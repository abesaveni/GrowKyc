"""
models/integration.py
=====================
Integration — external provider configuration records per tenant.

NEW enterprise table. tenant_id nullable=False from inception.

Tracks: Xero, AUSTRAC, ASIC, ComplyAdvantage, Refinitiv, payment providers,
and any other third-party system integrated at the tenant level.

Config stored as JSON — never store credentials here; use a secrets manager.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from models.base import Base


class Integration(Base):
    """
    External provider integration configuration for a Tenant.

    Each row represents one provider connection for one tenant.
    Status tracks whether the integration is active, in error, or disabled.
    """

    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)

    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,  # New table: mandatory
        index=True,
    )

    # ---- Provider identity ----
    provider_name = Column(
        String(100), nullable=False, index=True,
        comment="xero|austrac|asic|comply_advantage|refinitiv|stripe|pexa|custom",
    )
    provider_display_name = Column(String(255), nullable=True)
    integration_type = Column(
        String(100), nullable=True,
        comment="accounting|regulatory|screening|payment|property|custom",
    )

    # ---- Status ----
    status = Column(
        String(50), nullable=False, default="inactive", index=True,
        comment="active|inactive|error|pending_setup|suspended",
    )
    error_message = Column(Text, nullable=True)

    # ---- Configuration (non-sensitive metadata only) ----
    # WARNING: Do NOT store API keys or secrets here.
    # Use AWS Secrets Manager / Azure Key Vault / HashiCorp Vault.
    config = Column(
        JSON, nullable=True,
        comment=(
            "Non-sensitive config: base_url, org_id, webhook_url, "
            "api_version, feature_flags, etc."
        ),
    )
    webhook_url = Column(String(1000), nullable=True)
    api_version = Column(String(50), nullable=True)

    # ---- Sync tracking ----
    last_synced_at = Column(DateTime(timezone=True), nullable=True, index=True)
    next_sync_at = Column(DateTime(timezone=True), nullable=True)
    sync_frequency_minutes = Column(Integer, nullable=True, default=1440)

    # ---- Audit ----
    created_by_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="NO ACTION"), nullable=True
    )
    updated_by_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="NO ACTION"), nullable=True
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ---- Relationships ----
    tenant = relationship("Tenant", back_populates="integrations", lazy="select")

    __table_args__ = (
        Index("idx_integrations_tenant_id", "tenant_id"),
        Index("idx_integrations_provider_name", "provider_name"),
        Index("idx_integrations_status", "status"),
        # One active integration per provider per tenant
        Index("idx_integrations_tenant_provider", "tenant_id", "provider_name"),
    )

    def __repr__(self) -> str:
        return (
            f"<Integration(id={self.id}, tenant_id={self.tenant_id}, "
            f"provider={self.provider_name!r}, status={self.status!r})>"
        )
