"""
models/tenant.py
================
Tenant model — the root entity for multi-tenant SaaS architecture.

One Tenant = one organization (e.g. Deloitte, KPMG, a law firm).
All other enterprise tables reference tenant_id.

Phase 1:  tenant_id on existing tables is nullable=True.
Phase 4:  After backfill, tenant_id becomes nullable=False everywhere.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Index, Integer, String
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from models.base import Base


class Tenant(Base):
    """
    Top-level organization/company in the multi-tenant hierarchy.

    Each tenant represents a single subscribing organization.
    All KYC workflows, clients, users, and compliance data belong
    to exactly one tenant.
    """

    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Identity ----
    company_name = Column(String(255), nullable=False)
    slug = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
        comment="URL-safe unique identifier for the tenant (e.g. 'deloitte-au')",
    )

    # ---- Lifecycle ----
    status = Column(
        String(50),
        default="active",
        nullable=False,
        index=True,
        comment="active | suspended | cancelled | trial",
    )
    subscription_plan = Column(
        String(100),
        default="starter",
        nullable=True,
        comment="starter | professional | enterprise",
    )

    # ---- Contact / Metadata ----
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    timezone = Column(String(100), default="UTC", nullable=True)

    # ---- Timestamps ----
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    suspended_at = Column(DateTime(timezone=True), nullable=True)

    # ---- Relationships (back-refs to tenant-scoped data) ----
    # These use lazy="dynamic" or lazy="select" to avoid loading entire
    # tenant datasets on every Tenant query.
    users = relationship(
        "User",
        back_populates="tenant",
        lazy="select",
        foreign_keys="User.tenant_id",
    )
    clients = relationship(
        "Client",
        back_populates="tenant",
        lazy="select",
        foreign_keys="Client.tenant_id",
    )
    documents = relationship(
        "Document",
        back_populates="tenant",
        lazy="select",
        foreign_keys="Document.tenant_id",
    )
    screening_records = relationship(
        "ScreeningRecord",
        back_populates="tenant",
        lazy="select",
        cascade="all, delete-orphan",
    )
    risk_assessments = relationship(
        "RiskAssessment",
        back_populates="tenant",
        lazy="select",
        cascade="all, delete-orphan",
    )
    alerts = relationship(
        "Alert",
        back_populates="tenant",
        lazy="select",
        cascade="all, delete-orphan",
    )
    integrations = relationship(
        "Integration",
        back_populates="tenant",
        lazy="select",
        cascade="all, delete-orphan",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_tenants_slug", "slug"),
        Index("idx_tenants_status", "status"),
    )

    def __repr__(self) -> str:
        return (
            f"<Tenant(id={self.id}, slug={self.slug!r}, "
            f"status={self.status!r})>"
        )
