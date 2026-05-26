"""
Password hashing module using bcrypt.
Provides secure password hashing and verification functions.
"""

import logging

from passlib.context import CryptContext

logger = logging.getLogger(__name__)

# Configure bcrypt hashing context
# rounds=12 is the default recommended value for production use
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.

    Args:
        password (str): The plaintext password to hash

    Returns:
        str: The hashed password

    Example:
        >>> hashed = hash_password("MySecurePassword123")
        >>> verify_password("MySecurePassword123", hashed)
        True
    """
    try:
        hashed = pwd_context.hash(password)
        logger.debug("Password hashed successfully")
        return hashed
    except Exception as e:
        logger.error(f"Error hashing password: {str(e)}")
        raise


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against its hash.

    Args:
        plain_password (str): The plaintext password to verify
        hashed_password (str): The hash to verify against

    Returns:
        bool: True if password matches, False otherwise

    Example:
        >>> hashed = hash_password("MyPassword123")
        >>> verify_password("MyPassword123", hashed)
        True
        >>> verify_password("WrongPassword", hashed)
        False
    """
    try:
        is_valid = pwd_context.verify(plain_password, hashed_password)
        return is_valid
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False
