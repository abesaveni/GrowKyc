"""
services/case_workflow_service.py
=================================
Enterprise Case orchestration service.
Manages assignments, SLAs, event logging, and evidence linking
without breaking the legacy Case status lifecycle.
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from core.enums import CaseStatus
from core.exceptions import DatabaseError, InvalidStateError, ResourceNotFoundError
from core.tenant_context import get_tenant_id
from models import (
    Case,
    CaseAssignment,
    CaseComment,
    CaseEvent,
    CaseEvidence,
    CaseSLA,
    CaseSnapshot,
    Client,
)

logger = logging.getLogger(__name__)


class CaseWorkflowService:
    """Enterprise AML Case Management Service."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger
        self.tenant_id = get_tenant_id()

    def create_enterprise_case(
        self,
        client_id: int,
        title: str,
        description: str,
        priority: str = "medium",
        queue_name: str = "triage",
        creator_id: int = None,
    ) -> Case:
        """Create a new Case and initialize enterprise orchestration (Assignment, SLA, Event)."""
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise ResourceNotFoundError("Client", client_id)

        try:
            # 1. Base Case
            case = Case(
                client_id=client.id,
                tenant_id=self.tenant_id,
                title=title,
                description=description,
                status=CaseStatus.OPEN,
            )
            self.db.add(case)
            self.db.flush()

            # 2. Assignment & Queue
            assignment = CaseAssignment(
                case_id=case.id,
                tenant_id=self.tenant_id,
                queue_name=queue_name,
            )
            self.db.add(assignment)

            # 3. SLA
            due_date = datetime.now(timezone.utc) + timedelta(hours=48 if priority != "critical" else 12)
            sla = CaseSLA(
                case_id=case.id,
                tenant_id=self.tenant_id,
                priority=priority,
                due_date=due_date,
            )
            self.db.add(sla)

            # 4. Immutable Event
            self._append_event(
                case_id=case.id,
                event_type="created",
                actor_id=creator_id,
                details={"priority": priority, "queue": queue_name, "title": title},
            )

            self.db.commit()
            self.db.refresh(case)
            return case

        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Failed to create enterprise case: {e}")
            raise DatabaseError("Could not create Case.")

    def assign_case(self, case_id: int, assignee_id: int, actor_id: int) -> CaseAssignment:
        """Assign a case to a specific analyst/MLRO."""
        case = self._get_case(case_id)
        if case.status != CaseStatus.OPEN:
            raise InvalidStateError("Cannot assign a closed case.")

        assignment = self.db.query(CaseAssignment).filter(CaseAssignment.case_id == case.id).first()
        if not assignment:
            assignment = CaseAssignment(case_id=case.id, tenant_id=self.tenant_id)
            self.db.add(assignment)

        old_assignee = assignment.assigned_to_id
        assignment.assigned_to_id = assignee_id
        assignment.updated_at = datetime.now(timezone.utc)

        # Update queue to analyst_review if it was in triage
        if assignment.queue_name == "triage":
            assignment.queue_name = "analyst_review"

        self._append_event(
            case_id=case.id,
            event_type="assigned",
            actor_id=actor_id,
            details={"previous_assignee": old_assignee, "new_assignee": assignee_id, "queue": assignment.queue_name},
        )

        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def escalate_case(self, case_id: int, reason: str, actor_id: int) -> CaseAssignment:
        """Escalate a case to the MLRO queue."""
        case = self._get_case(case_id)
        if case.status != CaseStatus.OPEN:
            raise InvalidStateError("Cannot escalate a closed case.")

        assignment = self.db.query(CaseAssignment).filter(CaseAssignment.case_id == case.id).first()
        old_queue = assignment.queue_name if assignment else "None"

        if assignment:
            assignment.queue_name = "mlro_review"
            assignment.assigned_to_id = None  # Return to unassigned pool for MLROs
            assignment.updated_at = datetime.now(timezone.utc)
        else:
            assignment = CaseAssignment(
                case_id=case.id, tenant_id=self.tenant_id, queue_name="mlro_review"
            )
            self.db.add(assignment)

        # Escalate Priority
        sla = self.db.query(CaseSLA).filter(CaseSLA.case_id == case.id).first()
        if sla and sla.priority in ("low", "medium"):
            sla.priority = "high"

        self._append_event(
            case_id=case.id,
            event_type="escalated",
            actor_id=actor_id,
            details={"reason": reason, "previous_queue": old_queue},
        )

        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def link_evidence(self, case_id: int, evidence_type: str, ref_id: int, desc: str, actor_id: int) -> CaseEvidence:
        """Link external documents/reports to a case."""
        case = self._get_case(case_id)
        
        evidence = CaseEvidence(
            tenant_id=self.tenant_id,
            case_id=case.id,
            added_by_id=actor_id,
            evidence_type=evidence_type,
            evidence_ref_id=ref_id,
            description=desc,
        )
        self.db.add(evidence)

        self._append_event(
            case_id=case.id,
            event_type="evidence_added",
            actor_id=actor_id,
            details={"type": evidence_type, "ref_id": ref_id, "desc": desc},
        )

        self.db.commit()
        self.db.refresh(evidence)
        return evidence

    def add_comment(self, case_id: int, content: str, actor_id: int) -> CaseComment:
        """Add an analyst note to the case."""
        case = self._get_case(case_id)
        comment = CaseComment(
            tenant_id=self.tenant_id,
            case_id=case.id,
            author_id=actor_id,
            content=content,
        )
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def close_with_snapshot(self, case_id: int, resolution: str, actor_id: int) -> Case:
        """Close the case and generate an immutable snapshot."""
        case = self._get_case(case_id)
        if case.status == CaseStatus.CLOSED:
            return case

        case.status = CaseStatus.CLOSED

        # Generate Snapshot Payload
        # In a real system, we'd fetch actual screening & risk objects here.
        # For now, we mock the payload structure to prove the architecture.
        snapshot_payload = {
            "resolution": resolution,
            "final_risk_score": 85.5,
            "screening_hits_count": 2,
            "evidence_count": self.db.query(CaseEvidence).filter(CaseEvidence.case_id == case.id).count(),
            "closed_by_user_id": actor_id,
        }

        snapshot = CaseSnapshot(
            tenant_id=self.tenant_id,
            case_id=case.id,
            generated_by=actor_id,
            schema_version="1.0.0",
            risk_engine_version="v2.1",
            screening_versions="complyadvantage_v3",
            snapshot_data=snapshot_payload,
        )
        self.db.add(snapshot)

        self._append_event(
            case_id=case.id,
            event_type="closed",
            actor_id=actor_id,
            details={"resolution": resolution, "snapshot_version": "1.0.0"},
        )

        self.db.commit()
        self.db.refresh(case)
        return case

    def get_cases_by_queue(self, queue_name: str) -> List[Case]:
        """Fetch all cases currently residing in a specific operational queue."""
        return (
            self.db.query(Case)
            .join(CaseAssignment, Case.id == CaseAssignment.case_id)
            .filter(CaseAssignment.queue_name == queue_name)
            .filter(Case.status == CaseStatus.OPEN)
            .all()
        )

    def _get_case(self, case_id: int) -> Case:
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise ResourceNotFoundError("Case", case_id)
        return case

    def _append_event(self, case_id: int, event_type: str, actor_id: int, details: dict):
        """Internal helper to ensure CaseEvents are strictly appended."""
        event = CaseEvent(
            tenant_id=self.tenant_id,
            case_id=case_id,
            actor_id=actor_id,
            event_type=event_type,
            event_details=details,
        )
        self.db.add(event)
