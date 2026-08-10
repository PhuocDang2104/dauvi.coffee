"""Add grounded RAG knowledge base, pgvector embeddings and retrieval audit logs.

Revision ID: 20260810_0004
Revises: 20260803_0003
Create Date: 2026-08-10
"""

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import VECTOR

revision = "20260810_0004"
down_revision = "20260803_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name
    if dialect == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())

    if "knowledge_documents" not in tables:
        op.create_table(
            "knowledge_documents",
            sa.Column("id", sa.String(length=80), nullable=False),
            sa.Column("title", sa.String(length=200), nullable=False),
            sa.Column("source_type", sa.String(length=40), nullable=False),
            sa.Column("content_hash", sa.String(length=64), nullable=False),
            sa.Column("published", sa.Boolean(), nullable=False),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.PrimaryKeyConstraint("id"),
        )

    if "knowledge_chunks" not in tables:
        embedding_type = VECTOR(384) if dialect == "postgresql" else sa.JSON()
        op.create_table(
            "knowledge_chunks",
            sa.Column("id", sa.String(length=100), nullable=False),
            sa.Column("document_id", sa.String(length=80), nullable=False),
            sa.Column("product_id", sa.String(length=64), nullable=True),
            sa.Column("lot_code", sa.String(length=80), nullable=True),
            sa.Column("chunk_index", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(length=220), nullable=False),
            sa.Column("content", sa.Text(), nullable=False),
            sa.Column("metadata_json", sa.JSON(), nullable=False),
            sa.Column("token_count", sa.Integer(), nullable=False),
            sa.Column("embedding", embedding_type, nullable=True),
            sa.Column("embedding_model", sa.String(length=160), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.ForeignKeyConstraint(
                ["document_id"], ["knowledge_documents.id"], ondelete="CASCADE"
            ),
            sa.ForeignKeyConstraint(["lot_code"], ["coffee_lots.lot_code"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("document_id", "chunk_index", name="uq_knowledge_document_chunk"),
        )
        op.create_index("ix_knowledge_chunks_document_id", "knowledge_chunks", ["document_id"])
        op.create_index("ix_knowledge_chunks_product_id", "knowledge_chunks", ["product_id"])
        op.create_index("ix_knowledge_chunks_lot_code", "knowledge_chunks", ["lot_code"])
        op.create_index(
            "ix_knowledge_chunks_product_document",
            "knowledge_chunks",
            ["product_id", "document_id"],
        )
        if dialect == "postgresql":
            op.execute(
                "CREATE INDEX ix_knowledge_chunks_embedding_hnsw "
                "ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)"
            )

    if "retrieval_logs" not in tables:
        op.create_table(
            "retrieval_logs",
            sa.Column("id", sa.String(length=36), nullable=False),
            sa.Column("query_hash", sa.String(length=64), nullable=False),
            sa.Column("intent", sa.String(length=40), nullable=False),
            sa.Column("result_chunk_ids", sa.JSON(), nullable=False),
            sa.Column("result_product_ids", sa.JSON(), nullable=False),
            sa.Column("used_vector", sa.Boolean(), nullable=False),
            sa.Column("used_llm", sa.Boolean(), nullable=False),
            sa.Column("latency_ms", sa.Integer(), nullable=False),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_retrieval_logs_query_hash", "retrieval_logs", ["query_hash"])
        op.create_index("ix_retrieval_logs_created_at", "retrieval_logs", ["created_at"])
        op.create_index(
            "ix_retrieval_logs_created_intent", "retrieval_logs", ["created_at", "intent"]
        )


def downgrade() -> None:
    bind = op.get_bind()
    tables = set(sa.inspect(bind).get_table_names())
    if "retrieval_logs" in tables:
        op.drop_table("retrieval_logs")
    if "knowledge_chunks" in tables:
        op.drop_table("knowledge_chunks")
    if "knowledge_documents" in tables:
        op.drop_table("knowledge_documents")
