"""
compliance/risk/base_risk_policy.py
====================================
Abstract contract for country-specific AML risk policies.
Keeps core RiskEngine country-agnostic.
"""

from abc import ABC, abstractmethod
from typing import Dict


class BaseRiskPolicy(ABC):
    """
    Defines risk weightings, EDD thresholds, and AML rules per country.
    Policies are plugged into the RiskEngine dynamically.
    """

    @property
    @abstractmethod
    def country_code(self) -> str:
        """ISO 3166-1 alpha-2."""
        pass

    @property
    @abstractmethod
    def policy_version(self) -> str:
        """Version for audit reproducibility."""
        pass

    @property
    @abstractmethod
    def regulator_reference(self) -> str:
        """Primary regulatory body (e.g., 'AUSTRAC', 'RBI')."""
        pass

    # ---- Risk Thresholds ----
    @property
    @abstractmethod
    def edd_escalation_threshold(self) -> float:
        """Score (0-100) above which EDD is auto-triggered."""
        pass

    @property
    @abstractmethod
    def high_risk_threshold(self) -> float:
        """Score above which client is flagged HIGH risk."""
        pass

    # ---- Feature Flags ----
    @property
    def enable_auto_edd(self) -> bool:
        return True

    @property
    def sanctions_auto_escalation(self) -> bool:
        return True

    @property
    def strict_pep_mode(self) -> bool:
        return False

    # ---- Factor Weights (0-100 scale each) ----
    @property
    @abstractmethod
    def factor_weights(self) -> Dict[str, float]:
        """
        Return factor weight map used during scoring.
        Keys: pep, sanctions, geography_high, geography_medium,
              document_fraud, ubo_complexity, business_structure,
              transaction_risk, income_high.
        """
        pass

    # ---- Geography Config ----
    @property
    @abstractmethod
    def high_risk_geographies(self) -> list:
        pass

    @property
    @abstractmethod
    def medium_risk_geographies(self) -> list:
        pass
