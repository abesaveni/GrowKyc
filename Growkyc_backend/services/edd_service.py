"""
services/edd_service.py
=======================
Enhanced Due Diligence (EDD) Workflow Service.

Handles EDD lifecycle: initiation, questionnaire collection,
MLRO/partner approval chains, evidence tracking, and outcome recording.
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from core.enums import RiskLevel
from core.exceptions import DatabaseError, InvalidStateError, ResourceNotFoundError
from core.tenant_context import get_tenant_id
from models import Client, EDDWorkflow

logger = logging.getLogger(__name__)


# Standard EDD questionnaire template
EDD_QUESTIONNAIRE_TEMPLATE = [
    {
        "id": "q1",
        "question": "What is the primary source of funds for this client?",
        "type": "text",
        "mandatory": True,
    },
    {
        "id": "q2",
        "question": "What is the purpose of this business relationship?",
        "type": "text",
        "mandatory": True,
    },
    {
        "id": "q3",
        "question": "Does the client have any known political affiliations or PEP connections?",
        "type": "boolean",
        "mandatory": True,
    },
    {
        "id": "q4",
        "question": "Are there any complex ownership structures or offshore entities involved?",
        "type": "boolean",
        "mandatory": True,
    },
    {
        "id": "q5",
        "question": "Has the client operated in any high-risk jurisdictions in the last 5 years?",
        "type": "boolean",
        "mandatory": True,
    },
    {
        "id": "q6",
        "question": "Please provide additional context on source of wealth.",
        "type": "text",
        "mandatory": False,
    },
]

# Evidence checklist by trigger
EDD_EVIDENCE_REQUIREMENTS = {
    "pep": [
        {"type": "source_of_wealth", "description": "Source of Wealth documentation", "mandatory": True},
        {"type": "reference_letter", "description": "Professional reference letter", "mandatory": False},
    ],
    "high_risk_country": [
        {"type": "source_of_funds", "description": "Source of Funds evidence", "mandatory": True},
        {"type": "business_purpose", "description": "Business purpose statement", "mandatory": True},
    ],
    "complex_ownership": [
        {"type": "shareholder_register", "description": "Shareholder register", "mandatory": True},
        {"type": "trust_deed", "description": "Trust deed or constitutive documents", "mandatory": True},
    ],
    "manual": [
        {"type": "source_of_funds", "description": "Source of Funds documentation", "mandatory": True},
    ],
}


class EDDService:
    """Service managing Enhanced Due Diligence workflows."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def initiate_edd(
        self,
        client_id: int,
        trigger_reason: str,
        triggered_by_user_id: int = None,
        initial_risk_score: float = None,
    ) -> EDDWorkflow:
        """
        Initiate an EDD workflow for a client.
        Attaches the appropriate questionnaire and evidence checklist.
        """
        tenant_id = get_tenant_id()

        # Check if an active EDD already exists
        existing = (
            self.db.query(EDDWorkflow)
            .filter(
                EDDWorkflow.client_id == client_id,
                EDDWorkflow.status.notin_(["approved", "rejected", "closed"]),
            )
            .first()
        )
        if existing:
            self.logger.info(f"EDD already active for client {client_id}: {existing.id}")
            return existing

        # Build evidence requirements for this trigger
        evidence_reqs = EDD_EVIDENCE_REQUIREMENTS.get(
            trigger_reason, EDD_EVIDENCE_REQUIREMENTS["manual"]
        )

        edd = EDDWorkflow(
            client_id=client_id,
            tenant_id=tenant_id,
            trigger_reason=trigger_reason,
            triggered_by_user_id=triggered_by_user_id,
            status="initiated",
            questionnaire_data={"questions": EDD_QUESTIONNAIRE_TEMPLATE, "answers": {}},
            required_evidence=evidence_reqs,
            initial_risk_score=initial_risk_score,
            due_date=datetime.now(timezone.utc) + timedelta(days=14),  # 14-day SLA default
        )

        try:
            self.db.add(edd)
            self.db.commit()
            self.db.refresh(edd)
            self.logger.info(
                f"EDD workflow {edd.id} initiated for client {client_id}, trigger={trigger_reason}"
            )
            return edd
        except Exception as e:
            self.db.rollback()
            raise DatabaseError("Failed to initiate EDD workflow") from e

    def submit_questionnaire(
        self, edd_id: int, answers: Dict[str, Any]
    ) -> EDDWorkflow:
        """Submit questionnaire answers and advance status."""
        edd = self._get_edd(edd_id)

        if edd.status not in ("initiated", "questionnaire_sent"):
            raise InvalidStateError(f"Cannot submit questionnaire at status: {edd.status}")

        data = edd.questionnaire_data or {}
        data["answers"] = answers
        edd.questionnaire_data = data
        edd.questionnaire_submitted_at = datetime.now(timezone.utc)
        edd.status = "under_review"

        self.db.commit()
        self.db.refresh(edd)
        self.logger.info(f"Questionnaire submitted for EDD {edd_id}")
        return edd

    def assign_for_mlro_review(
        self, edd_id: int, assignee_user_id: int
    ) -> EDDWorkflow:
        """Assign an EDD workflow to an MLRO for review."""
        edd = self._get_edd(edd_id)

        if edd.status not in ("under_review", "escalated"):
            raise InvalidStateError(f"Cannot assign at status: {edd.status}")

        edd.assigned_to_user_id = assignee_user_id
        edd.status = "mlro_review"
        self.db.commit()
        self.db.refresh(edd)
        return edd

    def record_mlro_decision(
        self,
        edd_id: int,
        decision: str,
        reviewer_id: int,
        notes: str = None,
    ) -> EDDWorkflow:
        """
        Record MLRO decision: approve|reject|escalate.
        """
        if decision not in ("approve", "reject", "escalate"):
            raise InvalidStateError(f"Invalid MLRO decision: {decision!r}")

        edd = self._get_edd(edd_id)

        edd.mlro_decision = decision
        edd.mlro_notes = notes
        edd.mlro_decided_at = datetime.now(timezone.utc)

        if decision == "approve":
            edd.status = "approved"
            edd.outcome = "approved"
            edd.closed_at = datetime.now(timezone.utc)
        elif decision == "reject":
            edd.status = "rejected"
            edd.outcome = "rejected"
            edd.closed_at = datetime.now(timezone.utc)
        elif decision == "escalate":
            edd.status = "escalated"

        self.db.commit()
        self.db.refresh(edd)
        self.logger.info(f"MLRO decision={decision} recorded for EDD {edd_id}")
        return edd

    def get_active_edd_for_client(self, client_id: int) -> Optional[EDDWorkflow]:
        """Return the active EDD workflow for a client, if any."""
        return (
            self.db.query(EDDWorkflow)
            .filter(
                EDDWorkflow.client_id == client_id,
                EDDWorkflow.status.notin_(["approved", "rejected", "closed"]),
            )
            .first()
        )

    def list_edd_by_status(self, status: str) -> List[EDDWorkflow]:
        """Return all EDD workflows at a given status."""
        return (
            self.db.query(EDDWorkflow)
            .filter(EDDWorkflow.status == status)
            .order_by(EDDWorkflow.due_date.asc())
            .all()
        )

    def _get_edd(self, edd_id: int) -> EDDWorkflow:
        edd = self.db.query(EDDWorkflow).filter(EDDWorkflow.id == edd_id).first()
        if not edd:
            raise ResourceNotFoundError("EDDWorkflow", edd_id)
        return edd
