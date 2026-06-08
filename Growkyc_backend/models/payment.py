"""
models/payment.py
=================
Payment model — tracks onboarding payments via Square.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, Numeric, String
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from core.enums import PaymentStatus
from models.base import Base


class Payment(Base):
    """
    Onboarding payment record via Square.
    """

    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    onboarding_type = Column(String(50), nullable=False)  # INDIVIDUAL or ENTITY
    amount = Column(Numeric(10, 2), nullable=False)  # Decimal for money values
    currency = Column(String(10), nullable=False, default="AUD")

    # Square integration references
    square_payment_id = Column(String(255), unique=True, index=True, nullable=True)
    square_order_id = Column(String(255), index=True, nullable=True)

    status = Column(
        SQLEnum(PaymentStatus),
        nullable=False,
        default=PaymentStatus.PENDING,
        index=True,
    )

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user = relationship("User", lazy="select")

    __table_args__ = (
        Index("idx_payments_user_id", "user_id"),
        Index("idx_payments_square_payment_id", "square_payment_id"),
        Index("idx_payments_status", "status"),
    )

    def __repr__(self) -> str:
        return (
            f"<Payment(id={self.id}, user_id={self.user_id}, "
            f"onboarding_type={self.onboarding_type!r}, amount={self.amount}, "
            f"status={self.status.value})>"
        )
