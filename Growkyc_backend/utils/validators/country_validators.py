"""
utils/validators/country_validators.py
======================================
Modular validation logic decoupled from schemas.
Called by the KYC service and CountryPolicy engine.
"""

import re


def validate_australian_tfn(tfn: str) -> bool:
    """Validate Australian Tax File Number."""
    if not tfn or not re.match(r"^\d{8,9}$", tfn):
        return False
    # Simplified mock validation (In production, implement TFN checksum algorithm)
    return True


def validate_australian_abn(abn: str) -> bool:
    """Validate Australian Business Number."""
    if not abn or not re.match(r"^\d{11}$", abn):
        return False
    # Simplified mock validation (In production, implement ABN checksum)
    return True


def validate_australian_acn(acn: str) -> bool:
    """Validate Australian Company Number."""
    if not acn or not re.match(r"^\d{9}$", acn):
        return False
    return True


def validate_indian_aadhaar(aadhaar: str) -> bool:
    """Validate Indian Aadhaar (legacy support)."""
    if not aadhaar or not re.match(r"^\d{12}$", aadhaar):
        return False
    return True


def validate_indian_pan(pan: str) -> bool:
    """Validate Indian PAN (legacy support)."""
    if not pan or not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", pan):
        return False
    return True


def validate_us_ssn(ssn: str) -> bool:
    """Validate US Social Security Number."""
    if not ssn or not re.match(r"^\d{3}-?\d{2}-?\d{4}$", ssn):
        return False
    return True
