import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from core.enums import NotificationType
from models import Client, Document
from services.notification_service import NotificationService

logger = logging.getLogger(__name__)


class MonitoringService:
    """Service to handle ongoing monitoring, expiry checks, and periodic reviews."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def check_document_expirations(self):
        """Finds any assigned documents that have expired and triggers alerts."""
        now = datetime.now(timezone.utc)
        # BRD: Optimal bounds constraint -> Check docs that have expired or are
        # expiring within 30 days.
        window_end = now + timedelta(days=30)
        expired_docs = (
            self.db.query(Document)
            .filter(
                Document.expiry_date.isnot(None),
                Document.expiry_date <= window_end,
            )
            .all()
        )

        notif_service = NotificationService(self.db)
        for doc in expired_docs:
            if doc.client_id:
                client = (
                    self.db.query(Client).filter(Client.id == doc.client_id).first()
                )
                if client:
                    notif_service.create_notification(
                        user_id=client.user_id,
                        title="Document Expired",
                        message=(
                            f"Your {doc.type} document has expired. "
                            "Please re-upload."
                        ),
                        notif_type=NotificationType.SYSTEM_ALERT,
                    )

        self.logger.info(
            f"Monitoring check: Processed {len(expired_docs)} expired documents."
        )
        return len(expired_docs)

    def trigger_periodic_review(self):
        """Scan for clients due for review and flag them."""
        now = datetime.now(timezone.utc)
        due_clients = (
            self.db.query(Client)
            .filter(Client.review_date.isnot(None), Client.review_date <= now)
            .all()
        )

        notif_service = NotificationService(self.db)
        for client in due_clients:
            client.is_locked = False  # Unlock to force re-verification maybe
            notif_service.create_notification(
                user_id=client.user_id,
                title="Compliance Review Due",
                message="Your profile is due for a periodic compliance review.",
                notif_type=NotificationType.SYSTEM_ALERT,
            )
        self.db.commit()

        self.logger.info(f"Monitoring check: Processed {len(due_clients)} due clients.")
        return len(due_clients)

    def run_monitoring_checks(self):
        """
        Manually trigger all compliance monitoring mechanisms safely inline.
        This provides a cron-free approach triggered dynamically via user actions.
        """
        doc_count = self.check_document_expirations()
        review_count = self.trigger_periodic_review()

        self.logger.info(
            "Manual Monitoring Execution Finished: "
            f"{doc_count} Docs Expired, {review_count} Reviews Due."
        )
        return {"documents_expired": doc_count, "reviews_due": review_count}
