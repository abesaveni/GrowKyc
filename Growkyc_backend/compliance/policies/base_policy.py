"""
compliance/policies/base_policy.py
==================================
The central compliance orchestration contract.
Every country-specific policy must inherit from this to ensure
the core AML/KYC workflows (RiskEngine, EDD, Cases) remain generic.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any


class BaseCountryPolicy(ABC):
    """
    Abstract interface defining a country's KYC/AML rules.
    """

    @property
    @abstractmethod
    def country_code(self) -> str:
        """ISO 3166-1 alpha-2 code (e.g., 'AU', 'IN')."""
        pass

    @property
    @abstractmethod
    def policy_version(self) -> str:
        """Version of this policy logic, critical for audit reproducibility."""
        pass

    @property
    @abstractmethod
    def regulator_reference(self) -> str:
        """Name of the primary regulator (e.g., 'AUSTRAC', 'RBI')."""
        pass

    # ---- Required Documents ----
    @abstractmethod
    def get_required_document_types(self, client_type: str = "individual") -> List[str]:
        """Returns a list of NormalizedDocumentType required for onboarding."""
        pass

    # ---- Feature Flags ----
    @property
    def requires_business_verification(self) -> bool:
        return True

    @property
    def allows_electronic_verification_only(self) -> bool:
        """e.g. AU Safe Harbor allows DVS without physical documents."""
        return False

    # ---- Risk & AML Thresholds ----
    @abstractmethod
    def calculate_base_risk(self, kyc_data: Dict[str, Any]) -> float:
        """Calculate base risk score (0-100) based on country rules."""
        pass

    @abstractmethod
    def get_edd_escalation_threshold(self) -> float:
        """Risk score threshold (0-100) that automatically triggers EDD."""
        pass

    # ---- Reporting Obligations ----
    @property
    @abstractmethod
    def suspicious_matter_report_type(self) -> str:
        """e.g., 'SMR' (AU), 'STR' (IN), 'SAR' (US)."""
        pass
