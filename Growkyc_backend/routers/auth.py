"""
Authentication router for user registration, login, and token management.
Delegates all business logic to AuthService.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from core.exceptions import (AuthenticationError, DatabaseError,
                             DuplicateResourceError, ValidationError)
from core.limiter import limiter
from database import get_db
from dependencies import get_current_user
from models import User
from schemas import (PasswordChangeRequest, TokenResponse, UserLoginRequest,
                     UserRegisterRequest, UserResponse)
from services.auth_service import AuthService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("5/minute")
async def register(
    request: Request, body: UserRegisterRequest, db: Session = Depends(get_db)
) -> TokenResponse:
    """Register a new user account and return JWT token."""
    try:
        service = AuthService(db)
        user = service.register_user(body.name, body.email, body.password, role=body.role)
        access_token = service.create_access_token(
            user.id,
            tenant_id=user.tenant_id,
            role=user.role.value if hasattr(user.role, "value") else user.role,
        )
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=30 * 60,
            user=UserResponse.model_validate(user),
        )
    except (ValidationError, DuplicateResourceError) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError as e:
        logger.exception("Registration failed: %s", e.message)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(
    request: Request, body: UserLoginRequest, db: Session = Depends(get_db)
) -> TokenResponse:
    """Authenticate user and return JWT access token."""
    try:
        service = AuthService(db)
        user = service.authenticate_user(body.email, body.password)
        access_token = service.create_access_token(
            user.id,
            tenant_id=user.tenant_id,
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
@limiter.limit("5/minute")
async def change_password(
    request: Request,
    body: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Change password for authenticated user."""
    try:
        service = AuthService(db)
        service.change_password(
            current_user, body.current_password, body.new_password
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
@limiter.limit("20/minute")
async def refresh_token(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Refresh JWT access token using current authentication."""
    try:
        # Re-fetch user from DB to ensure account is still active and not locked
        user = db.query(User).filter(User.id == current_user.id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive or not found",
            )

        service = AuthService(db)
        new_token = service.create_access_token(
            user.id,
            tenant_id=user.tenant_id,
            role=user.role.value if hasattr(user.role, "value") else user.role,
        )

        return TokenResponse(
            access_token=new_token,
            token_type="bearer",
            expires_in=30 * 60,
            user=UserResponse.model_validate(user),
        )
    except HTTPException:
        raise
    except AuthenticationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh token",
        )
