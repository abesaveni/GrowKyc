"""
services/risk_service.py
========================
Enterprise Risk Scoring Service.
Handles immutable risk assessments and triggers live state updates.
"""

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from core.enums import RiskLevel
from core.exceptions import DatabaseError
from core.tenant_context import get_tenant_id
from models import Client, RiskAssessment
from services.risk.engine import RiskEngine

logger = logging.getLogger(__name__)


class RiskService:
    """Service for calculating and managing client risk immutably."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)

    def calculate_risk(
        self, client: Client, user_id: int = None, trigger: str = "system"
    ) -> RiskAssessment:
        """
        Calculate risk score using the dynamic RiskEngine, persist the
        immutable RiskAssessment, and update the Client's live risk state.
        """
        tenant_id = get_tenant_id() or client.tenant_id

        # 1. Execute granular scoring
        score, inherent_risk, residual_risk, factors = RiskEngine.calculate_risk(client)

        # Determine review due date based on risk (High = 1 year, Low = 3 years)
        review_years = (
            1 if residual_risk == "HIGH" else (2 if residual_risk == "MEDIUM" else 3)
        )
        review_due_date = datetime.now(timezone.utc) + timedelta(
            days=365 * review_years
        )

        # 2. Create Immutable Audit Record
        assessment = RiskAssessment(
            client_id=client.id,
            tenant_id=tenant_id,
            inherent_risk=inherent_risk,
            residual_risk=residual_risk,
            calculated_score=score,
            final_risk_level=residual_risk,
            risk_factors=factors,
            scoring_explanation="System-calculated based on dynamic AML rules engine.",
            review_due_date=review_due_date,
            assessment_trigger=trigger,
            assessed_by_user_id=user_id,
        )

        # 3. Update Live Client State (for backward compatibility and active queries)
        client.risk_score = score
        try:
            client.risk_level = RiskLevel(residual_risk.upper())
        except ValueError:
            client.risk_level = (
                RiskLevel.HIGH if residual_risk == "CRITICAL" else RiskLevel.LOW
            )

        try:
            self.db.add(assessment)
            self.db.add(client)
            self.db.commit()
            self.db.refresh(assessment)

            self.logger.info(
                f"Risk assessment created for Client {client.id}: "
                f"Score={score}, Level={residual_risk}, Trigger={trigger}"
            )
            return assessment
        except Exception as e:
            self.db.rollback()
            self.logger.error(
                f"Error saving risk assessment for Client {client.id}: {str(e)}"
            )
            raise DatabaseError("Failed to persist risk assessment") from e


def recalculate_client_risk(
    client_id: int, db: Session = None, trigger: str = "recalculation"
) -> RiskAssessment:
    """
    Helper function to recalculate a client's risk score and level.
    It retrieves the client, calls the existing RiskService.calculate_risk,
    and handles logging (started, completed, failed).
    """
    logger.info(f"Risk recalculation started for Client {client_id}")

    close_db = False
    if db is None:
        from database import SessionLocal
        db = SessionLocal()
        close_db = True

    try:
        client = db.query(Client).filter(Client.id == client_id).first()
        if not client:
            err_msg = f"Client {client_id} not found"
            logger.error(f"Risk recalculation failed: {err_msg}")
            return None

        risk_service = RiskService(db)
        assessment = risk_service.calculate_risk(client, trigger=trigger)

        logger.info(
            f"Risk recalculation completed for Client {client_id}: "
            f"Score={client.risk_score}, Level={client.risk_level.value if hasattr(client.risk_level, 'value') else client.risk_level}"
        )
        return assessment
    except Exception as e:
        logger.error(f"Risk recalculation failed for Client {client_id}: {str(e)}")
        if close_db:
            db.rollback()
        raise e
    finally:
        if close_db:
            db.close()

