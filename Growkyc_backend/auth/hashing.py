"""
Password hashing module using bcrypt.
Provides secure password hashing and verification functions.
"""

import logging

import bcrypt

logger = logging.getLogger(__name__)

_ROUNDS = 12


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    try:
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=_ROUNDS)).decode("utf-8")
        logger.debug("Password hashed successfully")
        return hashed
    except Exception as e:
        logger.error(f"Error hashing password: {str(e)}")
        raise


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against its bcrypt hash."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False
