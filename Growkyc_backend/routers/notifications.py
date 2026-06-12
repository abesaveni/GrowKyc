"""
routers/notifications.py — In-app notification endpoints.
"""
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.enums import NotificationStatus
from database import get_db
from dependencies import get_current_user
from models import Notification, User

router = APIRouter(prefix="/notifications", tags=["notifications"])


class NotificationOut(BaseModel):
    id: int
    type: str
    title: str
    message: str
    status: str
    created_at: datetime
    read_at: Optional[datetime] = None
    kyc_id: Optional[int] = None

    model_config = {"from_attributes": True}


@router.get("", response_model=dict)
async def list_notifications(
    skip: int = 0,
    limit: int = 20,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Notification).filter(Notification.user_id == current_user.id)
    if unread_only:
        q = q.filter(Notification.status == NotificationStatus.UNREAD)
    total = q.count()
    items = q.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    unread_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.status == NotificationStatus.UNREAD,
    ).count()
    return {
        "items": [NotificationOut.model_validate(n) for n in items],
        "total": total,
        "unread_count": unread_count,
        "skip": skip,
        "limit": limit,
    }


@router.post("/{notification_id}/read")
async def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ).first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notif.status = NotificationStatus.READ
    notif.read_at = datetime.now(timezone.utc)
    db.commit()
    return {"id": notification_id, "status": "read"}


@router.post("/read-all")
async def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    updated = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.status == NotificationStatus.UNREAD,
    ).update({"status": NotificationStatus.READ, "read_at": now})
    db.commit()
    return {"marked_read": updated}
