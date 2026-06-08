"""
services/providers/screening/adapters.py
========================================
Adapter implementations for various AML screening providers.
"""

import logging
from typing import Optional

from services.providers.screening.base import (BaseScreeningProvider,
                                               NormalizedScreeningResult)

logger = logging.getLogger(__name__)


class ComplyAdvantageAdapter(BaseScreeningProvider):
    """Mock adapter for ComplyAdvantage."""

    @property
    def provider_name(self) -> str:
        return "ComplyAdvantage"

    def screen_person(
        self, full_name: str, dob: Optional[str], nationality: Optional[str]
    ) -> NormalizedScreeningResult:
        logger.info(f"Screening person via {self.provider_name}: {full_name}")

        # Simulate logic
        is_pep = "pep" in full_name.lower()
        is_sanctioned = "sanction" in full_name.lower()

        status = "match_found" if is_pep or is_sanctioned else "clear"

        return NormalizedScreeningResult(
            provider_name=self.provider_name,
            provider_reference=f"CA-PER-{abs(hash(full_name))}",
            status=status,
            is_pep=is_pep,
            is_sanctioned=is_sanctioned,
            confidence_score=0.95 if status == "match_found" else 0.0,
            match_summary=f"Found PEP={is_pep}, Sanction={is_sanctioned}",
            raw_response={"mock_provider": "ComplyAdvantage", "search_term": full_name},
        )

    def screen_entity(
        self,
        company_name: str,
        registration_number: Optional[str],
        country: Optional[str],
    ) -> NormalizedScreeningResult:
        logger.info(f"Screening entity via {self.provider_name}: {company_name}")

        is_sanctioned = "sanction" in company_name.lower()
        status = "match_found" if is_sanctioned else "clear"

        return NormalizedScreeningResult(
            provider_name=self.provider_name,
            provider_reference=f"CA-ENT-{abs(hash(company_name))}",
            status=status,
            is_pep=False,
            is_sanctioned=is_sanctioned,
            confidence_score=0.88 if status == "match_found" else 0.0,
            match_summary=f"Found Sanction={is_sanctioned}",
            raw_response={
                "mock_provider": "ComplyAdvantage",
                "search_term": company_name,
            },
        )


class SumsubAdapter(BaseScreeningProvider):
    """Mock adapter for Sumsub."""

    @property
    def provider_name(self) -> str:
        return "Sumsub"

    def screen_person(
        self, full_name: str, dob: Optional[str], nationality: Optional[str]
    ) -> NormalizedScreeningResult:
        logger.info(f"Screening person via {self.provider_name}: {full_name}")
        # Simulated failure for failover testing
        if "fail" in full_name.lower():
            return NormalizedScreeningResult(
                provider_name=self.provider_name,
                status="error",
                error_message="Simulated Sumsub API timeout",
            )

        return NormalizedScreeningResult(
            provider_name=self.provider_name,
            provider_reference=f"SS-{abs(hash(full_name))}",
            status="clear",
            is_pep=False,
            is_sanctioned=False,
            confidence_score=0.0,
            raw_response={"status": "clean"},
        )

    def screen_entity(
        self,
        company_name: str,
        registration_number: Optional[str],
        country: Optional[str],
    ) -> NormalizedScreeningResult:
        return NormalizedScreeningResult(
            provider_name=self.provider_name,
            provider_reference=f"SS-ENT-{abs(hash(company_name))}",
            status="clear",
            is_pep=False,
            is_sanctioned=False,
            confidence_score=0.0,
            raw_response={"status": "clean"},
        )
