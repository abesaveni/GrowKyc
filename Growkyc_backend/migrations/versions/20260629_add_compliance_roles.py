"""add Senior Compliance Officer and Head of Compliance to the userrole enum

Revision ID: 20260629_add_roles
Revises: e5661815f2c5
Create Date: 2026-06-29 00:00:00.000000

Adds the two new canonical compliance roles to the Postgres ``userrole`` enum.
Fresh databases get these automatically via create_all; this migration is for
existing deployments. No-op on non-Postgres backends (e.g. SQLite tests, which
store the enum as text).
"""

from alembic import op

revision = "20260629_add_roles"
down_revision = "e5661815f2c5"
branch_labels = None
depends_on = None

_NEW_VALUES = ("SENIOR_COMPLIANCE_OFFICER", "HEAD_OF_COMPLIANCE")


def upgrade():
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return
    # ADD VALUE IF NOT EXISTS is idempotent and supported in a transaction on PG 12+.
    for value in _NEW_VALUES:
        op.execute(f"ALTER TYPE userrole ADD VALUE IF NOT EXISTS '{value}'")


def downgrade():
    # Postgres does not support removing enum values directly; intentionally a
    # no-op. (Removing would require recreating the type and rewriting columns.)
    pass
