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
import os
from datetime import date as _date
from datetime import datetime
from datetime import time as _time
from datetime import timedelta, timezone

from apscheduler.schedulers.background import BackgroundScheduler

from core.enums import CaseStatus, NotificationType
from database import SessionLocal
from models import Case, Client, Document, Notification
from services.monitoring_service import MonitoringService
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


def run_scheduled_monitoring_checks() -> dict:
    """
    Run daily monitoring checks from the background scheduler.
    Keeps the existing MonitoringService logic unchanged.
    """
    logger.info("Monitoring scheduler: job started")

    db = SessionLocal()
    try:
        result = MonitoringService(db).run_monitoring_checks()
        logger.info(f"Monitoring scheduler: job completed: {result}")
        return result
    except Exception as e:
        logger.error(f"Monitoring scheduler: job failed: {str(e)}")
        return {"error": str(e)}
    finally:
        db.close()


def _monitoring_enabled() -> bool:
    return os.getenv("MONITORING_ENABLED", "true").lower() in {
        "1",
        "true",
        "yes",
        "on",
    }


def _monitoring_hour() -> int:
    try:
        hour = int(os.getenv("MONITORING_HOUR", "2"))
    except ValueError:
        logger.warning("Invalid MONITORING_HOUR; defaulting to 2")
        return 2

    if hour < 0 or hour > 23:
        logger.warning("MONITORING_HOUR out of range; defaulting to 2")
        return 2

    return hour


def _periodic_review_enabled() -> bool:
    return os.getenv("PERIODIC_REVIEW_ENABLED", "true").lower() in {
        "1",
        "true",
        "yes",
        "on",
    }


def _periodic_review_hour() -> int:
    try:
        hour = int(os.getenv("PERIODIC_REVIEW_HOUR", "3"))
    except ValueError:
        logger.warning("Invalid PERIODIC_REVIEW_HOUR; defaulting to 3")
        return 3

    if hour < 0 or hour > 23:
        logger.warning("PERIODIC_REVIEW_HOUR out of range; defaulting to 3")
        return 3

    return hour


def _risk_review_interval_months(risk_level) -> int:
    risk_value = getattr(risk_level, "value", risk_level)
    risk_value = str(risk_value or "").upper()
    return {
        "LOW": 36,
        "MEDIUM": 24,
        "HIGH": 12,
        "CRITICAL": 6,
    }.get(risk_value, 24)


def _periodic_review_title(client: Client) -> str:
    return f"Periodic Review - Client {client.id}"


def _add_months(source: datetime, months: int) -> datetime:
    year = source.year + ((source.month - 1 + months) // 12)
    month = ((source.month - 1 + months) % 12) + 1
    day = min(source.day, 28)
    return source.replace(year=year, month=month, day=day)


def _has_open_periodic_review_case(db, client_id: int) -> bool:
    return (
        db.query(Case)
        .filter(
            Case.client_id == client_id,
            Case.status != CaseStatus.CLOSED,
            Case.title.like("Periodic Review - Client%"),
        )
        .first()
        is not None
    )


def create_periodic_review_cases() -> dict:
    """
    Create review cases for clients whose periodic review date is due.
    Preserves existing monitoring, risk, EDD, and investigation workflows.
    """
    logger.info("Periodic review scheduler: job started")

    db = SessionLocal()
    created = 0
    skipped_duplicates = 0

    try:
        now = datetime.now(timezone.utc)
        due_clients = (
            db.query(Client)
            .filter(Client.review_date.isnot(None), Client.review_date <= now)
            .all()
        )

        for client in due_clients:
            if _has_open_periodic_review_case(db, client.id):
                skipped_duplicates += 1
                continue

            interval_months = _risk_review_interval_months(client.risk_level)
            case = Case(
                client_id=client.id,
                tenant_id=client.tenant_id,
                title=_periodic_review_title(client),
                description=(
                    "Periodic review due for "
                    f"{getattr(client.risk_level, 'value', client.risk_level)} "
                    f"risk client. Review interval: {interval_months} months."
                ),
                status=CaseStatus.OPEN,
                created_at=now,
            )
            db.add(case)
            client.review_date = _add_months(now, interval_months)
            created += 1
            logger.info(
                "Periodic review case created for client_id=%s "
                "next_review_date=%s",
                client.id,
                client.review_date,
            )

        db.commit()
        result = {
            "created": created,
            "duplicates_skipped": skipped_duplicates,
            "due_clients": len(due_clients),
        }
        logger.info(f"Periodic review scheduler: job completed: {result}")
        return result
    except Exception as e:
        db.rollback()
        logger.error(f"Periodic review scheduler: job failed: {str(e)}")
        return {"created": 0, "duplicates_skipped": skipped_duplicates, "error": str(e)}
    finally:
        db.close()


def start_expiry_scheduler():
    """
    Start the APScheduler BackgroundScheduler.
    Runs scan_expiring_documents() once per day at 02:00 UTC.
    Safe to call from FastAPI lifespan startup.
    """
    global _scheduler
    try:
        if _scheduler and _scheduler.running:
            logger.info("Expiry scheduler already running")
            return

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
        if _monitoring_enabled():
            monitoring_hour = _monitoring_hour()
            _scheduler.add_job(
                run_scheduled_monitoring_checks,
                trigger="cron",
                hour=monitoring_hour,
                minute=0,
                id="daily_monitoring_checks",
                replace_existing=True,
                misfire_grace_time=3600,
            )
            logger.info(
                "Monitoring scheduler registered - "
                f"daily at {monitoring_hour:02d}:00 UTC"
            )
        else:
            logger.info("Monitoring scheduler disabled by MONITORING_ENABLED")

        if _periodic_review_enabled():
            periodic_review_hour = _periodic_review_hour()
            _scheduler.add_job(
                create_periodic_review_cases,
                trigger="cron",
                hour=periodic_review_hour,
                minute=0,
                id="periodic_review_cases",
                replace_existing=True,
                misfire_grace_time=3600,
            )
            logger.info(
                "Periodic review scheduler registered - "
                f"daily at {periodic_review_hour:02d}:00 UTC"
            )
        else:
            logger.info(
                "Periodic review scheduler disabled by PERIODIC_REVIEW_ENABLED"
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
