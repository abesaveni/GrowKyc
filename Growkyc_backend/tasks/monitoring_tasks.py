"""
tasks/monitoring_tasks.py
=========================
Async Celery background task for compliance monitoring checks.
Runs document expiry checks and periodic review triggers out-of-band
so KYC submission latency is not impacted.
"""

import logging

from core.celery_app import celery_app
from database import SessionLocal

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.monitoring.run_monitoring_checks")
def run_monitoring_checks_task(self, tenant_id: int = None, correlation_id: str = None):
    """
    Background task that runs all compliance monitoring mechanisms.
    Triggered after client actions (KYC submit, document upload) rather than
    blocking the request-response cycle.
    """
    logger.info("Starting background monitoring checks")
    db = SessionLocal()
    try:
        from services.monitoring_service import MonitoringService
        result = MonitoringService(db).run_monitoring_checks()
        logger.info(
            "Background monitoring completed: "
            f"{result.get('documents_expired', 0)} docs expired, "
            f"{result.get('reviews_due', 0)} reviews due"
        )
        return result
    except Exception as exc:
        logger.error(f"Background monitoring failed: {exc}", exc_info=True)
        raise self.retry(exc=exc, countdown=60, max_retries=2)
    finally:
        db.close()
