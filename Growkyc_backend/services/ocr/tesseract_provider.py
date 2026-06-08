"""
services/ocr/tesseract_provider.py
==================================
PyTesseract fallback integration skeleton.
"""

from services.ocr.base import BaseOCRProvider, OcrResult


class TesseractProvider(BaseOCRProvider):
    """Tesseract local fallback provider."""

    @property
    def provider_name(self) -> str:
        return "tesseract"

    def extract(self, document_bytes: bytes, document_type: str = None) -> OcrResult:
        # TODO: Implement pytesseract integration
        return OcrResult(
            status="completed",
            provider=self.provider_name,
            document_type=document_type,
            confidence_score=70.0,
            extracted_fields={"dummy": "tesseract_raw_text"},
        )
