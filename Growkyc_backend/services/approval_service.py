"""
Approval service handling multi-level client approval and locking.
"""

import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from core.enums import NotificationType, RiskLevel, UserRole
from core.exceptions import AuthorizationError, InvalidStateError
from models import Approval, Case, Client, OverrideReason, ReviewApproval, User
from services.audit_service import AuditService
from services.notification_service import NotificationService

logger = logging.getLogger(__name__)


class ApprovalService:
    """Service for managing multi-level approvals for clients/cases."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)

    def process_approval(
        self,
        client_id: int,
        case_id: int,
        approver: User,
        status: str = "Approved",
    ) -> Approval:
        """
        Record an approval decision for a client's case by an authorized approver.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        case = self.db.query(Case).filter(Case.id == case_id).first()

        if not client or not case:
            raise InvalidStateError("Client or Case not found")

        if client.is_locked:
            raise InvalidStateError("Client is already locked and fully approved.")

        approver_role = str(
            approver.role.value if hasattr(approver.role, "value") else approver.role
        )

        # Get existing approvals to check hierarchy state
        existing_approvals = (
            self.db.query(Approval)
            .filter(
                Approval.client_id == client.id,
                Approval.case_id == case.id,
                Approval.status == "Approved",
            )
            .all()
        )
        roles_approved = set([app.role for app in existing_approvals])

        # Enforce Hierarchical Verification Ordering BRD System:
        # Analyst -> Compliance Officer -> MLRO -> Partner
        if (
            approver_role == UserRole.COMPLIANCE_OFFICER.value
            and UserRole.ANALYST.value not in roles_approved
        ):
            raise InvalidStateError(
                "Analyst approval must be completed before Compliance Officer."
            )
        if (
            approver_role == UserRole.MLRO.value
            and UserRole.COMPLIANCE_OFFICER.value not in roles_approved
        ):
            raise InvalidStateError(
                "Compliance Officer approval must be completed before MLRO."
            )
        if (
            approver_role == UserRole.PARTNER.value
            and UserRole.MLRO.value not in roles_approved
        ):
            raise InvalidStateError("MLRO approval must be completed before Partner.")

        # Determine rights based on risk level
        if client.risk_level == RiskLevel.LOW and approver_role not in [
            UserRole.ANALYST.value,
            UserRole.ADMIN.value,
        ]:
            raise AuthorizationError(
                "Only Analysts or Admins can approve LOW risk clients."
            )
        if client.risk_level == RiskLevel.MEDIUM and approver_role not in [
            UserRole.ANALYST.value,
            UserRole.COMPLIANCE_OFFICER.value,
            UserRole.ADMIN.value,
        ]:
            raise AuthorizationError(
                "Only Analysts or Compliance Officers can approve MEDIUM risk clients."
            )
        if client.risk_level == RiskLevel.HIGH and approver_role not in [
            UserRole.ANALYST.value,
            UserRole.COMPLIANCE_OFFICER.value,
            UserRole.MLRO.value,
            UserRole.PARTNER.value,
            UserRole.ADMIN.value,
        ]:
            raise AuthorizationError(
                "Requires full hierarchical chain to approve HIGH risk cases."
            )

        # Create approval record
        approval = Approval(
            client_id=client.id,
            case_id=case.id,
            approved_by=approver.id,
            role=approver_role,
            status=status,
            timestamp=datetime.now(timezone.utc),
        )
        self.db.add(approval)
        self.db.commit()
        self.db.refresh(approval)

        # --- AUDIT TRAIL RECORDING ---
        audit_service = AuditService(self.db)
        audit_service.log_event(
            actor_id=approver.id,
            action="APPROVE" if status == "Approved" else "REJECT",
            entity_type="approval",
            entity_id=approval.id,
            after_data={
                "client_id": client.id,
                "case_id": case.id,
                "role": approver_role,
            },
        )
        # -----------------------------

        # --- INTEGRATION: TRIGGER NOTIFICATION ---
        notif_service = NotificationService(self.db)
        notif_service.create_notification(
            user_id=client.user_id,
            title="Approval Update",
            message=f"Your case has received a {status} from a {approver_role}.",
            notif_type=(
                NotificationType.KYC_VERIFIED
                if status == "Approved"
                else NotificationType.SYSTEM_ALERT
            ),
        )
        # -----------------------------------------

        self._check_and_lock_client(client, case, notif_service)

        return approval

    def validate_separation_of_duties(self, case: Case, reviewer_id: int) -> None:
        """
        Prevent the submitting client user from approving their own case.
        """
        if case and case.client and case.client.user_id == reviewer_id:
            self.logger.warning(
                f"SoD violation: User {reviewer_id} attempted to approve Case {case.id}"
            )
            raise AuthorizationError(
                "Separation of duties violation: reviewer cannot approve "
                "own submission."
            )

    def create_review_approval(
        self,
        case_id: int,
        reviewer: User,
        reviewer_role: str,
        decision: str,
        comments: str = None,
    ) -> ReviewApproval:
        """
        Record a Sprint 3 governance review approval step.
        """
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise InvalidStateError("Case not found")

        self.validate_separation_of_duties(case, reviewer.id)

        allowed_roles = [
            UserRole.ANALYST.value,
            UserRole.COMPLIANCE_OFFICER.value,
            UserRole.MLRO.value,
        ]
        if reviewer_role not in allowed_roles:
            raise AuthorizationError(
                "Reviewer role is not permitted for governance approval."
            )

        existing_approvals = (
            self.db.query(ReviewApproval)
            .filter(
                ReviewApproval.case_id == case.id,
                ReviewApproval.decision == "Approved",
            )
            .all()
        )
        roles_approved = set(
            [approval.reviewer_role for approval in existing_approvals]
        )

        if (
            reviewer_role == UserRole.COMPLIANCE_OFFICER.value
            and UserRole.ANALYST.value not in roles_approved
        ):
            raise InvalidStateError(
                "Analyst approval must be completed before Compliance Officer."
            )
        if (
            reviewer_role == UserRole.MLRO.value
            and UserRole.COMPLIANCE_OFFICER.value not in roles_approved
        ):
            raise InvalidStateError(
                "Compliance Officer approval must be completed before MLRO."
            )

        approval = ReviewApproval(
            case_id=case.id,
            reviewer_id=reviewer.id,
            reviewer_role=reviewer_role,
            decision=decision,
            comments=comments,
        )
        self.db.add(approval)
        self.db.commit()
        self.db.refresh(approval)

        self.logger.info(
            f"Governance approval {approval.id} recorded for Case "
            f"{case.id} by User {reviewer.id}"
        )
        return approval

    def create_override_reason(
        self,
        case_id: int,
        reviewer: User,
        original_decision: str,
        override_decision: str,
        reason_code: str,
        comments: str = None,
    ) -> OverrideReason:
        """
        Record a Sprint 3 override reason and audit it automatically.
        """
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise InvalidStateError("Case not found")

        override_reason = OverrideReason(
            case_id=case.id,
            reviewer_id=reviewer.id,
            original_decision=original_decision,
            override_decision=override_decision,
            reason_code=reason_code,
            comments=comments,
        )
        self.db.add(override_reason)
        self.db.commit()
        self.db.refresh(override_reason)

        self.logger.info(
            f"Override reason {override_reason.id} recorded for Case "
            f"{case.id} by User {reviewer.id}"
        )

        audit_service = AuditService(self.db)
        audit_service.log_event(
            actor_id=reviewer.id,
            action="OVERRIDE",
            entity_type="override_reason",
            entity_id=override_reason.id,
            before_data={"case_id": case.id, "decision": original_decision},
            after_data={
                "case_id": case.id,
                "decision": override_decision,
                "reason_code": reason_code,
            },
        )

        return override_reason

    def _check_and_lock_client(
        self, client: Client, case: Case, notif_service: NotificationService
    ):
        """
        Check if the required number/type of approvals have been met logic.
        """
        approvals = (
            self.db.query(Approval)
            .filter(
                Approval.client_id == client.id,
                Approval.case_id == case.id,
                Approval.status == "Approved",
            )
            .all()
        )

        roles_approved = set([app.role for app in approvals])

        is_fully_approved = False
        if (
            client.risk_level == RiskLevel.LOW
            and UserRole.ANALYST.value in roles_approved
        ):
            is_fully_approved = True
        elif client.risk_level == RiskLevel.MEDIUM and (
            UserRole.ANALYST.value in roles_approved
            and UserRole.COMPLIANCE_OFFICER.value in roles_approved
        ):
            is_fully_approved = True
        elif client.risk_level == RiskLevel.HIGH and (
            UserRole.ANALYST.value in roles_approved
            and UserRole.COMPLIANCE_OFFICER.value in roles_approved
            and UserRole.MLRO.value in roles_approved
            and UserRole.PARTNER.value in roles_approved
        ):
            is_fully_approved = True

        if is_fully_approved:
            client.is_locked = True
            self.db.commit()

            # --- AUDIT FULL APPROVAL ---
            audit_service = AuditService(self.db)
            audit_service.log_event(
                actor_id=None,
                action="FULL_APPROVAL_LOCKED",
                entity_type="client",
                entity_id=client.id,
                before_data={"is_locked": False},
                after_data={"is_locked": True},
            )
            # ---------------------------

            self.logger.info(f"Client {client.id} is now locked and fully approved.")

            # Additional Notification for Full Approval
            notif_service.create_notification(
                user_id=client.user_id,
                title="Client Fully Approved",
                message=(
                    "Congratulations! Your profile has been fully approved "
                    "by all requisite compliance tiers."
                ),
                notif_type=NotificationType.KYC_APPROVED,
            )
