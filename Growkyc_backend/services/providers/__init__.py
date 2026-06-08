"""services/providers/__init__.py
Registry and simple factory helpers to obtain provider instances.

This file follows the pattern used by other service-level factories
(e.g., `services.ocr.__init__`) — it is additive and non-invasive. It
does NOT change any runtime behavior unless callers switch to using
these helpers.
"""

import os
from typing import List

from services.providers.equifax_digital_identity import (
    get_equifax_digital_identity_provider,
)
from services.providers.equifax_entity_validation import get_equifax_entity_provider

# Optional Equifax providers (added in Sprints 1-5)
from services.providers.equifax_identity import EquifaxIdentityProvider
from services.providers.equifax_screening import EquifaxScreeningAdapter
from services.providers.frankieone import FrankieOneProvider
from services.providers.trulioo import TruliooProvider


def get_identity_provider():
    """Return an identity verification provider instance based on env var.

    Env: IDENTITY_PROVIDER -> one of 'trulioo', 'frankieone', 'equifax'
    Default: 'trulioo'
    """
    provider = os.getenv("IDENTITY_PROVIDER", "trulioo").lower()
    if provider == "trulioo":
        return TruliooProvider()
    if provider == "frankieone":
        return FrankieOneProvider()
    if provider == "equifax":
        return EquifaxIdentityProvider()
    raise ValueError(f"Unknown IDENTITY_PROVIDER: {provider}")


def get_screening_providers() -> List[object]:
    """Return a list of screening provider instances.

    Env: SCREENING_PROVIDERS -> comma-separated list,
    e.g. 'sumsub,complyadvantage,equifax'
    Default: 'sumsub,complyadvantage'
    """
    preferred = os.getenv("SCREENING_PROVIDERS", "sumsub,complyadvantage")
    out: List[object] = []
    for p in [s.strip().lower() for s in preferred.split(",") if s.strip()]:
        if p == "sumsub":
            from services.providers.screening.adapters import SumsubAdapter

            out.append(SumsubAdapter())
        elif p == "complyadvantage":
            from services.providers.screening.adapters import ComplyAdvantageAdapter

            out.append(ComplyAdvantageAdapter())
        elif p == "equifax":
            out.append(EquifaxScreeningAdapter())
        else:
            # ignore unknown entries to keep behavior safe
            continue
    return out


def get_entity_provider():
    """Return an entity verification provider instance based on env var.

    Env: ENTITY_PROVIDER -> one of 'equifax' (default)
    """
    provider = os.getenv("ENTITY_PROVIDER", "equifax").lower()
    if provider == "equifax":
        return get_equifax_entity_provider()
    raise ValueError(f"Unknown ENTITY_PROVIDER: {provider}")


def get_digital_identity_provider():
    """Return a digital identity/contact provider instance based on env var.

    Env: DIGITAL_IDENTITY_PROVIDER -> one of 'equifax' (default)
    """
    provider = os.getenv("DIGITAL_IDENTITY_PROVIDER", "equifax").lower()
    if provider == "equifax":
        return get_equifax_digital_identity_provider()
    raise ValueError(f"Unknown DIGITAL_IDENTITY_PROVIDER: {provider}")


__all__ = [
    "get_identity_provider",
    "get_screening_providers",
    "get_entity_provider",
    "get_digital_identity_provider",
]
