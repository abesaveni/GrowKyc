"""
routers/alerts.py
=================
Transaction / risk monitoring alerts API.

Backs the front-end Monitoring & Alerts screen with real, persisted data. The
Alert model already exists (models/alert.py); this exposes CRUD + a lightweight
rule engine that derives alerts from real client risk signals.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.tenant_context import get_tenant_id, set_tenant_id
from database import get_db
from dependencies import get_admin_or_agent_user
from models import Alert, Client, User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/alerts", tags=["monitoring"])

VALID_STATUSES = {"open", "in_review", "escalated", "resolved", "dismissed", "false_positive"}
VALID_SEVERITIES = {"low", "medium", "high", "critical"}


def _bind_tenant(current_user: User) -> None:
    if get_tenant_id() is None and current_user.tenant_id is not None:
        set_tenant_id(current_user.tenant_id)


class AlertCreate(BaseModel):
    client_id: int
    alert_type: str
    title: str
    severity: str = "medium"
    description: Optional[str] = None


class AlertStatusUpdate(BaseModel):
    status: str
    resolution_notes: Optional[str] = None


def _serialize(a: Alert) -> dict:
    return {
        "id": a.id,
        "client_id": a.client_id,
        "case_id": a.case_id,
        "alert_type": a.alert_type,
        "severity": a.severity,
        "status": a.status,
        "title": a.title,
        "description": a.description,
        "assigned_to_user_id": a.assigned_to_user_id,
        "triggered_by": a.triggered_by,
        "resolution_notes": a.resolution_notes,
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None,
    }


@router.get("")
async def list_alerts(
    alert_status: Optional[str] = Query(None, alias="status"),
    severity: Optional[str] = None,
    client_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """List monitoring alerts, optionally filtered by status / severity / client."""
    _bind_tenant(current_user)
    query = db.query(Alert)
    if alert_status:
        query = query.filter(Alert.status == alert_status)
    if severity:
        query = query.filter(Alert.severity == severity)
    if client_id:
        query = query.filter(Alert.client_id == client_id)
    total = query.count()
    rows = query.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": [_serialize(a) for a in rows]}


@router.get("/stats")
async def alert_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Aggregate counts for the monitoring dashboard."""
    _bind_tenant(current_user)
    by_status = dict(
        db.query(Alert.status, func.count(Alert.id)).group_by(Alert.status).all()
    )
    by_severity = dict(
        db.query(Alert.severity, func.count(Alert.id)).group_by(Alert.severity).all()
    )
    total = db.query(func.count(Alert.id)).scalar() or 0
    open_count = (by_status.get("open", 0) or 0) + (by_status.get("in_review", 0) or 0)
    return {
        "total": total,
        "open": open_count,
        "critical": by_severity.get("critical", 0) or 0,
        "high": by_severity.get("high", 0) or 0,
        "resolved": by_status.get("resolved", 0) or 0,
        "by_status": by_status,
        "by_severity": by_severity,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_alert(
    body: AlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Manually raise a monitoring alert against a client."""
    _bind_tenant(current_user)
    if body.severity not in VALID_SEVERITIES:
        raise HTTPException(status_code=400, detail=f"Invalid severity: {body.severity}")
    client = db.query(Client).filter(Client.id == body.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    alert = Alert(
        client_id=body.client_id,
        tenant_id=current_user.tenant_id,
        alert_type=body.alert_type,
        severity=body.severity,
        title=body.title,
        description=body.description,
        status="open",
        triggered_by="manual",
        triggered_by_user_id=current_user.id,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return _serialize(alert)


@router.patch("/{alert_id}/status")
async def update_alert_status(
    alert_id: int,
    body: AlertStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Move an alert through its workflow (in_review / escalated / resolved / …)."""
    _bind_tenant(current_user)
    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status: {body.status}")
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = body.status
    if body.resolution_notes is not None:
        alert.resolution_notes = body.resolution_notes
    if body.status in ("resolved", "dismissed", "false_positive"):
        alert.resolved_at = datetime.now(timezone.utc)
        alert.resolved_by_user_id = current_user.id
    db.commit()
    db.refresh(alert)
    return _serialize(alert)


@router.post("/generate")
async def generate_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Lightweight rule engine: derive alerts from real client risk signals.

    Scans clients and raises an alert (if one is not already open) for:
      - sanctions hits     -> sanctions_hit (critical)
      - PEP matches        -> pep_match (high)
      - high risk score    -> high_risk (high/critical by score)
    Idempotent per (client, alert_type) while an alert is still open.
    """
    _bind_tenant(current_user)
    clients = db.query(Client).all()
    created = 0

    def has_open(client_id: int, alert_type: str) -> bool:
        return (
            db.query(Alert.id)
            .filter(
                Alert.client_id == client_id,
                Alert.alert_type == alert_type,
                Alert.status.in_(["open", "in_review", "escalated"]),
            )
            .first()
            is not None
        )

    def raise_alert(c: Client, alert_type: str, severity: str, title: str, desc: str):
        nonlocal created
        if has_open(c.id, alert_type):
            return
        db.add(
            Alert(
                client_id=c.id,
                tenant_id=current_user.tenant_id,
                alert_type=alert_type,
                severity=severity,
                title=title,
                description=desc,
                status="open",
                triggered_by="risk_engine",
            )
        )
        created += 1

    for c in clients:
        name = c.name or f"Client {c.id}"
        if getattr(c, "is_sanctioned", False):
            raise_alert(c, "sanctions_hit", "critical", f"Sanctions match — {name}",
                        "Client flagged against a sanctions list. Immediate review required.")
        if getattr(c, "is_pep", False):
            raise_alert(c, "pep_match", "high", f"PEP match — {name}",
                        "Client identified as a Politically Exposed Person.")
        score = getattr(c, "risk_score", 0) or 0
        if score >= 70:
            sev = "critical" if score >= 85 else "high"
            raise_alert(c, "high_risk", sev, f"High risk score ({score}) — {name}",
                        f"Client risk score of {score} exceeds the monitoring threshold.")

    db.commit()
    logger.info(f"Alert rule engine created {created} alert(s) by user {current_user.id}")
    return {"created": created, "clients_scanned": len(clients)}
