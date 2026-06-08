"""
models/alert.py
===============
Alert — compliance workflow alerts distinct from user Notifications.

NEW enterprise table. tenant_id nullable=False from inception.

Distinction from Notification:
- Notification  = user-facing message (in-app inbox)
- Alert         = compliance workflow item requiring analyst action/review
                  (SLA-tracked, assignable, case-linked, evidence-referenced)
"""

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from models.base import Base


class Alert(Base):
    """
    Compliance workflow alert requiring analyst review or action.

    Supports: assignment, SLA tracking, escalation, evidence references,
    and full lifecycle state management.
    """

    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    case_id = Column(
        Integer,
        ForeignKey("cases.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,  # New table: mandatory
        index=True,
    )

    # ---- Alert classification ----
    alert_type = Column(
        String(100),
        nullable=False,
        index=True,
        comment=(
            "document_expiry|high_risk|sanctions_hit|pep_match|"
            "adverse_media|transaction_threshold"
        ),
    )
    severity = Column(
        String(20),
        nullable=False,
        default="medium",
        index=True,
        comment="low|medium|high|critical",
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # ---- Workflow state ----
    status = Column(
        String(50),
        nullable=False,
        default="open",
        index=True,
        comment="open|in_review|escalated|resolved|dismissed|false_positive",
    )
    assigned_to_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="NO ACTION"),
        nullable=True,
        index=True,
    )
    escalated_to_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="NO ACTION"),
        nullable=True,
    )
    escalation_reason = Column(Text, nullable=True)

    # ---- Resolution ----
    resolution_notes = Column(Text, nullable=True)
    resolved_by_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="NO ACTION"), nullable=True
    )

    # ---- SLA tracking ----
    sla_due_at = Column(DateTime(timezone=True), nullable=True, index=True)
    sla_breached = Column(Integer, default=0, nullable=False)

    # ---- Evidence references (JSON list of document/evidence IDs) ----
    evidence_refs = Column(
        JSON,
        nullable=True,
        comment="[{type: 'document', id: 42}, {type: 'screening_record', id: 7}]",
    )

    # ---- Source ----
    triggered_by = Column(
        String(100),
        nullable=True,
        comment="system_auto|manual|scheduler|screening|risk_engine",
    )
    triggered_by_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="NO ACTION"), nullable=True
    )

    # ---- Timestamps ----
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ---- Relationships ----
    client = relationship("Client", back_populates="client_alerts", lazy="select")
    case = relationship("Case", back_populates="case_alerts", lazy="select")
    tenant = relationship("Tenant", back_populates="alerts", lazy="select")

    __table_args__ = (
        Index("idx_alerts_client_id", "client_id"),
        Index("idx_alerts_tenant_id", "tenant_id"),
        Index("idx_alerts_status_severity", "status", "severity"),
        Index("idx_alerts_sla_due_at", "sla_due_at"),
        Index("idx_alerts_alert_type", "alert_type"),
        Index("idx_alerts_assigned_to", "assigned_to_user_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<Alert(id={self.id}, client_id={self.client_id}, "
            f"type={self.alert_type!r}, status={self.status!r})>"
        )
