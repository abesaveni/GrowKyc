"""
services/ocr/google_document_ai.py
==================================
Google Document AI integration skeleton.
"""

from services.ocr.base import BaseOCRProvider, OcrResult


class GoogleDocumentAIProvider(BaseOCRProvider):
    """Google Document AI provider."""

    @property
    def provider_name(self) -> str:
        return "google_document_ai"

    def extract(self, document_bytes: bytes, document_type: str = None) -> OcrResult:
        # TODO: Implement google-cloud-documentai integration
        return OcrResult(
            status="completed",
            provider=self.provider_name,
            document_type=document_type,
            confidence_score=96.2,  # GCP usually returns 0.0-1.0, normalize to 0-100
            extracted_fields={"dummy": "gcp_data"},
        )
