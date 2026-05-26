"""
compliance/document_registry.py
===============================
Centralized registry for normalized document types, categories, and mapping rules.
Future-proof architecture for adding AU, US, SG without schema redesigns.
"""

from enum import Enum
from typing import Dict, Any


class DocumentCategory(str, Enum):
    GOVERNMENT_ID = "GOVERNMENT_ID"
    TAX_ID = "TAX_ID"
    BUSINESS_ID = "BUSINESS_ID"
    ADDRESS_PROOF = "ADDRESS_PROOF"
    FINANCIAL_DOCUMENT = "FINANCIAL_DOCUMENT"


class NormalizedDocumentType(str, Enum):
    # Global
    PASSPORT = "passport"
    DRIVER_LICENSE = "driver_license"
    NATIONAL_ID = "national_identifier"
    UTILITY_BILL = "utility_bill"
    BANK_STATEMENT = "bank_statement"
    
    # Australia (AU)
    TFN = "tax_file_number"
    MEDICARE_CARD = "medicare_card"
    ABN = "australian_business_number"
    ACN = "australian_company_number"
    
    # India (IN) (Legacy mappings)
    AADHAAR = "national_identifier"
    PAN = "tax_identifier"
    VOTER_ID = "voter_identifier"
    
    # USA (US)
    SSN = "social_security_number"
    EIN = "employer_identification_number"


# Map legacy internal string representations to normalized Enums
LEGACY_DOCUMENT_MAPPING = {
    "aadhaar": (DocumentCategory.GOVERNMENT_ID, NormalizedDocumentType.NATIONAL_ID, "IN"),
    "pan": (DocumentCategory.TAX_ID, NormalizedDocumentType.PAN, "IN"),
    "voter_id": (DocumentCategory.GOVERNMENT_ID, NormalizedDocumentType.VOTER_ID, "IN"),
}

# Supported capabilities per document type for verification routing
DOCUMENT_CAPABILITIES = {
    NormalizedDocumentType.PASSPORT: ["ocr", "mrz", "liveness", "tamper"],
    NormalizedDocumentType.DRIVER_LICENSE: ["ocr", "liveness", "tamper"],
    NormalizedDocumentType.NATIONAL_ID: ["ocr", "liveness", "tamper"],
    NormalizedDocumentType.MEDICARE_CARD: ["ocr", "database_verification"],
    NormalizedDocumentType.TFN: ["database_verification"],
    NormalizedDocumentType.ABN: ["database_verification"],
}
