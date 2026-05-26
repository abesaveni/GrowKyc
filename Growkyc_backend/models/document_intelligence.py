"""
models/document_intelligence.py
===============================
Enterprise document intelligence models.
Handles OCR extraction, MRZ parsing, fraud detection, and liveness checks.

Rules:
- Append-only architecture (no overwriting previous extractions).
- Provider-agnostic.
- Confidence scores normalized to 0-100.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Index, Integer, String
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from models.base import Base


class DocumentExtraction(Base):
    """
    Append-only record of an OCR extraction run.
    """
    __tablename__ = "document_extractions"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Links ----
    tenant_id = Column(
        Integer, ForeignKey("tenants.id", ondelete="NO ACTION"), nullable=False, index=True
    )
    document_id = Column(
        Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    correlation_id = Column(String(128), nullable=True, index=True)

    # ---- Provider Metadata ----
    provider_name = Column(String(100), nullable=False, comment="aws|azure|gcp|mock")
    provider_version = Column(String(50), nullable=False, default="unknown")
    schema_version = Column(String(50), nullable=False, default="1.0.0")
    
    status = Column(
        String(50),
        nullable=False,
        default="pending",
        comment="pending|processing|completed|failed|requires_review",
    )
    
    # ---- Normalization ----
    normalized_confidence = Column(
        Float, nullable=True, comment="0.0 to 100.0 standardized score"
    )

    # ---- Payloads ----
    raw_response = Column(JSON, nullable=True, comment="Original provider payload")
    extracted_data = Column(JSON, nullable=True, comment="Normalized key-value fields")
    mrz_data = Column(JSON, nullable=True, comment="Parsed MRZ components if applicable")

    error_message = Column(String(1000), nullable=True)

    # ---- Timestamps ----
    processed_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Relationships ----
    document = relationship("Document", backref="extractions", lazy="select")

    __table_args__ = (
        Index("idx_doc_ext_doc_id", "document_id"),
        Index("idx_doc_ext_tenant_id", "tenant_id"),
    )


class DocumentVerification(Base):
    """Provider-specific document authentications (e.g. ID chip validation)."""
    __tablename__ = "document_verifications"

    id = Column(Integer, primary_key=True, index=True)

    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="NO ACTION"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    correlation_id = Column(String(128), nullable=True)

    provider_name = Column(String(100), nullable=False)
    provider_version = Column(String(50), nullable=False, default="unknown")

    status = Column(String(50), nullable=False, comment="completed|failed")
    verification_outcome = Column(String(50), nullable=True, comment="pass|fail|caution")
    normalized_confidence = Column(Float, nullable=True)
    
    verification_data = Column(JSON, nullable=True)

    processed_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class DocumentFraudCheck(Base):
    """Tampering indicators, blurry image detection, and duplicate checks."""
    __tablename__ = "document_fraud_checks"

    id = Column(Integer, primary_key=True, index=True)

    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="NO ACTION"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    correlation_id = Column(String(128), nullable=True)

    provider_name = Column(String(100), nullable=False)
    fraud_engine_version = Column(String(50), nullable=False, default="unknown")

    # ---- Fingerprinting & Integrity ----
    perceptual_hash = Column(String(128), nullable=True, index=True)
    is_duplicate = Column(Integer, default=0, nullable=False, comment="0=No, 1=Yes")
    duplicate_of_document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)

    # ---- Quality & Fraud Metrics ----
    blurry_score = Column(Float, nullable=True)
    tamper_score = Column(Float, nullable=True)
    fraud_indicators = Column(JSON, nullable=True, comment="Array of specific fraud flags raised")

    processed_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class DocumentFace(Base):
    """Detected face metrics."""
    __tablename__ = "document_faces"

    id = Column(Integer, primary_key=True, index=True)

    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="NO ACTION"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    
    face_count = Column(Integer, default=0, nullable=False)
    face_bounding_boxes = Column(JSON, nullable=True)
    face_quality_score = Column(Float, nullable=True)

    processed_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class DocumentLiveness(Base):
    """Liveness checks and selfie matching."""
    __tablename__ = "document_liveness"

    id = Column(Integer, primary_key=True, index=True)

    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="NO ACTION"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    correlation_id = Column(String(128), nullable=True)

    provider_name = Column(String(100), nullable=False)
    liveness_engine_version = Column(String(50), nullable=False, default="unknown")

    status = Column(String(50), nullable=False)
    liveness_outcome = Column(String(50), nullable=True, comment="pass|fail|spoof_detected")
    normalized_confidence = Column(Float, nullable=True)

    match_score_to_id = Column(Float, nullable=True, comment="If matched against ID portrait")

    processed_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
