"""
Helper functions and utilities for the KYC system.
Common functions used throughout the application.
"""

import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


def get_current_utc_timestamp() -> datetime:
    """Get current timestamp in UTC."""
    return datetime.now(timezone.utc)


def format_timestamp(dt: datetime) -> str:
    """Format datetime to ISO format string."""
    if dt is None:
        return None
    return dt.isoformat() if isinstance(dt, datetime) else str(dt)


def mask_email(email: str) -> str:
    """
    Mask email for privacy (show only first letter and domain).

    Example: john@example.com -> j****@example.com
    """
    if not email or "@" not in email:
        return "***"

    name, domain = email.split("@")
    masked_name = name[0] + "*" * (len(name) - 1)
    return f"{masked_name}@{domain}"


def mask_aadhaar(aadhaar: str) -> str:
    """
    Mask Aadhaar number for privacy (show only last 4 digits).

    Example: 123456789012 -> XXXX XXXX 9012
    """
    if not aadhaar or len(aadhaar) < 4:
        return "****"

    return f"XXXX XXXX {aadhaar[-4:]}"


def mask_pan(pan: str) -> str:
    """
    Mask PAN for privacy (show only last 4 characters).

    Example: ABCDE1234F -> XXXXXX34F
    """
    if not pan or len(pan) < 4:
        return "****"

    return f"{'X' * 6}{pan[-4:]}"


def generate_file_name(original_name: str, prefix: str = "") -> str:
    """
    Generate a unique file name for uploads.

    Args:
        original_name: Original file name
        prefix: Optional prefix (e.g., user ID, document type)

    Returns:
        Generated file name with timestamp
    """
    from datetime import datetime

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Extract extension
    _, ext = os.path.splitext(original_name)

    if prefix:
        return f"{prefix}_{timestamp}{ext}"
    else:
        return f"{timestamp}{ext}"


def format_error_message(error: Exception) -> str:
    """Format exception message for user display."""
    error_str = str(error)
    if not error_str:
        return "An unexpected error occurred"
    return error_str


def paginate(items: List[Any], skip: int = 0, limit: int = 50) -> Dict[str, Any]:
    """
    Paginate a list of items.

    Args:
        items: List to paginate
        skip: Number of items to skip
        limit: Maximum items per page

    Returns:
        Dict with paginated items and metadata
    """
    total = len(items)

    paginated = items[skip : skip + limit]

    return {
        "items": paginated,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": (skip + limit) < total,
    }


def validate_file_extension(filename: str, allowed_extensions: List[str]) -> bool:
    """
    Validate if file has an allowed extension.

    Args:
        filename: File name to validate
        allowed_extensions: List of allowed extensions (e.g., ['pdf', 'jpg', 'png'])

    Returns:
        True if extension is allowed, False otherwise
    """
    if not filename or "." not in filename:
        return False

    ext = filename.rsplit(".", 1)[1].lower()
    return ext in allowed_extensions


def get_file_extension(filename: str) -> str:
    """Get file extension from filename."""
    if not filename or "." not in filename:
        return ""
    return filename.rsplit(".", 1)[1].lower()


def format_currency(amount: float, currency: str = "INR") -> str:
    """Format amount as currency string."""
    if currency.upper() == "INR":
        return f"₹{amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"


def get_safe_dict(obj: Dict[str, Any], *keys: str) -> Dict[str, Any]:
    """
    Safely extract multiple keys from a dictionary.

    Args:
        obj: Dictionary to extract from
        keys: Keys to extract

    Returns:
        Dictionary with only the specified keys
    """
    return {key: obj.get(key) for key in keys if key in obj}


def truncate_string(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate text to maximum length.

    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated

    Returns:
        Truncated text
    """
    if not text or len(text) <= max_length:
        return text

    return text[: max_length - len(suffix)] + suffix
