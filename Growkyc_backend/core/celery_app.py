"""
core/celery_app.py
==================
Celery application instance and custom TenantAwareTask class.
"""

import logging
import os
from typing import Any

from celery import Celery, Task

from core.tenant_context import set_correlation_id, set_tenant_id, clear_tenant_id

logger = logging.getLogger(__name__)

# Initialize Celery app
celery_app = Celery(
    "kyc_worker",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0"),
    include=["tasks.screening_tasks", "tasks.notification_tasks", "tasks.document_tasks"],
)

# Optional configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1,  # Fair distribution
)


class TenantAwareTask(Task):
    """
    Custom Celery Task class that restores the tenant context and correlation ID
    before executing the business logic, and clears it afterward.

    Tasks inheriting from this MUST accept `tenant_id` and `correlation_id`
    in their kwargs if they need tenant context.
    """
    abstract = True

    def __call__(self, *args: Any, **kwargs: Any) -> Any:
        tenant_id = kwargs.get("tenant_id")
        req_id = kwargs.get("correlation_id")

        if tenant_id is not None:
            set_tenant_id(tenant_id)
        else:
            clear_tenant_id()

        if req_id is not None:
            set_correlation_id(req_id)

        try:
            # Execute the original task
            return super().__call__(*args, **kwargs)
        finally:
            # Always clear context after task completion
            clear_tenant_id()

celery_app.Task = TenantAwareTask
