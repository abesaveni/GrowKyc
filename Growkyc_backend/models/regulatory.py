"""
models/regulatory.py
====================
Enterprise regulatory reporting models (Phase 8).
Preserves legacy Report model while adding SMR/TTR, submission tracking,
and immutable evidence pack architecture.
"""

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from models.base import Base


class RegulatoryReport(Base):
    """
    Enterprise regulatory report (SMR, TTR, IFTI).
    Immutable once submitted.
    """

    __tablename__ = "regulatory_reports"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Links ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )
    case_id = Column(
        Integer,
        ForeignKey("cases.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---- Configuration ----
    report_type = Column(
        String(50),
        nullable=False,
        comment="SMR|TTR|IFTI|MANUAL",
        index=True,
    )
    schema_version = Column(String(50), nullable=False, default="1.0.0")

    # ---- Payload ----
    report_payload = Column(
        JSON,
        nullable=False,
        comment="Immutable structured payload for regulator",
    )
    immutable_hash = Column(String(128), nullable=True)

    # ---- Governance ----
    generated_by_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    reviewed_by_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    approval_chain = Column(JSON, nullable=True)

    # ---- Status ----
    submission_status = Column(
        String(50),
        nullable=False,
        default="draft",
        comment="draft|pending_approval|pending_submission|submitted|failed|rejected",
        index=True,
    )
    regulator_reference = Column(String(255), nullable=True, index=True)

    # ---- Timestamps ----
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    submitted_at = Column(DateTime(timezone=True), nullable=True)

    # ---- Relationships ----
    submissions = relationship(
        "ReportSubmission", backref="report", cascade="all, delete-orphan"
    )
    acknowledgements = relationship(
        "ReportAcknowledgement", backref="report", cascade="all, delete-orphan"
    )
    evidence_packs = relationship("EvidencePack", backref="report", lazy="select")

    def __repr__(self):
        return (
            f"<RegulatoryReport(id={self.id}, "
            f"type={self.report_type}, status={self.submission_status})>"
        )


class ReportSubmission(Base):
    """Tracks transmission attempts to regulators."""

    __tablename__ = "report_submissions"

    id = Column(Integer, primary_key=True, index=True)

    report_id = Column(
        Integer,
        ForeignKey("regulatory_reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    correlation_id = Column(String(128), nullable=False, index=True)

    status = Column(
        String(50),
        nullable=False,
        comment="pending|in_progress|success|failed",
    )
    raw_request_payload = Column(Text, nullable=True)
    raw_response_payload = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)

    submitted_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self):
        return f"<ReportSubmission(report_id={self.report_id}, status={self.status})>"


class ReportAcknowledgement(Base):
    """Tracks async receipts and callbacks from regulators."""

    __tablename__ = "report_acknowledgements"

    id = Column(Integer, primary_key=True, index=True)

    report_id = Column(
        Integer,
        ForeignKey("regulatory_reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    correlation_id = Column(String(128), nullable=False, index=True)

    acknowledgement_reference = Column(String(255), nullable=False)
    status_code = Column(
        String(50), nullable=False, comment="accepted|rejected|needs_info"
    )
    raw_response_data = Column(JSON, nullable=True)

    received_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self):
        return (
            f"<ReportAcknowledgement(report_id={self.report_id}, "
            f"status={self.status_code})>"
        )


class EvidencePack(Base):
    """
    Immutable zip/PDF bundle containing case history and evidence.
    """

    __tablename__ = "evidence_packs"

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
        ForeignKey("cases.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )
    report_id = Column(
        Integer,
        ForeignKey("regulatory_reports.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    generated_by_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    correlation_id = Column(String(128), nullable=True, index=True)

    # ---- Status & Integrity ----
    status = Column(
        String(50),
        nullable=False,
        default="pending",
        comment="pending|generating|completed|failed",
        index=True,
    )
    schema_version = Column(String(50), nullable=False, default="1.0.0")
    immutable_hash = Column(
        String(128), nullable=True, comment="SHA256 of the generated zip"
    )

    # ---- Storage ----
    storage_key = Column(
        String(1000),
        nullable=True,
        comment="Path in evidence-packs/tenant_id/case_id/...",
    )
    file_size_bytes = Column(Integer, nullable=True)

    error_message = Column(Text, nullable=True)

    # ---- Timestamps ----
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # ---- Relationships ----
    items = relationship(
        "EvidencePackItem", backref="pack", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return (
            f"<EvidencePack(id={self.id}, "
            f"case_id={self.case_id}, status={self.status})>"
        )


class EvidencePackItem(Base):
    """Link defining what goes into the Evidence Pack bundle."""

    __tablename__ = "evidence_pack_items"

    id = Column(Integer, primary_key=True, index=True)

    pack_id = Column(
        Integer,
        ForeignKey("evidence_packs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    item_type = Column(
        String(50),
        nullable=False,
        comment="document|screening|timeline_event|edd_workflow|audit_log",
    )
    item_ref_id = Column(Integer, nullable=False)

    included_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (Index("idx_evidence_pack_item_ref", "item_type", "item_ref_id"),)
