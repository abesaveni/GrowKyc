"""
core/tenant_context.py
======================
Context variables for request-scoped tenant isolation and tracing.

These context variables allow SQLAlchemy event listeners and logging formatters
to dynamically access the current tenant and correlation IDs without passing
them explicitly through every service and repository layer function.

- current_tenant_id: Integer ID of the active tenant.
- correlation_id: UUID string for cross-system request tracing.
"""

from contextvars import ContextVar
from typing import Optional

# Global context variables (thread-safe and async-safe via contextvars)
current_tenant_id: ContextVar[Optional[int]] = ContextVar(
    "current_tenant_id", default=None
)
correlation_id: ContextVar[Optional[str]] = ContextVar("correlation_id", default=None)


def set_tenant_id(tenant_id: int) -> None:
    """Set the current tenant ID in the request context."""
    current_tenant_id.set(tenant_id)


def get_tenant_id() -> Optional[int]:
    """Get the current tenant ID from the request context."""
    return current_tenant_id.get()


def clear_tenant_id() -> None:
    """Clear the current tenant ID (fail closed)."""
    current_tenant_id.set(None)


def set_correlation_id(req_id: str) -> None:
    """Set the correlation ID in the request context."""
    correlation_id.set(req_id)


def get_correlation_id() -> Optional[str]:
    """Get the current correlation ID."""
    return correlation_id.get()
