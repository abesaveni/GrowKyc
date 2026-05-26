"""
models/case_snapshots.py
========================
Immutable snapshot of case state on closure.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from models.base import Base


class CaseSnapshot(Base):
    """
    Immutable snapshot generated when a Case is closed.
    Includes full state for regulator defensibility.
    """

    __tablename__ = "case_snapshots"

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

    # ---- Version Metadata ----
    schema_version = Column(String(50), nullable=False, default="1.0.0")
    generated_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    risk_engine_version = Column(String(50), nullable=True)
    screening_versions = Column(String(255), nullable=True)

    # ---- Snapshot Payload ----
    snapshot_data = Column(
        JSON,
        nullable=False,
        comment="Full JSON dump of risk, screening, evidence, and EDD state",
    )

    # ---- Timestamps ----
    generated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ---- Relationships ----
    case = relationship("Case", backref="snapshot", uselist=False)

    def __repr__(self):
        return f"<CaseSnapshot(case_id={self.case_id}, version={self.schema_version})>"
