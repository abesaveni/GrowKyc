"""
models/case_assignments.py
==========================
Tracks queue ownership and assignments for enterprise Case orchestration.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import relationship

from models.base import Base


class CaseAssignment(Base):
    """
    Queue and assignment tracking.
    Operational orchestration without polluting CaseStatus.
    """

    __tablename__ = "case_assignments"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Links ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )
    case_id = Column(
        Integer,
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    assigned_to_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # ---- Operational State ----
    queue_name = Column(
        String(100),
        nullable=False,
        default="triage",
        index=True,
        comment="triage|analyst_review|mlro_review|escalated|overdue|high_risk|pending_evidence",
    )

    # ---- Timestamps ----
    assigned_at = Column(
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
    case = relationship("Case", backref="assignment", uselist=False)
    assignee = relationship("User", foreign_keys=[assigned_to_id])

    __table_args__ = (
        Index("idx_case_assign_queue", "tenant_id", "queue_name"),
    )

    def __repr__(self):
        return f"<CaseAssignment(case_id={self.case_id}, queue={self.queue_name})>"
