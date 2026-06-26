"""
routers/didit.py
================
Didit KYC/KYB verification endpoints.

Flow:
  1. POST /verifications/start  -> we create a Didit session and return the
     hosted verification URL; the frontend redirects the user there.
  2. The user completes verification on Didit's hosted page / SDK.
  3. Didit POSTs a signed event to POST /webhooks/didit; we verify the HMAC
     signature, update the session + linked KYC record, and return 200 fast.
  4. GET /verifications/{session_id} -> current status / decision.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.enums import KYCStatus
from core.limiter import limiter
from core.tenant_context import clear_tenant_id, set_tenant_id
from database import get_db
from dependencies import get_current_user
from models import DiditSession, KYC, User
from services.providers.didit import (DiditError, DiditNotConfiguredError,
                                      DiditService)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["didit"])


# Map Didit terminal statuses to our KYC lifecycle. Non-terminal/intermediate
# statuses (In Progress, In Review, Abandoned, Expired) do not force a KYC state.
_DIDIT_TO_KYC = {
    "Approved": KYCStatus.APPROVED,
    "Declined": KYCStatus.REJECTED,
}


class StartVerificationRequest(BaseModel):
    kind: str = Field(default="individual", description="'individual' (KYC) or 'business' (KYB)")
    kyc_id: Optional[int] = Field(default=None, description="KYC record to link this verification to")
    callback_url: Optional[str] = Field(default=None, description="Where Didit redirects the user when done")


class StartVerificationResponse(BaseModel):
    session_id: str
    url: str
    status: str


@router.post(
    "/verifications/start",
    response_model=StartVerificationResponse,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("20/minute")
async def start_verification(
    request: Request,
    body: StartVerificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StartVerificationResponse:
    """Create a Didit verification session and return the hosted URL."""
    try:
        service = DiditService()
    except DiditNotConfiguredError as e:
        logger.warning("Didit not configured: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="KYC verification (Didit) is not enabled in this deployment.",
        )

    workflow_id = DiditService.workflow_for(body.kind)
    if not workflow_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No Didit workflow configured for kind '{body.kind}'.",
        )

    vendor_data = f"kyc:{body.kyc_id}" if body.kyc_id else f"user:{current_user.id}"
    contact = {"email": current_user.email} if getattr(current_user, "email", None) else None

    try:
        result = service.create_session(
            workflow_id=workflow_id,
            vendor_data=vendor_data,
            callback_url=body.callback_url,
            contact_details=contact,
        )
    except DiditError as e:
        logger.error("Didit session creation failed: %s", e)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

    if not result.get("session_id") or not result.get("url"):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Didit did not return a session id / url.",
        )

    record = DiditSession(
        tenant_id=current_user.tenant_id,
        session_id=result["session_id"],
        workflow_id=workflow_id,
        kind=body.kind,
        vendor_data=vendor_data,
        kyc_id=body.kyc_id,
        status=result.get("status", "Not Started"),
        verification_url=result["url"],
        created_by=current_user.id,
    )
    db.add(record)
    db.commit()

    return StartVerificationResponse(
        session_id=result["session_id"], url=result["url"], status=record.status
    )


@router.get("/verifications/{session_id}")
async def get_verification(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Return the stored status + decision for a verification session."""
    record = db.query(DiditSession).filter(DiditSession.session_id == session_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return {
        "session_id": record.session_id,
        "kind": record.kind,
        "status": record.status,
        "kyc_id": record.kyc_id,
        "decision": record.decision,
        "verification_url": record.verification_url,
    }


@router.post("/webhooks/didit", include_in_schema=True)
async def didit_webhook(request: Request, db: Session = Depends(get_db)) -> dict:
    """Receive and process a signed Didit webhook.

    Public endpoint (no JWT) — authenticated instead by HMAC signature. Verifies
    the signature + timestamp, is idempotent on event_id, updates the session and
    any linked KYC record, and returns 200 quickly.
    """
    raw = await request.body()
    signature = request.headers.get("x-signature")
    timestamp = request.headers.get("x-timestamp")

    try:
        service = DiditService()
    except DiditNotConfiguredError:
        # Integration disabled — nothing legitimately sends us webhooks.
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Didit disabled")

    if not service.verify_webhook(raw, signature, timestamp):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook signature")

    import json

    try:
        payload = json.loads(raw.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON")

    session_id = payload.get("session_id")
    new_status = payload.get("status")
    event_id = payload.get("event_id")
    decision = payload.get("decision")
    if not session_id:
        return {"status": "ignored", "reason": "no session_id"}

    # Webhook is unauthenticated => no tenant context. Look the session up across
    # all tenants, then pin the tenant context for any downstream KYC update.
    record = (
        db.query(DiditSession)
        .execution_options(include_all_tenants=True)
        .filter(DiditSession.session_id == session_id)
        .first()
    )
    if not record:
        logger.warning("Didit webhook for unknown session_id=%s", session_id)
        return {"status": "ignored", "reason": "unknown session"}

    # Idempotency: ignore duplicate deliveries of the same event.
    if event_id and record.last_event_id == event_id:
        return {"status": "ok", "deduped": True}

    try:
        set_tenant_id(record.tenant_id)

        record.status = new_status or record.status
        if decision is not None:
            record.decision = decision
        if event_id:
            record.last_event_id = event_id

        # Propagate terminal outcomes to the linked KYC record.
        mapped = _DIDIT_TO_KYC.get(new_status)
        if record.kyc_id and mapped is not None:
            kyc = db.query(KYC).filter(KYC.id == record.kyc_id).first()
            if kyc:
                kyc.status = mapped
                logger.info(
                    "Didit %s -> KYC %s set to %s", session_id, record.kyc_id, mapped.value
                )

        db.commit()
    finally:
        clear_tenant_id()

    return {"status": "ok"}
