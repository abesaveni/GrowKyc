"""
services/regulatory_service.py
==============================
Enterprise regulatory reporting service.
Handles structured payload generation and initiates async submission sequences.
"""

import hashlib
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from core.exceptions import InvalidStateError, ResourceNotFoundError
from core.tenant_context import get_tenant_id
from models import Client, RegulatoryReport, ReportSubmission
from services.audit_service import AuditService

logger = logging.getLogger(__name__)


class RegulatoryService:
    """Service for handling SMR, TTR, IFTI enterprise reporting."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger
        self.tenant_id = get_tenant_id()

    def generate_report(
        self,
        client_id: int,
        report_type: str,
        case_id: Optional[int] = None,
        generator_id: Optional[int] = None,
    ) -> RegulatoryReport:
        """
        Builds the immutable payload for a regulatory report.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise ResourceNotFoundError("Client", client_id)

        # Build payload (simulating structured data gathering)
        payload = {
            "metadata": {
                "tenant_id": self.tenant_id,
                "schema_version": "1.0.0",
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "report_classification": report_type,
            },
            "subject": {
                "internal_client_id": client.id,
                "name": client.name,
                "risk_score": client.risk_score,
            },
            "context": {
                "case_id": case_id,
                "trigger_events": ["High risk score detected", "SLA breached"],
            },
            "findings": "Pending MLRO narrative.",
        }

        payload_json = json.dumps(payload, separators=(",", ":"))
        immutable_hash = hashlib.sha256(payload_json.encode()).hexdigest()

        report = RegulatoryReport(
            tenant_id=self.tenant_id,
            client_id=client.id,
            case_id=case_id,
            report_type=report_type,
            report_payload=payload,
            immutable_hash=immutable_hash,
            generated_by_id=generator_id,
        )

        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)

        AuditService(self.db).log_event(
            actor_id=generator_id,
            action="GENERATE_REPORT",
            entity_type="regulatory_report",
            entity_id=report.id,
            after_data={"report_type": report_type, "hash": immutable_hash},
        )

        return report

    def submit_report(self, report_id: int, submitter_id: int) -> ReportSubmission:
        """
        Locks the report and queues an async transmission.
        """
        report = (
            self.db.query(RegulatoryReport)
            .filter(RegulatoryReport.id == report_id)
            .first()
        )
        if not report:
            raise ResourceNotFoundError("RegulatoryReport", report_id)

        if report.submission_status in ("submitted", "pending_submission"):
            raise InvalidStateError("Report is already submitted or pending.")

        # Lock report status
        report.submission_status = "pending_submission"
        report.reviewed_by_id = submitter_id

        correlation_id = str(uuid.uuid4())

        submission = ReportSubmission(
            report_id=report.id,
            correlation_id=correlation_id,
            status="pending",
        )
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)

        # Trigger Celery Task
        from tasks.reporting_tasks import transmit_report_async

        transmit_report_async.delay(submission.id, correlation_id)

        return submission
