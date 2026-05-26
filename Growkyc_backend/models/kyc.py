"""
models/kyc.py
=============
KYC model — the core KYC verification record for each user.

Preserved verbatim from the original monolithic models.py.
Added: tenant_id (nullable=True, Phase 1 multi-tenancy preparation).

Imports: use `from models import KYC` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from core.enums import KYCOnboardingStatus, KYCStatus
from models.base import Base


class KYC(Base):
    """KYC record model for tracking user identity verification status."""

    __tablename__ = "kyc"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # ---- Personal identity fields ----
    # [DEPRECATED] India-specific fields. Use IdentityDocument model instead.
    # Scheduled for removal in API v2.
    aadhaar = Column(String(12), nullable=True)
    pan = Column(String(10), nullable=True)
    
    name = Column(String(255), nullable=True)
    dob = Column(DateTime, nullable=True)
    gender = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)

    # ---- Status fields ----
    status = Column(
        SQLEnum(KYCStatus),
        default=KYCStatus.PENDING,
        nullable=False,
        index=True,
    )
    onboarding_status = Column(
        SQLEnum(KYCOnboardingStatus),
        default=KYCOnboardingStatus.DRAFT,
        nullable=False,
        index=True,
    )
    rejection_reason = Column(Text, nullable=True)

    # ---- Lifecycle timestamps ----
    submitted_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    approved_at = Column(DateTime, nullable=True)
    rejected_at = Column(DateTime, nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---- Relationships ----
    user = relationship("User", back_populates="kyc_records")
    documents = relationship(
        "Document",
        back_populates="kyc",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    audit_logs = relationship(
        "KYCAuditLog",
        back_populates="kyc",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_kyc_user_id", "user_id"),
        Index("idx_kyc_status", "status"),
        Index("idx_kyc_submitted_at", "submitted_at"),
        Index("idx_kyc_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<KYC(id={self.id}, user_id={self.user_id}, "
            f"status={self.status})>"
        )
