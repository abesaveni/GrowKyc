"""
routers/sar.py
==============
SAR (Suspicious Activity Report) endpoints.
Access restricted to Compliance_Officer, MLRO, Admin.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.exceptions import DatabaseError, InvalidStateError, ResourceNotFoundError
from database import get_db
from dependencies import get_current_user, require_role
from models import User
from services.sar_service import SARService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sars", tags=["sar"])

_COMPLIANCE_ROLES = ["Admin", "Compliance_Officer", "MLRO"]


class SARCreate(BaseModel):
    client_id: int
    kyc_id: Optional[int] = None
    case_id: Optional[int] = None
    reason_for_suspicion: str
    transaction_details: Optional[str] = None
    narrative: Optional[str] = None


class SARReview(BaseModel):
    sar_id: int


class SARFile(BaseModel):
    sar_id: int
    regulator_reference: Optional[str] = None


class SARDecline(BaseModel):
    sar_id: int
    reason: str


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sar(
    data: SARCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(_COMPLIANCE_ROLES)),
):
    """Raise a new Suspicious Activity Report (SAR) for a client."""
    try:
        service = SARService(db)
        sar = service.create_sar(
            client_id=data.client_id,
            raised_by=current_user.id,
            reason_for_suspicion=data.reason_for_suspicion,
            kyc_id=data.kyc_id,
            case_id=data.case_id,
            tenant_id=getattr(current_user, "tenant_id", None),
            transaction_details=data.transaction_details,
            narrative=data.narrative,
        )
        try:
            from core.enums import NotificationType
            from services.notification_service import NotificationService
            NotificationService(db).create_notification(
                user_id=current_user.id, title="SAR raised",
                message=f"SAR #{sar.id} raised for client {data.client_id}.",
                notif_type=NotificationType.SYSTEM_ALERT,
            )
        except Exception:  # noqa: BLE001
            pass
        return {"id": sar.id, "status": sar.status, "raised_at": sar.raised_at}
    except DatabaseError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/{sar_id}/submit-review", status_code=status.HTTP_200_OK)
async def submit_for_review(
    sar_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(_COMPLIANCE_ROLES)),
):
    """Submit a draft SAR for MLRO review."""
    try:
        service = SARService(db)
        sar = service.submit_for_review(sar_id=sar_id, reviewer_id=current_user.id)
        return {"id": sar.id, "status": sar.status}
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidStateError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.post("/{sar_id}/file", status_code=status.HTTP_200_OK)
async def file_sar(
    sar_id: int,
    regulator_reference: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin", "MLRO"])),
):
    """File a SAR with the regulator (AUSTRAC/FinCEN)."""
    try:
        service = SARService(db)
        sar = service.file_sar(
            sar_id=sar_id,
            filed_by=current_user.id,
            regulator_reference=regulator_reference,
        )
        return {"id": sar.id, "status": sar.status, "filed_at": sar.filed_at, "regulator_reference": sar.regulator_reference}
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidStateError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.post("/{sar_id}/decline", status_code=status.HTTP_200_OK)
async def decline_sar(
    sar_id: int,
    data: SARDecline,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin", "MLRO"])),
):
    """Decline a SAR — document the decision not to file."""
    try:
        service = SARService(db)
        sar = service.decline_sar(
            sar_id=sar_id,
            declined_by=current_user.id,
            reason=data.reason,
        )
        return {"id": sar.id, "status": sar.status}
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidStateError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("")
async def list_sars(
    client_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(_COMPLIANCE_ROLES)),
):
    """List SARs, optionally filtered by client or status."""
    service = SARService(db)
    records, total = service.list_sars(client_id=client_id, status=status, skip=skip, limit=limit)
    return {
        "total": total,
        "items": [
            {
                "id": s.id,
                "client_id": s.client_id,
                "case_id": s.case_id,
                "status": s.status,
                "raised_at": s.raised_at,
                "filed_at": s.filed_at,
                "regulator_reference": s.regulator_reference,
            }
            for s in records
        ],
    }


@router.get("/{sar_id}")
async def get_sar(
    sar_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(_COMPLIANCE_ROLES)),
):
    """Retrieve a single SAR by ID."""
    try:
        service = SARService(db)
        sar = service.get_sar(sar_id)
        return {
            "id": sar.id,
            "client_id": sar.client_id,
            "kyc_id": sar.kyc_id,
            "status": sar.status,
            "reason_for_suspicion": sar.reason_for_suspicion,
            "transaction_details": sar.transaction_details,
            "narrative": sar.narrative,
            "raised_by": sar.raised_by,
            "reviewed_by": sar.reviewed_by,
            "filed_by": sar.filed_by,
            "regulator_reference": sar.regulator_reference,
            "raised_at": sar.raised_at,
            "reviewed_at": sar.reviewed_at,
            "filed_at": sar.filed_at,
            "declined_at": sar.declined_at,
            "decline_reason": sar.decline_reason,
        }
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
