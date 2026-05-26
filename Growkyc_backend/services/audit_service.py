import json
import logging
from typing import Optional

from sqlalchemy.orm import Session

from models import AuditLog

logger = logging.getLogger(__name__)


class AuditService:
    """Service handling immutable compliance audit trails."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def log_event(
        self,
        actor_id: int,
        action: str,
        entity_type: str,
        entity_id: int,
        before_data: dict = None,
        after_data: dict = None,
        # ---- Phase 11: Country-aware audit metadata ----
        country_code: Optional[str] = None,
        policy_version: Optional[str] = None,
        validation_version: Optional[str] = None,
        provider_version: Optional[str] = None,
    ) -> AuditLog:
        """
        Record a business-critical action into the compliance audit log.

        Country-aware fields (all optional for backward compatibility):
            country_code: ISO-2 code of the governing policy.
            policy_version: Version of the CountryPolicy applied.
            validation_version: Version of the validator used.
            provider_version: Version of the verification provider.
        """
        try:
            # Merge country metadata into after_data for storage
            # (AuditLog schema stays unchanged — no migration needed)
            enriched_after = dict(after_data or {})
            if country_code:
                enriched_after["_policy_country"] = country_code
            if policy_version:
                enriched_after["_policy_version"] = policy_version
            if validation_version:
                enriched_after["_validation_version"] = validation_version
            if provider_version:
                enriched_after["_provider_version"] = provider_version

            log_entry = AuditLog(
                actor_id=actor_id,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id,
                before_data=json.dumps(before_data) if before_data else None,
                after_data=json.dumps(enriched_after) if enriched_after else None,
            )
            self.db.add(log_entry)
            self.db.commit()
            self.db.refresh(log_entry)

            self.logger.info(
                f"AUDIT TRAIL: {action} on {entity_type} {entity_id} "
                f"by User {actor_id} [country={country_code}, policy={policy_version}]"
            )
            return log_entry
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Failed to write audit log: {str(e)}")
            raise

    def log_compliance_decision(
        self,
        actor_id: int,
        action: str,
        entity_type: str,
        entity_id: int,
        country_code: str,
        policy_version: str,
        regulator_reference: str,
        decision_data: dict = None,
    ) -> AuditLog:
        """
        Convenience method for rich country-aware compliance decisions.
        Always stores the regulator reference for defensibility.
        """
        after_data = dict(decision_data or {})
        after_data["_regulator_reference"] = regulator_reference

        return self.log_event(
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            after_data=after_data,
            country_code=country_code,
            policy_version=policy_version,
        )
