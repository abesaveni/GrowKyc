"""
services/evidence_pack_service.py
=================================
Enterprise Evidence Pack generation.
Triggers async zipping of all case artifacts into a secure bundle.
"""

import logging
import uuid
from typing import Optional

from sqlalchemy.orm import Session

from core.exceptions import InvalidStateError, ResourceNotFoundError
from core.tenant_context import get_tenant_id
from models import Case, EvidencePack
from services.audit_service import AuditService

logger = logging.getLogger(__name__)


class EvidencePackService:
    """Service for building and retrieving Evidence Packs."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger
        self.tenant_id = get_tenant_id()

    def trigger_pack_generation(
        self,
        case_id: int,
        report_id: Optional[int] = None,
        generator_id: Optional[int] = None,
    ) -> EvidencePack:
        """
        Initializes an EvidencePack record and dispatches Celery to build the zip.
        """
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise ResourceNotFoundError("Case", case_id)

        correlation_id = str(uuid.uuid4())

        pack = EvidencePack(
            tenant_id=self.tenant_id,
            case_id=case.id,
            report_id=report_id,
            generated_by_id=generator_id,
            correlation_id=correlation_id,
            status="generating",
        )
        self.db.add(pack)
        self.db.commit()
        self.db.refresh(pack)

        AuditService(self.db).log_event(
            actor_id=generator_id,
            action="GENERATE_EVIDENCE_PACK",
            entity_type="evidence_pack",
            entity_id=pack.id,
            after_data={"case_id": case.id, "correlation_id": correlation_id},
        )

        from tasks.reporting_tasks import generate_evidence_pack_async

        generate_evidence_pack_async.delay(pack.id, correlation_id)

        return pack

    def get_download_url(
        self, pack_id: int, requester_id: int, expiry_seconds: int = 3600
    ) -> str:
        """
        Returns a signed URL for a completed pack, using Phase 5 BaseStorageBackend.
        """
        pack = self.db.query(EvidencePack).filter(EvidencePack.id == pack_id).first()
        if not pack:
            raise ResourceNotFoundError("EvidencePack", pack_id)

        if pack.status != "completed" or not pack.storage_key:
            raise InvalidStateError("Evidence pack is not ready for download.")

        from services.storage.factory import get_storage_backend

        storage = get_storage_backend()
        url = storage.generate_signed_url(pack.storage_key, expiry_seconds)

        AuditService(self.db).log_event(
            actor_id=requester_id,
            action="DOWNLOAD_EVIDENCE_PACK",
            entity_type="evidence_pack",
            entity_id=pack.id,
        )

        return url
