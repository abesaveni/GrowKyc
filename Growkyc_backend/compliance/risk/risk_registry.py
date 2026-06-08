"""
compliance/risk/risk_registry.py
=================================
Dynamic registry mapping country codes to their risk policies.
"""

import logging
from typing import Dict

from compliance.risk.australia_risk_policy import AustraliaRiskPolicy
from compliance.risk.base_risk_policy import BaseRiskPolicy
from compliance.risk.india_risk_policy import IndiaRiskPolicy

logger = logging.getLogger(__name__)

_RISK_REGISTRY: Dict[str, BaseRiskPolicy] = {
    "AU": AustraliaRiskPolicy(),
    "IN": IndiaRiskPolicy(),
}

DEFAULT_RISK_COUNTRY = "AU"


def get_risk_policy(country_code: str = None) -> BaseRiskPolicy:
    """
    Load the risk policy for a given country.
    Defaults to Australia (AUSTRAC) if no match found.
    """
    code = (country_code or DEFAULT_RISK_COUNTRY).upper()
    policy = _RISK_REGISTRY.get(code)
    if not policy:
        logger.warning(
            f"No risk policy for '{code}', falling back to {DEFAULT_RISK_COUNTRY}"
        )
        policy = _RISK_REGISTRY[DEFAULT_RISK_COUNTRY]
    return policy
