"""
JWT authentication handler using python-jose.
Provides token creation and verification functionality.
"""

import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt

logger = logging.getLogger(__name__)

# Get JWT configuration from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Validate secret key in production
if SECRET_KEY == "your-secret-key-change-in-production":
    logger.warning("WARNING: Using default SECRET_KEY. Change this in production!")
elif len(SECRET_KEY) < 32:
    logger.warning(
        "WARNING: SECRET_KEY appears weak (less than 32 characters). "
        "Use a stronger secret in production!"
    )


def create_access_token(
    data: Dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token containing standard claims and tenant isolation data.

    Args:
        data (Dict[str, Any]): The payload data to encode in the token. Must include
            at minimum 'sub' (user_id) and 'tenant_id'.
        expires_delta (Optional[timedelta]): Custom expiration time.
            If None, uses ACCESS_TOKEN_EXPIRE_MINUTES

    Returns:
        str: The encoded JWT token
    """
    try:
        # Make a copy of data to avoid modifying the original
        to_encode = data.copy()

        # Set expiration time
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            )

        to_encode.update({"exp": expire})

        # Encode and sign the token
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        logger.debug(f"Access token created for user: {data.get('sub')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}")
        raise


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token.

    Args:
        token (str): The JWT token to verify

    Returns:
        Optional[Dict[str, Any]]: The decoded payload if valid, None otherwise

    Raises:
        JWTError: If token verification fails

    Example:
        >>> token = create_access_token({"sub": "123"})
        >>> payload = verify_token(token)
        >>> payload["sub"]
        '123'
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        tenant_id = payload.get("tenant_id")

        if user_id is None:
            logger.warning("Token missing 'sub' claim")
            return None
            
        if tenant_id is None:
            logger.warning("Token missing 'tenant_id' claim - rejecting cross-tenant token")
            return None

        logger.debug(f"Token verified for user: {user_id} in tenant: {tenant_id}")
        return payload
    except JWTError as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error verifying token: {str(e)}")
        return None


def decode_token_unsafe(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode a JWT token without verification (use with caution).
    Useful for debugging or when you need header information.

    Args:
        token (str): The JWT token to decode

    Returns:
        Optional[Dict[str, Any]]: The decoded payload if valid, None otherwise
    """
    try:
        payload = jwt.get_unverified_claims(token)
        return payload
    except Exception as e:
        logger.error(f"Error decoding token: {str(e)}")
        return None


def get_token_expiration(token: str) -> Optional[datetime]:
    """
    Get the expiration time of a JWT token.

    Args:
        token (str): The JWT token

    Returns:
        Optional[datetime]: The expiration datetime if found, None otherwise
    """
    try:
        payload = decode_token_unsafe(token)
        if payload and "exp" in payload:
            exp_timestamp = payload["exp"]
            return datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
        return None
    except Exception as e:
        logger.error(f"Error getting token expiration: {str(e)}")
        return None


def is_token_expired(token: str) -> bool:
    """
    Check if a JWT token has expired.

    Args:
        token (str): The JWT token to check

    Returns:
        bool: True if expired, False otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        if exp:
            exp_time = datetime.fromtimestamp(exp, tz=timezone.utc)
            return exp_time < datetime.now(timezone.utc)
        return False
    except JWTError:
        # If verification fails, token is considered expired/invalid
        return True
    except Exception as e:
        logger.error(f"Error checking token expiration: {str(e)}")
        return True
