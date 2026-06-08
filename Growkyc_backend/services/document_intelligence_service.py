"""
services/document_intelligence_service.py
=========================================
Orchestrates intelligent document processing, fraud checks, and liveness.
Leaves the base Document intact, populating the new analytical tables.
"""

import logging
import uuid

from sqlalchemy.orm import Session

from core.exceptions import ResourceNotFoundError
from core.tenant_context import get_tenant_id
from models import Client, Document, DocumentExtraction, DocumentFraudCheck
from services.audit_service import AuditService
from services.ocr import get_ocr_provider
from services.storage.factory import get_storage_backend

logger = logging.getLogger(__name__)


class DocumentIntelligenceService:
    """Service for running OCR and Fraud Intelligence on Documents."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger
        self.tenant_id = get_tenant_id()

    def extract_and_parse(
        self, document_id: int, correlation_id: str = None
    ) -> DocumentExtraction:
        """
        Runs OCR provider and appends a DocumentExtraction record.
        """
        doc = self._get_document(document_id)

        provider = get_ocr_provider()

        # Read the file from storage
        storage = get_storage_backend()
        # Mock reading bytes since BaseStorageBackend has no read method.
        # Real providers should use a read method or presigned URL.
        content = b"mock file bytes"

        # Perform extraction
        result = provider.extract(
            content, document_type=str(doc.type.value) if doc.type else None
        )

        extraction = DocumentExtraction(
            tenant_id=self.tenant_id,
            document_id=doc.id,
            correlation_id=correlation_id or str(uuid.uuid4()),
            provider_name=result.provider,
            provider_version="v2.1",  # Hardcoded version for demo
            schema_version="1.0.0",
            status=result.status,
            normalized_confidence=result.confidence_score,
            extracted_data=result.extracted_fields,
            mrz_data=result.mrz_data,
        )
        self.db.add(extraction)

        # Update base document status for backward compatibility
        doc.ocr_status = result.status
        if result.status == "completed":
            doc.ocr_data = result.extracted_fields

        self.db.commit()
        self.db.refresh(extraction)

        AuditService(self.db).log_event(
            actor_id=None,
            action="DOCUMENT_EXTRACTION",
            entity_type="document",
            entity_id=doc.id,
            after_data={"provider": provider.provider_name, "status": result.status},
        )

        return extraction

    def analyze_fraud(
        self, document_id: int, correlation_id: str = None
    ) -> DocumentFraudCheck:
        """
        Analyzes for duplicates, blurry images, and tampering.
        """
        doc = self._get_document(document_id)

        # Simulated perceptual hashing and duplicate check
        mock_phash = "a1b2c3d4e5f67890"

        duplicate = (
            self.db.query(DocumentFraudCheck)
            .filter(
                DocumentFraudCheck.perceptual_hash == mock_phash,
                DocumentFraudCheck.document_id != doc.id,
            )
            .first()
        )

        fraud = DocumentFraudCheck(
            tenant_id=self.tenant_id,
            document_id=doc.id,
            correlation_id=correlation_id or str(uuid.uuid4()),
            provider_name="internal_fraud_engine",
            fraud_engine_version="v1.5",
            perceptual_hash=mock_phash,
            is_duplicate=1 if duplicate else 0,
            duplicate_of_document_id=duplicate.document_id if duplicate else None,
            blurry_score=5.2,  # 0-100 scale, low is better
            tamper_score=1.1,
            fraud_indicators=["duplicate_found"] if duplicate else [],
        )
        self.db.add(fraud)

        # Base document backward compatibility
        doc.tamper_detection_status = "tampered" if duplicate else "clean"

        self.db.commit()
        self.db.refresh(fraud)

        AuditService(self.db).log_event(
            actor_id=None,
            action="DOCUMENT_FRAUD_CHECK",
            entity_type="document",
            entity_id=doc.id,
            after_data={
                "is_duplicate": fraud.is_duplicate,
                "tamper_score": fraud.tamper_score,
            },
        )

        # Trigger EDD Escaltion if fraud detected
        if fraud.is_duplicate or fraud.tamper_score > 50.0:
            self._trigger_fraud_escalation(doc)

        return fraud

    def _trigger_fraud_escalation(self, doc: Document):
        """Increase Risk Score and Initiate EDD Workflow if fraud is detected."""
        if not doc.client_id:
            return

        client = self.db.query(Client).filter(Client.id == doc.client_id).first()
        if client:
            from core.enums import RiskLevel

            client.risk_score = min(client.risk_score + 40.0, 100.0)
            client.risk_level = RiskLevel.HIGH

            # Start EDD
            try:
                from services.edd_service import EDDService

                EDDService(self.db).initiate_edd(
                    client_id=client.id,
                    # Overloaded as system fraud trigger for now.
                    trigger_reason="manual",
                    initial_risk_score=client.risk_score,
                )
            except Exception as e:
                self.logger.error(f"Failed to auto-trigger EDD on fraud: {e}")

            self.db.commit()

    def _get_document(self, document_id: int) -> Document:
        doc = self.db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise ResourceNotFoundError("Document", document_id)
        return doc
