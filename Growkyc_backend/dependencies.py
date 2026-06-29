"""
Dependency injection functions for FastAPI endpoints.
Provides JWT authentication via AuthService, role-based access control,
and common dependencies.
"""

import logging
from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from core.enums import UserRole
from core.exceptions import AuthenticationError
from core.tenant_context import get_tenant_id
from database import get_db
from models import Tenant, User
from services.auth_service import AuthService
from services.tenant_service import TenantService

logger = logging.getLogger(__name__)


async def get_current_user(
    authorization: Optional[str] = Header(None), db: Session = Depends(get_db)
) -> User:
    """
    Extract and validate JWT token from Authorization header via AuthService.
    Returns current authenticated user from database.

    Args:
        authorization: Authorization header containing "Bearer <token>"
        db: SQLAlchemy database session

    Returns:
        User ORM object of the authenticated user

    Raises:
        HTTPException: If token is invalid, expired, or user not found/inactive

    Example:
        @app.get("/profile")
        async def get_profile(current_user: User = Depends(get_current_user)):
            return {
                "id": current_user.id,
                "email": current_user.email,
                "role": current_user.role
            }
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]

    try:
        service = AuthService(db)
        payload = service.verify_token(token)

        # Prevent cross-tenant token abuse
        token_tenant_id = payload.get("tenant_id")
        active_tenant_id = get_tenant_id()

        if active_tenant_id is not None and token_tenant_id != active_tenant_id:
            logger.critical(
                "Cross-tenant token abuse attempt! "
                f"Token tenant: {token_tenant_id}, "
                f"Active tenant: {active_tenant_id}"
            )
            raise AuthenticationError("Invalid token context")

        user = service.get_current_user(token)
        return user
    except AuthenticationError as e:
        logger.warning(f"Authentication failed: {e.message}")
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error validating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
    finally:
        # Ensure tenant context is never leaked to the next request in thread-pool reuse
        from core.tenant_context import clear_tenant_id as _clear
        _clear()


async def get_current_tenant(db: Session = Depends(get_db)) -> Tenant:
    """
    Dependency to resolve the current active Tenant from context.

    Raises:
        HTTPException 401: If no tenant context is established.
        HTTPException 403: If tenant is suspended or not found.
    """
    tenant_id = get_tenant_id()
    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tenant context missing or unauthorized",
        )

    service = TenantService(db)
    tenant = service.get_tenant_by_id(tenant_id)

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tenant not found",
        )

    if not tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tenant account is suspended",
        )

    return tenant


async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Role-based access control: Admin only.

    Use this dependency on admin-only endpoints.

    Args:
        current_user: The authenticated user from get_current_user

    Returns:
        User object if user has Admin role

    Raises:
        HTTPException 403: If user is not an admin

    Example:
        @app.delete("/kyc/{kyc_id}")
        async def delete_kyc(
            kyc_id: int,
            admin: User = Depends(get_admin_user)
        ):
            # Only admin can execute this
            pass
    """
    if current_user.role != UserRole.ADMIN:
        logger.warning(
            f"Admin endpoint access attempt by {current_user.role} "
            f"user: {current_user.id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )

    return current_user


async def get_admin_or_agent_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Role-based access control: Admin or Agent.

    Use this dependency on endpoints requiring admin or agent privileges.

    Args:
        current_user: The authenticated user from get_current_user

    Returns:
        User object if user has Admin or Agent role

    Raises:
        HTTPException 403: If user is neither admin nor agent

    Example:
        @app.post("/kyc/{kyc_id}/approve")
        async def approve_kyc(
            kyc_id: int,
            agent: User = Depends(get_admin_or_agent_user)
        ):
            # Only admin or agent can execute this
            pass
    """
    if current_user.role not in (UserRole.ADMIN, UserRole.AGENT):
        logger.warning(
            f"Agent/Admin endpoint access attempt by "
            f"{current_user.role}: {current_user.id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Agent privileges required",
        )

    return current_user


def require_role(allowed_roles: list[str]):
    """
    Role-based access control (RBAC) dependency.

    Args:
        allowed_roles: A list of allowed role string values (e.g., ["Admin", "Analyst"])

    Returns:
        Dependency checker for FastAPI routes

    Example:
        @app.get("/analytics")
        async def get_analytics(
            user: User = Depends(require_role(["Admin", "Analyst"]))
        ):
            pass
    """

    async def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        user_role = (
            current_user.role.value
            if hasattr(current_user.role, "value")
            else current_user.role
        )
        if user_role not in allowed_roles:
            logger.warning(
                f"Endpoint access attempt by unauthorized {user_role} "
                f"user: {current_user.id}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required one of roles: {', '.join(allowed_roles)}",
            )
        return current_user

    return role_checker


def require_permission(permission: str):
    """Permission-based access control dependency (RBAC matrix).

    Prefer this over role lists: it checks the single source-of-truth matrix in
    core/permissions.py, so endpoints declare the capability they need rather
    than hard-coding which roles have it.

    Example:
        @router.post("/cases")
        async def create_case(
            user: User = Depends(require_permission("case:create"))
        ):
            ...
    """

    async def permission_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        from core.permissions import has_permission

        if not has_permission(current_user.role, permission):
            role_value = (
                current_user.role.value
                if hasattr(current_user.role, "value")
                else current_user.role
            )
            logger.warning(
                "Permission denied: user %s (role %s) lacks %s",
                current_user.id,
                role_value,
                permission,
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {permission}",
            )
        return current_user

    return permission_checker


async def get_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verify that user is active.

    Already checked in get_current_user, but provided for clarity.

    Args:
        current_user: The authenticated user

    Returns:
        User object if active

    Raises:
        HTTPException 403: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is not active",
        )

    return current_user


def get_pagination_params(skip: int = 0, limit: int = 10) -> dict:
    """
    Extract pagination parameters from query string.

    Args:
        skip: Number of records to skip (default 0)
        limit: Number of records to return (default 10, max 100)

    Returns:
        Dict with skip and limit values

    Example:
        @app.get("/users")
        async def list_users(
            params: dict = Depends(get_pagination_params),
            db: Session = Depends(get_db)
        ):
            users = db.query(User).offset(params['skip']).limit(params['limit']).all()
            return {"total": len(users), "items": users}
    """
    if skip < 0:
        skip = 0
    if limit < 1:
        limit = 1
    if limit > 100:
        limit = 100

    return {"skip": skip, "limit": limit}
