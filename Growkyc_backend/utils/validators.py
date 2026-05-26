"""
Validators for KYC data.
Provides validation functions for Aadhaar, PAN, and other KYC data.
"""

import logging
import re
from typing import Optional, Tuple

logger = logging.getLogger(__name__)


def validate_aadhaar(aadhaar: str) -> Tuple[bool, Optional[str]]:
    """
    Validate Aadhaar number format.

    Aadhaar is a 12-digit number.

    Args:
        aadhaar: Aadhaar number to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not aadhaar:
        return False, "Aadhaar cannot be empty"

    if not isinstance(aadhaar, str):
        return False, "Aadhaar must be a string"

    # Remove spaces if any
    aadhaar_clean = aadhaar.replace(" ", "")

    if not aadhaar_clean.isdigit():
        return False, "Aadhaar must contain only digits"

    if len(aadhaar_clean) != 12:
        return False, "Aadhaar must be exactly 12 digits"

    return True, None


def validate_pan(pan: str) -> Tuple[bool, Optional[str]]:
    """
    Validate PAN (Permanent Account Number) format.

    PAN format: AAAAA9999A (5 letters, 4 digits, 1 letter)

    Args:
        pan: PAN to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not pan:
        return False, "PAN cannot be empty"

    if not isinstance(pan, str):
        return False, "PAN must be a string"

    pan_upper = pan.upper().strip()

    # PAN format: AAAAA9999A
    pan_pattern = r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$"

    if not re.match(pan_pattern, pan_upper):
        return (
            False,
            "PAN format must be AAAAA9999A (5 letters, 4 digits, 1 letter)",
        )

    if len(pan_upper) != 10:
        return False, "PAN must be exactly 10 characters"

    return True, None


def validate_email(email: str) -> Tuple[bool, Optional[str]]:
    """
    Validate email format.

    Args:
        email: Email to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not email:
        return False, "Email cannot be empty"

    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if not re.match(email_pattern, email):
        return False, "Invalid email format"

    if len(email) > 255:
        return False, "Email must be less than 255 characters"

    return True, None


def validate_phone(phone: str) -> Tuple[bool, Optional[str]]:
    """
    Validate phone number format (Indian 10-digit mobile).

    Args:
        phone: Phone number to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not phone:
        return False, "Phone number cannot be empty"

    phone_clean = phone.replace(" ", "").replace("-", "").replace("+", "")

    if not phone_clean.isdigit():
        return False, "Phone number must contain only digits"

    if len(phone_clean) < 10 or len(phone_clean) > 13:
        return False, "Phone number must be between 10-13 digits"

    return True, None


def validate_name(name: str) -> Tuple[bool, Optional[str]]:
    """
    Validate name format.

    Args:
        name: Name to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not name:
        return False, "Name cannot be empty"

    if not isinstance(name, str):
        return False, "Name must be a string"

    name = name.strip()

    if len(name) < 2:
        return False, "Name must be at least 2 characters"

    if len(name) > 255:
        return False, "Name must be less than 255 characters"

    # Allow letters, spaces, and common punctuation
    if not re.match(r"^[a-zA-Z\s'-]+$", name):
        return False, "Name contains invalid characters"

    return True, None


def validate_password(password: str) -> Tuple[bool, Optional[str]]:
    """
    Validate password strength.

    Requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit

    Args:
        password: Password to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password:
        return False, "Password cannot be empty"

    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"

    return True, None
