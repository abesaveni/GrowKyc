"""
models/risk.py
==============
RiskAssessment — structured risk scoring records for a Client.

NEW enterprise table. tenant_id nullable=False from inception.

Distinct from Client.risk_score / Client.risk_level (live state):
- Client fields = current live risk state updated in-place by RiskService.
- RiskAssessment = immutable historical audit trail of each scoring event.
"""

from datetime import datetime, timezone

from sqlalchemy import (JSON, Column, DateTime, Float, ForeignKey, Index,
                        Integer, String, Text)
from sqlalchemy.orm import relationship

from models.base import Base


class RiskAssessment(Base):
    """Full risk scoring record for a Client at a specific point in time."""

    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)

    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,  # New table: mandatory tenant scope
        index=True,
    )

    # ---- Risk scores ----
    inherent_risk = Column(
        String(20), nullable=True, comment="LOW|MEDIUM|HIGH before controls"
    )
    residual_risk = Column(
        String(20), nullable=True, comment="LOW|MEDIUM|HIGH after controls"
    )
    calculated_score = Column(Float, nullable=True, comment="Composite score 0–100")
    manual_override_score = Column(
        Float, nullable=True, comment="Compliance officer override"
    )
    final_risk_level = Column(String(20), nullable=True, index=True)

    # ---- Factor breakdown ----
    risk_factors = Column(
        JSON,
        nullable=True,
        comment="Dict of contributing factors and weights",
    )
    scoring_explanation = Column(Text, nullable=True)

    # ---- Override tracking ----
    override_reason = Column(Text, nullable=True)
    override_by_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="NO ACTION"), nullable=True
    )
    override_at = Column(DateTime(timezone=True), nullable=True)

    # ---- Review scheduling ----
    review_due_date = Column(DateTime(timezone=True), nullable=True, index=True)
    review_history = Column(
        JSON, nullable=True, comment="[{date, reviewer_id, outcome}]"
    )

    # ---- Trigger context ----
    assessment_trigger = Column(
        String(100),
        nullable=True,
        comment="onboarding|periodic_review|manual|screening_hit|case_escalation",
    )
    assessed_by_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="NO ACTION"), nullable=True
    )

    # ---- Timestamps ----
    assessed_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ---- Relationships ----
    client = relationship("Client", back_populates="risk_assessments", lazy="select")
    tenant = relationship("Tenant", back_populates="risk_assessments", lazy="select")

    __table_args__ = (
        Index("idx_risk_assessments_client_id", "client_id"),
        Index("idx_risk_assessments_tenant_id", "tenant_id"),
        Index("idx_risk_assessments_final_risk", "final_risk_level"),
        Index("idx_risk_assessments_review_due", "review_due_date"),
        Index("idx_risk_assessments_assessed_at", "assessed_at"),
    )

    def __repr__(self) -> str:
        return (
            f"<RiskAssessment(id={self.id}, client_id={self.client_id}, "
            f"final_risk={self.final_risk_level!r}, score={self.calculated_score})>"
        )
