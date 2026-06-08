"""
compliance/risk/india_risk_policy.py
======================================
RBI-compliant risk policy (backward compatibility).
"""

from typing import Dict

from compliance.risk.base_risk_policy import BaseRiskPolicy


class IndiaRiskPolicy(BaseRiskPolicy):
    """India (RBI) AML risk configuration — legacy compat."""

    @property
    def country_code(self) -> str:
        return "IN"

    @property
    def policy_version(self) -> str:
        return "1.0.0"

    @property
    def regulator_reference(self) -> str:
        return "RBI"

    @property
    def edd_escalation_threshold(self) -> float:
        return 70.0

    @property
    def high_risk_threshold(self) -> float:
        return 75.0

    @property
    def factor_weights(self) -> Dict[str, float]:
        return {
            "pep": 40.0,
            "sanctions": 100.0,
            "geography_high": 35.0,
            "geography_medium": 15.0,
            "document_fraud": 30.0,
            "ubo_complexity": 15.0,
            "business_structure": 10.0,
            "transaction_risk": 15.0,
            "income_high": 20.0,
        }

    @property
    def high_risk_geographies(self) -> list:
        return ["North Korea", "Iran", "Syria", "Cuba", "Russia", "Belarus", "Myanmar"]

    @property
    def medium_risk_geographies(self) -> list:
        return ["Panama", "Cayman Islands", "BVI", "UAE"]
