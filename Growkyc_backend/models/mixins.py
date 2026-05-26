"""
models/mixins.py
================
Reusable SQLAlchemy declarative mixins for enterprise AML/KYC models.

Design Rules:
- Mixins use MappedColumn / declared_attr for proper 2.0 compatibility.
- All timestamp columns are timezone-aware (UTC).
- TenantMixin is optional on existing tables (nullable=True for Phase 1 compat).
- For NEW enterprise tables use TenantRequiredMixin (nullable=False).
- Mixins do NOT define __tablename__ — each model does that itself.

Usage:
    class MyModel(TimestampMixin, Base):
        __tablename__ = "my_table"
        id = Column(Integer, primary_key=True)
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import declared_attr


# ---------------------------------------------------------------------------
# Timestamp helpers
# ---------------------------------------------------------------------------


def _utcnow() -> datetime:
    """Return the current UTC-aware datetime."""
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Mixins
# ---------------------------------------------------------------------------


class TimestampMixin:
    """
    Adds created_at and updated_at columns to a model.

    Both columns are timezone-aware and default to UTC.
    updated_at is automatically refreshed on every UPDATE.
    """

    created_at = Column(
        DateTime(timezone=True),
        default=_utcnow,
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )


class SoftDeleteMixin:
    """
    Adds a deleted_at column for soft-delete support.

    When deleted_at is set, the row is considered logically deleted.
    Queries should filter WHERE deleted_at IS NULL for active records.

    Note: Soft-delete enforcement is done at the service layer, not the DB.
    """

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    @property
    def is_deleted(self) -> bool:
        """Return True if this record has been soft-deleted."""
        return self.deleted_at is not None


class AuditFieldsMixin:
    """
    Adds created_by and updated_by actor tracking columns.

    These reference users.id (nullable to support system-generated records).
    Complement TimestampMixin for full auditability.
    """

    @declared_attr
    def created_by(cls):
        return Column(
            Integer,
            ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        )

    @declared_attr
    def updated_by(cls):
        return Column(
            Integer,
            ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        )


class TenantMixin:
    """
    Adds an OPTIONAL tenant_id FK to existing legacy tables.

    Phase 1: nullable=True — no existing data is broken.
    Phase 4: A follow-up migration will make this nullable=False
             after backfilling all historical rows.

    Use this mixin on ALL existing tables being upgraded toward multi-tenancy.
    """

    @declared_attr
    def tenant_id(cls):
        return Column(
            Integer,
            ForeignKey("tenants.id", ondelete="SET NULL"),
            nullable=True,   # Phase 1: safe for legacy data
            index=True,
        )


class TenantRequiredMixin:
    """
    Adds a MANDATORY tenant_id FK for NEW enterprise tables.

    All new tables (screening_records, risk_assessments, beneficial_owners,
    alerts, integrations, enterprise_notifications) must be tenant-scoped
    from inception — nullable=False.
    """

    @declared_attr
    def tenant_id(cls):
        return Column(
            Integer,
            ForeignKey("tenants.id", ondelete="CASCADE"),
            nullable=False,  # New tables: always tenant-scoped
            index=True,
        )
