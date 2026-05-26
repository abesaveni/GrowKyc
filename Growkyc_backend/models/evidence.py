"""
models/evidence.py
==================
Evidence model — immutable final JSON storage packages generated upon
Case resolution.

Preserved verbatim from the original monolithic models.py.
Added: tenant_id (nullable=True, Phase 1 multi-tenancy preparation).

Imports: use `from models import Evidence` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import relationship

from models.base import Base


class Evidence(Base):
    """
    Immutable evidence package generated upon Case closure/resolution.

    Stores a JSON payload aggregating all compliance-relevant data
    for a client at the point of resolution. Append-only — never mutated.
    """

    __tablename__ = "evidences"

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

    # JSON payload as text (cross-DB safe; Phase 4 upgrade to native JSON)
    data = Column(Text, nullable=False)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_evidences_client_id", "client_id"),
        Index("idx_evidences_case_id", "case_id"),
        Index("idx_evidences_tenant_id", "tenant_id"),
        Index("idx_evidences_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return (
            f"<Evidence(id={self.id}, client_id={self.client_id}, "
            f"case_id={self.case_id})>"
        )
