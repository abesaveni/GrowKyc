"""
models/client.py
================
Client model — represents a business entity or individual onboarded for KYC.

Preserved verbatim from the original monolithic models.py.
Added: tenant_id (nullable=True, Phase 1 multi-tenancy preparation).

Imports: use `from models import Client` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from core.enums import RiskLevel
from models.base import Base


class Client(Base):
    """Client model representing a business or individual entity tied to a User."""

    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(255), nullable=False)
    risk_score = Column(Integer, default=0, nullable=False)
    risk_level = Column(SQLEnum(RiskLevel), default=RiskLevel.LOW, nullable=False)
    is_pep = Column(Boolean, default=False, nullable=False)
    is_sanctioned = Column(Boolean, default=False, nullable=False)
    geography = Column(String(255), nullable=True)
    income_level = Column(Integer, default=0, nullable=False)
    is_locked = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Monitoring extensions ----
    review_date = Column(DateTime, nullable=True)
    last_reviewed_at = Column(DateTime, nullable=True)

    # ---- Approval audit fields ----
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rejected_at = Column(DateTime, nullable=True)
    rejected_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rejection_reason = Column(String(500), nullable=True)

    # ---- Soft delete ----
    deleted_at = Column(DateTime, nullable=True)

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,  # Phase 1: existing clients have no tenant
        index=True,
    )

    # ---- Relationships ----
    tenant = relationship(
        "Tenant",
        back_populates="clients",
        foreign_keys=[tenant_id],
        lazy="select",
    )
    user = relationship("User", foreign_keys=[user_id], back_populates="clients")
    cases = relationship(
        "Case",
        back_populates="client",
        cascade="all, delete-orphan",
    )
    approvals = relationship(
        "Approval",
        back_populates="client",
        cascade="all, delete-orphan",
    )
    reports = relationship(
        "Report",
        back_populates="client",
        cascade="all, delete-orphan",
    )

    # ---- New enterprise relationships (Phase 1 additions) ----
    individual_profile = relationship(
        "IndividualProfile",
        back_populates="client",
        uselist=False,  # one-to-one
        cascade="all, delete-orphan",
        lazy="select",
    )
    entity_profile = relationship(
        "EntityProfile",
        back_populates="client",
        uselist=False,  # one-to-one
        cascade="all, delete-orphan",
        lazy="select",
    )
    beneficial_owners = relationship(
        "BeneficialOwner",
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="select",
    )
    screening_records = relationship(
        "ScreeningRecord",
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="select",
    )
    risk_assessments = relationship(
        "RiskAssessment",
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="select",
    )
    client_alerts = relationship(
        "Alert",
        back_populates="client",
        cascade="all, delete-orphan",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<Client(id={self.id}, user_id={self.user_id}, " f"name={self.name!r})>"
