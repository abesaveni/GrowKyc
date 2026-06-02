"""
KYC service handling all KYC-related business logic.
Encapsulates KYC submission, approval, rejection, and document management.
"""

import logging
from datetime import datetime, date as _date, time as _time, timezone
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from core.constants import (
    AUDIT_KYC_APPROVED,
    AUDIT_KYC_SUBMITTED,
    ERROR_INVALID_KYC_STATUS,
    ERROR_KYC_NO_IDENTIFIERS,
)
from core.enums import KYCStatus, NotificationType, RiskLevel
from core.exceptions import (
    DatabaseError,
    DuplicateResourceError,
    InvalidStateError,
    ResourceNotFoundError,
    ValidationError,
)
from models import KYC, Client, KYCAuditLog, User, IdentityDocument
from compliance.document_registry import (
    DocumentCategory,
    NormalizedDocumentType,
    LEGACY_DOCUMENT_MAPPING,
)
from core.tenant_context import get_tenant_id
from services.audit_service import AuditService
from services.case_service import CaseService
from services.monitoring_service import MonitoringService
from services.notification_service import NotificationService
from services.monitoring_service import MonitoringService
from services.client_service import ClientService
from schemas import IndividualProfileCreate

logger = logging.getLogger(__name__)


class KYCService:
    """Service for handling KYC operations."""

    def __init__(self, db: Session):
        """Initialize with database session."""
        self.db = db
        self.logger = logging.getLogger(__name__)

    def submit_kyc(
        self,
        user: User,
        aadhaar: Optional[str],
        pan: Optional[str],
        name: str,
        dob: Optional[str] = None,
        gender: Optional[str] = None,
        address: Optional[str] = None,
    ) -> KYC:
        """
        Submit KYC for a user.

        Args:
            user: User instance
            aadhaar: Aadhaar number (optional)
            pan: PAN number (optional)
            name: User's name
            dob: Date of birth (optional)
            gender: Gender (optional)
            address: Address (optional)

        Returns:
            Created KYC instance

        Raises:
            InvalidStateError: If user already has pending KYC
            ValidationError: If validation fails
            DatabaseError: If database operation fails
        """
        try:
            # Check if user has pending KYC
            existing_kyc = (
                self.db.query(KYC)
                .filter(KYC.user_id == user.id, KYC.status == KYCStatus.PENDING)
                .first()
            )

            if existing_kyc:
                self.logger.warning(
                    f"KYC submission attempted by user with existing record: {user.id}"
                )
                raise DuplicateResourceError("KYC", "user_id")

            # Validate at least one identifier is provided
            # NOTE: documents list also satisfies this requirement in future API v2
            if not aadhaar and not pan:
                raise ValidationError(ERROR_KYC_NO_IDENTIFIERS)

            # Normalize DOB: allow `date` inputs from schemas and convert
            # to timezone-aware datetime for storage (minimal change).
            dob_val = dob
            try:
                if isinstance(dob, _date) and not isinstance(dob, datetime):
                    dob_val = datetime.combine(dob, _time.min).replace(
                        tzinfo=timezone.utc
                    )
            except Exception:
                dob_val = dob

            # Create KYC record
            kyc = KYC(
                user_id=user.id,
                aadhaar=aadhaar,
                pan=pan,
                name=name,
                dob=dob_val,
                gender=gender,
                address=address,
                status=KYCStatus.PENDING,
                submitted_at=datetime.utcnow(),
            )

            self.db.add(kyc)
            self.db.commit()
            self.db.refresh(kyc)

            # ── COMPATIBILITY ADAPTER ──────────────────────────────────────────
            # Translate deprecated aadhaar/pan into IdentityDocument records.
            # This makes legacy submissions available in the new generic schema
            # without breaking existing APIs or data.
            self._normalize_legacy_documents(
                kyc=kyc,
                aadhaar=aadhaar,
                pan=pan,
            )
            # ──────────────────────────────────────────────────────────────────

            # Create audit log
            self._create_audit_log(
                kyc_id=kyc.id,
                changed_by=user.id,
                old_status=None,
                new_status=KYCStatus.PENDING,
                change_reason=AUDIT_KYC_SUBMITTED,
            )

            # --- INTEGRATION: CREATE CLIENT VIA CLIENT_SERVICE ---
            tenant_id = get_tenant_id() or kyc.tenant_id or user.tenant_id
            existing_client = self.db.query(Client).filter(Client.user_id == user.id).first()
            if not existing_client and tenant_id is None:
                self.logger.info(
                    "[COMPAT] Skipping ClientService profile sync for KYC %s "
                    "because no tenant context is available",
                    kyc.id,
                )
            elif not existing_client:
                client_service = ClientService(self.db)
                # Map legacy fields to new Enterprise IndividualProfile
                # Note: name split is handled inside ClientService if first_name/last_name are missing,
                # but we will try to split it here.
                name_parts = name.split(" ", 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ""
                
                profile_data = IndividualProfileCreate(
                    first_name=first_name,
                    last_name=last_name,
                    dob=dob_val,
                    gender=gender,
                    national_id_number=aadhaar,
                    tax_file_number=pan,
                    residential_address=address,
                )
                
                # ClientService handles Screening, Risk Scoring, and Alerts
                client_service.create_individual_client(
                    user_id=user.id, 
                    profile_data=profile_data,
                    trigger_async=False
                )
            
            # Integration STEP 6: Execute Monitoring Scrape on Client Action
            try:
                MonitoringService(self.db).run_monitoring_checks()
            except Exception as e:
                self.logger.warning(
                    "Monitoring scrape failed after client creation, "
                    f"non-critical: {str(e)}"
                )

            self.logger.info(f"KYC submitted for user: {user.id}")
            return kyc
        except (InvalidStateError, ValidationError, DuplicateResourceError):
            raise
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"KYC submission error: {str(e)}")
            raise DatabaseError("Failed to submit KYC")

    def get_user_kyc(self, user: User) -> KYC:
        """
        Get KYC record for a user.

        Args:
            user: User instance

        Returns:
            KYC instance

        Raises:
            ResourceNotFoundError: If KYC not found
        """
        kyc = self.db.query(KYC).filter(KYC.user_id == user.id).first()
        if not kyc:
            raise ResourceNotFoundError("KYC", user.id)
        return kyc

    def get_user_kyc_by_user_id(self, user_id: int) -> KYC:
        """
        Get KYC record for a user by user ID.

        Args:
            user_id: User ID

        Returns:
            KYC instance

        Raises:
            ResourceNotFoundError: If KYC not found
        """
        kyc = self.db.query(KYC).filter(KYC.user_id == user_id).first()
        if not kyc:
            raise ResourceNotFoundError("KYC", user_id)
        return kyc

    def get_kyc_by_id(self, kyc_id: int) -> KYC:
        """
        Get KYC by ID.

        Args:
            kyc_id: KYC ID

        Returns:
            KYC instance

        Raises:
            ResourceNotFoundError: If KYC not found
        """
        kyc = self.db.query(KYC).filter(KYC.id == kyc_id).first()
        if not kyc:
            raise ResourceNotFoundError("KYC", kyc_id)
        return kyc

    def list_kyc_records(self, skip: int = 0, limit: int = 10) -> Tuple[List[KYC], int]:
        """
        List all KYC records with pagination.

        Args:
            skip: Number of records to skip
            limit: Number of records to return

        Returns:
            Tuple of (KYC list, total count)
        """
        try:
            total = self.db.query(KYC).count()
            records = (
                self.db.query(KYC)
                .order_by(KYC.submitted_at.desc())
                .offset(skip)
                .limit(limit)
                .all()
            )
            return records, total
        except Exception as e:
            self.logger.error(f"Error listing KYC records: {str(e)}")
            raise DatabaseError("Failed to list KYC records")

    def list_pending_kyc(self, skip: int = 0, limit: int = 20) -> Tuple[List[KYC], int]:
        """
        List pending KYC records for review.

        Args:
            skip: Number of records to skip
            limit: Number of records to return

        Returns:
            Tuple of (pending KYC list, total count)
        """
        try:
            total = self.db.query(KYC).filter(KYC.status == KYCStatus.PENDING).count()
            records = (
                self.db.query(KYC)
                .filter(KYC.status == KYCStatus.PENDING)
                .order_by(KYC.submitted_at.asc())
                .offset(skip)
                .limit(limit)
                .all()
            )
            return records, total
        except Exception as e:
            self.logger.error(f"Error listing pending KYC: {str(e)}")
            raise DatabaseError("Failed to list pending KYC")

    def approve_kyc(
        self, kyc: KYC, admin_user: User, reason: Optional[str] = None
    ) -> KYC:
        """
        Approve a KYC record.

        Args:
            kyc: KYC instance to approve
            admin_user: Admin/Agent user approving
            reason: Optional approval reason

        Returns:
            Updated KYC instance

        Raises:
            InvalidStateError: If KYC is not in Pending status
            DatabaseError: If operation fails
        """
        try:
            if kyc.status != KYCStatus.PENDING:
                raise InvalidStateError(
                    f"{ERROR_INVALID_KYC_STATUS}: {kyc.status.value}"
                )

            # Update KYC
            old_status = kyc.status
            kyc.status = KYCStatus.APPROVED
            kyc.approved_at = datetime.utcnow()

            self.db.commit()
            self.db.refresh(kyc)

            # Create audit log
            self._create_audit_log(
                kyc_id=kyc.id,
                changed_by=admin_user.id,
                old_status=old_status,
                new_status=KYCStatus.APPROVED,
                change_reason=reason or AUDIT_KYC_APPROVED,
            )

            self.logger.info(f"KYC {kyc.id} approved by admin {admin_user.id}")
            return kyc
        except InvalidStateError:
            raise
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error approving KYC: {str(e)}")
            raise DatabaseError("Failed to approve KYC")

    def reject_kyc(self, kyc: KYC, admin_user: User, reason: str) -> KYC:
        """
        Reject a KYC record.

        Args:
            kyc: KYC instance to reject
            admin_user: Admin/Agent user rejecting
            reason: Rejection reason

        Returns:
            Updated KYC instance

        Raises:
            InvalidStateError: If KYC is not in Pending status
            DatabaseError: If operation fails
        """
        try:
            if kyc.status != KYCStatus.PENDING:
                raise InvalidStateError(
                    f"{ERROR_INVALID_KYC_STATUS}: {kyc.status.value}"
                )

            # Update KYC
            old_status = kyc.status
            kyc.status = KYCStatus.REJECTED
            kyc.rejected_at = datetime.utcnow()
            kyc.rejection_reason = reason

            self.db.commit()
            self.db.refresh(kyc)

            # Create audit log
            self._create_audit_log(
                kyc_id=kyc.id,
                changed_by=admin_user.id,
                old_status=old_status,
                new_status=KYCStatus.REJECTED,
                change_reason=reason,
            )

            self.logger.info(f"KYC {kyc.id} rejected by admin {admin_user.id}")
            return kyc
        except InvalidStateError:
            raise
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error rejecting KYC: {str(e)}")
            raise DatabaseError("Failed to reject KYC")

    def bulk_approve_kyc(
        self,
        kyc_ids: List[int],
        admin_user: User,
        reason: Optional[str] = None,
    ) -> dict:
        """
        Approve multiple KYC records in bulk.

        Args:
            kyc_ids: List of KYC IDs to approve
            admin_user: Admin/Agent user approving
            reason: Optional approval reason

        Returns:
            Dict with success/failure counts and failed IDs
        """
        success_count = 0
        failed_ids = []

        try:
            for kyc_id in kyc_ids:
                try:
                    kyc = self.get_kyc_by_id(kyc_id)
                    self.approve_kyc(kyc, admin_user, reason)
                    success_count += 1
                except Exception as e:
                    self.logger.warning(f"Failed to approve KYC {kyc_id}: {str(e)}")
                    failed_ids.append(kyc_id)

            return {
                "success_count": success_count,
                "failed_count": len(failed_ids),
                "failed_ids": failed_ids,
            }
        except Exception as e:
            self.logger.error(f"Error in bulk approval: {str(e)}")
            raise DatabaseError("Bulk approval operation failed")

    def get_kyc_audit_log(self, kyc: KYC) -> List[KYCAuditLog]:
        """
        Get audit log for a KYC record.

        Args:
            kyc: KYC instance

        Returns:
            List of audit log entries
        """
        try:
            return (
                self.db.query(KYCAuditLog)
                .filter(KYCAuditLog.kyc_id == kyc.id)
                .order_by(KYCAuditLog.changed_at.desc())
                .all()
            )
        except Exception as e:
            self.logger.error(f"Error fetching audit log: {str(e)}")
            return []

    def _create_audit_log(
        self,
        kyc_id: int,
        changed_by: int,
        old_status,
        new_status,
        change_reason: str,
    ) -> KYCAuditLog:
        """
        Create audit log entry (private method).

        Args:
            kyc_id: KYC ID
            changed_by: User ID who made change
            old_status: Previous status
            new_status: New status
            change_reason: Reason for change

        Returns:
            Created audit log entry
        """
        try:
            audit_log = KYCAuditLog(
                kyc_id=kyc_id,
                changed_by=changed_by,
                old_status=old_status,
                new_status=new_status,
                change_reason=change_reason,
                changed_at=datetime.utcnow(),
            )
            self.db.add(audit_log)
            self.db.commit()
            return audit_log
        except Exception as e:
            self.logger.error(f"Error creating audit log: {str(e)}")
            # Don't raise here - audit log failure shouldn't block main
            # operation
            return None

    def _normalize_legacy_documents(
        self,
        kyc: KYC,
        aadhaar: Optional[str],
        pan: Optional[str],
    ) -> None:
        """
        Compatibility Adapter: Translate deprecated Aadhaar/PAN fields into
        normalised IdentityDocument records.

        This allows:
        - Existing APIs to keep submitting legacy fields unchanged.
        - New workflows to consume the generic IdentityDocument model.
        - Historical data to remain available under the new architecture.

        [DEPRECATED] This method will be removed once all consumers migrate
        to submitting `documents: List[IdentityDocumentCreate]` directly.
        """
        try:
            tenant_id = get_tenant_id() or kyc.tenant_id
            if tenant_id is None:
                self.logger.info(
                    "[COMPAT] Skipping IdentityDocument normalization for KYC %s "
                    "because no tenant context is available",
                    kyc.id,
                )
                return

            # Resolve client_id from the KYC record's user
            client = self.db.query(Client).filter(Client.user_id == kyc.user_id).first()
            client_id = client.id if client else None

            docs_to_create = []

            if aadhaar:
                cat, norm_type, country = LEGACY_DOCUMENT_MAPPING["aadhaar"]
                docs_to_create.append(
                    IdentityDocument(
                        tenant_id=tenant_id,
                        client_id=client_id,
                        kyc_id=kyc.id,
                        country_code=country,
                        document_category=cat.value,
                        document_type=norm_type.value,
                        document_number=aadhaar,
                        issuing_authority="UIDAI",
                        metadata_json={"source": "legacy_aadhaar_field", "schema_version": "1.0.0"},
                    )
                )

            if pan:
                cat, norm_type, country = LEGACY_DOCUMENT_MAPPING["pan"]
                docs_to_create.append(
                    IdentityDocument(
                        tenant_id=tenant_id,
                        client_id=client_id,
                        kyc_id=kyc.id,
                        country_code=country,
                        document_category=cat.value,
                        document_type=norm_type.value,
                        document_number=pan,
                        issuing_authority="Income Tax Department",
                        metadata_json={"source": "legacy_pan_field", "schema_version": "1.0.0"},
                    )
                )

            for doc in docs_to_create:
                self.db.add(doc)

            if docs_to_create:
                self.db.commit()
                self.logger.info(
                    f"[COMPAT] Normalized {len(docs_to_create)} legacy field(s) "
                    f"into IdentityDocument for KYC {kyc.id}"
                )
        except Exception as e:
            # Non-fatal — legacy fields still exist on KYC record for fallback.
            self.db.rollback()
            self.logger.error(f"[COMPAT] Failed to normalize legacy documents for KYC {kyc.id}: {e}")
