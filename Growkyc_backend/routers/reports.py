"""
routers/reports.py
==================
Enterprise Regulatory Reporting and Evidence Pack APIs.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_admin_or_agent_user
from models import User
from services.evidence_pack_service import EvidencePackService
from services.regulatory_service import RegulatoryService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["reporting"])


class GenerateReportRequest(BaseModel):
    client_id: int
    report_type: str
    case_id: Optional[int] = None


class GeneratePackRequest(BaseModel):
    case_id: int
    report_id: Optional[int] = None


@router.post("/reports/generate", status_code=status.HTTP_201_CREATED)
async def generate_regulatory_report(
    body: GenerateReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Generate an immutable structured payload for a regulatory report."""
    try:
        service = RegulatoryService(db)
        report = service.generate_report(
            client_id=body.client_id,
            report_type=body.report_type,
            case_id=body.case_id,
            generator_id=current_user.id,
        )
        return {
            "report_id": report.id,
            "status": report.submission_status,
            "hash": report.immutable_hash,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/reports/{report_id}/submit")
async def submit_regulatory_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Queue an approved report for async transmission to a regulator."""
    try:
        service = RegulatoryService(db)
        submission = service.submit_report(
            report_id=report_id, submitter_id=current_user.id
        )
        return {
            "submission_id": submission.id,
            "status": submission.status,
            "correlation_id": submission.correlation_id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reports/{report_id}")
async def get_report_status(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Get the submission status and payload hash for a report."""
    from models import RegulatoryReport

    report = db.query(RegulatoryReport).filter(RegulatoryReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return {
        "report_id": report.id,
        "type": report.report_type,
        "status": report.submission_status,
        "reference": report.regulator_reference,
        "hash": report.immutable_hash,
    }


@router.post("/evidence-packs/generate", status_code=status.HTTP_201_CREATED)
async def generate_evidence_pack(
    body: GeneratePackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Trigger async generation of a deterministic evidence zip bundle."""
    try:
        service = EvidencePackService(db)
        pack = service.trigger_pack_generation(
            case_id=body.case_id,
            report_id=body.report_id,
            generator_id=current_user.id,
        )
        return {
            "pack_id": pack.id,
            "status": pack.status,
            "correlation_id": pack.correlation_id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/evidence-packs/{pack_id}")
async def get_evidence_pack_url(
    pack_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Retrieve a signed, temporary download URL for an evidence pack."""
    try:
        service = EvidencePackService(db)
        url = service.get_download_url(pack_id=pack_id, requester_id=current_user.id)
        return {"pack_id": pack_id, "download_url": url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
