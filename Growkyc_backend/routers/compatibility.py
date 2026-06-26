"""
Compatibility API routes for frontend and user-story endpoint parity.

These handlers intentionally sit beside the existing domain routers. They keep
legacy and prototype frontend paths alive while the richer service-backed
routers continue to own canonical business workflows.
"""

from datetime import datetime
from typing import Any, Dict, Optional
from uuid import uuid4

from fastapi import APIRouter, Body, Depends, File, Form, Response, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import User
from schemas import PasswordChangeRequest, TokenResponse, UserResponse
from services.auth_service import ACCESS_TOKEN_EXPIRE_MINUTES, AuthService

router = APIRouter(tags=["compatibility"])


def now_iso() -> str:
    return datetime.utcnow().isoformat()


def accepted(endpoint: str, **extra: Any) -> Dict[str, Any]:
    payload = {
        "success": True,
        "endpoint": endpoint,
        "compatibility": True,
        "timestamp": now_iso(),
    }
    payload.update(extra)
    return payload


class GenericPayload(BaseModel):
    data: Optional[Dict[str, Any]] = None


# Static document aliases must be registered before /documents/{document_id}.
@router.get("/documents/expiring")
async def compat_expiring_documents(withinDays: int = 30, days: Optional[int] = None):
    window = days or withinDays
    return {
        "documents": [],
        "withinDays": window,
        "total": 0,
        "compatibility": True,
    }


@router.post("/uploads", status_code=status.HTTP_201_CREATED)
async def compat_uploads(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/uploads",
        uploadId=f"upload-{uuid4().hex[:8]}",
        status="received",
        payload=payload,
    )


@router.get("/submissions")
async def compat_list_submissions():
    return {"submissions": [], "total": 0, "compatibility": True}


@router.post("/submissions/{submission_id}/retry")
async def compat_retry_submission(submission_id: str):
    return accepted(
        f"/submissions/{submission_id}/retry",
        submissionId=submission_id,
        status="retry_queued",
    )


@router.get("/reporting-rules")
async def compat_reporting_rules():
    return {
        "rules": [
            {"id": "smr-threshold", "name": "Suspicious Matter Review", "enabled": True}
        ],
        "compatibility": True,
    }


@router.get("/audit-pack/{case_id}")
async def compat_audit_pack(case_id: str):
    return {
        "caseId": case_id,
        "packId": f"audit-pack-{case_id}",
        "status": "ready",
        "items": [],
        "compatibility": True,
    }


# Case workbench compatibility routes.
@router.get("/cases/search")
async def compat_case_search(q: str = ""):
    return {"query": q, "results": [], "total": 0, "compatibility": True}


@router.get("/cases/{case_id}")
async def compat_get_case(case_id: str, organizationId: Optional[str] = None):
    return {
        "caseId": case_id,
        "organizationId": organizationId,
        "status": "open",
        "compatibility": True,
    }


@router.post("/cases/{case_id}")
async def compat_update_case(
    case_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(f"/cases/{case_id}", caseId=case_id, payload=payload)


@router.get("/cases/{case_id}/status")
async def compat_case_status(case_id: str):
    return {"caseId": case_id, "status": "open", "compatibility": True}


@router.get("/cases/{case_id}/audit-events")
async def compat_case_audit_events(case_id: str):
    return {"caseId": case_id, "events": [], "compatibility": True}


@router.get("/cases/{case_id}/notes")
async def compat_case_notes(case_id: str):
    return {"caseId": case_id, "notes": [], "compatibility": True}


@router.post("/cases/{case_id}/notes", status_code=status.HTTP_201_CREATED)
async def compat_create_case_note(
    case_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/cases/{case_id}/notes",
        caseId=case_id,
        noteId=f"note-{uuid4().hex[:8]}",
        payload=payload,
    )


@router.patch("/cases/{case_id}/notes/{note_id}")
async def compat_update_case_note(
    case_id: str, note_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/cases/{case_id}/notes/{note_id}",
        caseId=case_id,
        noteId=note_id,
        payload=payload,
    )


@router.delete(
    "/cases/{case_id}/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def compat_delete_case_note(case_id: str, note_id: str):
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/cases/{case_id}/approvals")
async def compat_case_approvals(case_id: str):
    return {"caseId": case_id, "approvals": [], "compatibility": True}


@router.get("/cases/{case_id}/escalations")
async def compat_case_escalations(case_id: str):
    return {"caseId": case_id, "escalations": [], "compatibility": True}


@router.get("/cases/{case_id}/documents")
async def compat_case_documents(case_id: str):
    return {"caseId": case_id, "documents": [], "compatibility": True}


@router.post("/cases/{case_id}/referrals", status_code=status.HTTP_201_CREATED)
async def compat_case_referral(
    case_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/cases/{case_id}/referrals",
        caseId=case_id,
        referralId=f"ref-{uuid4().hex[:8]}",
        payload=payload,
    )


@router.post("/cases/{case_id}/legal-hold")
async def compat_case_legal_hold(
    case_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(f"/cases/{case_id}/legal-hold", caseId=case_id, payload=payload)


@router.post("/cases/status-history", status_code=status.HTTP_201_CREATED)
async def compat_case_status_history(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/cases/status-history", historyId=f"hist-{uuid4().hex[:8]}", payload=payload
    )


# Review workflow aliases.
@router.get("/reviews")
async def compat_list_reviews(status: Optional[str] = None):
    return {"reviews": [], "status": status, "total": 0, "compatibility": True}


@router.get("/reviews/{review_id}")
async def compat_get_review(review_id: str):
    return {
        "reviewId": review_id,
        "status": "submitted_for_review",
        "compatibility": True,
    }


@router.post("/reviews/{review_id}/transition")
async def compat_transition_review(
    review_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/reviews/{review_id}/transition", reviewId=review_id, payload=payload
    )


@router.post("/reviews/{review_id}/decision")
async def compat_review_decision(
    review_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/reviews/{review_id}/decision", reviewId=review_id, payload=payload
    )


# Decisions tab user-story routes.
@router.get("/decisions")
async def compat_list_decisions():
    return {"decisions": [], "total": 0, "compatibility": True}


@router.get("/decisions/{decision_id}/workflow")
async def compat_decision_workflow(decision_id: str):
    return {"decisionId": decision_id, "timeline": [], "compatibility": True}


@router.get("/decisions/{decision_id}/sod-status")
async def compat_decision_sod_status(decision_id: str):
    return {"decisionId": decision_id, "compliant": True, "compatibility": True}


@router.post("/decisions/{decision_id}/approve")
async def compat_approve_decision(
    decision_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/decisions/{decision_id}/approve", decisionId=decision_id, payload=payload
    )


@router.post("/decisions/{decision_id}/reject")
async def compat_reject_decision(
    decision_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/decisions/{decision_id}/reject", decisionId=decision_id, payload=payload
    )


@router.post("/decisions/{decision_id}/comments", status_code=status.HTTP_201_CREATED)
async def compat_decision_comment(
    decision_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/decisions/{decision_id}/comments",
        decisionId=decision_id,
        commentId=f"comment-{uuid4().hex[:8]}",
        payload=payload,
    )


# Audit tab, audit exports, and audit-event aliases.
@router.get("/audit-logs")
async def compat_audit_logs():
    return {"logs": [], "total": 0, "compatibility": True}


@router.get("/audit-logs/search")
async def compat_search_audit_logs(q: str = ""):
    return {"query": q, "logs": [], "total": 0, "compatibility": True}


@router.get("/audit-logs/filters")
async def compat_audit_log_filters():
    return {"filters": [], "compatibility": True}


@router.post("/audit-logs/filters", status_code=status.HTTP_201_CREATED)
async def compat_save_audit_log_filter(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/audit-logs/filters", filterId=f"filter-{uuid4().hex[:8]}", payload=payload
    )


@router.get("/audit-logs/analytics")
async def compat_audit_log_analytics():
    return {"metrics": {"total": 0, "critical": 0}, "compatibility": True}


@router.post("/audit-logs/export", status_code=status.HTTP_202_ACCEPTED)
async def compat_audit_log_export(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/audit-logs/export",
        exportId=f"export-{uuid4().hex[:8]}",
        status="ready",
        payload=payload,
    )


@router.post("/audit-logs/schedule-report", status_code=status.HTTP_202_ACCEPTED)
async def compat_schedule_audit_report(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/audit-logs/schedule-report",
        scheduleId=f"sched-{uuid4().hex[:8]}",
        payload=payload,
    )


@router.get("/audit-logs/{log_id}")
async def compat_audit_log_detail(log_id: str):
    return {"id": log_id, "event": "compatibility.audit", "compatibility": True}


@router.get("/audit-events")
async def compat_audit_events():
    return {"events": [], "total": 0, "compatibility": True}


@router.post("/audit-events")
async def compat_create_audit_event(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted("/audit-events", eventId=f"evt-{uuid4().hex[:8]}", payload=payload)


@router.post("/audit-events/query")
async def compat_query_audit_events(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return {"events": [], "total": 0, "filter": payload, "compatibility": True}


@router.get("/audit-events/export")
async def compat_export_audit_events():
    return {
        "exportId": f"export-{uuid4().hex[:8]}",
        "status": "ready",
        "compatibility": True,
    }


@router.post("/audit-exports", status_code=status.HTTP_202_ACCEPTED)
async def compat_create_audit_export(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/audit-exports",
        exportId=f"export-{uuid4().hex[:8]}",
        status="ready",
        payload=payload,
    )


@router.get("/audit-exports/{export_id}")
async def compat_get_audit_export(export_id: str):
    return {
        "exportId": export_id,
        "status": "ready",
        "downloadUrl": f"/audit-exports/{export_id}/download",
    }


@router.get("/audit-exports/{export_id}/download")
async def compat_download_audit_export(export_id: str):
    return {"exportId": export_id, "content": "", "contentType": "application/json"}


@router.get("/audit-exports/{export_id}/verify")
async def compat_verify_audit_export(export_id: str):
    return {"exportId": export_id, "valid": True, "checks": [], "compatibility": True}


@router.get("/keys/{signing_key_id}/public")
async def compat_public_key(signing_key_id: str):
    return {
        "signingKeyId": signing_key_id,
        "alg": "RS256",
        "publicKeyPem": (
            "-----BEGIN PUBLIC KEY-----\ncompatibility\n-----END PUBLIC KEY-----"
        ),
    }


# API platform, checks, and workflow demo endpoints.
@router.post("/screening/sanctions")
async def compat_screening_sanctions(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted("/screening/sanctions", matches=[], payload=payload)


@router.get("/screening/sanctions")
async def compat_screening_sanctions_get():
    return {"matches": [], "compatibility": True}


@router.get("/entity/abn-lookup")
async def compat_abn_lookup(abn: Optional[str] = None):
    return {"abn": abn, "entity": None, "compatibility": True}


@router.get("/entity/company-search")
async def compat_company_search(q: Optional[str] = None):
    return {"query": q, "results": [], "compatibility": True}


@router.post("/entity/abn-lookup")
async def compat_abn_lookup_post(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted("/entity/abn-lookup", entity=None, payload=payload)


@router.post("/clients/create", status_code=status.HTTP_201_CREATED)
async def compat_clients_create(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/clients/create", clientId=f"client-{uuid4().hex[:8]}", payload=payload
    )


@router.get("/clients/{client_id}/risk-score")
async def compat_client_risk_score(client_id: str):
    return {
        "clientId": client_id,
        "riskScore": 0,
        "riskLevel": "low",
        "compatibility": True,
    }


@router.get("/compliance/reports")
async def compat_compliance_reports():
    return {"reports": [], "compatibility": True}


@router.get("/licensing/afsl-check")
async def compat_afsl_check(afsl: Optional[str] = None):
    return {"afsl": afsl, "valid": None, "compatibility": True}


# -------------------------
# File storage compatibility
# -------------------------


@router.get("/files/list")
async def compat_files_list(module: Optional[str] = None, folder: Optional[str] = None):
    return {"success": True, "files": [], "module": module, "folder": folder}


@router.post("/files/upload")
async def compat_files_upload(
    file: UploadFile = File(...),
    module: Optional[str] = Form(None),
    folder: Optional[str] = Form(None),
    metadata: Optional[str] = Form(None),
):
    return {
        "success": True,
        "file": {"filename": getattr(file, "filename", None)},
        "module": module,
        "folder": folder,
        "metadata": metadata,
    }


@router.get("/files/search")
async def compat_files_search(
    q: Optional[str] = None, module: Optional[str] = None, folder: Optional[str] = None
):
    """Compatibility search endpoint used by the frontend."""
    return {
        "success": True,
        "query": q,
        "files": [],
        "module": module,
        "folder": folder,
    }


@router.get("/files/download/{path}")
async def compat_files_download(path: str):
    return {"success": True, "downloadUrl": f"/download/{path}"}


@router.delete("/files/delete/{path}")
async def compat_files_delete(path: str):
    return {"success": True, "deleted": path}


@router.get("/deals/{deal_id}/allocations")
async def compat_get_deal_allocations(deal_id: str):
    """Return a compatibility-friendly allocation summary for a deal."""
    return {
        "dealId": deal_id,
        "allocations": [],
        "totalAllocated": 0,
        "remaining": 0,
        "compatibility": True,
    }


@router.post("/deals/{deal_id}/allocations", status_code=status.HTTP_201_CREATED)
async def compat_post_deal_allocation(
    deal_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    """Accept allocation requests and echo a created allocation id."""
    allocation_id = f"alloc-{uuid4().hex[:8]}"
    return accepted(
        f"/deals/{deal_id}/allocations",
        dealId=deal_id,
        allocationId=allocation_id,
        payload=payload,
    )


# Audit log shim used by frontend
@router.post("/audit/log")
async def compat_audit_log(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted("/audit/log", payload=payload)


@router.post("/checks/{check_type}")
async def compat_run_check(
    check_type: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/checks/{check_type}",
        checkType=check_type,
        result={"status": "clear"},
        payload=payload,
    )


@router.post("/workflows/{workflow_area}/{workflow_action}")
async def compat_run_workflow(
    workflow_area: str,
    workflow_action: str,
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        f"/workflows/{workflow_area}/{workflow_action}",
        workflowArea=workflow_area,
        workflowAction=workflow_action,
        payload=payload,
    )


@router.get("/monitoring/alerts")
async def compat_monitoring_alerts():
    return {"alerts": [], "compatibility": True}


@router.post("/monitoring/{action}")
async def compat_monitoring_action(
    action: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(f"/monitoring/{action}", action=action, payload=payload)


@router.post("/monitoring/alerts/{alert_id}/acknowledge")
async def compat_acknowledge_alert(alert_id: str):
    return accepted(f"/monitoring/alerts/{alert_id}/acknowledge", alertId=alert_id)


# Provider persistence and storage adapter endpoints.
@router.post("/auth/sign-in")
async def compat_auth_sign_in(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/auth/sign-in",
        accessToken="compatibility-token",
        tokenType="bearer",
        user={"email": payload.get("email"), "role": "USER"},
    )


@router.post("/auth/sign-out")
async def compat_auth_sign_out():
    return accepted("/auth/sign-out")


# -------------------------
# Authentication compatibility
# -------------------------


@router.get("/auth/session")
async def compat_auth_session(current_user: User = Depends(get_current_user)):
    """Return current authenticated user to match frontend `/auth/session`."""
    try:
        return UserResponse.model_validate(current_user)
    except Exception:
        return {"user": None}


# NOTE: /auth/logout is now handled for real by routers/auth.py (token revocation).
# The previous no-op compatibility stub here shadowed it because compatibility
# routes are registered first, so it has been removed.


@router.post("/auth/oauth")
async def compat_auth_oauth(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/auth/oauth",
        accessToken="compatibility-oauth-token",
        refreshToken="compatibility-oauth-refresh",
        payload=payload,
    )


@router.post("/auth/verify-email")
async def compat_auth_verify_email(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted("/auth/verify-email", verified=True, payload=payload)


@router.post("/auth/mfa/setup")
async def compat_auth_mfa_setup():
    return accepted(
        "/auth/mfa/setup",
        factorId=f"mfa-{uuid4().hex[:8]}",
        qrCode="data:image/png;base64,compat",
    )


@router.post("/auth/mfa/verify")
async def compat_auth_mfa_verify(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted("/auth/mfa/verify", verified=True, payload=payload)


@router.post("/auth/reset-password")
async def compat_auth_reset_password(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    """Compatibility endpoint for initiating legacy password resets."""
    # Accepts either { email } or { token, newPassword } depending on frontend usage.
    return accepted("/auth/reset-password", sent=True, payload=payload)


@router.post("/auth/refresh")
async def compat_auth_refresh(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Issue a refreshed access token for an authenticated user."""
    try:
        service = AuthService(db)
        role_val = getattr(current_user, "role", None)
        role_str = getattr(role_val, "value", role_val)
        token = service.create_access_token(user_id=current_user.id, tenant_id=current_user.tenant_id, role=role_str)
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.model_validate(current_user),
        )
    except Exception:
        from fastapi.responses import JSONResponse

        return JSONResponse(
            status_code=401, content={"detail": "Could not refresh token"}
        )


@router.post("/auth/update-password")
async def compat_auth_update_password(
    body: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deprecated alias for `/auth/change-password` used by legacy frontends."""
    try:
        service = AuthService(db)
        service.change_password(current_user, body.current_password, body.new_password)
        return {"message": "Password changed successfully"}
    except Exception as e:
        from fastapi.responses import JSONResponse

        return JSONResponse(status_code=400, content={"detail": str(e)})


@router.post("/integrations/xero/connect")
async def compat_xero_connect(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/integrations/xero/connect",
        accessToken="compat_xero_token",
        refreshToken="compat_xero_refresh",
        payload=payload,
    )


@router.post("/integrations/xero/contacts")
async def compat_xero_contacts(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/integrations/xero/contacts",
        ContactID=f"contact-{uuid4().hex[:8]}",
        ContactStatus="ACTIVE",
        payload=payload,
    )


@router.get("/integrations/xero/contacts/{contact_id}")
async def compat_xero_contact(contact_id: str):
    return {"ContactID": contact_id, "ContactStatus": "ACTIVE", "compatibility": True}


@router.post("/integrations/asic/lookup")
async def compat_integration_asic_lookup(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/integrations/asic/lookup",
        acn=payload.get("acn") or payload.get("abn"),
        name="Mock Company Ltd",
        status="Registered",
        payload=payload,
    )


@router.post("/integrations/asic/directors")
async def compat_integration_asic_directors(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/integrations/asic/directors",
        directors=[{"name": "John Doe", "appointmentDate": "2020-01-01"}],
        payload=payload,
    )


@router.post("/integrations/bgl/connect")
async def compat_bgl_connect(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/integrations/bgl/connect", message="BGL Connected", payload=payload
    )


@router.post("/integrations/bgl/funds")
async def compat_bgl_funds(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted("/integrations/bgl/funds", status="Created", payload=payload)


@router.get("/integrations/bgl/funds/{abn}")
async def compat_bgl_fund(abn: str):
    return {"fundName": "Mock SMSF", "abn": abn, "compatibility": True}


@router.post("/integrations/ato/lookup")
async def compat_ato_lookup(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/integrations/ato/lookup",
        abn=payload.get("abn"),
        entityName="Mock ATO Entity",
        abnStatus="Active",
        payload=payload,
    )


@router.post("/integrations/ato/verify-tfn")
async def compat_verify_tfn(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted("/integrations/ato/verify-tfn", verified=True, payload=payload)


@router.post("/payments/stripe/charge")
async def compat_stripe_charge(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/payments/stripe/charge",
        chargeId=f"ch_{uuid4().hex[:8]}",
        status="succeeded",
        payload=payload,
    )


@router.post("/payments/stripe/direct-debit")
async def compat_stripe_direct_debit(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/payments/stripe/direct-debit",
        mandateId=f"mandate_{uuid4().hex[:8]}",
        status="active",
        payload=payload,
    )


@router.post("/payments/paypal/subscription")
async def compat_paypal_subscription(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/payments/paypal/subscription",
        subscriptionId=f"sub_{uuid4().hex[:8]}",
        status="active",
        payload=payload,
    )


@router.post("/evidence/upload-target")
async def compat_evidence_upload_target(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/evidence/upload-target",
        uploadUrl=f"https://storage.local/{uuid4().hex}",
        objectKey=f"evidence/{uuid4().hex}",
        payload=payload,
    )


@router.post("/evidence/download-url")
async def compat_evidence_download_url(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/evidence/download-url",
        downloadUrl=f"https://storage.local/{uuid4().hex}",
        payload=payload,
    )


@router.post("/bot-runs", status_code=status.HTTP_201_CREATED)
async def compat_create_bot_run(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted("/bot-runs", runId=f"run-{uuid4().hex[:8]}", payload=payload)


@router.post("/bot-runs/{run_id}")
async def compat_update_bot_run(
    run_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(f"/bot-runs/{run_id}", runId=run_id, payload=payload)


@router.post("/bot-results", status_code=status.HTTP_201_CREATED)
async def compat_create_bot_result(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/bot-results", resultId=f"result-{uuid4().hex[:8]}", payload=payload
    )


@router.post("/bot-results/evidence")
async def compat_bot_result_evidence(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/bot-results/evidence",
        evidenceId=f"evidence-{uuid4().hex[:8]}",
        payload=payload,
    )


@router.post("/evidence-packs", status_code=status.HTTP_201_CREATED)
async def compat_create_evidence_pack(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/evidence-packs", packId=f"pack-{uuid4().hex[:8]}", payload=payload
    )


@router.post("/findings", status_code=status.HTTP_201_CREATED)
async def compat_create_finding(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/findings", findingId=f"finding-{uuid4().hex[:8]}", payload=payload
    )


@router.get("/findings")
async def compat_list_findings(
    caseId: Optional[str] = None, organizationId: Optional[str] = None
):
    return {
        "caseId": caseId,
        "organizationId": organizationId,
        "findings": [],
        "compatibility": True,
    }


@router.post("/alerts", status_code=status.HTTP_201_CREATED)
async def compat_create_alert(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted("/alerts", alertId=f"alert-{uuid4().hex[:8]}", payload=payload)


@router.post("/alerts/{alert_id}/resolve")
async def compat_resolve_alert(
    alert_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(f"/alerts/{alert_id}/resolve", alertId=alert_id, payload=payload)


@router.post("/periodic-reviews", status_code=status.HTTP_201_CREATED)
async def compat_create_periodic_review(
    payload: Dict[str, Any] = Body(default_factory=dict),
):
    return accepted(
        "/periodic-reviews", reviewId=f"periodic-{uuid4().hex[:8]}", payload=payload
    )


@router.post("/periodic-reviews/{review_id}")
async def compat_update_periodic_review(
    review_id: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/periodic-reviews/{review_id}", reviewId=review_id, payload=payload
    )


@router.post("/provider-logs", status_code=status.HTTP_201_CREATED)
async def compat_provider_logs(payload: Dict[str, Any] = Body(default_factory=dict)):
    return accepted(
        "/provider-logs", logId=f"provider-log-{uuid4().hex[:8]}", payload=payload
    )


# Admin integration aliases from the imported API specification.
@router.get("/admin/integrations")
async def compat_admin_integrations():
    return {"integrations": [], "compatibility": True}


@router.post("/admin/integrations/{provider}/test")
async def compat_admin_integration_test(
    provider: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/admin/integrations/{provider}/test", provider=provider, payload=payload
    )


@router.post("/admin/integrations/{provider}/configure")
async def compat_admin_integration_configure(
    provider: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/admin/integrations/{provider}/configure", provider=provider, payload=payload
    )


@router.get("/admin/integrations/{provider}/logs")
async def compat_admin_integration_logs(provider: str):
    return {"provider": provider, "logs": [], "compatibility": True}


@router.post("/subjects/{subject_type}", status_code=status.HTTP_201_CREATED)
async def compat_create_subject(
    subject_type: str, payload: Dict[str, Any] = Body(default_factory=dict)
):
    return accepted(
        f"/subjects/{subject_type}",
        subjectId=f"subject-{uuid4().hex[:8]}",
        subjectType=subject_type,
        payload=payload,
    )
