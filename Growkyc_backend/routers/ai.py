"""
routers/ai.py
=============
AI-powered compliance bot analysis endpoints.

All OpenAI calls are made server-side — the API key NEVER reaches the browser.
The frontend calls these endpoints; the backend proxies to OpenAI with the
appropriate compliance domain system prompt for each bot type.
"""

import logging
from typing import Any, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.limiter import limiter
from database import get_db
from dependencies import get_current_user
from models import User
from services.ai_service import run_bot_analysis

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai", tags=["ai"])


class BotAnalysisRequest(BaseModel):
    bot_id: str = Field(..., description="Bot identifier, e.g. 'aml-screening'")
    client_id: Union[str, int] = Field(..., description="Client identifier")
    client_name: str = Field(..., description="Client display name")
    organization_id: Optional[str] = Field(None, description="Tenant/org identifier")
    client_data: dict[str, Any] = Field(
        default_factory=dict,
        description="All client data available for analysis (KYC, documents, risk, etc.)"
    )

    @property
    def client_id_str(self) -> str:
        return str(self.client_id)


class BotAnalysisResponse(BaseModel):
    bot_id: str
    client_id: str
    status: str
    score: int
    summary: str
    findings: list[str]
    risk_factors: list[str]
    recommended_actions: list[str]
    ai_powered: bool


@router.post("/bot-analysis", response_model=BotAnalysisResponse)
@limiter.limit("30/minute")
async def analyse_client_with_bot(
    request: Request,
    body: BotAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BotAnalysisResponse:
    """
    Run AI-powered compliance analysis for a specific bot against a client.

    Uses OpenAI GPT-4o-mini with a compliance domain system prompt trained for
    GrowKYC's AML/KYC context. Falls back to simulated results if OPENAI_API_KEY
    is not configured.

    Rate-limited to 30 requests/minute per IP.
    """
    import os
    is_ai_powered = bool(os.getenv("OPENAI_API_KEY"))

    try:
        result = run_bot_analysis(
            bot_id=body.bot_id,
            client_name=body.client_name,
            client_data=body.client_data,
            organization_id=body.organization_id or str(getattr(current_user, "tenant_id", "")),
        )
        return BotAnalysisResponse(
            bot_id=body.bot_id,
            client_id=body.client_id_str,
            status=result["status"],
            score=result["score"],
            summary=result["summary"],
            findings=result.get("findings", []),
            risk_factors=result.get("risk_factors", []),
            recommended_actions=result.get("recommended_actions", []),
            ai_powered=is_ai_powered,
        )
    except Exception as e:
        logger.error(f"Bot analysis endpoint error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Bot analysis failed — please retry or contact support",
        )


@router.post("/bot-analysis/batch", response_model=list[BotAnalysisResponse])
@limiter.limit("5/minute")
async def analyse_client_all_bots(
    request: Request,
    body: BotAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[BotAnalysisResponse]:
    """
    Run all enabled compliance bots against a client in sequence.
    Rate-limited to 5 batch requests/minute (each batch runs ~18 bots).
    """
    import os
    from services.ai_service import _BOT_SYSTEM_PROMPTS

    is_ai_powered = bool(os.getenv("OPENAI_API_KEY"))
    results = []

    for bot_id in _BOT_SYSTEM_PROMPTS.keys():
        try:
            result = run_bot_analysis(
                bot_id=bot_id,
                client_name=body.client_name,
                client_data=body.client_data,
                organization_id=body.organization_id or str(getattr(current_user, "tenant_id", "")),
            )
            results.append(BotAnalysisResponse(
                bot_id=bot_id,
                client_id=body.client_id_str,
                status=result["status"],
                score=result["score"],
                summary=result["summary"],
                findings=result.get("findings", []),
                risk_factors=result.get("risk_factors", []),
                recommended_actions=result.get("recommended_actions", []),
                ai_powered=is_ai_powered,
            ))
        except Exception as e:
            logger.error(f"Bot {bot_id} failed in batch: {e}")
            results.append(BotAnalysisResponse(
                bot_id=bot_id,
                client_id=body.client_id_str,
                status="alert",
                score=50,
                summary="Analysis failed — manual review required",
                findings=["Analysis error"],
                risk_factors=["Could not complete analysis"],
                recommended_actions=["Manual review required"],
                ai_powered=False,
            ))

    return results


class ComplianceQueryRequest(BaseModel):
    caseId: Optional[str] = None
    caseStatus: Optional[str] = None
    openIssues: list[Any] = Field(default_factory=list)
    docExpiry: Optional[dict[str, Any]] = None
    formData: Optional[dict[str, Any]] = None
    uploadedDocuments: list[Any] = Field(default_factory=list)
    infoTrackData: Optional[dict[str, Any]] = None
    rpData: Optional[dict[str, Any]] = None


@router.post("/compliance-query")
@limiter.limit("20/minute")
async def compliance_query(
    request: Request,
    body: ComplianceQueryRequest,
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Case compliance analysis endpoint used by AIComplianceAgent component.
    Runs bot analysis against the provided case data and returns a ComplianceReport.
    """
    import os
    from datetime import datetime as dt

    is_ai_powered = bool(os.getenv("OPENAI_API_KEY"))
    client_data = {
        "case_id": body.caseId,
        "case_status": body.caseStatus,
        "open_issues": body.openIssues,
        "doc_expiry": body.docExpiry or {},
        "form_data": body.formData or {},
        "uploaded_documents": body.uploadedDocuments,
        "info_track": body.infoTrackData or {},
        "rp_data": body.rpData or {},
    }
    try:
        result = run_bot_analysis(
            bot_id="aml-screening",
            client_name=f"Case {body.caseId or 'Unknown'}",
            client_data=client_data,
        )
        issues = []
        for i, finding in enumerate(result.get("findings", [])):
            issues.append({
                "id": f"issue-{i}",
                "severity": "medium",
                "category": "compliance",
                "title": finding,
                "description": finding,
                "recommendation": (result.get("recommended_actions") or ["Manual review required"])[0],
                "canAutoFix": False,
                "source": "ai-analysis",
            })
        expiring = (body.docExpiry or {}).get("expiringSoon", 0)
        expired = (body.docExpiry or {}).get("expired", 0)
        if expired > 0:
            issues.append({
                "id": "doc-expired",
                "severity": "critical",
                "category": "document_mismatch",
                "title": f"{expired} document(s) expired",
                "description": f"{expired} uploaded document(s) have expired and must be renewed.",
                "recommendation": "Request updated documents from the client immediately.",
                "canAutoFix": False,
                "source": "document-check",
            })
        if expiring > 0:
            issues.append({
                "id": "doc-expiring",
                "severity": "high",
                "category": "document_mismatch",
                "title": f"{expiring} document(s) expiring soon",
                "description": f"{expiring} document(s) will expire within 30 days.",
                "recommendation": "Proactively request document renewals.",
                "canAutoFix": False,
                "source": "document-check",
            })
        critical = sum(1 for i in issues if i["severity"] == "critical")
        high = sum(1 for i in issues if i["severity"] == "high")
        medium = sum(1 for i in issues if i["severity"] == "medium")
        low = sum(1 for i in issues if i["severity"] == "low")
        score = max(0, result.get("score", 75) - critical * 15 - high * 5)
        return {
            "overallScore": score,
            "totalIssues": len(issues),
            "criticalIssues": critical,
            "highIssues": high,
            "mediumIssues": medium,
            "lowIssues": low,
            "issues": issues,
            "documentAnalysis": [],
            "complianceChecks": {"nccp": True, "privacyAct": True, "ppsa": True, "amlCtf": score >= 60},
            "recommendations": result.get("recommended_actions", []),
            "timestamp": dt.utcnow().isoformat(),
            "ai_powered": is_ai_powered,
        }
    except Exception as e:
        logger.error(f"Compliance query error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Compliance analysis failed — please retry",
        )


@router.get("/status")
async def ai_status(
    current_user: User = Depends(get_current_user),
):
    """Check whether AI bot analysis is active (OpenAI key configured)."""
    import os
    api_key_set = bool(os.getenv("OPENAI_API_KEY"))
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    return {
        "ai_powered": api_key_set,
        "model": model if api_key_set else None,
        "bot_count": 18,
        "mode": "openai" if api_key_set else "simulated",
        "message": (
            f"AI analysis active using {model}"
            if api_key_set
            else "Using simulated results — set OPENAI_API_KEY to enable real AI analysis"
        ),
    }
