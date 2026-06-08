"""
Routers module for KYC API endpoints.
Exports all API routers for use in main application.
"""

from . import admin, auth, kyc
from .admin import router as admin_router
# For backward compatibility
from .auth import router as auth_router
from .kyc import router as kyc_router

__all__ = [
    # New imports (preferred)
    "auth",
    "kyc",
    "admin",
    # Legacy imports (for backward compatibility)
    "auth_router",
    "kyc_router",
    "admin_router",
]
