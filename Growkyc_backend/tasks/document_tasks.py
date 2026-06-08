"""
tasks/document_tasks.py
=======================
Async Celery tasks for document OCR processing and expiry monitoring.
"""

import logging
from datetime import datetime, timedelta, timezone

from core.celery_app import celery_app
from database import SessionLocal

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.documents.process_document_intelligence")
def process_document_intelligence_async(
    self, document_id: int, correlation_id: str = None
):
    """
    Multi-stage async pipeline for Document Intelligence.
    1. Extracts OCR
    2. Performs Fraud Check
    3. Triggers Escalations
    """
    logger.info(f"Starting Document Intelligence Pipeline for document {document_id}")
    db = SessionLocal()
    try:
        import uuid

        from services.document_intelligence_service import DocumentIntelligenceService

        service = DocumentIntelligenceService(db)
        corr_id = correlation_id or str(uuid.uuid4())

        # Stage 1: Extraction
        logger.info(f"Stage 1: Extraction for {document_id}")
        service.extract_and_parse(document_id, corr_id)

        # Stage 2: Fraud Check (which autoscales Risk/EDD)
        logger.info(f"Stage 2: Fraud Check for {document_id}")
        service.analyze_fraud(document_id, corr_id)

        logger.info(f"Document Intelligence Pipeline completed for {document_id}")
    except Exception as e:
        logger.error(f"Document Intelligence Pipeline failed for {document_id}: {e}")
        self.retry(exc=e, countdown=60, max_retries=3)
    finally:
        db.close()


@celery_app.task(name="tasks.documents.check_expiry")
def check_document_expiry():
    """
    Beat task — scans for documents expiring in the next 30 days and
    generates compliance notifications.
    """
    logger.info("Running document expiry check...")
    db = SessionLocal()
    try:
        from models import Document
        from services.notification_service import NotificationService

        now = datetime.now(timezone.utc)
        threshold = now + timedelta(days=30)

        expiring = (
            db.query(Document)
            .filter(
                Document.expiry_date != None,
                Document.expiry_date <= threshold,
                Document.expiry_date >= now,
            )
            .all()
        )

        notif_service = NotificationService(db)
        for doc in expiring:
            days_left = (doc.expiry_date.replace(tzinfo=timezone.utc) - now).days
            if doc.uploaded_by:
                notif_service.create_notification(
                    user_id=doc.uploaded_by,
                    title=f"Document Expiring in {days_left} days",
                    message=(
                        f"Document '{doc.file_name}' (ID: {doc.id}) expires "
                        f"on {doc.expiry_date.date()}. Please upload a "
                        "renewed document."
                    ),
                    notif_type="SYSTEM_ALERT",
                )

        logger.info(f"Expiry check: {len(expiring)} documents flagged.")
    finally:
        db.close()
