"""
Dashboard router providing aggregated system metrics.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.enums import RiskLevel, UserRole
from database import get_db
from dependencies import require_role
from models import Approval, Case, Client, User
from schemas import DashboardResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardResponse)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    user: User = Depends(
        require_role(
            [
                UserRole.ADMIN.value,
                UserRole.ANALYST.value,
                UserRole.COMPLIANCE_OFFICER.value,
                UserRole.MLRO.value,
            ]
        )
    ),
) -> DashboardResponse:
    """
    Returns aggregated dashboard statistics via efficient SQL counting.
    """
    try:
        # 1. Total Clients
        total_clients = db.query(func.count(Client.id)).scalar() or 0

        # 2. High Risk Clients
        high_risk_clients = (
            db.query(func.count(Client.id))
            .filter(Client.risk_level == RiskLevel.HIGH)
            .scalar()
            or 0
        )

        # 3. Pending Approvals
        pending_approvals = (
            db.query(func.count(Approval.id))
            .filter(Approval.status == "Pending")
            .scalar()
            or 0
        )

        # 4. Total Cases
        total_cases = db.query(func.count(Case.id)).scalar() or 0

        return DashboardResponse(
            total_clients=total_clients,
            high_risk_clients=high_risk_clients,
            pending_approvals=pending_approvals,
            total_cases=total_cases,
        )
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard stats",
        )
