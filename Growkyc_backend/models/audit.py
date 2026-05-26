"""
models/audit.py
===============
Audit models — KYCAuditLog (KYC-specific status change log) and
AuditLog (immutable enterprise-wide action trail).

Both models preserved verbatim from the original monolithic models.py.
AuditLog now includes tenant_id (nullable=True, Phase 1 preparation).

Imports:
    from models import KYCAuditLog   # KYC status change events
    from models import AuditLog      # Enterprise-wide immutable audit trail
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from core.enums import KYCStatus
from models.base import Base


class KYCAuditLog(Base):
    """
    Audit log for KYC status transitions.

    Immutable record: every KYC status change (Pending → Approved, etc.)
    is captured here with actor, reason, and before/after states.
    """

    __tablename__ = "kyc_audit_log"

    id = Column(Integer, primary_key=True, index=True)
    kyc_id = Column(
        Integer,
        ForeignKey("kyc.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    changed_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    old_status = Column(SQLEnum(KYCStatus), nullable=True)
    new_status = Column(SQLEnum(KYCStatus), nullable=False)
    change_reason = Column(Text, nullable=True)
    changed_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # ---- Relationships ----
    kyc = relationship("KYC", back_populates="audit_logs")
    changed_by_user = relationship(
        "User",
        foreign_keys=[changed_by],
        back_populates="audit_logs",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_kyc_audit_log_kyc_id", "kyc_id"),
        Index("idx_kyc_audit_log_changed_at", "changed_at"),
        Index("idx_kyc_audit_log_changed_by", "changed_by"),
    )

    def __repr__(self) -> str:
        return (
            f"<KYCAuditLog(id={self.id}, kyc_id={self.kyc_id}, "
            f"new_status={self.new_status})>"
        )


class AuditLog(Base):
    """
    Immutable enterprise audit trail for all business-critical actions.

    Records: CREATE, UPDATE, APPROVE, DELETE, OVERRIDE, FULL_APPROVAL_LOCKED,
    and any other compliance-significant event.

    Design principle: this table must never be updated or deleted.
    Rows are append-only. Enforce via DB grants in production.
    """

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="User who performed the action (NULL = system-generated event)",
    )

    # ---- Action metadata ----
    action = Column(
        String(50),
        nullable=False,
        comment="e.g. CREATE, UPDATE, APPROVE, DELETE, OVERRIDE",
    )
    entity_type = Column(
        String(50),
        nullable=False,
        comment="e.g. client, case, approval, report, kyc",
    )
    entity_id = Column(Integer, nullable=False, index=True)

    # ---- Payload ----
    before_data = Column(Text, nullable=True, comment="JSON payload before change")
    after_data = Column(Text, nullable=True, comment="JSON payload after change")

    # ---- Context ----
    ip_address = Column(String(45), nullable=True)   # supports IPv6
    user_agent = Column(String(512), nullable=True)

    # ---- Timestamp ----
    timestamp = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---- Relationships ----
    actor = relationship("User", foreign_keys=[actor_id])

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_audit_logs_actor_id", "actor_id"),
        Index("idx_audit_logs_entity_type_id", "entity_type", "entity_id"),
        Index("idx_audit_logs_timestamp", "timestamp"),
        Index("idx_audit_logs_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<AuditLog(id={self.id}, action={self.action!r}, "
            f"entity_type={self.entity_type!r}, entity_id={self.entity_id})>"
        )
