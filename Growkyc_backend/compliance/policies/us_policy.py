"""
compliance/policies/us_policy.py
================================
FinCEN-compliant US AML/KYC policy skeleton.
"""
from typing import Dict, List, Any

from compliance.document_registry import NormalizedDocumentType
from compliance.policies.base_policy import BaseCountryPolicy


class USPolicy(BaseCountryPolicy):
    """US policy implementing FinCEN rules."""

    @property
    def country_code(self) -> str:
        return "US"

    @property
    def policy_version(self) -> str:
        return "1.0.0"

    @property
    def regulator_reference(self) -> str:
        return "FinCEN"

    def get_required_document_types(self, client_type: str = "individual") -> List[str]:
        if client_type == "business":
            return [NormalizedDocumentType.EIN.value]
        return [NormalizedDocumentType.SSN.value, NormalizedDocumentType.DRIVER_LICENSE.value]

    def calculate_base_risk(self, kyc_data: Dict[str, Any]) -> float:
        return 25.0

    def get_edd_escalation_threshold(self) -> float:
        return 80.0

    @property
    def suspicious_matter_report_type(self) -> str:
        return "SAR"
