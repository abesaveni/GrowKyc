"""
compliance/risk/australia_risk_policy.py
=========================================
AUSTRAC-compliant risk policy for the Australian market.
"""

from typing import Dict

from compliance.risk.base_risk_policy import BaseRiskPolicy


class AustraliaRiskPolicy(BaseRiskPolicy):
    """Australia (AUSTRAC) AML risk configuration."""

    @property
    def country_code(self) -> str:
        return "AU"

    @property
    def policy_version(self) -> str:
        return "1.0.0"

    @property
    def regulator_reference(self) -> str:
        return "AUSTRAC"

    # ---- Thresholds ----
    @property
    def edd_escalation_threshold(self) -> float:
        return 75.0

    @property
    def high_risk_threshold(self) -> float:
        return 80.0

    # ---- Feature Flags ----
    @property
    def enable_auto_edd(self) -> bool:
        return True

    @property
    def sanctions_auto_escalation(self) -> bool:
        return True

    @property
    def strict_pep_mode(self) -> bool:
        # AUSTRAC requires enhanced scrutiny on PEPs
        return True

    # ---- Weights ----
    @property
    def factor_weights(self) -> Dict[str, float]:
        return {
            "pep": 40.0,
            "sanctions": 100.0,  # Always maxes out to critical
            "geography_high": 40.0,
            "geography_medium": 20.0,
            "document_fraud": 45.0,  # High weight per AUSTRAC guidance
            "ubo_complexity": 20.0,  # Complex trust structures penalized
            "business_structure": 15.0,  # Shell/non-operating companies flagged
            "transaction_risk": 20.0,
            "income_high": 15.0,
        }

    # ---- Geography ----
    @property
    def high_risk_geographies(self) -> list:
        return ["North Korea", "Iran", "Syria", "Cuba", "Russia", "Belarus", "Myanmar"]

    @property
    def medium_risk_geographies(self) -> list:
        return ["Panama", "Cayman Islands", "BVI", "UAE", "Malta", "Vanuatu"]
