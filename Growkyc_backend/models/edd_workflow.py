"""
models/edd_workflow.py
======================
Enhanced Due Diligence (EDD) Workflow model.

Enterprise table tracking EDD triggers, questionnaires, 
MLRO approval chains, and evidence collection for high-risk clients.

Triggered when:
  - Client is PEP
  - Client is in a high-risk jurisdiction
  - Ownership structure is complex (offshore, nominees)
  - Sanctions adjacent hit
  - Risk score exceeds HIGH threshold

Immutable audit trail — no updates to completed workflows.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from models.base import Base


class EDDWorkflow(Base):
    """Full EDD workflow record for a Client requiring enhanced scrutiny."""

    __tablename__ = "edd_workflows"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Tenant scope ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )

    # ---- Client link ----
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ---- Trigger context ----
    trigger_reason = Column(
        String(500),
        nullable=False,
        comment="pep|high_risk_country|complex_ownership|sanctions_adjacent|manual",
    )
    triggered_by_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # ---- Status lifecycle ----
    status = Column(
        String(50),
        nullable=False,
        default="initiated",
        index=True,
        comment="initiated|questionnaire_sent|under_review|escalated|mlro_review|approved|rejected|closed",
    )

    # ---- Questionnaire ----
    questionnaire_data = Column(
        JSON, nullable=True,
        comment="Questionnaire questions and submitted answers",
    )
    questionnaire_submitted_at = Column(DateTime(timezone=True), nullable=True)

    # ---- Risk scoring ----
    initial_risk_score = Column(Float, nullable=True)
    post_edd_risk_score = Column(Float, nullable=True)
    risk_override_justification = Column(Text, nullable=True)

    # ---- MLRO/Partner approval chain ----
    assigned_to_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="Compliance officer or MLRO assigned for review",
    )
    mlro_decision = Column(
        String(50), nullable=True,
        comment="approve|reject|escalate|pending",
    )
    mlro_notes = Column(Text, nullable=True)
    mlro_decided_at = Column(DateTime(timezone=True), nullable=True)

    partner_decision = Column(
        String(50), nullable=True,
        comment="approve|reject|pending",
    )
    partner_notes = Column(Text, nullable=True)
    partner_decided_at = Column(DateTime(timezone=True), nullable=True)

    # ---- Evidence collection ----
    required_evidence = Column(
        JSON, nullable=True,
        comment="[{type, description, mandatory}] checklist",
    )
    evidence_collected = Column(
        JSON, nullable=True,
        comment="[{type, document_id, collected_at}] actuals",
    )
    evidence_complete = Column(Integer, nullable=True, default=0)

    # ---- SLA ----
    due_date = Column(DateTime(timezone=True), nullable=True, index=True)

    # ---- Outcome ----
    outcome = Column(
        String(50), nullable=True,
        comment="approved_with_monitoring|approved|rejected|suspended",
    )
    outcome_notes = Column(Text, nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)

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

    # ---- Relationships ----
    client = relationship("Client", backref="edd_workflows", lazy="select")

    __table_args__ = (
        Index("idx_edd_workflows_client_id", "client_id"),
        Index("idx_edd_workflows_tenant_id", "tenant_id"),
        Index("idx_edd_workflows_status", "status"),
        Index("idx_edd_workflows_due_date", "due_date"),
    )

    def __repr__(self) -> str:
        return (
            f"<EDDWorkflow(id={self.id}, client_id={self.client_id}, "
            f"status={self.status!r}, trigger={self.trigger_reason!r})>"
        )
