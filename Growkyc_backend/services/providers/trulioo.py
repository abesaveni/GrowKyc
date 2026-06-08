"""
services/providers/trulioo.py
=============================
Trulioo global identity verification integration.
"""

from typing import Any, Dict

from services.providers.base_verification_provider import \
    BaseVerificationProvider


class TruliooProvider(BaseVerificationProvider):
    """Trulioo GlobalGateway integration."""

    @property
    def provider_name(self) -> str:
        return "Trulioo"

    @property
    def provider_version(self) -> str:
        return "v3.0"

    def verify_identity(
        self, identity_data: Dict[str, Any], country_code: str
    ) -> Dict[str, Any]:
        # TODO: Implement Trulioo HTTP requests
        return {
            "status": "verified",
            "provider_reference": "TRUL-888-ABC",
            "raw_response": {"mock": "trulioo_response"},
            "normalized_confidence": 95.0,
        }
