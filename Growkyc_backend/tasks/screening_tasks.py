"""
tasks/screening_tasks.py
========================
Async Celery background tasks for screening and AML processing.
Uses TenantAwareTask to automatically restore contextvars.
"""

import logging
from core.celery_app import celery_app
from database import SessionLocal
from models import Client
from services.screening_service import ScreeningService
from services.risk_service import RiskService

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.screening.run_async_screening")
def run_async_screening(self, client_id: int, user_id: int = None, tenant_id: int = None, correlation_id: str = None):
    """
    Background task to execute full AML screening and risk scoring.
    """
    logger.info(f"Starting async screening for client_id={client_id} [req_id={correlation_id}]")
    
    # DB Session
    db = SessionLocal()
    try:
        client = db.query(Client).filter(Client.id == client_id).first()
        if not client:
            logger.error(f"Client {client_id} not found for screening")
            return
            
        # 1. Run Screening
        screening_service = ScreeningService(db)
        screening_service.perform_screening(client, triggered_by_user_id=user_id)
        
        # 2. Run Risk Assessment
        risk_service = RiskService(db)
        risk_service.calculate_risk(client, user_id=user_id, trigger="async_screening")
        
        logger.info(f"Async screening completed successfully for client_id={client_id}")
        return {"status": "success", "client_id": client_id}
        
    except Exception as e:
        logger.error(f"Async screening failed for client_id={client_id}: {e}")
        self.retry(exc=e, countdown=60, max_retries=3)
    finally:
        db.close()
