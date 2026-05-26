"""
compliance/policies/uk_policy.py
================================
FCA-compliant UK AML/KYC policy skeleton.
"""
from typing import Dict, List, Any

from compliance.document_registry import NormalizedDocumentType
from compliance.policies.base_policy import BaseCountryPolicy


class UKPolicy(BaseCountryPolicy):
    """UK policy implementing FCA rules."""

    @property
    def country_code(self) -> str:
        return "UK"

    @property
    def policy_version(self) -> str:
        return "1.0.0"

    @property
    def regulator_reference(self) -> str:
        return "FCA"

    def get_required_document_types(self, client_type: str = "individual") -> List[str]:
        return [NormalizedDocumentType.PASSPORT.value, NormalizedDocumentType.NATIONAL_ID.value]

    def calculate_base_risk(self, kyc_data: Dict[str, Any]) -> float:
        return 20.0

    def get_edd_escalation_threshold(self) -> float:
        return 75.0

    @property
    def suspicious_matter_report_type(self) -> str:
        return "SAR"
