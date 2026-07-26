"""Add users, secure sessions and authentication throttling.

Revision ID: 20260726_0002
Revises: 20260719_0001
Create Date: 2026-07-26
"""

import sqlalchemy as sa
from alembic import op

revision = "20260726_0002"
down_revision = "20260719_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # The original project migration uses metadata.create_all. Conditional creation keeps
    # fresh installs and databases that already ran 0001 compatible with this revision.
    inspector = sa.inspect(op.get_bind())
    existing = set(inspector.get_table_names())

    if "users" not in existing:
        op.create_table(
            "users",
            sa.Column("id", sa.String(length=36), nullable=False),
            sa.Column("email", sa.String(length=255), nullable=False),
            sa.Column("full_name", sa.String(length=160), nullable=False),
            sa.Column("password_hash", sa.String(length=512), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False),
            sa.Column("accepted_terms_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("email"),
        )
        op.create_index("ix_users_active", "users", ["is_active"], unique=False)

    if "user_sessions" not in existing:
        op.create_table(
            "user_sessions",
            sa.Column("id", sa.String(length=36), nullable=False),
            sa.Column("user_id", sa.String(length=36), nullable=False),
            sa.Column("token_hash", sa.String(length=64), nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("ip_hash", sa.String(length=64), nullable=True),
            sa.Column("user_agent", sa.String(length=255), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("last_seen_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("token_hash"),
        )
        op.create_index("ix_user_sessions_user_id", "user_sessions", ["user_id"], unique=False)
        op.create_index("ix_user_sessions_expires_at", "user_sessions", ["expires_at"], unique=False)
        op.create_index("ix_user_sessions_active", "user_sessions", ["user_id", "revoked_at", "expires_at"], unique=False)

    if "auth_attempts" not in existing:
        op.create_table(
            "auth_attempts",
            sa.Column("id", sa.String(length=36), nullable=False),
            sa.Column("identity_hash", sa.String(length=64), nullable=False),
            sa.Column("succeeded", sa.Boolean(), nullable=False),
            sa.Column("occurred_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_auth_attempts_identity_hash", "auth_attempts", ["identity_hash"], unique=False)
        op.create_index("ix_auth_attempts_occurred_at", "auth_attempts", ["occurred_at"], unique=False)
        op.create_index("ix_auth_attempt_identity_time", "auth_attempts", ["identity_hash", "occurred_at"], unique=False)


def downgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    existing = set(inspector.get_table_names())
    if "auth_attempts" in existing:
        op.drop_table("auth_attempts")
    if "user_sessions" in existing:
        op.drop_table("user_sessions")
    if "users" in existing:
        op.drop_table("users")
