"""
services/ocr/base.py
====================
Abstract base for OCR provider integration.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, Optional


@dataclass
class OcrResult:
    """Normalized OCR extraction output."""
    status: str  # completed | failed
    provider: str
    document_type: Optional[str] = None
    extracted_fields: Dict[str, Any] = field(default_factory=dict)
    confidence_score: Optional[float] = None
    mrz_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None


class BaseOCRProvider(ABC):
    """Abstract OCR provider."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    def extract(self, document_bytes: bytes, document_type: str = None) -> OcrResult:
        """Extract text and structured fields from document bytes."""
