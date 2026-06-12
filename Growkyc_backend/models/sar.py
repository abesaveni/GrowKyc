"""
models/sar.py
=============
Suspicious Activity Report (SAR) model for AML compliance.
SAR records document decisions to file or not file reports with regulators.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from models.base import Base


class SARStatus(str):
    DRAFT = "draft"
    UNDER_REVIEW = "under_review"
    FILED = "filed"
    DECLINED = "declined"


class SAR(Base):
    """Suspicious Activity Report record."""

    __tablename__ = "sars"

    id = Column(Integer, primary_key=True, index=True)

    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    kyc_id = Column(
        Integer,
        ForeignKey("kyc.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Who raised the SAR
    raised_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    reviewed_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    filed_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    status = Column(
        String(50),
        nullable=False,
        default="draft",
        comment="draft|under_review|filed|declined",
    )

    # Narrative fields
    reason_for_suspicion = Column(Text, nullable=False)
    transaction_details = Column(Text, nullable=True)
    narrative = Column(Text, nullable=True)
    regulator_reference = Column(String(255), nullable=True, comment="AUSTRAC/FinCEN reference number after filing")

    # Lifecycle
    raised_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    reviewed_at = Column(DateTime, nullable=True)
    filed_at = Column(DateTime, nullable=True)
    declined_at = Column(DateTime, nullable=True)
    decline_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    deleted_at = Column(DateTime, nullable=True)

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_sars_client_id", "client_id"),
        Index("idx_sars_status", "status"),
        Index("idx_sars_raised_at", "raised_at"),
        Index("idx_sars_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return f"<SAR(id={self.id}, client_id={self.client_id}, status={self.status})>"
