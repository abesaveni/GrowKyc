"""
services/risk/engine.py
=======================
Country-aware, policy-driven AML risk scoring engine.

The engine is intentionally country-agnostic:
  - It loads a BaseRiskPolicy from the registry.
  - All weights/thresholds come from that policy.
  - factor_contributions in the return value provides full explainability.
"""

from typing import Dict, Any, Tuple

from models import Client
from compliance.risk.risk_registry import get_risk_policy
from services.risk.rules import determine_risk_level


class RiskEngine:
    """Policy-driven, country-aware AML risk scoring engine."""

    @staticmethod
    def calculate_risk(
        client: Client,
        country_code: str = None,
    ) -> Tuple[float, str, str, Dict[str, Any]]:
        """
        Score a client against the active country risk policy.

        Args:
            client: The Client ORM instance.
            country_code: ISO-2 override; falls back to client.geography or 'AU'.

        Returns:
            Tuple of (final_score, inherent_risk, residual_risk, factor_breakdown)
        """
        # Resolve country — prefer explicit override, then client geography, then default
        code = country_code or (client.geography or "AU")
        policy = get_risk_policy(code)
        weights = policy.factor_weights

        score = 0.0
        factors: Dict[str, Any] = {
            "_meta": {
                "country_code": policy.country_code,
                "policy_version": policy.policy_version,
                "regulator_reference": policy.regulator_reference,
                "edd_escalation_threshold": policy.edd_escalation_threshold,
            }
        }

        # 1. Geography
        geo = client.geography or ""
        if geo in policy.high_risk_geographies:
            val = weights.get("geography_high", 40.0)
            score += val
            factors["geography"] = {"value": geo, "score": val, "level": "HIGH"}
        elif geo in policy.medium_risk_geographies:
            val = weights.get("geography_medium", 20.0)
            score += val
            factors["geography"] = {"value": geo, "score": val, "level": "MEDIUM"}
        else:
            factors["geography"] = {"value": geo, "score": 0, "level": "LOW"}

        # 2. PEP
        if client.is_pep:
            val = weights.get("pep", 40.0)
            # Strict PEP mode (AUSTRAC) doubles weight if near-threshold
            if policy.strict_pep_mode and score + val < policy.high_risk_threshold:
                val = min(val * 1.25, 100.0)
            score += val
            factors["pep"] = {"value": True, "score": val, "level": "HIGH"}
        else:
            factors["pep"] = {"value": False, "score": 0, "level": "LOW"}

        # 3. Sanctions — always critical
        if client.is_sanctioned:
            val = weights.get("sanctions", 100.0)
            score += val
            factors["sanctions"] = {"value": True, "score": val, "level": "CRITICAL"}
            if policy.sanctions_auto_escalation:
                factors["sanctions"]["auto_escalated"] = True
        else:
            factors["sanctions"] = {"value": False, "score": 0, "level": "LOW"}

        # 4. Income / Source of Funds
        income_threshold = 1_000_000
        if client.income_level and client.income_level > income_threshold:
            val = weights.get("income_high", 15.0)
            score += val
            factors["income"] = {"value": client.income_level, "score": val, "level": "MEDIUM"}
        else:
            factors["income"] = {"value": client.income_level, "score": 0, "level": "LOW"}

        # Normalize to 0-100
        final_score = min(score, 100.0)

        inherent_risk = determine_risk_level(final_score)
        residual_risk = inherent_risk

        # Attach EDD flag for downstream consumers
        factors["_meta"]["edd_required"] = final_score >= policy.edd_escalation_threshold

        return final_score, inherent_risk, residual_risk, factors

