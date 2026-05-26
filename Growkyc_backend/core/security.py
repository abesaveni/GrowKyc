"""
Core security utilities for the KYC system.
Provides common security functions and utilities.
"""

import logging
from datetime import datetime, timezone

from passlib.context import CryptContext

logger = logging.getLogger(__name__)

# Configure bcrypt hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Hash to verify against

    Returns:
        True if password matches, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False


def get_password_hash(password: str) -> str:
    """Convenience function for hashing passwords."""
    return hash_password(password)


def generate_timestamp() -> datetime:
    """Generate current timestamp in UTC."""
    return datetime.now(timezone.utc)
