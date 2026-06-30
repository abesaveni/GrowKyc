"""
models/didit_session.py
=======================
DiditSession — tracks a Didit verification session (KYC/KYB) and its outcome.

One row per verification attempt. Created when we open a Didit session for a
user/entity; updated by the signed Didit webhook as the status progresses
(Not Started -> In Progress -> Approved/Declined/In Review/...).

Tenant-scoped, but tenant_id is nullable to match this codebase's Phase-1
multi-tenancy (users may not yet have a tenant). The unauthenticated webhook
looks the row up with include_all_tenants and then pins the tenant context.
"""

from sqlalchemy import (JSON, Column, ForeignKey, Index, Integer, String,
                        Text)
from sqlalchemy.orm import relationship

from models.base import Base
from models.mixins import TenantMixin, TimestampMixin


class DiditSession(TenantMixin, TimestampMixin, Base):
    __tablename__ = "didit_sessions"

    id = Column(Integer, primary_key=True, index=True)

    # Didit's session UUID (unique). Indexed for webhook lookups.
    session_id = Column(String(100), nullable=False, unique=True, index=True)
    workflow_id = Column(String(100), nullable=True)

    # 'individual' (KYC) or 'business' (KYB)
    kind = Column(String(20), nullable=False, default="individual")

    # Our own reference echoed back by Didit (e.g. "kyc:123").
    vendor_data = Column(String(255), nullable=True, index=True)

    # Optional link to the KYC record being verified.
    kyc_id = Column(
        Integer, ForeignKey("kyc.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Current Didit status string (e.g. Approved, Declined, In Review).
    status = Column(String(50), nullable=False, default="Not Started", index=True)

    # Hosted verification page URL returned at session creation.
    verification_url = Column(Text, nullable=True)

    # Full decision payload from Didit (set on terminal webhook).
    decision = Column(JSON, nullable=True)

    # Last processed webhook event_id, for idempotent delivery handling.
    last_event_id = Column(String(100), nullable=True)

    created_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    tenant = relationship("Tenant", lazy="select")

    __table_args__ = (
        Index("idx_didit_sessions_tenant_id", "tenant_id"),
        Index("idx_didit_sessions_status", "status"),
    )

    def __repr__(self) -> str:
        return (
            f"<DiditSession(id={self.id}, session_id={self.session_id!r}, "
            f"kind={self.kind!r}, status={self.status!r})>"
        )
