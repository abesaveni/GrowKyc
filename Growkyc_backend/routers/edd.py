"""
routers/edd.py
==============
EDD Workflow API endpoints.
"""

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_admin_or_agent_user, get_current_user
from models import User
from services.edd_service import EDDService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/edd", tags=["edd"])


class EDDInitiateRequest(BaseModel):
    client_id: int
    trigger_reason: str
    initial_risk_score: Optional[float] = None


class EDDQuestionnaireRequest(BaseModel):
    answers: Dict[str, Any]


class EDDMLRODecisionRequest(BaseModel):
    decision: str  # approve | reject | escalate
    notes: Optional[str] = None


class EDDAssignRequest(BaseModel):
    assignee_user_id: int


@router.post("/initiate", status_code=201)
async def initiate_edd(
    body: EDDInitiateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Initiate an EDD workflow for a high-risk client."""
    service = EDDService(db)
    edd = service.initiate_edd(
        client_id=body.client_id,
        trigger_reason=body.trigger_reason,
        triggered_by_user_id=current_user.id,
        initial_risk_score=body.initial_risk_score,
    )
    return {
        "edd_id": edd.id,
        "status": edd.status,
        "trigger_reason": edd.trigger_reason,
        "due_date": edd.due_date,
        "questionnaire": edd.questionnaire_data,
        "required_evidence": edd.required_evidence,
    }


@router.post("/{edd_id}/questionnaire")
async def submit_questionnaire(
    edd_id: int,
    body: EDDQuestionnaireRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit questionnaire answers for an EDD workflow."""
    try:
        service = EDDService(db)
        edd = service.submit_questionnaire(edd_id=edd_id, answers=body.answers)
        return {
            "edd_id": edd.id,
            "status": edd.status,
            "questionnaire_submitted_at": edd.questionnaire_submitted_at,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{edd_id}/assign")
async def assign_for_review(
    edd_id: int,
    body: EDDAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Assign an EDD workflow to an MLRO for review."""
    try:
        service = EDDService(db)
        edd = service.assign_for_mlro_review(
            edd_id=edd_id, assignee_user_id=body.assignee_user_id
        )
        return {
            "edd_id": edd.id,
            "status": edd.status,
            "assigned_to": edd.assigned_to_user_id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{edd_id}/mlro-decision")
async def record_mlro_decision(
    edd_id: int,
    body: EDDMLRODecisionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Record MLRO decision: approve | reject | escalate."""
    try:
        service = EDDService(db)
        edd = service.record_mlro_decision(
            edd_id=edd_id,
            decision=body.decision,
            reviewer_id=current_user.id,
            notes=body.notes,
        )
        return {
            "edd_id": edd.id,
            "status": edd.status,
            "outcome": edd.outcome,
            "mlro_decision": edd.mlro_decision,
            "closed_at": edd.closed_at,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/client/{client_id}")
async def get_active_edd(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the active EDD workflow for a client."""
    service = EDDService(db)
    edd = service.get_active_edd_for_client(client_id)
    if not edd:
        raise HTTPException(
            status_code=404, detail="No active EDD workflow found for this client"
        )
    return {
        "edd_id": edd.id,
        "status": edd.status,
        "trigger_reason": edd.trigger_reason,
        "due_date": edd.due_date,
        "mlro_decision": edd.mlro_decision,
        "evidence_complete": edd.evidence_complete,
    }


@router.get("/queue/{status}")
async def list_edd_queue(
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """List all EDD workflows at a given status (e.g., mlro_review, escalated)."""
    service = EDDService(db)
    workflows = service.list_edd_by_status(status)
    return [
        {
            "edd_id": e.id,
            "client_id": e.client_id,
            "status": e.status,
            "trigger_reason": e.trigger_reason,
            "due_date": e.due_date,
            "assigned_to": e.assigned_to_user_id,
        }
        for e in workflows
    ]
