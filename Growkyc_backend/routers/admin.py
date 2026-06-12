"""
Admin and Agent router for KYC management, approvals, and system operations.
Delegates all business logic to KYCService and UserService.
Restricted to Admin and Agent roles only.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from core.constants import MAX_BULK_APPROVE_SIZE
from core.enums import KYCStatus
from core.exceptions import DatabaseError, ResourceNotFoundError
from core.limiter import limiter
from database import get_db
from dependencies import get_admin_or_agent_user, get_admin_user
from models import KYC, Document, User
from schemas import (BulkApproveRequest, BulkApproveResponse,
                     KYCAuditLogResponse, KYCResponse, PaginatedResponse,
                     UserResponse)
from services.kyc_service import KYCService
from services.user_service import UserService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> dict:
    """
    Get KYC dashboard statistics for admin/agent overview.

    Args:
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        Dict with KYC and user statistics
    """
    try:
        # Single aggregated query replaces 4 separate COUNT queries (N+1 fix)
        kyc_stats = db.query(
            func.count(KYC.id).label("total"),
            func.sum(case((KYC.status == KYCStatus.PENDING, 1), else_=0)).label("pending"),
            func.sum(case((KYC.status == KYCStatus.APPROVED, 1), else_=0)).label("approved"),
            func.sum(case((KYC.status == KYCStatus.REJECTED, 1), else_=0)).label("rejected"),
        ).one()

        total_kyc = kyc_stats.total or 0
        pending_kyc = kyc_stats.pending or 0
        approved_kyc = kyc_stats.approved or 0
        rejected_kyc = kyc_stats.rejected or 0

        # Single aggregated query for user stats
        user_stats = db.query(
            func.count(User.id).label("total"),
            func.sum(case((User.is_active.is_(True), 1), else_=0)).label("active"),
        ).one()

        total_users = user_stats.total or 0
        active_users = user_stats.active or 0

        total_documents = db.query(func.count(Document.id)).scalar() or 0

        logger.info(f"Dashboard stats retrieved by admin {admin.id}")

        return {
            "kyc": {
                "total": total_kyc,
                "pending": pending_kyc,
                "approved": approved_kyc,
                "rejected": rejected_kyc,
            },
            "users": {"total": total_users, "active": active_users},
            "documents": {"total": total_documents},
        }
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch dashboard statistics",
        )


@router.get("/kyc/pending", response_model=PaginatedResponse)
async def get_pending_kyc(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> dict:
    """
    Get all pending KYC records for review.

    Args:
        skip: Number of records to skip
        limit: Number of records to return
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        PaginatedResponse with pending KYC records
    """
    try:
        # Validate pagination
        if skip < 0:
            skip = 0
        if limit < 1:
            limit = 1
        if limit > 100:
            limit = 100

        service = KYCService(db)
        records, total = service.list_pending_kyc(skip=skip, limit=limit)

        logger.info(
            f"Retrieved {len(records)} pending KYC records for admin {admin.id}"
        )

        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "items": [KYCResponse.model_validate(r) for r in records],
        }
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch pending KYC records",
        )


@router.post("/kyc/bulk-approve", response_model=BulkApproveResponse)
@limiter.limit("20/minute")
async def bulk_approve_kyc(
    request: Request,
    body: BulkApproveRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> BulkApproveResponse:
    """
    Approve multiple KYC records in bulk.

    Args:
        body: Bulk approve request with KYC IDs
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        BulkApproveResponse with success/failure counts
    """
    if len(body.kyc_ids) > MAX_BULK_APPROVE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Bulk approve limit is {MAX_BULK_APPROVE_SIZE} records per request",
        )

    try:
        service = KYCService(db)
        result = service.bulk_approve_kyc(
            kyc_ids=body.kyc_ids,
            admin_user=admin,
            reason=body.approval_reason,
        )

        message = (
            f"Successfully approved {result['success_count']} of "
            f"{len(body.kyc_ids)} KYCs"
        )
        if result["failed_count"] > 0:
            message += f"; {result['failed_count']} failed"

        logger.info(
            f"Bulk approval: {result['success_count']} succeeded, "
            f"{result['failed_count']} failed by admin {admin.id}"
        )

        return BulkApproveResponse(
            success_count=result["success_count"],
            failed_count=result["failed_count"],
            failed_ids=result["failed_ids"],
            message=message,
        )
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to perform bulk approval",
        )


@router.get("/kyc/{kyc_id}/audit-log", response_model=list[KYCAuditLogResponse])
async def get_kyc_audit_log(
    kyc_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> list:
    """
    Get audit log for a specific KYC record.

    Shows all status changes, who made them, and when.

    Args:
        kyc_id: KYC record ID
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        List of KYCAuditLogResponse entries

    Raises:
        HTTPException 404: If KYC not found
    """
    try:
        service = KYCService(db)
        kyc = service.get_kyc_by_id(kyc_id)
        audit_logs = service.get_kyc_audit_log(kyc)

        logger.info(f"Retrieved audit log for KYC {kyc_id} by admin {admin.id}")

        return [KYCAuditLogResponse.model_validate(log) for log in audit_logs]
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch audit log",
        )


@router.get("/users", response_model=PaginatedResponse)
async def list_users(
    skip: int = 0,
    limit: int = 20,
    role: str = Query(None, description="Filter by role"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
) -> dict:
    """
    List all users with pagination and optional role filtering (Admin only).

    Args:
        skip: Number of records to skip
        limit: Number of records to return
        role: Optional role filter (Admin, Agent, User)
        db: Database session
        admin: Authenticated admin user

    Returns:
        PaginatedResponse with user records
    """
    try:
        # Validate pagination
        if skip < 0:
            skip = 0
        if limit < 1:
            limit = 1
        if limit > 100:
            limit = 100

        service = UserService(db)
        users, total = service.list_users(skip=skip, limit=limit, role=role)

        logger.info(f"User list retrieved by admin {admin.id} (total: {total})")

        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "items": [UserResponse.model_validate(u) for u in users],
        }
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list users",
        )


@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
) -> dict:
    """
    Toggle user active status (Admin only).

    Args:
        user_id: User ID to toggle
        db: Database session
        admin: Authenticated admin user

    Returns:
        Dict with updated user status

    Raises:
        HTTPException 404: If user not found
        HTTPException 400: If trying to deactivate yourself
    """
    try:
        # Prevent admin from deactivating themselves
        if user_id == admin.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot deactivate your own account",
            )

        service = UserService(db)
        user_obj = service.get_user_by_id(user_id)
        user = service.toggle_user_active(user_obj)

        logger.info(
            f"User {user_id} toggled to is_active={user.is_active} by admin {admin.id}"
        )

        return {
            "user_id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "message": (
                "User account " f"{'activated' if user.is_active else 'deactivated'}"
            ),
        }
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except HTTPException:
        raise
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to toggle user status",
        )


@router.get("/kyc/stats/by-status")
async def get_kyc_stats_by_status(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> dict:
    """
    Get KYC statistics grouped by status.

    Args:
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        Dict with KYC counts by status and other metrics
    """
    try:
        row = db.query(
            func.sum(case((KYC.status == KYCStatus.PENDING, 1), else_=0)).label("pending"),
            func.sum(case((KYC.status == KYCStatus.APPROVED, 1), else_=0)).label("approved"),
            func.sum(case((KYC.status == KYCStatus.REJECTED, 1), else_=0)).label("rejected"),
        ).one()

        stats = {
            "Pending": row.pending or 0,
            "Approved": row.approved or 0,
            "Rejected": row.rejected or 0,
        }

        total = sum(stats.values())

        logger.info(f"KYC status statistics retrieved by admin {admin.id}")

        return {
            "total": total,
            "by_status": stats,
            "pending_percentage": round(
                (stats["Pending"] / total * 100) if total > 0 else 0, 2
            ),
        }
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch KYC statistics",
        )


@router.get("/monitoring/run")
async def run_manual_monitoring(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> dict:
    """
    Manually trigger the backend compliance monitoring checks engine.

    Used as a cron substitution.

    Args:
        db: Database session
        admin: Authenticated admin/agent user (Implicit RBAC)

    Returns:
        Dict outlining count totals of structural alerts dispatched
    """
    from services.monitoring_service import MonitoringService

    try:
        service = MonitoringService(db)
        results = service.run_monitoring_checks()
        logger.info(
            f"Manual Monitoring Engine Triggered by Admin {admin.id}: {results}"
        )

        return {
            "status": "success",
            "message": "Monitoring evaluation checks executed successfully",
            "results": results,
        }
    except Exception as e:
        logger.error(f"Manual Monitoring Engine Failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to run monitoring checks",
        )
