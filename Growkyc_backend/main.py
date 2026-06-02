"""
FastAPI application entry point for KYC System.
Main application factory with middleware, error handling, and route
configuration.
"""

import logging
import os
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

from core.exceptions import KYCException
from core.middleware import RequestIDMiddleware, TenantContextMiddleware, LoggingMiddleware
from database import close_db, init_db
from routers import (
    admin,
    auth,
    clients,
    compatibility,
    communications,
    dashboard,
    documents,
    integrations,
    kyc,
    payments,
    pexa,
    route_aliases,
)
from routers.edd import router as edd_router
from routers.cases import router as cases_router
from routers.reports import router as reports_router
from schemas import ErrorResponse
from services.expiry_scheduler import start_expiry_scheduler, stop_expiry_scheduler

# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# Lifespan context manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events for FastAPI application.
    Handles startup (database initialization) and shutdown (cleanup) operations.

    With lifespan, the code before 'yield' runs on startup,
    and code after 'yield' runs on shutdown.
    """
    # ==================== STARTUP ====================
    logger.info("=" * 50)
    logger.info("Starting KYC Backend Application")
    logger.info("=" * 50)

    try:
        success = init_db()
        if success:
            logger.info("✓ Database initialized successfully")
            logger.info(
                f"  Database: {os.getenv('DATABASE_URL', 'SQLite (development)')}"
            )
        else:
            logger.warning("⚠ Database initialization encountered issues")
    except Exception as e:
        logger.error(f"✗ Failed to initialize database: {str(e)}")
    # Startup environment sanity checks
    secret = os.getenv("SECRET_KEY", "")
    if not secret:
        logger.warning("WARNING: SECRET_KEY is not set. Tokens will be insecure.")
    elif len(secret) < 32:
        logger.warning(
            "WARNING: SECRET_KEY appears weak (less than 32 chars). "
            "Rotate in production."
        )

    db_url = os.getenv("DATABASE_URL", "")
    if not db_url:
        logger.warning(
            "WARNING: DATABASE_URL is not set. Using default SQLite for development."
        )

    # Ensure upload directory exists
    upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
    try:
        from pathlib import Path

        Path(upload_dir).mkdir(parents=True, exist_ok=True)
        logger.info(f"Upload directory ready: {upload_dir}")
    except Exception as e:
        logger.warning(f"Could not create upload directory '{upload_dir}': {str(e)}")

    # CORS safety warning for production
    allowed = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:8000,"
        "http://127.0.0.1:3000,http://127.0.0.1:8000",
    )
    if "*" in allowed and os.getenv("ENV", "development").lower() == "production":
        logger.warning(
            "WARNING: ALLOWED_ORIGINS contains wildcard '*' in production. "
            "Restrict CORS in production."
        )
    logger.info(f"✓ FastAPI application ready at /{os.getenv('API_PREFIX', 'api/v1')}")

    # US-026: Start document expiry background scheduler
    start_expiry_scheduler()

    yield  # Application runs here

    # ==================== SHUTDOWN ====================
    logger.info("=" * 50)
    logger.info("Shutting down KYC Backend Application")
    logger.info("=" * 50)

    # US-026: Stop document expiry background scheduler
    stop_expiry_scheduler()

    try:
        close_db()
        logger.info("✓ Database connections closed")
    except Exception as e:
        logger.error(f"✗ Error closing database: {str(e)}")


# Create FastAPI application instance
app = FastAPI(
    title="KYC System API",
    description=(
        "Production-ready Know Your Customer (KYC) verification backend system "
        "with role-based access control, JWT authentication, and "
        "comprehensive audit logging"
    ),
    version="2.0.0",
    summary="Enterprise KYC Management System",
    contact={
        "name": "KYC System Support",
        "url": "https://example.com/support",
        "email": "support@example.com",
    },
    license_info={"name": "Proprietary", "url": "https://example.com/license"},
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# Configure CORS middleware
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,"
    "http://localhost:8000,"
    "http://127.0.0.1:3000,"
    "http://127.0.0.1:8000,"
    "http://localhost:5173,"
    "http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Page-Count"],
    max_age=600,  # Cache preflight requests for 10 minutes
)


# Add application middlewares (order matters)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(TenantContextMiddleware)
app.add_middleware(LoggingMiddleware)


# ==================== CUSTOM EXCEPTION HANDLERS ====================


# Handler for KYCException base class (catches all domain exceptions)
@app.exception_handler(KYCException)
async def kyc_exception_handler(request: Request, exc: KYCException):
    """
    Custom exception handler for KYC domain exceptions.
    Converts domain exceptions to standardized HTTP responses.
    """
    logger.warning(f"Domain exception: {exc.message} (code: {exc.status_code})")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "error_code": exc.status_code,
            "path": str(request.url.path),
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


# Custom exception handler for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Custom HTTP exception handler for consistent error responses.

    Provides structured error responses with error codes and paths.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.status_code,
            "path": str(request.url.path),
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


# Custom global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    General exception handler for unexpected errors.
    Logs errors and returns generic message for security.
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error_code": 500,
            "path": str(request.url.path),
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


# ==================== HEALTH & INFO ENDPOINTS ====================


@app.get(
    "/health",
    tags=["system"],
    summary="Health Check",
    description="Verify API is running and healthy",
)
async def health_check() -> dict:
    """
    Health check endpoint for monitoring and load balancers.

    Returns:
        JSON with status, service name, and version
    """
    return {
        "status": "healthy",
        "service": "KYC Backend API",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get(
    "/",
    tags=["system"],
    summary="API Root",
    description="Get API information and available endpoints",
)
async def root() -> dict:
    """
    Root endpoint providing API information and documentation.

    Returns:
        JSON with API details and links to documentation
    """
    return {
        "message": "Welcome to KYC System API",
        "version": "2.0.0",
        "status": "active",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json",
        },
        "api_endpoints": {
            "authentication": [
                "POST /auth/register - Register new user",
                "POST /auth/login - User login",
                "POST /auth/change-password - Change password",
                "GET /auth/profile - Get current user profile",
                "POST /auth/refresh-token - Refresh JWT token",
            ],
            "kyc_user": [
                "POST /kyc/submit - Submit KYC",
                "POST /kyc/upload-document - Upload KYC document",
                "GET /kyc/status - Get my KYC status",
            ],
            "kyc_admin": [
                "GET /kyc/user/{user_id} - Get user's KYC (admin/agent)",
                "GET /kyc/list - List all KYC records (admin/agent)",
                "POST /kyc/approve/{kyc_id} - Approve KYC (admin/agent)",
                "POST /kyc/reject/{kyc_id} - Reject KYC (admin/agent)",
            ],
            "admin": [
                "GET /admin/dashboard/stats - Dashboard statistics",
                "GET /admin/kyc/pending - List pending KYC",
                "POST /admin/kyc/bulk-approve - Bulk approve KYC",
                "GET /admin/kyc/{kyc_id}/audit-log - KYC audit trail",
                "GET /admin/users - List all users",
                "POST /admin/users/{user_id}/toggle-active - Toggle user status",
                "GET /admin/kyc/stats/by-status - KYC statistics",
            ],
        },
    }


# ==================== ROUTER INCLUSION ====================

# Include routers with API prefix
api_prefix = os.getenv("API_PREFIX", "api/v1")

common_error_responses = {
    401: {"model": ErrorResponse},
    403: {"model": ErrorResponse},
    404: {"model": ErrorResponse},
}

# Compatibility routes are registered first so static aliases such as
# /documents/expiring are not shadowed by dynamic paths like /documents/{id}.
app.include_router(
    compatibility.router,
    prefix=f"/{api_prefix}",
    responses=common_error_responses,
)

if api_prefix != "api":
    app.include_router(
        compatibility.router,
        prefix="/api",
        include_in_schema=False,
        responses=common_error_responses,
    )

# Targeted root-level aliases for legacy frontend paths (minimal, additive)
app.include_router(
    route_aliases.router,
    prefix="",
    include_in_schema=False,
    responses=common_error_responses,
)

app.include_router(
    auth.router,
    prefix=f"/{api_prefix}",
    responses={
        401: {
            "description": "Unauthorized - Invalid or missing authentication",
            "model": ErrorResponse,
        },
        403: {
            "description": "Forbidden - Insufficient permissions",
            "model": ErrorResponse,
        },
        404: {"description": "Not Found", "model": ErrorResponse},
        422: {"description": "Validation Error", "model": ErrorResponse},
    },
)

app.include_router(
    kyc.router,
    prefix=f"/{api_prefix}",
    dependencies=[],
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)

app.include_router(
    admin.router,
    prefix=f"/{api_prefix}",
    dependencies=[],
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)

app.include_router(
    dashboard.router,
    prefix=f"/{api_prefix}",
    dependencies=[],
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)

app.include_router(
    pexa.router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

app.include_router(
    integrations.router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

app.include_router(
    payments.router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

app.include_router(
    clients.router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

app.include_router(
    communications.router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

# Frontend expects /documents/upload — register compatibility router
app.include_router(
    documents.router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

# Phase 6: EDD Workflow router
app.include_router(
    edd_router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

# Phase 7: Enterprise Cases router
app.include_router(
    cases_router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)

# Phase 8: Regulatory Reporting router
app.include_router(
    reports_router,
    prefix=f"/{api_prefix}",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}},
)


def include_versionless_api_aliases() -> None:
    """Expose canonical routers under /api for older frontend callers."""
    if api_prefix == "api":
        return

    alias_routers = [
        auth.router,
        kyc.router,
        admin.router,
        dashboard.router,
        pexa.router,
        integrations.router,
        payments.router,
        clients.router,
        communications.router,
        documents.router,
        edd_router,
        cases_router,
        reports_router,
    ]

    for alias_router in alias_routers:
        app.include_router(
            alias_router,
            prefix="/api",
            include_in_schema=False,
            responses=common_error_responses,
        )


include_versionless_api_aliases()


# ==================== OPENAPI CUSTOMIZATION ====================


def custom_openapi():
    """
    Customize OpenAPI schema for enhanced documentation.
    Adds logo, tags, and server information.
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="KYC System API",
        version="2.0.0",
        description="Enterprise KYC (Know Your Customer) verification backend",
        routes=app.routes,
    )

    # Add custom metadata
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }

    # Add server configuration
    openapi_schema["servers"] = [
        {"url": "http://localhost:8000", "description": "Development"},
        {"url": "https://api.example.com", "description": "Production"},
    ]

    # Expose the existing Authorization: Bearer <token> dependency to Swagger UI.
    # The runtime auth flow still uses get_current_user and the Authorization
    # header; this only restores the OpenAPI lock/Authorize behavior.
    components = openapi_schema.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})
    security_schemes["BearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Enter the JWT access token returned by /auth/login.",
    }

    for path_item in openapi_schema.get("paths", {}).values():
        for operation in path_item.values():
            if not isinstance(operation, dict):
                continue

            parameters = operation.get("parameters", [])
            auth_parameters = [
                parameter
                for parameter in parameters
                if parameter.get("name", "").lower() == "authorization"
                and parameter.get("in") == "header"
            ]
            if not auth_parameters:
                continue

            operation["security"] = [{"BearerAuth": []}]
            operation["parameters"] = [
                parameter
                for parameter in parameters
                if parameter not in auth_parameters
            ]

    # Add tags for organization
    openapi_schema["tags"] = [
        {
            "name": "authentication",
            "description": "User registration, login, and token management",
        },
        {
            "name": "kyc",
            "description": "KYC submission, document upload, and status tracking",
        },
        {
            "name": "admin",
            "description": "Administrative operations and reporting (admin/agent only)",
        },
        {"name": "system", "description": "System health and API information"},
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# ==================== APPLICATION LOGGING ====================

logger.info("=" * 50)
logger.info("KYC Backend Configuration")
logger.info("=" * 50)
logger.info(f"Environment: {os.getenv('ENV', 'development')}")
logger.info(f"API Prefix: /{api_prefix}")
logger.info(f"Database: {os.getenv('DATABASE_URL', 'SQLite (development)')}")
logger.info(f"JWT Algorithm: {os.getenv('JWT_ALGORITHM', 'HS256')}")
logger.info(
    f"Access Token Expiry: {os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '30')} minutes"
)
logger.info(f"CORS Origins: {', '.join([o.strip() for o in allowed_origins])}")
logger.info("=" * 50)


# ==================== PRODUCTION ENTRY POINT ====================

if __name__ == "__main__":
    import uvicorn

    # Run the application with uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    env = os.getenv("ENV", "development").lower()
    reload = env == "development"
    log_level = os.getenv("LOG_LEVEL", "info").lower()

    logger.info(f"Starting uvicorn server at {host}:{port}")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level=log_level,
        access_log=True,
    )
