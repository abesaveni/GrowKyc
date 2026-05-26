"""
services/ocr/aws_textract.py
============================
AWS Textract integration skeleton.
"""
from services.ocr.base import BaseOCRProvider, OcrResult


class AWSTextractProvider(BaseOCRProvider):
    """AWS Textract provider."""

    @property
    def provider_name(self) -> str:
        return "aws_textract"

    def extract(self, document_bytes: bytes, document_type: str = None) -> OcrResult:
        # TODO: Implement actual boto3 textract integration
        return OcrResult(
            status="completed",
            provider=self.provider_name,
            document_type=document_type,
            confidence_score=95.0,  # AWS returns 0-100 usually, so normalize here
            extracted_fields={"dummy": "aws_data"},
        )
