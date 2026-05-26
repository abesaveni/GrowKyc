"""
models/case_evidence.py
=======================
M:N evidence linking for Cases.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import relationship

from models.base import Base


class CaseEvidence(Base):
    """
    Links external evidence directly to a Case.
    """

    __tablename__ = "case_evidence"

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
    added_by_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # ---- Evidence Type & Ref ----
    evidence_type = Column(
        String(50),
        nullable=False,
        comment="document|screening|report|audit|edd_workflow",
    )
    evidence_ref_id = Column(
        Integer,
        nullable=False,
        comment="ID of the referenced entity",
    )
    description = Column(String(500), nullable=True)

    # ---- Timestamps ----
    added_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ---- Relationships ----
    case = relationship("Case", backref="evidence_links", lazy="select")
    added_by = relationship("User", foreign_keys=[added_by_id])

    __table_args__ = (
        Index("idx_case_evidence_ref", "evidence_type", "evidence_ref_id"),
    )

    def __repr__(self):
        return f"<CaseEvidence(case_id={self.case_id}, type={self.evidence_type}, ref={self.evidence_ref_id})>"
