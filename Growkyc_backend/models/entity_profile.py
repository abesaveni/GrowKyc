"""
models/entity_profile.py
========================
EntityProfile — extended corporate/entity data for business-type Clients.

NEW enterprise table. Uses TenantRequiredMixin (tenant_id nullable=False).
One-to-one with Client (client_id is unique).

Covers: companies, trusts, partnerships, and other legal entities
subject to KYC/AML obligations under AustLII, FATF, and AUSTRAC guidelines.
"""

from datetime import datetime, timezone

from sqlalchemy import (Column, DateTime, ForeignKey, Index, Integer, String,
                        Text)
from sqlalchemy.orm import relationship

from models.base import Base


class EntityProfile(Base):
    """
    Extended corporate profile for business/entity KYC clients.

    Linked one-to-one with Client. Stores corporate registration,
    business activity, and registered address data required for
    Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD).
    """

    __tablename__ = "entity_profiles"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Parent link (one-to-one with Client) ----
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # ---- Mandatory tenant scope (new table: nullable=False) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,  # New table: mandatory tenant scope
        index=True,
    )

    # ---- Legal identity ----
    legal_name = Column(
        String(500), nullable=False, comment="Full registered legal name"
    )
    trading_name = Column(String(500), nullable=True, comment="DBA / trading name")
    entity_type = Column(
        String(100),
        nullable=True,
        comment="company | trust | partnership | sole_trader | government",
    )

    # ---- Australian registration numbers ----
    abn = Column(String(11), nullable=True, comment="Australian Business Number")
    acn = Column(String(9), nullable=True, comment="Australian Company Number")
    arbn = Column(String(9), nullable=True, comment="Australian Registered Body Number")
    tfn = Column(String(9), nullable=True, comment="Tax File Number")

    # ---- International registration ----
    incorporation_country = Column(String(100), nullable=True)
    incorporation_date = Column(DateTime, nullable=True)
    registration_number = Column(String(100), nullable=True)
    lei = Column(String(20), nullable=True, comment="Legal Entity Identifier")

    # ---- Business details ----
    business_activity = Column(
        Text, nullable=True, comment="Primary business activity description"
    )
    industry_code = Column(
        String(20), nullable=True, comment="ANZSIC/NACE industry code"
    )
    annual_revenue_range = Column(String(100), nullable=True)
    number_of_employees = Column(Integer, nullable=True)
    website = Column(String(500), nullable=True)

    # ---- Addresses ----
    registered_address = Column(Text, nullable=True)
    principal_place_of_business = Column(Text, nullable=True)
    mailing_address = Column(Text, nullable=True)

    # ---- Contact ----
    contact_name = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)

    # ---- Regulatory flags ----
    is_regulated_entity = Column(
        Integer,
        default=0,
        nullable=False,
        comment="1 if subject to AUSTRAC, ASIC, or other regulatory oversight",
    )
    regulatory_body = Column(String(255), nullable=True)
    regulatory_licence_number = Column(String(100), nullable=True)
    is_listed_company = Column(Integer, default=0, nullable=False)
    listing_exchange = Column(String(100), nullable=True)

    # ---- Timestamps ----
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
    client = relationship(
        "Client",
        back_populates="entity_profile",
        lazy="select",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_entity_profiles_client_id", "client_id"),
        Index("idx_entity_profiles_tenant_id", "tenant_id"),
        Index("idx_entity_profiles_abn", "abn"),
        Index("idx_entity_profiles_acn", "acn"),
        Index("idx_entity_profiles_legal_name", "legal_name"),
    )

    def __repr__(self) -> str:
        return (
            f"<EntityProfile(id={self.id}, client_id={self.client_id}, "
            f"legal_name={self.legal_name!r})>"
        )
