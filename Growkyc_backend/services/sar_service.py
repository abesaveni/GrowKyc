"""
services/sar_service.py
=======================
Business logic for Suspicious Activity Reports (SAR).
All SAR operations are logged to the audit trail.
"""

import logging
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session

from core.exceptions import DatabaseError, InvalidStateError, ResourceNotFoundError
from models.sar import SAR

logger = logging.getLogger(__name__)


class SARService:
    def __init__(self, db: Session):
        self.db = db

    def create_sar(
        self,
        client_id: int,
        raised_by: int,
        reason_for_suspicion: str,
        kyc_id: Optional[int] = None,
        case_id: Optional[int] = None,
        tenant_id: Optional[int] = None,
        transaction_details: Optional[str] = None,
        narrative: Optional[str] = None,
    ) -> SAR:
        try:
            sar = SAR(
                client_id=client_id,
                kyc_id=kyc_id,
                case_id=case_id,
                tenant_id=tenant_id,
                raised_by=raised_by,
                status="draft",
                reason_for_suspicion=reason_for_suspicion,
                transaction_details=transaction_details,
                narrative=narrative,
            )
            self.db.add(sar)
            self.db.commit()
            self.db.refresh(sar)
            logger.info(f"SAR {sar.id} created for client {client_id} by user {raised_by}")
            return sar
        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to create SAR: {e}")
            raise DatabaseError("Failed to create SAR")

    def submit_for_review(self, sar_id: int, reviewer_id: int) -> SAR:
        sar = self._get_or_raise(sar_id)
        if sar.status != "draft":
            raise InvalidStateError(f"SAR {sar_id} is not in draft status")
        sar.status = "under_review"
        sar.reviewed_by = reviewer_id
        sar.reviewed_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(sar)
        return sar

    def file_sar(self, sar_id: int, filed_by: int, regulator_reference: Optional[str] = None) -> SAR:
        sar = self._get_or_raise(sar_id)
        if sar.status != "under_review":
            raise InvalidStateError(f"SAR {sar_id} must be under_review before filing")
        sar.status = "filed"
        sar.filed_by = filed_by
        sar.filed_at = datetime.now(timezone.utc)
        if regulator_reference:
            sar.regulator_reference = regulator_reference
        self.db.commit()
        self.db.refresh(sar)
        logger.info(f"SAR {sar_id} filed by user {filed_by}, ref={regulator_reference}")
        return sar

    def decline_sar(self, sar_id: int, declined_by: int, reason: str) -> SAR:
        sar = self._get_or_raise(sar_id)
        if sar.status not in ("draft", "under_review"):
            raise InvalidStateError(f"SAR {sar_id} cannot be declined from status {sar.status}")
        sar.status = "declined"
        sar.declined_at = datetime.now(timezone.utc)
        sar.decline_reason = reason
        self.db.commit()
        self.db.refresh(sar)
        return sar

    def list_sars(
        self,
        client_id: Optional[int] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[SAR], int]:
        query = self.db.query(SAR).filter(SAR.deleted_at.is_(None))
        if client_id:
            query = query.filter(SAR.client_id == client_id)
        if status:
            query = query.filter(SAR.status == status)
        total = query.count()
        records = query.order_by(SAR.raised_at.desc()).offset(skip).limit(limit).all()
        return records, total

    def get_sar(self, sar_id: int) -> SAR:
        return self._get_or_raise(sar_id)

    def _get_or_raise(self, sar_id: int) -> SAR:
        sar = self.db.query(SAR).filter(SAR.id == sar_id, SAR.deleted_at.is_(None)).first()
        if not sar:
            raise ResourceNotFoundError("SAR", sar_id)
        return sar
