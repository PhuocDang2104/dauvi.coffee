from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.db import get_db
from app.models import KnowledgeChunk

router = APIRouter(tags=["health"])


@router.get("/health/live", include_in_schema=False)
def liveness() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/ready", include_in_schema=False)
def readiness(
    session: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> dict[str, str]:
    try:
        session.execute(text("SELECT 1"))
        if settings.vector_search_required:
            embedded_chunks = session.scalar(
                select(func.count())
                .select_from(KnowledgeChunk)
                .where(KnowledgeChunk.embedding.is_not(None))
            )
            if not embedded_chunks:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="RAG vector index is not ready.",
                )
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is not ready.",
        ) from error
    return {"status": "ready", "database": "ok"}


@router.get("/health/rag", include_in_schema=False)
def rag_readiness(
    session: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> dict[str, object]:
    total_chunks = session.scalar(select(func.count()).select_from(KnowledgeChunk)) or 0
    embedded_chunks = (
        session.scalar(
            select(func.count())
            .select_from(KnowledgeChunk)
            .where(KnowledgeChunk.embedding.is_not(None))
        )
        or 0
    )
    vector_extension = False
    if session.bind is not None and session.bind.dialect.name == "postgresql":
        vector_extension = bool(
            session.scalar(
                text("SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname='vector')")
            )
        )

    ready = total_chunks > 0 and (
        not settings.vector_search_required
        or (vector_extension and embedded_chunks == total_chunks)
    )
    return {
        "status": "ready" if ready else "degraded",
        "workflow": "langgraph" if settings.rag_enabled else "legacy",
        "routing": "groq-semantic-router+deterministic-fallback",
        "retrieval": "bm25+pgvector" if settings.vector_search_enabled else "bm25",
        "knowledgeChunks": total_chunks,
        "embeddedChunks": embedded_chunks,
        "embeddingModel": settings.embedding_model if settings.vector_search_enabled else None,
        "llmProvider": "groq" if settings.ai_enabled else "deterministic-fallback",
    }
