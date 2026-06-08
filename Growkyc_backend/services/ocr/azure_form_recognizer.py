"""
services/ocr/azure_form_recognizer.py
=====================================
Azure Form Recognizer integration skeleton.
"""

from services.ocr.base import BaseOCRProvider, OcrResult


class AzureFormRecognizerProvider(BaseOCRProvider):
    """Azure Form Recognizer provider."""

    @property
    def provider_name(self) -> str:
        return "azure_form_recognizer"

    def extract(self, document_bytes: bytes, document_type: str = None) -> OcrResult:
        # TODO: Implement azure-ai-formrecognizer integration
        return OcrResult(
            status="completed",
            provider=self.provider_name,
            document_type=document_type,
            confidence_score=98.5,  # Azure usually returns 0.0-1.0, normalize to 0-100
            extracted_fields={"dummy": "azure_data"},
        )
