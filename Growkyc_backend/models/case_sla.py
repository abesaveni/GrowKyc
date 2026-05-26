"""
models/case_sla.py
==================
SLA engine for tracking escalation timers and priority queues.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import relationship

from models.base import Base


class CaseSLA(Base):
    """
    SLA and Priority tracking for Case workflows.
    """

    __tablename__ = "case_sla"

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

    # ---- Configuration ----
    priority = Column(
        String(50),
        nullable=False,
        default="medium",
        comment="low|medium|high|critical",
    )
    
    # ---- Timers ----
    due_date = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )
    breached = Column(
        Integer,
        default=0,
        nullable=False,
        comment="0=No, 1=Yes",
    )
    escalation_window_hours = Column(
        Integer,
        nullable=True,
        default=48,
        comment="Hours before auto-escalation",
    )

    # ---- Relationships ----
    case = relationship("Case", backref="sla", uselist=False)

    __table_args__ = (
        Index("idx_case_sla_due_date", "tenant_id", "due_date", "breached"),
        Index("idx_case_sla_priority", "tenant_id", "priority"),
    )

    def __repr__(self):
        return f"<CaseSLA(case_id={self.case_id}, priority={self.priority}, breached={self.breached})>"
