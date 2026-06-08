"""create payments table

Revision ID: 20260606_create_payments
Revises: None
Create Date: 2026-06-06 12:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260606_create_payments"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("onboarding_type", sa.String(length=50), nullable=False),
        sa.Column("amount", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("currency", sa.String(length=10), nullable=False),
        sa.Column("square_payment_id", sa.String(length=255), nullable=True),
        sa.Column("square_order_id", sa.String(length=255), nullable=True),
        sa.Column(
            "status",
            sa.Enum("PENDING", "PAID", "FAILED", "CANCELLED", name="paymentstatus"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("square_payment_id"),
    )
    # Create indexes as requested
    op.create_index("idx_payments_user_id", "payments", ["user_id"], unique=False)
    op.create_index(
        "idx_payments_square_payment_id", "payments", ["square_payment_id"], unique=True
    )
    op.create_index("idx_payments_status", "payments", ["status"], unique=False)


def downgrade():
    op.drop_index("idx_payments_status", table_name="payments")
    op.drop_index("idx_payments_square_payment_id", table_name="payments")
    op.drop_index("idx_payments_user_id", table_name="payments")
    op.drop_table("payments")
