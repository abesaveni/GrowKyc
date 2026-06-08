"""
compliance/policy_registry.py
=============================
Central registry for resolving country codes to active Compliance Policies.
"""

import logging
from typing import Dict

from compliance.policies.australia_policy import AustraliaPolicy
from compliance.policies.base_policy import BaseCountryPolicy
from compliance.policies.india_policy import IndiaPolicy
from compliance.policies.uk_policy import UKPolicy
from compliance.policies.us_policy import USPolicy

logger = logging.getLogger(__name__)

# Registry mapping ISO 3166-1 alpha-2 codes to Policy instances
_POLICY_REGISTRY: Dict[str, BaseCountryPolicy] = {
    "AU": AustraliaPolicy(),
    "IN": IndiaPolicy(),
    "US": USPolicy(),
    "UK": UKPolicy(),
}

# The default system policy (per prompt, Australia-first)
DEFAULT_COUNTRY = "AU"


def get_policy(country_code: str = None) -> BaseCountryPolicy:
    """
    Returns the loaded compliance policy for the given country.
    Defaults to the primary target architecture (Australia) if none provided.
    """
    code = (country_code or DEFAULT_COUNTRY).upper()
    policy = _POLICY_REGISTRY.get(code)

    if not policy:
        logger.warning(
            f"No compliance policy found for {code}, falling back to {DEFAULT_COUNTRY}"
        )
        policy = _POLICY_REGISTRY[DEFAULT_COUNTRY]

    return policy


def get_all_supported_countries() -> list[str]:
    """Return all currently supported policy region codes."""
    return list(_POLICY_REGISTRY.keys())
