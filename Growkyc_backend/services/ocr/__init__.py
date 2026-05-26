"""services/ocr/__init__.py"""
from services.ocr.mock_provider import MockOCRProvider
from services.ocr.aws_textract import AWSTextractProvider
from services.ocr.azure_form_recognizer import AzureFormRecognizerProvider
from services.ocr.google_document_ai import GoogleDocumentAIProvider
from services.ocr.tesseract_provider import TesseractProvider

def get_ocr_provider():
    import os
    provider = os.getenv("OCR_PROVIDER", "mock").lower()
    if provider == "mock":
        return MockOCRProvider()
    elif provider == "aws":
        return AWSTextractProvider()
    elif provider == "azure":
        return AzureFormRecognizerProvider()
    elif provider == "google":
        return GoogleDocumentAIProvider()
    elif provider == "tesseract":
        return TesseractProvider()
    raise ValueError(f"Unknown OCR_PROVIDER: {provider!r}")

__all__ = ["get_ocr_provider", "MockOCRProvider"]
