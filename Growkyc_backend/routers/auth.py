"""
Authentication router for user registration, login, and token management.
Delegates all business logic to AuthService.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.exceptions import (
    AuthenticationError,
    DatabaseError,
    DuplicateResourceError,
    ValidationError,
)
from database import get_db
from dependencies import get_current_user
from models import User
from schemas import (
    PasswordChangeRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from services.auth_service import AuthService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    request: UserRegisterRequest, db: Session = Depends(get_db)
) -> UserResponse:
    """Register a new user account."""
    try:
        service = AuthService(db)
        user = service.register_user(request.name, request.email, request.password)
        return UserResponse.model_validate(user)
    except (ValidationError, DuplicateResourceError) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError as e:
        logger.exception("Registration failed: %s", e.message)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    request: UserLoginRequest, db: Session = Depends(get_db)
) -> TokenResponse:
    """Authenticate user and return JWT access token."""
    try:
        service = AuthService(db)
        user = service.authenticate_user(request.email, request.password)
        access_token = service.create_access_token(
            user.id,
            role=user.role.value if hasattr(user.role, "value") else user.role,
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=30 * 60,  # 30 minutes in seconds
            user=UserResponse.model_validate(user),
        )
    except AuthenticationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed",
        )


@router.post("/change-password")
async def change_password(
    request: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Change password for authenticated user."""
    try:
        service = AuthService(db)
        service.change_password(
            current_user, request.current_password, request.new_password
        )

        return {"message": "Password changed successfully"}
    except (ValidationError, AuthenticationError) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password",
        )


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Get current authenticated user's profile."""
    return UserResponse.model_validate(current_user)


@router.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Refresh JWT access token using current authentication."""
    try:
        service = AuthService(db)
        # Verify user still exists and is active
        user = service.get_current_user(
            service.create_access_token(
                current_user.id,
                role=(
                    current_user.role.value
                    if hasattr(current_user.role, "value")
                    else current_user.role
                ),
            )
        )

        new_token = service.create_access_token(
            user.id,
            role=user.role.value if hasattr(user.role, "value") else user.role,
        )

        return TokenResponse(
            access_token=new_token,
            token_type="bearer",
            expires_in=30 * 60,
            user=UserResponse.model_validate(user),
        )
    except AuthenticationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh token",
        )
