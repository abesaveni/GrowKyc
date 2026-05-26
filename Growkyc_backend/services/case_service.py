"""
Case service for managing client investigations.
"""

import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from core.enums import CaseStatus, ReportType
from core.exceptions import ResourceNotFoundError
from models import Case, Client
from services.audit_service import AuditService
from services.evidence_service import EvidenceService
from services.report_service import ReportService

logger = logging.getLogger(__name__)


class CaseService:
    """Service handling case management operations."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)

    def create_case(self, client_id: int, title: str, description: str = None) -> Case:
        """Create a new case for a client (e.g. high-risk flag)."""
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise ResourceNotFoundError("Client", client_id)

        case = Case(
            client_id=client.id,
            title=title,
            description=description,
            status=CaseStatus.OPEN,
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(case)
        self.db.commit()
        self.db.refresh(case)

        self.logger.info(f"Case {case.id} created for Client {client.id}.")
        return case

    def update_case_status(self, case_id: int, status: CaseStatus) -> Case:
        """Update the status of a case."""
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise ResourceNotFoundError("Case", case_id)

        old_status = case.status
        case.status = status
        self.db.commit()
        self.db.refresh(case)

        # --- INTEGRATION: TRIGGER AUDIT LOG ---
        AuditService(self.db).log_event(
            actor_id=None,
            action="UPDATE",
            entity_type="case",
            entity_id=case.id,
            before_data={"status": old_status.value},
            after_data={"status": status.value},
        )
        # --------------------------------------

        # --- INTEGRATION: TRIGGER REPORT & EVIDENCE ON CLOSURE ---
        # Add idempotency constraint so multiple packs aren't spammed
        if status == CaseStatus.CLOSED and old_status != CaseStatus.CLOSED:
            report_service = ReportService(self.db)
            report_service.generate_report(case.client_id, ReportType.SMR)

            # Generate Immutable Evidence Pack
            evidence_service = EvidenceService(self.db)
            try:
                evidence_service.generate_evidence_pack(
                    case.client_id, target_case_id=case.id
                )
                # BRD: Store results. Keeping it lightweight without external
                # dependencies by logging struct to DB or output
                self.logger.info(
                    "EVIDENCE PACK GENERATED (IDEMPOTENT) FOR CLIENT "
                    f"{case.client_id} / CASE {case.id}"
                )
            except Exception as e:
                self.logger.error(
                    f"Failed to generate evidence pack, maintaining state: {str(e)}"
                )
        # ---------------------------------------------------------

        self.logger.info(f"Case {case.id} transitioned to {status.value}.")
        return case
