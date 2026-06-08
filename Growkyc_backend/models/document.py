"""
models/document.py
==================
Document model — uploaded KYC verification files and evidence attachments.

Preserved verbatim from the original monolithic models.py.
Added: tenant_id (nullable=True, Phase 1 multi-tenancy preparation).

Imports: use `from models import Document` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from core.enums import DocumentType
from models.base import Base


class Document(Base):
    """Document model for tracking uploaded verification files."""

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    # Primary KYC link
    kyc_id = Column(
        Integer,
        ForeignKey("kyc.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    file_name = Column(String(500), nullable=False)
    file_path = Column(String(500), nullable=False)
    type = Column(SQLEnum(DocumentType), nullable=False)

    # ---- Evidence extensions (added in prior sprint) ----
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    case_id = Column(
        Integer,
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    uploaded_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    expiry_date = Column(DateTime, nullable=True)
    uploaded_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
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

    # ---- Phase 5: Enterprise document metadata ----
    # All fields are nullable for backward compatibility.
    document_category = Column(
        String(100),
        nullable=True,
        comment="identity|address|financial|corporate|evidence",
    )
    document_subtype = Column(String(100), nullable=True)
    mime_type = Column(String(100), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)

    # ---- Issuance ----
    issue_date = Column(DateTime, nullable=True)
    issuing_country = Column(String(100), nullable=True)
    issuing_authority = Column(String(255), nullable=True)

    # ---- Storage abstraction ----
    storage_backend = Column(
        String(50), nullable=True, default="local", comment="local|s3|minio|azure"
    )
    storage_key = Column(
        String(1000), nullable=True, comment="Object key / S3 key for the stored file"
    )

    # ---- Integrity / tamper detection ----
    checksum_hash = Column(
        String(128), nullable=True, comment="SHA-256 of file content"
    )
    tamper_detection_status = Column(
        String(50), nullable=True, default="pending", comment="pending|clean|tampered"
    )
    encryption_reference = Column(String(255), nullable=True)

    # ---- OCR ----
    ocr_status = Column(
        String(50),
        nullable=True,
        default="not_started",
        comment="not_started|processing|completed|failed",
    )
    ocr_data = Column(JSON, nullable=True, comment="Extracted fields from OCR provider")
    liveness_reference = Column(String(255), nullable=True)

    # ---- Verification ----
    verification_status = Column(
        String(50),
        nullable=True,
        default="pending",
        comment="pending|verified|failed|requires_review",
    )
    verification_provider = Column(String(100), nullable=True)
    provider_reference = Column(String(255), nullable=True)
    verified_at = Column(DateTime, nullable=True)

    # ---- Review workflow ----
    reviewed_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    review_status = Column(
        String(50), nullable=True, comment="pending|approved|rejected"
    )
    review_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    # ---- Document versioning ----
    document_version = Column(Integer, nullable=True, default=1)
    is_superseded = Column(Integer, nullable=True, default=0)
    superseded_by_id = Column(
        Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True
    )

    # ---- Relationships ----
    kyc = relationship("KYC", back_populates="documents")
    tenant = relationship(
        "Tenant",
        back_populates="documents",
        foreign_keys=[tenant_id],
        lazy="select",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_documents_kyc_id", "kyc_id"),
        Index("idx_documents_type", "type"),
        Index("idx_documents_uploaded_at", "uploaded_at"),
        Index("idx_documents_expiry_date", "expiry_date"),  # used by expiry scheduler
        Index("idx_documents_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return f"<Document(id={self.id}, kyc_id={self.kyc_id}, type={self.type})>"
