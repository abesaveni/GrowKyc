"""
models/identity_document.py
===========================
Enterprise-grade generic Identity Document abstraction.
Replaces country-specific fields (e.g. aadhaar, pan).
"""

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import relationship

from models.base import Base


class IdentityDocument(Base):
    """
    Generic identity document model supporting any country's KYC/AML docs
    (e.g., Driver License, Passport, Medicare, TFN, ABN, SSN, Aadhaar).
    """

    __tablename__ = "identity_documents"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Links ----
    # nullable=True: legacy KYC submissions created before multi-tenancy had no tenant context.
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    kyc_id = Column(
        Integer, ForeignKey("kyc.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # ---- Document Details ----
    country_code = Column(
        String(2), nullable=False, comment="ISO 3166-1 alpha-2, e.g. AU, IN, US"
    )

    document_category = Column(
        String(50),
        nullable=False,
        comment="GOVERNMENT_ID|TAX_ID|BUSINESS_ID|ADDRESS_PROOF|FINANCIAL_DOCUMENT",
    )
    document_type = Column(
        String(50), nullable=False, comment="passport|driver_license|tfn|aadhaar|pan"
    )

    document_number = Column(String(255), nullable=False, index=True)

    issuing_authority = Column(String(255), nullable=True)
    issue_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)

    # ---- Status & Integrity ----
    verification_status = Column(
        String(50),
        nullable=False,
        default="pending",
        comment="pending|verified|failed|requires_review",
    )

    provider_reference = Column(String(255), nullable=True)
    ocr_extraction_reference = Column(
        Integer,
        ForeignKey("document_extractions.id", ondelete="SET NULL"),
        nullable=True,
    )
    fraud_check_reference = Column(
        Integer,
        ForeignKey("document_fraud_checks.id", ondelete="SET NULL"),
        nullable=True,
    )

    metadata_json = Column(
        JSON, nullable=True, comment="Normalized attributes or extra data"
    )

    # ---- Timestamps ----
    created_at = Column(
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
    client = relationship("Client", backref="identity_documents", lazy="select")
    kyc = relationship("KYC", backref="identity_documents", lazy="select")

    __table_args__ = (
        Index("idx_id_doc_country_type", "country_code", "document_type"),
    )

    def __repr__(self):
        return (
            f"<IdentityDocument(id={self.id}, "
            f"type={self.document_type}, country={self.country_code})>"
        )
