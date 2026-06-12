"""
tasks/notification_tasks.py
============================
Async Celery background tasks for sending notifications.
"""

import logging

from core.celery_app import celery_app
from database import SessionLocal

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.notifications.send_notification")
def send_notification_task(
    self,
    user_id: int,
    title: str,
    message: str,
    notif_type: str = "SYSTEM_ALERT",
    tenant_id: int = None,
    correlation_id: str = None,
):
    """Send a notification to a user in the background."""
    db = SessionLocal()
    try:
        from core.enums import NotificationType
        from services.notification_service import NotificationService

        ntype = NotificationType[notif_type] if isinstance(notif_type, str) else notif_type
        NotificationService(db).create_notification(
            user_id=user_id,
            title=title,
            message=message,
            notif_type=ntype,
        )
        logger.info(f"Notification sent to user {user_id}: {title}")
    except Exception as exc:
        logger.error(f"Failed to send notification to user {user_id}: {exc}")
        raise self.retry(exc=exc, countdown=30, max_retries=3)
    finally:
        db.close()
