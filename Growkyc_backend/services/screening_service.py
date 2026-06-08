"""
services/screening_service.py
=============================
Enterprise screening service supporting provider failover, immutable
evidence records, and automated compliance alerts.
"""

import logging
from typing import List

from sqlalchemy.orm import Session

from core.tenant_context import get_tenant_id
from models import Alert, Client, ScreeningRecord
from services.providers.equifax_screening import EquifaxScreeningAdapter
from services.providers.screening.adapters import ComplyAdvantageAdapter, SumsubAdapter
from services.providers.screening.base import (
    BaseScreeningProvider,
    NormalizedScreeningResult,
)

logger = logging.getLogger(__name__)


class ProviderFactory:
    """Factory to manage screening providers and failovers."""

    @staticmethod
    def get_providers() -> List[BaseScreeningProvider]:
        # Primary provider first, fallback secondary
        return [SumsubAdapter(), ComplyAdvantageAdapter(), EquifaxScreeningAdapter()]


class ScreeningService:
    """
    Enterprise AML/KYC screening service.
    """

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger
        self.providers = ProviderFactory.get_providers()

    def perform_screening(
        self, client: Client, triggered_by_user_id: int = None
    ) -> ScreeningRecord:
        """
        Screen a client across providers with failover.
        Results are saved immutably. Hits generate Alerts.
        """
        tenant_id = get_tenant_id() or client.tenant_id

        result: NormalizedScreeningResult = None

        # Try providers in order (Failover logic)
        for provider in self.providers:
            try:
                self.logger.info(
                    f"Attempting screening via {provider.provider_name} "
                    f"for Client {client.id}"
                )

                # Check entity vs person
                if client.client_type == "INDIVIDUAL":
                    result = provider.screen_person(
                        full_name=client.name, dob=None, nationality=client.geography
                    )
                else:
                    result = provider.screen_entity(
                        company_name=client.name,
                        registration_number=None,
                        country=client.geography,
                    )

                if result.status != "error":
                    break  # Success

                self.logger.warning(
                    f"Provider {provider.provider_name} failed: "
                    f"{result.error_message}. Failing over..."
                )

            except Exception as e:
                self.logger.error(
                    f"Provider {provider.provider_name} threw exception: {e}. "
                    "Failing over..."
                )
                continue

        if not result or result.status == "error":
            self.logger.error(f"All screening providers failed for Client {client.id}")
            # Save error record
            record = ScreeningRecord(
                client_id=client.id,
                tenant_id=tenant_id,
                screening_type="combined",
                provider_name="ALL_FAILED",
                screening_status="error",
                match_summary="All providers failed or timed out.",
                triggered_by_user_id=triggered_by_user_id,
            )
            self.db.add(record)
            self.db.commit()
            return record

        # 1. Save Immutable Evidence Record
        record = ScreeningRecord(
            client_id=client.id,
            tenant_id=tenant_id,
            screening_type="combined",
            provider_name=result.provider_name,
            provider_reference=result.provider_reference,
            screening_status=result.status,
            confidence_score=result.confidence_score,
            match_summary=result.match_summary,
            raw_response=result.raw_response,
            matched_entities=result.matched_entities,
            triggered_by_user_id=triggered_by_user_id,
        )
        self.db.add(record)

        # Update client live state (for backward compat)
        client.is_pep = result.is_pep
        client.is_sanctioned = result.is_sanctioned

        self.db.commit()
        self.db.refresh(record)

        # 2. Generate Compliance Alerts if Hits Detected
        if result.status == "match_found":
            self._generate_screening_alert(client, record)

        self.logger.info(
            f"Screening completed for Client {client.id}. Status: {result.status}"
        )

        # Trigger risk recalculation (Sprint C)
        try:
            from services.risk_service import recalculate_client_risk

            trigger = "screening_finding"
            if client.is_sanctioned:
                trigger = "sanctions_match"
            elif client.is_pep:
                trigger = "pep_match"

            recalculate_client_risk(client.id, db=self.db, trigger=trigger)
        except Exception as e:
            self.logger.error(
                f"Failed to trigger risk recalculation after screening for Client {client.id}: {e}"
            )

        return record

    def _generate_screening_alert(
        self, client: Client, record: ScreeningRecord
    ) -> None:
        """Generate a compliance workflow alert for screening hits."""
        alert_type = "sanctions_hit" if client.is_sanctioned else "pep_match"
        severity = "critical" if client.is_sanctioned else "high"

        alert = Alert(
            client_id=client.id,
            tenant_id=record.tenant_id,
            alert_type=alert_type,
            severity=severity,
            title=f"Screening Match: {client.name}",
            description=(
                f"Match found via {record.provider_name}. "
                f"Summary: {record.match_summary}"
            ),
            status="open",
            evidence_refs=[{"type": "screening_record", "id": record.id}],
        )
        self.db.add(alert)
        self.db.commit()
        self.logger.warning(f"Generated {alert_type} alert for Client {client.id}")

    # ---- US-024: Equifax Credit Score Mock ----
    def get_equifax_credit_score(self, full_name: str, pan_number: str) -> dict:
        """
        Mock Equifax credit score lookup (US-024).
        """
        self.logger.info(
            f"Equifax credit score request received for PAN: {pan_number[:4]}****"
        )
        try:
            pan_digits = [c for c in pan_number if c.isdigit()]
            base_score = (
                600 + (sum(int(d) for d in pan_digits) * 7 % 250) if pan_digits else 700
            )
            credit_score = max(300, min(900, base_score))

            if credit_score >= 750:
                rating = "EXCELLENT"
                risk_level = "LOW"
            elif credit_score >= 700:
                rating = "GOOD"
                risk_level = "LOW"
            elif credit_score >= 650:
                rating = "FAIR"
                risk_level = "MEDIUM"
            else:
                rating = "HIGH_RISK"
                risk_level = "HIGH"

            self.logger.info(
                f"Equifax mock score generated: {credit_score} ({rating}) "
                f"for PAN {pan_number[:4]}****"
            )
            return {
                "provider": "equifax",
                "credit_score": credit_score,
                "rating": rating,
                "risk_level": risk_level,
            }
        except Exception as e:
            self.logger.error(f"Equifax credit score mock error: {str(e)}")
            raise

    # ---- US-025: AFSA Insolvency Search Mock ----
    def get_afsa_insolvency_search(
        self, full_name: str, registration_number: str
    ) -> dict:
        """
        Mock AFSA insolvency search (US-025).
        """
        self.logger.info(
            "AFSA insolvency search request received for reg: "
            f"{registration_number[:4]}****"
        )
        try:
            reg_sum = sum(ord(c) for c in registration_number)
            bucket = reg_sum % 10  # 0-9 bucket

            if bucket <= 6:
                status = "CLEAR"
                insolvency_found = False
                risk_level = "LOW"
            elif bucket <= 8:
                status = "UNDER_REVIEW"
                insolvency_found = False
                risk_level = "MEDIUM"
            else:
                status = "INSOLVENT"
                insolvency_found = True
                risk_level = "HIGH"

            self.logger.info(
                f"AFSA insolvency result: status={status} "
                f"insolvency_found={insolvency_found} "
                f"for reg {registration_number[:4]}****"
            )
            return {
                "provider": "afsa",
                "entity_name": full_name,
                "insolvency_found": insolvency_found,
                "status": status,
                "risk_level": risk_level,
            }
        except Exception as e:
            self.logger.error(f"AFSA insolvency search mock error: {str(e)}")
            raise
