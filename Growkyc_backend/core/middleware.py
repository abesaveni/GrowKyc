"""
core/middleware.py
==================
Custom middleware for tenant context, request tracing, and logging.
"""

import logging
import time
import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from auth.jwt_handler import decode_token_unsafe
from core.tenant_context import (clear_tenant_id, set_correlation_id,
                                 set_tenant_id)

logger = logging.getLogger(__name__)


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Add a simple X-Request-ID header for tracing.
    Also initializes the global `correlation_id` contextvar.
    """

    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("x-request-id") or uuid.uuid4().hex
        set_correlation_id(req_id)

        response = await call_next(request)
        response.headers["X-Request-ID"] = req_id
        return response


class TenantContextMiddleware(BaseHTTPMiddleware):
    """
    Extracts tenant_id from JWT payload and initializes the contextvar.
    Fails closed: If no valid tenant is found, context remains unset (None),
    which causes DB queries to return empty.
    """

    async def dispatch(self, request: Request, call_next):
        # 1. Clear any leaked state from thread pool reuse
        clear_tenant_id()

        # 2. Extract Authorization header
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                # Use unsafe decode to quickly grab tenant_id before hitting DB.
                # Full validation happens later in dependencies.py.
                payload = decode_token_unsafe(token)
                if payload and "tenant_id" in payload:
                    tenant_id = int(payload["tenant_id"])
                    set_tenant_id(tenant_id)
            except Exception as e:
                logger.warning(f"Failed to extract tenant_id from token: {e}")

        # 3. Process Request
        try:
            response = await call_next(request)
            return response
        finally:
            # 4. Cleanup context
            clear_tenant_id()


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging all requests and responses with correlation ID."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Try to get user from token
        user_id = "anonymous"
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            user_id = "authenticated"

        response = await call_next(request)

        elapsed_time = time.time() - start_time
        status_code = response.status_code

        log_message = (
            f"{request.method} {request.url.path} | "
            f"Status: {status_code} | "
            f"User: {user_id} | "
            f"IP: {request.client.host if request.client else 'unknown'} | "
            f"Duration: {elapsed_time:.3f}s"
        )

        if status_code >= 500:
            logger.error(log_message)
        elif status_code >= 400:
            logger.warning(log_message)
        else:
            logger.info(log_message)

        return response
