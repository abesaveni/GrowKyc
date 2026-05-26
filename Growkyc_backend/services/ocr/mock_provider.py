"""
services/ocr/mock_provider.py
==============================
Deterministic mock OCR provider for development/testing.
Returns realistic extracted fields for all supported document types.
"""
from services.ocr.base import BaseOCRProvider, OcrResult


class MockOCRProvider(BaseOCRProvider):
    """Mock OCR — returns structured extraction without calling any external API."""

    @property
    def provider_name(self) -> str:
        return "mock_ocr"

    def extract(self, document_bytes: bytes, document_type: str = None) -> OcrResult:
        """
        Return mock extraction results based on document type.
        In production, replace with AWS Textract, Azure Form Recognizer, or Google Document AI.
        """
        doc_type = (document_type or "").lower()

        if "passport" in doc_type:
            return OcrResult(
                status="completed",
                provider=self.provider_name,
                document_type="passport",
                confidence_score=0.97,
                extracted_fields={
                    "given_names": "JOHN",
                    "surname": "DOE",
                    "nationality": "AUS",
                    "date_of_birth": "1985-06-15",
                    "expiry_date": "2030-06-14",
                    "document_number": "PA1234567",
                    "issuing_country": "AUS",
                    "sex": "M",
                },
                mrz_data={
                    "line1": "P<AUSDOE<<JOHN<<<<<<<<<<<<<<<<<<<<<<<<<<<",
                    "line2": "PA12345678AUS8506153M3006144<<<<<<<<<<<<2",
                },
            )
        elif "license" in doc_type or "licence" in doc_type:
            return OcrResult(
                status="completed",
                provider=self.provider_name,
                document_type="driver_license",
                confidence_score=0.93,
                extracted_fields={
                    "given_names": "JOHN",
                    "surname": "DOE",
                    "licence_number": "DL9876543",
                    "date_of_birth": "1985-06-15",
                    "expiry_date": "2027-06-14",
                    "address": "123 MAIN ST, SYDNEY NSW 2000",
                    "state": "NSW",
                    "class": "C",
                },
            )
        elif "bank" in doc_type:
            return OcrResult(
                status="completed",
                provider=self.provider_name,
                document_type="bank_statement",
                confidence_score=0.89,
                extracted_fields={
                    "account_holder": "JOHN DOE",
                    "bsb": "062-000",
                    "account_number": "12345678",
                    "bank_name": "Commonwealth Bank",
                    "statement_period": "2024-01-01 to 2024-01-31",
                    "closing_balance": "15234.50",
                    "currency": "AUD",
                },
            )
        else:
            return OcrResult(
                status="completed",
                provider=self.provider_name,
                document_type=doc_type or "unknown",
                confidence_score=0.75,
                extracted_fields={"raw_text": "Document processed — no structured extraction available."},
            )
