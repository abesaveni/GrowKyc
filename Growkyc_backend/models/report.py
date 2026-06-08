"""
models/report.py
================
Report model — generated compliance reports (SMR, TTR, IFTI).

Preserved verbatim from the original monolithic models.py.
Added: tenant_id (nullable=True, Phase 1 multi-tenancy preparation).

Imports: use `from models import Report` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Index, Integer, Text
from sqlalchemy.orm import relationship

from core.enums import ReportType
from models.base import Base


class Report(Base):
    """Report model for generated compliance reports (SMR, TTR, IFTI)."""

    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    type = Column(SQLEnum(ReportType), nullable=False)

    # Stored as JSON-encoded text for cross-DB compatibility.
    # Phase 4 upgrade path: migrate to native JSON/JSONB column.
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

    # ---- Relationships ----
    client = relationship("Client", back_populates="reports")

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_reports_client_id", "client_id"),
        Index("idx_reports_type", "type"),
        Index("idx_reports_tenant_id", "tenant_id"),
        Index("idx_reports_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return (
            f"<Report(id={self.id}, client_id={self.client_id}, " f"type={self.type})>"
        )
