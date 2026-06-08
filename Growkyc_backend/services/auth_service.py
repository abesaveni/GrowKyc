"""
Authentication service handling user registration, login, and token management.
Encapsulates all authentication business logic.
"""

import logging
import os
from datetime import datetime, timedelta

from jose import jwt
from sqlalchemy.orm import Session

from core.constants import (ERROR_INVALID_EMAIL_PASSWORD,
                            ERROR_INVALID_PASSWORD, ERROR_USER_INACTIVE,
                            MIN_PASSWORD_LENGTH)
from core.enums import UserRole
from core.exceptions import (AuthenticationError, DatabaseError,
                             DuplicateResourceError, ValidationError)
from core.security import hash_password, verify_password
from models import User

logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


class AuthService:
    """Service for handling authentication and authorization operations."""

    def __init__(self, db: Session):
        """Initialize with database session."""
        self.db = db
        self.logger = logging.getLogger(__name__)

    def register_user(
        self, name: str, email: str, password: str, tenant_id: int = None
    ) -> User:
        """
        Register a new user.

        Args:
            name: User's full name
            email: User's email (must be unique)
            password: Plain password (will be hashed)

        Returns:
            Created User instance

        Raises:
            ValidationError: If validation fails
            DuplicateResourceError: If email already exists
            DatabaseError: If database operation fails
        """
        try:
            # Validate password strength
            if len(password) < MIN_PASSWORD_LENGTH:
                raise ValidationError(
                    f"Password must be at least {MIN_PASSWORD_LENGTH} characters"
                )

            # Check if user already exists
            existing_user = self.db.query(User).filter(User.email == email).first()
            if existing_user:
                self.logger.warning(
                    f"Registration attempt with existing email: {email}"
                )
                raise DuplicateResourceError("User", "email")

            # Create new user
            hashed_password = hash_password(password)
            user = User(
                name=name,
                email=email,
                password=hashed_password,
                role=UserRole.USER,
                tenant_id=tenant_id,
                is_active=True,
                created_at=datetime.utcnow(),
            )

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            self.logger.info(f"User registered successfully: {email}")
            return user
        except (ValidationError, DuplicateResourceError):
            raise
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Registration error: {str(e)}")
            raise DatabaseError("Failed to register user") from e

    def authenticate_user(self, email: str, password: str) -> User:
        """
        Authenticate user with email and password.

        Args:
            email: User's email
            password: Plain password

        Returns:
            Authenticated User instance

        Raises:
            AuthenticationError: If credentials are invalid
            DatabaseError: If database operation fails
        """
        try:
            # Find user by email
            user = self.db.query(User).filter(User.email == email).first()
            if not user:
                self.logger.warning(f"Login attempt with non-existent email: {email}")
                raise AuthenticationError(ERROR_INVALID_EMAIL_PASSWORD)

            # Verify password
            if not verify_password(password, user.password):
                self.logger.warning(f"Login attempt with incorrect password: {email}")
                raise AuthenticationError(ERROR_INVALID_EMAIL_PASSWORD)

            # Check if user is active
            if not user.is_active:
                self.logger.warning(f"Login attempt with inactive user: {email}")
                raise AuthenticationError(ERROR_USER_INACTIVE)

            self.logger.info(f"User logged in successfully: {email}")
            return user
        except AuthenticationError:
            raise
        except Exception as e:
            self.logger.error(f"Authentication error: {str(e)}")
            raise DatabaseError("Authentication failed")

    def create_access_token(
        self,
        user_id: int,
        tenant_id: int = None,
        role: str = None,
        permissions: list = None,
        expires_delta: timedelta = None,
    ) -> str:
        """
        Create JWT access token for user.

        Args:
            user_id: User ID to embed in token
            role: Optional User role to embed in token
            expires_delta: Custom expiration time (default 30 minutes)

        Returns:
            Encoded JWT token
        """
        if expires_delta is None:
            expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

        expire = datetime.utcnow() + expires_delta
        to_encode = {"sub": str(user_id), "exp": expire}
        if tenant_id is not None:
            to_encode["tenant_id"] = tenant_id
        if role is not None:
            to_encode["role"] = role
        if permissions is not None:
            to_encode["permissions"] = permissions

        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def verify_token(self, token: str) -> dict:
        """
        Verify and decode JWT token.

        Args:
            token: JWT token string

        Returns:
            Decoded token payload

        Raises:
            AuthenticationError: If token is invalid or expired
        """
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            tenant_id = payload.get("tenant_id")
            if user_id is None:
                raise AuthenticationError("Invalid token: missing claims")
            decoded = {"user_id": int(user_id), **payload}
            if tenant_id is not None:
                decoded["tenant_id"] = int(tenant_id)
            return decoded
        except Exception as e:
            self.logger.warning(f"Token verification failed: {str(e)}")
            raise AuthenticationError("Invalid or expired token")

    def change_password(
        self, user: User, current_password: str, new_password: str
    ) -> User:
        """
        Change user's password.

        Args:
            user: User instance
            current_password: Current plain password
            new_password: New plain password

        Returns:
            Updated User instance

        Raises:
            ValidationError: If validation fails
            AuthenticationError: If current password is incorrect
            DatabaseError: If database operation fails
        """
        try:
            # Validate new password
            if len(new_password) < MIN_PASSWORD_LENGTH:
                raise ValidationError(
                    f"New password must be at least {MIN_PASSWORD_LENGTH} characters"
                )

            # Verify current password
            if not verify_password(current_password, user.password):
                self.logger.warning(
                    f"Wrong current password attempt by user: {user.id}"
                )
                raise AuthenticationError(ERROR_INVALID_PASSWORD)

            # Update password
            user.password = hash_password(new_password)
            self.db.commit()
            self.db.refresh(user)

            self.logger.info(f"Password changed for user: {user.email}")
            return user
        except (ValidationError, AuthenticationError):
            raise
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error changing password: {str(e)}")
            raise DatabaseError("Failed to change password")

    def get_current_user(self, token: str) -> User:
        """
        Get current user from token.

        Args:
            token: JWT token

        Returns:
            User instance

        Raises:
            AuthenticationError: If token is invalid or user not found
            DatabaseError: If database operation fails
        """
        try:
            payload = self.verify_token(token)
            user_id = payload.get("user_id")

            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise AuthenticationError("User not found")

            if not user.is_active:
                raise AuthenticationError(ERROR_USER_INACTIVE)

            return user
        except AuthenticationError:
            raise
        except Exception as e:
            self.logger.error(f"Error getting current user: {str(e)}")
            raise DatabaseError("Failed to get user")
