"""
services/tenant_service.py
==========================
Service for managing tenants in the multi-tenant architecture.
"""

import logging
import re
from typing import Optional

from sqlalchemy.orm import Session

from core.exceptions import DatabaseError, ValidationError, DuplicateResourceError
from models import Tenant

logger = logging.getLogger(__name__)


class TenantService:
    """Service for managing tenant lifecycle."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def create_tenant(self, name: str, slug: str) -> Tenant:
        """
        Create a new tenant.

        Args:
            name: Display name of the tenant
            slug: URL-friendly identifier

        Returns:
            Created Tenant instance
        """
        self._validate_slug(slug)

        existing = self.db.query(Tenant).filter(Tenant.slug == slug).first()
        if existing:
            raise DuplicateResourceError("Tenant", "slug")

        try:
            tenant = Tenant(name=name, slug=slug, is_active=True)
            self.db.add(tenant)
            self.db.commit()
            self.db.refresh(tenant)
            self.logger.info(f"Tenant created successfully: {slug}")
            return tenant
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error creating tenant: {e}")
            raise DatabaseError("Failed to create tenant") from e

    def get_tenant_by_slug(self, slug: str) -> Optional[Tenant]:
        """Lookup tenant by slug."""
        return self.db.query(Tenant).filter(Tenant.slug == slug).first()

    def get_tenant_by_id(self, tenant_id: int) -> Optional[Tenant]:
        """Lookup tenant by ID."""
        return self.db.query(Tenant).filter(Tenant.id == tenant_id).first()

    def set_tenant_status(self, tenant_id: int, is_active: bool) -> Tenant:
        """Activate or suspend a tenant."""
        tenant = self.get_tenant_by_id(tenant_id)
        if not tenant:
            raise ValidationError("Tenant not found")

        try:
            tenant.is_active = is_active
            self.db.commit()
            self.db.refresh(tenant)
            status = "activated" if is_active else "suspended"
            self.logger.info(f"Tenant {tenant.slug} has been {status}.")
            return tenant
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error updating tenant status: {e}")
            raise DatabaseError("Failed to update tenant status") from e

    def _validate_slug(self, slug: str) -> None:
        """Ensure slug contains only lowercase letters, numbers, and hyphens."""
        if not re.match(r"^[a-z0-9-]+$", slug):
            raise ValidationError(
                "Slug must contain only lowercase letters, numbers, and hyphens."
            )
