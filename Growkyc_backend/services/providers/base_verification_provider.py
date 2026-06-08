"""
services/providers/base_verification_provider.py
================================================
Provider-agnostic interface for identity verification.
Normalizes payloads from vendors like FrankieOne/Trulioo into our schema.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseVerificationProvider(ABC):
    """
    Abstract interface for third-party identity verification vendors.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Vendor name (e.g., 'FrankieOne', 'Trulioo')."""
        pass

    @property
    @abstractmethod
    def provider_version(self) -> str:
        """API version utilized for this request."""
        pass

    @abstractmethod
    def verify_identity(
        self, identity_data: Dict[str, Any], country_code: str
    ) -> Dict[str, Any]:
        """
        Sends data to the vendor.
        Must return a standardized dictionary containing:
        - status: 'verified', 'failed', 'requires_review'
        - provider_reference: str
        - raw_response: dict
        - normalized_confidence: float
        """
        pass
