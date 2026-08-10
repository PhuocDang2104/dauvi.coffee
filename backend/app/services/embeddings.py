from __future__ import annotations

import logging
from functools import lru_cache

from app.config import Settings

logger = logging.getLogger(__name__)


class EmbeddingUnavailableError(RuntimeError):
    """Raised when the configured local embedding model cannot be used."""


@lru_cache(maxsize=2)
def _load_model(model_name: str, cache_dir: str):
    from fastembed import TextEmbedding

    return TextEmbedding(model_name=model_name, cache_dir=cache_dir)


def embed_texts(texts: list[str], settings: Settings) -> list[list[float]]:
    if not texts:
        return []
    if not settings.vector_search_enabled:
        return []

    try:
        model = _load_model(settings.embedding_model, settings.embedding_cache_dir)
        vectors = [vector.astype(float).tolist() for vector in model.embed(texts)]
    except Exception as error:
        logger.exception("Local embedding model is unavailable: %s", type(error).__name__)
        raise EmbeddingUnavailableError("Local embedding model is unavailable.") from error

    if any(len(vector) != settings.embedding_dimensions for vector in vectors):
        raise EmbeddingUnavailableError(
            f"Embedding dimension does not match schema dimension {settings.embedding_dimensions}."
        )
    return vectors


def embed_query(text: str, settings: Settings) -> list[float] | None:
    vectors = embed_texts([text], settings)
    return vectors[0] if vectors else None
