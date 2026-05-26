"""
US-026 — Document Expiry Scheduler Job.
Runs daily via APScheduler to detect expiring documents and generate alerts.

Reuses:
- existing Document model (expiry_date field)
- existing Notification model via NotificationService
- existing SessionLocal from database.py
- existing NotificationType enum
- existing logging style
"""

import logging
from datetime import datetime, timedelta, timezone, time as _time, date as _date

from apscheduler.schedulers.background import BackgroundScheduler

from core.enums import NotificationType
from database import SessionLocal
from models import Client, Document, Notification
from services.notification_service import NotificationService

logger = logging.getLogger(__name__)

# Module-level scheduler instance (singleton)
_scheduler: BackgroundScheduler = None


# ---- Core scan function ----


def scan_expiring_documents() -> dict:
    """
    Query documents expiring within 30 and 60 days.
    Generate system alert notifications for affected users.
    Skips documents whose user already received the same alert today.

    Returns:
        dict with counts of alerts created per window.
    """
    logger.info("Expiry scheduler: scan started")

    db = SessionLocal()
    alerts_30 = 0
    alerts_60 = 0

    try:
        now = datetime.now(timezone.utc)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

        window_30 = now + timedelta(days=30)
        window_60 = now + timedelta(days=60)

        # Query 1: expiring within 30 days
        docs_30 = (
            db.query(Document)
            .filter(
                Document.expiry_date.isnot(None),
                Document.expiry_date >= now,
                Document.expiry_date <= window_30,
            )
            .all()
        )

        # Query 2: expiring within 31–60 days
        docs_60 = (
            db.query(Document)
            .filter(
                Document.expiry_date.isnot(None),
                Document.expiry_date > window_30,
                Document.expiry_date <= window_60,
            )
            .all()
        )

        notif_service = NotificationService(db)

        def _to_aware(dt_val):
            # Convert date or naive datetime to timezone-aware datetime (UTC)
            try:
                if isinstance(dt_val, datetime):
                    if dt_val.tzinfo is None:
                        return dt_val.replace(tzinfo=timezone.utc)
                    return dt_val
                if isinstance(dt_val, _date):
                    return datetime.combine(dt_val, _time.min).replace(
                        tzinfo=timezone.utc
                    )
            except Exception:
                pass
            return None

        for doc in docs_30:
            user_id = _resolve_user_id(db, doc)
            if user_id and not _alert_sent_today(db, user_id, doc.id, today_start):
                ed = _to_aware(doc.expiry_date)
                if ed is None:
                    continue
                days_left = (ed - now).days
                notif_service.create_notification(
                    user_id=user_id,
                    title="Document Expiring Soon (30 Days)",
                    message=(
                        f"Your {doc.type} document expires in "
                        f"{days_left} day(s). Please renew it."
                    ),
                    notif_type=NotificationType.SYSTEM_ALERT,
                )
                alerts_30 += 1
                logger.info(
                    f"30-day expiry alert created: doc_id={doc.id} user_id={user_id}"
                )

        for doc in docs_60:
            user_id = _resolve_user_id(db, doc)
            if user_id and not _alert_sent_today(db, user_id, doc.id, today_start):
                ed = _to_aware(doc.expiry_date)
                if ed is None:
                    continue
                days_left = (ed - now).days
                notif_service.create_notification(
                    user_id=user_id,
                    title="Document Expiring Soon (60 Days)",
                    message=(
                        f"Your {doc.type} document expires in "
                        f"{days_left} day(s). Please plan renewal."
                    ),
                    notif_type=NotificationType.SYSTEM_ALERT,
                )
                alerts_60 += 1
                logger.info(
                    f"60-day expiry alert created: doc_id={doc.id} user_id={user_id}"
                )

        logger.info(
            f"Expiry scheduler: scan complete — "
            f"30-day alerts={alerts_30}, 60-day alerts={alerts_60}"
        )
        return {"alerts_30_day": alerts_30, "alerts_60_day": alerts_60}

    except Exception as e:
        logger.error(f"Expiry scheduler: scan failed — {str(e)}")
        return {"alerts_30_day": 0, "alerts_60_day": 0, "error": str(e)}
    finally:
        db.close()


# ---- Internal helpers ----


def _resolve_user_id(db, doc: Document):
    """
    Resolve the user_id for a document.
    Priority: doc.kyc.user_id → doc.client.user_id → None.
    """
    try:
        if doc.kyc_id and doc.kyc:
            return doc.kyc.user_id
        if doc.client_id:
            client = db.query(Client).filter(Client.id == doc.client_id).first()
            if client:
                return client.user_id
    except Exception:
        pass
    return None


def _alert_sent_today(db, user_id: int, doc_id: int, today_start: datetime) -> bool:
    """
    Check if an expiry alert for this doc was already sent today.
    Prevents duplicate notifications per document per day.
    """
    existing = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.created_at >= today_start,
            Notification.title.like("Document Expiring Soon%"),
        )
        .first()
    )
    return existing is not None


# ---- Scheduler lifecycle ----


def start_expiry_scheduler():
    """
    Start the APScheduler BackgroundScheduler.
    Runs scan_expiring_documents() once per day at 02:00 UTC.
    Safe to call from FastAPI lifespan startup.
    """
    global _scheduler
    try:
        _scheduler = BackgroundScheduler(timezone="UTC")
        _scheduler.add_job(
            scan_expiring_documents,
            trigger="cron",
            hour=2,
            minute=0,
            id="document_expiry_scan",
            replace_existing=True,
            misfire_grace_time=3600,  # tolerate up to 1h delay
        )
        _scheduler.start()
        logger.info("Expiry scheduler started — daily at 02:00 UTC")
    except Exception as e:
        logger.error(f"Expiry scheduler failed to start: {str(e)}")


def stop_expiry_scheduler():
    """
    Gracefully shut down the APScheduler.
    Safe to call from FastAPI lifespan shutdown.
    """
    try:
        if _scheduler and _scheduler.running:
            _scheduler.shutdown(wait=False)
            logger.info("Expiry scheduler stopped gracefully")
    except Exception as e:
        logger.error(f"Expiry scheduler shutdown error: {str(e)}")


def get_scheduler() -> BackgroundScheduler:
    """Return the current scheduler instance (for testing/inspection)."""
    return _scheduler
