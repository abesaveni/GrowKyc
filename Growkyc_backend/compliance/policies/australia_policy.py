"""
compliance/policies/australia_policy.py
=======================================
AUSTRAC-compliant Australian AML/KYC policy.
"""

from typing import Any, Dict, List

from compliance.document_registry import NormalizedDocumentType
from compliance.policies.base_policy import BaseCountryPolicy


class AustraliaPolicy(BaseCountryPolicy):
    """
    Australia-first policy implementing AUSTRAC rules.
    """

    @property
    def country_code(self) -> str:
        return "AU"

    @property
    def policy_version(self) -> str:
        return "1.0.0"

    @property
    def regulator_reference(self) -> str:
        return "AUSTRAC"

    # ---- Required Documents ----
    def get_required_document_types(self, client_type: str = "individual") -> List[str]:
        if client_type == "business":
            return [
                NormalizedDocumentType.ABN.value,
                NormalizedDocumentType.ACN.value,
            ]
        # Standard AU Individual (Driver License or Passport + Medicare usually)
        return [
            NormalizedDocumentType.DRIVER_LICENSE.value,
            NormalizedDocumentType.PASSPORT.value,
            NormalizedDocumentType.MEDICARE_CARD.value,
        ]

    # ---- Feature Flags ----
    @property
    def requires_business_verification(self) -> bool:
        return True

    @property
    def allows_electronic_verification_only(self) -> bool:
        # AU Safe Harbor rules generally allow e-KYC (DVS)
        return True

    # ---- Risk & AML Thresholds ----
    def calculate_base_risk(self, kyc_data: Dict[str, Any]) -> float:
        # Simplified mock logic for AUSTRAC
        risk = 20.0
        # High risk if foreign politically exposed
        if kyc_data.get("is_pep", False):
            risk += 50.0
        return min(risk, 100.0)

    def get_edd_escalation_threshold(self) -> float:
        return 75.0  # High risk triggers EDD

    # ---- Reporting Obligations ----
    @property
    def suspicious_matter_report_type(self) -> str:
        return "SMR"
