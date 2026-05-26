"""
models/case_events.py
=====================
Enterprise case event tracking.
Forms an immutable timeline of workflow transitions and actions.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from models.base import Base


class CaseEvent(Base):
    """
    Immutable event in a Case timeline.
    MUST be append-only. NEVER update existing events.
    """

    __tablename__ = "case_events"

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
        index=True,
    )
    actor_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="System = NULL",
    )

    # ---- Event Data ----
    event_type = Column(
        String(100),
        nullable=False,
        index=True,
        comment="created|assigned|escalated|reviewed|approved|rejected|reopened|closed|evidence_added|risk_updated|screening_updated|edd_triggered",
    )
    event_details = Column(
        JSON,
        nullable=True,
        comment="Contextual metadata for the event",
    )
    
    timestamp = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # ---- Relationships ----
    case = relationship("Case", backref="timeline_events", lazy="select")
    actor = relationship("User", foreign_keys=[actor_id])

    __table_args__ = (
        Index("idx_case_events_case_timestamp", "case_id", "timestamp"),
    )

    def __repr__(self):
        return f"<CaseEvent(id={self.id}, type={self.event_type}, case_id={self.case_id})>"
