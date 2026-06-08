"""
models/screening.py
===================
ScreeningRecord — external provider screening results for a Client.

NEW enterprise table. Uses tenant_id nullable=False (new table from inception).

Distinct from Client.is_pep / Client.is_sanctioned boolean flags:
- Those flags are live state (updated in-place).
- ScreeningRecord is an immutable history of each provider check run,
  supporting audit trail, confidence tracking, and multi-provider aggregation.

Supports: sanctions screening, PEP screening, adverse media screening.
Providers: Refinitiv World-Check, ComplyAdvantage, ACRIS, local lists, etc.
"""

from datetime import datetime, timezone

from sqlalchemy import (JSON, Column, DateTime, Float, ForeignKey, Index,
                        Integer, String, Text)
from sqlalchemy.orm import relationship

from models.base import Base


class ScreeningRecord(Base):
    """
    Immutable record of a single screening check run against an external provider.

    Each time a client is screened (onboarding, periodic review, trigger event),
    a new ScreeningRecord is created. Historical records are never mutated.
    """

    __tablename__ = "screening_records"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Parent client ----
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ---- Mandatory tenant scope ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,  # New table: mandatory tenant scope
        index=True,
    )

    # ---- Screening classification ----
    screening_type = Column(
        String(50),
        nullable=False,
        index=True,
        comment="sanctions | pep | adverse_media | credit | insolvency | combined",
    )

    # ---- Provider metadata ----
    provider_name = Column(
        String(255),
        nullable=False,
        comment="e.g. ComplyAdvantage, Refinitiv, AUSTRAC, local_mock",
    )
    provider_reference = Column(
        String(255),
        nullable=True,
        comment="Provider's internal case/reference ID for this check",
    )
    provider_version = Column(String(50), nullable=True)

    # ---- Results ----
    screening_status = Column(
        String(50),
        nullable=False,
        default="pending",
        index=True,
        comment="pending | clear | match_found | review_required | error",
    )
    confidence_score = Column(
        Float,
        nullable=True,
        comment="Provider-reported match confidence (0.0 – 1.0)",
    )
    match_summary = Column(
        Text,
        nullable=True,
        comment="Human-readable match summary from the provider",
    )

    # ---- Full provider payload (native JSON — cross-DB via SQLAlchemy JSON type) ----
    raw_response = Column(
        JSON,
        nullable=True,
        comment="Complete raw JSON response from the screening provider",
    )
    matched_entities = Column(
        JSON,
        nullable=True,
        comment="Structured list of matched entity objects",
    )

    # ---- Trigger context ----
    triggered_by = Column(
        String(100),
        nullable=True,
        comment="onboarding | periodic_review | manual | event_trigger",
    )
    triggered_by_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="NO ACTION"), nullable=True
    )

    # ---- Timestamps ----
    screening_timestamp = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
        comment="When the screening check was executed",
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ---- Relationships ----
    client = relationship(
        "Client",
        back_populates="screening_records",
        lazy="select",
    )
    tenant = relationship(
        "Tenant",
        back_populates="screening_records",
        lazy="select",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_screening_records_client_id", "client_id"),
        Index("idx_screening_records_tenant_id", "tenant_id"),
        Index(
            "idx_screening_records_type_status", "screening_type", "screening_status"
        ),
        Index("idx_screening_records_timestamp", "screening_timestamp"),
    )

    def __repr__(self) -> str:
        return (
            f"<ScreeningRecord(id={self.id}, client_id={self.client_id}, "
            f"type={self.screening_type!r}, status={self.screening_status!r})>"
        )
