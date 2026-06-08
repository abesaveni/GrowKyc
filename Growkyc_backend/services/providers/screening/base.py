"""
services/providers/screening/base.py
====================================
Abstract base classes and schemas for AML screening providers.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class NormalizedScreeningResult(BaseModel):
    """
    Normalized response format across all screening providers.
    Ensures the internal risk engine and audit logs receive consistent data
    regardless of the underlying vendor.
    """

    provider_name: str
    provider_reference: Optional[str] = None
    status: str  # clear | match_found | error
    is_pep: bool = False
    is_sanctioned: bool = False
    confidence_score: Optional[float] = None
    match_summary: Optional[str] = None
    matched_entities: List[Dict[str, Any]] = []
    raw_response: Dict[str, Any] = {}
    error_message: Optional[str] = None


class BaseScreeningProvider(ABC):
    """
    Abstract interface for all external screening providers.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the unique identifier for this provider."""
        pass

    @abstractmethod
    def screen_person(
        self, full_name: str, dob: Optional[str], nationality: Optional[str]
    ) -> NormalizedScreeningResult:
        """Screen an individual."""
        pass

    @abstractmethod
    def screen_entity(
        self,
        company_name: str,
        registration_number: Optional[str],
        country: Optional[str],
    ) -> NormalizedScreeningResult:
        """Screen a corporate entity."""
        pass
