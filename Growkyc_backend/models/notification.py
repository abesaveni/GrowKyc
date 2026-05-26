"""
models/notification.py
======================
Notification model — in-app user notifications for KYC events,
system alerts, and compliance triggers.

Preserved verbatim from the original monolithic models.py.
Added: tenant_id (nullable=True, Phase 1 multi-tenancy preparation).

Imports: use `from models import Notification` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from core.enums import NotificationStatus, NotificationType
from models.base import Base


class Notification(Base):
    """
    In-app notification record for a user.

    Covers all KYC lifecycle events (submitted, approved, rejected),
    document expiry alerts (US-026), high-risk auto-case alerts,
    and full-approval confirmations.

    Future channels (email, SMS, webhook) should be dispatched by the
    notification service layer, not stored as separate rows here.
    """

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    kyc_id = Column(
        Integer,
        ForeignKey("kyc.id", ondelete="CASCADE"),
        nullable=True,
    )
    type = Column(SQLEnum(NotificationType), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(
        SQLEnum(NotificationStatus),
        default=NotificationStatus.UNREAD,
        nullable=False,
    )
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    read_at = Column(DateTime, nullable=True)

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---- Relationships ----
    user = relationship("User", back_populates="notifications")

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_notifications_user_id", "user_id"),
        Index("idx_notifications_kyc_id", "kyc_id"),
        Index("idx_notifications_status", "status"),
        Index("idx_notifications_created_at", "created_at"),
        Index("idx_notifications_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<Notification(id={self.id}, user_id={self.user_id}, "
            f"type={self.type})>"
        )
