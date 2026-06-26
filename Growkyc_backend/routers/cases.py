"""
routers/cases.py
================
Enterprise AML Case Management API endpoints.
Provides operational queues, assignment, and escalation workflows.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_admin_or_agent_user, get_admin_user
from models import User
from services.case_workflow_service import CaseWorkflowService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cases", tags=["cases"])


class CaseCreateRequest(BaseModel):
    client_id: int
    title: str
    description: str
    priority: str = "medium"
    queue_name: str = "triage"


class CaseAssignRequest(BaseModel):
    assignee_id: int


class CaseEscalateRequest(BaseModel):
    reason: str


class CaseCommentRequest(BaseModel):
    content: str


class CaseEvidenceRequest(BaseModel):
    evidence_type: str
    ref_id: int
    description: str


class CaseCloseRequest(BaseModel):
    resolution: str


class CaseStatusUpdate(BaseModel):
    status: str


@router.get("")
async def list_cases(
    skip: int = 0,
    limit: int = 50,
    case_status: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """List all enterprise cases with optional status filter."""
    from models import Case
    query = db.query(Case)
    if case_status:
        query = query.filter(Case.status == case_status)
    total = query.count()
    cases = query.order_by(Case.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "total": total,
        "items": [
            {
                "case_id": c.id,
                "client_id": c.client_id,
                "title": c.title,
                "status": c.status.value,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in cases
        ],
    }


@router.patch("/{case_id}/status")
async def update_case_status(
    case_id: int,
    body: CaseStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Update the status of an enterprise case."""
    from models import Case
    from core.enums import CaseStatus
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    try:
        case.status = CaseStatus(body.status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {body.status}")
    db.commit()
    return {"case_id": case_id, "status": case.status.value}


@router.delete("/{case_id}")
async def delete_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    """Permanently delete an enterprise case (Admin only)."""
    from models import Case
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    db.delete(case)
    db.commit()
    return {"message": f"Case {case_id} deleted"}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_enterprise_case(
    body: CaseCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Create a new enterprise investigation case."""
    try:
        service = CaseWorkflowService(db)
        case = service.create_enterprise_case(
            client_id=body.client_id,
            title=body.title,
            description=body.description,
            priority=body.priority,
            queue_name=body.queue_name,
            creator_id=current_user.id,
        )
        return {"case_id": case.id, "status": case.status.value, "title": case.title}
    except Exception as e:
        logger.error(f"Failed to create case: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/queue/{queue_name}")
async def get_cases_by_queue(
    queue_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Retrieve all open cases currently in a specific operational queue."""
    service = CaseWorkflowService(db)
    cases = service.get_cases_by_queue(queue_name)
    return [
        {
            "case_id": c.id,
            "client_id": c.client_id,
            "title": c.title,
            "status": c.status.value,
        }
        for c in cases
    ]


@router.post("/{case_id}/assign")
async def assign_case(
    case_id: int,
    body: CaseAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Assign a case to an analyst or MLRO."""
    try:
        service = CaseWorkflowService(db)
        assignment = service.assign_case(
            case_id=case_id,
            assignee_id=body.assignee_id,
            actor_id=current_user.id,
        )
        return {
            "case_id": case_id,
            "assigned_to": assignment.assigned_to_id,
            "queue": assignment.queue_name,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{case_id}/escalate")
async def escalate_case(
    case_id: int,
    body: CaseEscalateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Escalate a case to the MLRO review queue."""
    try:
        service = CaseWorkflowService(db)
        assignment = service.escalate_case(
            case_id=case_id,
            reason=body.reason,
            actor_id=current_user.id,
        )
        return {"case_id": case_id, "queue": assignment.queue_name}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{case_id}/evidence")
async def link_evidence(
    case_id: int,
    body: CaseEvidenceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Link an external document, report, or screening to this case."""
    try:
        service = CaseWorkflowService(db)
        evidence = service.link_evidence(
            case_id=case_id,
            evidence_type=body.evidence_type,
            ref_id=body.ref_id,
            desc=body.description,
            actor_id=current_user.id,
        )
        return {"case_id": case_id, "evidence_id": evidence.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{case_id}/comments")
async def add_comment(
    case_id: int,
    body: CaseCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Add an analyst note to the case."""
    try:
        service = CaseWorkflowService(db)
        comment = service.add_comment(
            case_id=case_id, content=body.content, actor_id=current_user.id
        )
        return {"case_id": case_id, "comment_id": comment.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{case_id}/close")
async def close_case(
    case_id: int,
    body: CaseCloseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Close the case and generate an immutable regulatory snapshot."""
    try:
        service = CaseWorkflowService(db)
        case = service.close_with_snapshot(
            case_id=case_id,
            resolution=body.resolution,
            actor_id=current_user.id,
        )
        return {"case_id": case.id, "status": case.status.value}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
