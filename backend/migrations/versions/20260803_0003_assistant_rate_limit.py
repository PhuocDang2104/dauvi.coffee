"""Add persistent Coffee Assistant request throttling.

Revision ID: 20260803_0003
Revises: 20260726_0002
Create Date: 2026-08-03
"""

import sqlalchemy as sa
from alembic import op

revision = "20260803_0003"
down_revision = "20260726_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    if "assistant_requests" in set(inspector.get_table_names()):
        return

    op.create_table(
        "assistant_requests",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("client_hash", sa.String(length=64), nullable=False),
        sa.Column("used_ai", sa.Boolean(), nullable=False),
        sa.Column(
            "occurred_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_assistant_requests_client_hash",
        "assistant_requests",
        ["client_hash"],
        unique=False,
    )
    op.create_index(
        "ix_assistant_requests_occurred_at",
        "assistant_requests",
        ["occurred_at"],
        unique=False,
    )
    op.create_index(
        "ix_assistant_request_client_time",
        "assistant_requests",
        ["client_hash", "occurred_at"],
        unique=False,
    )


def downgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    if "assistant_requests" in set(inspector.get_table_names()):
        op.drop_table("assistant_requests")
