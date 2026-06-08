"""
tasks/case_tasks.py
===================
Async Celery tasks for case management SLAs and auto-escalation.
"""

import logging
from datetime import datetime, timezone

from core.celery_app import celery_app
from database import SessionLocal

logger = logging.getLogger(__name__)


@celery_app.task(name="tasks.cases.check_case_slas")
def check_case_slas():
    """
    Beat task — scans for OPEN cases whose SLA due date has passed.
    Marks them as breached and logs an immutable CaseEvent.
    """
    logger.info("Running case SLA breach check...")
    db = SessionLocal()
    try:
        from core.enums import CaseStatus
        from models import Case, CaseEvent, CaseSLA

        now = datetime.now(timezone.utc)

        # Find open cases with overdue SLA dates not yet marked breached.
        breached_slas = (
            db.query(CaseSLA)
            .join(Case, Case.id == CaseSLA.case_id)
            .filter(
                Case.status == CaseStatus.OPEN,
                CaseSLA.due_date != None,
                CaseSLA.due_date <= now,
                CaseSLA.breached == 0,
            )
            .all()
        )

        for sla in breached_slas:
            sla.breached = 1

            # Append an immutable event
            event = CaseEvent(
                tenant_id=sla.tenant_id,
                case_id=sla.case_id,
                actor_id=None,  # System
                event_type="sla_breached",
                event_details={"priority": sla.priority, "due_date": str(sla.due_date)},
            )
            db.add(event)

        if breached_slas:
            db.commit()
            logger.info(
                f"SLA Breach check: Marked {len(breached_slas)} cases as breached."
            )
        else:
            logger.info("SLA Breach check: No new breaches detected.")

    except Exception as e:
        logger.error(f"SLA Breach check failed: {e}")
        db.rollback()
    finally:
        db.close()


@celery_app.task(name="tasks.cases.auto_escalate_cases")
def auto_escalate_cases():
    """
    Beat task — scans for critical or high-risk cases that have breached SLA
    and automatically moves them to the MLRO queue if they are still in analyst_review.
    """
    logger.info("Running auto-escalation check...")
    db = SessionLocal()
    try:
        from core.enums import CaseStatus
        from models import Case, CaseAssignment, CaseEvent, CaseSLA

        # Find OPEN, breached cases assigned to analysts that are high/critical priority
        escalation_candidates = (
            db.query(CaseAssignment)
            .join(Case, Case.id == CaseAssignment.case_id)
            .join(CaseSLA, Case.id == CaseSLA.case_id)
            .filter(
                Case.status == CaseStatus.OPEN,
                CaseSLA.breached == 1,
                CaseSLA.priority.in_(["high", "critical"]),
                CaseAssignment.queue_name == "analyst_review",
            )
            .all()
        )

        for assignment in escalation_candidates:
            old_queue = assignment.queue_name
            assignment.queue_name = "mlro_review"
            assignment.assigned_to_id = None  # Return to pool
            assignment.updated_at = datetime.now(timezone.utc)

            event = CaseEvent(
                tenant_id=assignment.tenant_id,
                case_id=assignment.case_id,
                actor_id=None,  # System
                event_type="escalated",
                event_details={
                    "reason": "Auto-escalation due to SLA breach",
                    "previous_queue": old_queue,
                },
            )
            db.add(event)

        if escalation_candidates:
            db.commit()
            logger.info(
                f"Auto-escalated {len(escalation_candidates)} cases to MLRO queue."
            )
        else:
            logger.info("Auto-escalation check: No cases required escalation.")

    except Exception as e:
        logger.error(f"Auto-escalation check failed: {e}")
        db.rollback()
    finally:
        db.close()
