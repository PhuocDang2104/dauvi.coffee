from __future__ import annotations

import math
import re
import unicodedata
from collections import Counter
from dataclasses import dataclass

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.config import Settings
from app.models import KnowledgeChunk, KnowledgeDocument
from app.services.embeddings import EmbeddingUnavailableError, embed_query

STOP_WORDS = {
    "anh",
    "ban",
    "ca",
    "cho",
    "co",
    "cua",
    "giup",
    "la",
    "minh",
    "mot",
    "muon",
    "nao",
    "pha",
    "san",
    "pham",
    "toi",
    "va",
    "voi",
}


def normalize_text(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower().replace("đ", "d"))
    without_marks = "".join(
        character for character in decomposed if unicodedata.category(character) != "Mn"
    )
    return re.sub(r"[^a-z0-9]+", " ", without_marks).strip()


def tokenize(value: str) -> list[str]:
    return [
        token
        for token in normalize_text(value).split()
        if len(token) > 1 and token not in STOP_WORDS
    ]


@dataclass(frozen=True)
class HybridRetrievalResult:
    chunks: list[KnowledgeChunk]
    bm25_chunk_ids: list[str]
    vector_chunk_ids: list[str]
    used_vector: bool


def _load_candidate_chunks(session: Session, product_ids: list[str] | None) -> list[KnowledgeChunk]:
    statement = (
        select(KnowledgeChunk)
        .join(KnowledgeDocument)
        .where(KnowledgeDocument.published.is_(True))
        .order_by(KnowledgeChunk.document_id, KnowledgeChunk.chunk_index)
    )
    if product_ids is not None:
        statement = statement.where(
            or_(KnowledgeChunk.product_id.in_(product_ids), KnowledgeChunk.product_id.is_(None))
        )
    return list(session.scalars(statement))


def _bm25_rank(chunks: list[KnowledgeChunk], query: str, top_k: int) -> list[str]:
    query_tokens = tokenize(query)
    if not chunks or not query_tokens:
        return []

    documents = [tokenize(f"{chunk.title} {chunk.content}") for chunk in chunks]
    average_length = sum(len(document) for document in documents) / max(len(documents), 1)
    document_frequency = Counter(token for document in documents for token in set(document))
    query_frequency = Counter(query_tokens)
    k1 = 1.5
    b = 0.75
    scores: list[tuple[str, float]] = []
    for chunk, document in zip(chunks, documents, strict=True):
        term_frequency = Counter(document)
        score = 0.0
        for token, query_count in query_frequency.items():
            frequency = term_frequency[token]
            if frequency == 0:
                continue
            idf = math.log(
                1
                + (len(documents) - document_frequency[token] + 0.5)
                / (document_frequency[token] + 0.5)
            )
            denominator = frequency + k1 * (1 - b + b * len(document) / max(average_length, 1))
            score += query_count * idf * (frequency * (k1 + 1) / denominator)
        if score > 0:
            scores.append((chunk.id, score))
    scores.sort(key=lambda item: (-item[1], item[0]))
    return [chunk_id for chunk_id, _ in scores[:top_k]]


def _vector_rank(
    session: Session,
    query: str,
    product_ids: list[str] | None,
    settings: Settings,
) -> list[str]:
    if not settings.vector_search_enabled or session.bind is None:
        return []
    if session.bind.dialect.name != "postgresql":
        return []

    try:
        query_vector = embed_query(query, settings)
    except EmbeddingUnavailableError:
        return []
    if query_vector is None:
        return []

    distance = KnowledgeChunk.embedding.cosine_distance(query_vector)
    statement = (
        select(KnowledgeChunk.id)
        .join(KnowledgeDocument)
        .where(
            KnowledgeDocument.published.is_(True),
            KnowledgeChunk.embedding.is_not(None),
        )
        .order_by(distance)
        .limit(settings.rag_top_k)
    )
    if product_ids is not None:
        statement = statement.where(
            or_(KnowledgeChunk.product_id.in_(product_ids), KnowledgeChunk.product_id.is_(None))
        )
    return list(session.scalars(statement))


def _reciprocal_rank_fusion(
    bm25_ids: list[str], vector_ids: list[str], rrf_k: int, top_k: int
) -> list[str]:
    scores: Counter[str] = Counter()
    for rank, chunk_id in enumerate(bm25_ids, start=1):
        scores[chunk_id] += 1 / (rrf_k + rank)
    for rank, chunk_id in enumerate(vector_ids, start=1):
        scores[chunk_id] += 1 / (rrf_k + rank)
    return [chunk_id for chunk_id, _ in scores.most_common(top_k)]


def hybrid_retrieve(
    session: Session,
    query: str,
    product_ids: list[str] | None,
    settings: Settings,
) -> HybridRetrievalResult:
    chunks = _load_candidate_chunks(session, product_ids)
    bm25_ids = _bm25_rank(chunks, query, settings.rag_top_k)
    vector_ids = _vector_rank(session, query, product_ids, settings)
    ranked_ids = _reciprocal_rank_fusion(
        bm25_ids, vector_ids, settings.rag_rrf_k, settings.rag_top_k
    )

    by_id = {chunk.id: chunk for chunk in chunks}
    ranked_chunks = [by_id[chunk_id] for chunk_id in ranked_ids if chunk_id in by_id]
    return HybridRetrievalResult(
        chunks=ranked_chunks,
        bm25_chunk_ids=bm25_ids,
        vector_chunk_ids=vector_ids,
        used_vector=bool(vector_ids),
    )
