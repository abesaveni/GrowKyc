"""
Notification service for system events and alerts.
"""

import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from core.enums import NotificationStatus, NotificationType
from models import Notification

logger = logging.getLogger(__name__)


class NotificationService:
    """Service handling system alerting and event generation."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)

    def create_notification(
        self,
        user_id: int,
        title: str,
        message: str,
        notif_type: NotificationType,
        related_kyc_id: int = None,
    ) -> Notification:
        """
        Record a notification explicitly triggered by state changes.
        """
        notification = Notification(
            user_id=user_id,
            kyc_id=related_kyc_id,
            type=notif_type,
            title=title,
            message=message,
            status=NotificationStatus.UNREAD,
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)

        self.logger.info(f"Notification '{title}' delivered to user {user_id}")
        return notification
