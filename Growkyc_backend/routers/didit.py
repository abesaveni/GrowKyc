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
from dependencies import get_admin_or_agent_user, get_current_user
from models import Client, DiditSession, KYC, User
from services import email_service
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


class InviteRequest(BaseModel):
    client_id: int = Field(..., description="Client to invite for KYC")
    kind: str = Field(default="individual", description="'individual' (KYC) or 'business' (KYB)")
    email: Optional[str] = Field(default=None, description="Override the client's email")


class InviteResponse(BaseModel):
    session_id: str
    url: str
    status: str
    contact_email: Optional[str] = None
    email_sent: bool


def _client_email(client: "Client") -> Optional[str]:
    prof = getattr(client, "individual_profile", None)
    if prof and getattr(prof, "email", None):
        return prof.email
    ent = getattr(client, "entity_profile", None)
    if ent and getattr(ent, "contact_email", None):
        return ent.contact_email
    return None


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

    # Didit reuses a session for the same vendor_data, so it may return an id we
    # already have. Upsert rather than blindly insert (which hit a unique violation).
    record = (
        db.query(DiditSession)
        .filter(DiditSession.session_id == result["session_id"])
        .first()
    )
    if record:
        record.status = result.get("status", record.status)
        record.verification_url = result["url"]
        record.workflow_id = workflow_id
        if body.kyc_id:
            record.kyc_id = body.kyc_id
    else:
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


@router.post("/verifications/invite", response_model=InviteResponse, status_code=201)
@limiter.limit("20/minute")
async def invite_client_verification(
    request: Request,
    body: InviteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
) -> InviteResponse:
    """Onboard flow: create a Didit session FOR A CLIENT and email them the link.

    Staff trigger this when onboarding a client. We create a hosted Didit
    verification session tied to the client, store it, and send the client a
    welcome email containing their personal verification link.
    """
    client = db.query(Client).filter(Client.id == body.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    to_email = body.email or _client_email(client)
    if not to_email:
        raise HTTPException(
            status_code=400,
            detail="No email on file for this client. Provide an email to send the invite.",
        )

    try:
        service = DiditService()
    except DiditNotConfiguredError:
        raise HTTPException(status_code=503, detail="KYC verification (Didit) is not enabled.")

    workflow_id = DiditService.workflow_for(body.kind)
    if not workflow_id:
        raise HTTPException(status_code=400, detail=f"No Didit workflow for kind '{body.kind}'.")

    vendor_data = f"client:{client.id}"
    try:
        result = service.create_session(
            workflow_id=workflow_id,
            vendor_data=vendor_data,
            contact_details={"email": to_email},
        )
    except DiditError as e:
        logger.error("Didit invite session failed: %s", e)
        raise HTTPException(status_code=502, detail=str(e))

    if not result.get("session_id") or not result.get("url"):
        raise HTTPException(status_code=502, detail="Didit did not return a session id / url.")

    record = (
        db.query(DiditSession)
        .filter(DiditSession.session_id == result["session_id"])
        .first()
    )
    if record:
        record.status = result.get("status", record.status)
        record.verification_url = result["url"]
        record.workflow_id = workflow_id
        record.client_id = client.id
        record.contact_email = to_email
    else:
        record = DiditSession(
            tenant_id=current_user.tenant_id,
            session_id=result["session_id"],
            workflow_id=workflow_id,
            kind=body.kind,
            vendor_data=vendor_data,
            client_id=client.id,
            contact_email=to_email,
            status=result.get("status", "Not Started"),
            verification_url=result["url"],
            created_by=current_user.id,
        )
        db.add(record)
    db.commit()

    # Send the welcome / invitation email (best-effort).
    subject, html, text = email_service.kyc_invite_email(client.name, result["url"])
    email_sent = email_service.send_email(to_email, subject, html, text)

    return InviteResponse(
        session_id=result["session_id"],
        url=result["url"],
        status=record.status,
        contact_email=to_email,
        email_sent=email_sent,
    )


@router.get("/verifications")
async def list_verifications(
    client_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """List Didit verification sessions (status + result) for the app."""
    skip = max(0, skip)
    limit = max(1, min(limit, 200))
    query = db.query(DiditSession)
    if client_id:
        query = query.filter(DiditSession.client_id == client_id)
    total = query.count()
    rows = query.order_by(DiditSession.id.desc()).offset(skip).limit(limit).all()
    return {
        "total": total,
        "items": [
            {
                "session_id": r.session_id,
                "client_id": r.client_id,
                "kind": r.kind,
                "status": r.status,
                "contact_email": r.contact_email,
                "verification_url": r.verification_url,
                "decision": r.decision,
                "created_at": r.created_at.isoformat() if getattr(r, "created_at", None) else None,
            }
            for r in rows
        ],
    }


@router.get("/verifications/{session_id}")
async def get_verification(
    session_id: str,
    refresh: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Return the stored status + decision for a verification session.

    With ?refresh=true we pull the latest decision from Didit (a poll-based
    fallback to the webhook) and persist it, including the KYC status mapping.
    """
    record = db.query(DiditSession).filter(DiditSession.session_id == session_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    if refresh:
        try:
            data = DiditService().get_decision(session_id)
            new_status = data.get("status")
            if new_status:
                record.status = new_status
            record.decision = data
            mapped = _DIDIT_TO_KYC.get(new_status)
            if record.kyc_id and mapped is not None:
                kyc = db.query(KYC).filter(KYC.id == record.kyc_id).first()
                if kyc:
                    kyc.status = mapped
            db.commit()
        except (DiditNotConfiguredError, DiditError) as e:
            logger.warning("Didit refresh failed for %s: %s", session_id, e)

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

        # Propagate terminal outcomes to the linked Client (invite flow).
        if record.client_id and new_status in ("Approved", "Declined"):
            from datetime import datetime, timezone
            client = db.query(Client).filter(Client.id == record.client_id).first()
            if client:
                if new_status == "Approved":
                    client.is_locked = False
                    client.approved_at = datetime.now(timezone.utc)
                else:
                    client.is_locked = True
                logger.info("Didit %s -> Client %s %s", session_id, record.client_id, new_status)

        db.commit()
    finally:
        clear_tenant_id()

    return {"status": "ok"}
