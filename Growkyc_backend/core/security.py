"""
Core security utilities for the KYC system.
Provides common security functions and utilities.
"""

import logging
from datetime import datetime, timezone

import bcrypt

logger = logging.getLogger(__name__)

_ROUNDS = 12


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=_ROUNDS)).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its bcrypt hash."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Convenience alias for hash_password."""
    return hash_password(password)


def generate_timestamp() -> datetime:
    """Generate current timestamp in UTC."""
    return datetime.now(timezone.utc)
