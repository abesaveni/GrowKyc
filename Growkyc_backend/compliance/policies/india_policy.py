"""
compliance/policies/india_policy.py
===================================
RBI-compliant Indian AML/KYC policy.
Maintains backward compatibility for legacy workflows.
"""
from typing import Dict, List, Any

from compliance.document_registry import NormalizedDocumentType
from compliance.policies.base_policy import BaseCountryPolicy


class IndiaPolicy(BaseCountryPolicy):
    """
    India policy implementing RBI rules and supporting legacy Aadhaar/PAN.
    """

    @property
    def country_code(self) -> str:
        return "IN"

    @property
    def policy_version(self) -> str:
        return "1.0.0"

    @property
    def regulator_reference(self) -> str:
        return "RBI"

    # ---- Required Documents ----
    def get_required_document_types(self, client_type: str = "individual") -> List[str]:
        # Legacy backward compatibility requires these translated types
        return [
            NormalizedDocumentType.AADHAAR.value,
            NormalizedDocumentType.PAN.value,
        ]

    # ---- Feature Flags ----
    @property
    def requires_business_verification(self) -> bool:
        return True

    @property
    def allows_electronic_verification_only(self) -> bool:
        return False  # CKYC/V-CIP usually required

    # ---- Risk & AML Thresholds ----
    def calculate_base_risk(self, kyc_data: Dict[str, Any]) -> float:
        risk = 30.0
        if kyc_data.get("is_pep", False):
            risk += 40.0
        return min(risk, 100.0)

    def get_edd_escalation_threshold(self) -> float:
        return 70.0

    # ---- Reporting Obligations ----
    @property
    def suspicious_matter_report_type(self) -> str:
        return "STR"
