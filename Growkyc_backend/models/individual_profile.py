"""
models/individual_profile.py
============================
IndividualProfile — extended personal data for individual-type Clients.

NEW enterprise table. Uses TenantRequiredMixin (tenant_id nullable=False).
One-to-one with Client (client_id is unique).

Rationale: keeps personally identifiable information (PII) cleanly separated
from the base Client record, enabling field-level access controls and
GDPR-aligned data compartmentalization in future phases.
"""

from datetime import datetime, timezone

from sqlalchemy import (Column, DateTime, ForeignKey, Index, Integer, String,
                        Text)
from sqlalchemy.orm import relationship

from models.base import Base


class IndividualProfile(Base):
    """
    Extended personal profile for individual KYC clients.

    Linked one-to-one with Client. Stores PII fields that are not required
    for the core compliance workflow but are needed for enhanced due diligence
    (EDD) and identity verification.
    """

    __tablename__ = "individual_profiles"

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

    # ---- Personal identity ----
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    middle_name = Column(String(255), nullable=True)
    dob = Column(DateTime, nullable=True, comment="Date of birth (UTC-aware)")
    gender = Column(String(20), nullable=True)
    nationality = Column(String(100), nullable=True)
    country_of_birth = Column(String(100), nullable=True)
    place_of_birth = Column(String(255), nullable=True)

    # ---- Identity documents ----
    passport_number = Column(String(50), nullable=True)
    passport_country = Column(String(100), nullable=True)
    passport_expiry = Column(DateTime, nullable=True)
    national_id_number = Column(String(100), nullable=True)
    tax_file_number = Column(String(50), nullable=True)  # TFN (AU)

    # ---- Employment / Financial ----
    occupation = Column(String(255), nullable=True)
    employer_name = Column(String(255), nullable=True)
    annual_income_range = Column(String(100), nullable=True)
    source_of_funds = Column(String(255), nullable=True)
    source_of_wealth = Column(Text, nullable=True)

    # ---- Contact / Address ----
    residential_address = Column(Text, nullable=True)
    mailing_address = Column(Text, nullable=True)
    mobile_phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)

    # ---- PEP / Sanctions flags ----
    is_pep = Column(
        Integer,  # Use Integer as Boolean for SQLite compat (0/1)
        default=0,
        nullable=False,
        comment="Politically Exposed Person flag",
    )
    pep_details = Column(Text, nullable=True)

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
        back_populates="individual_profile",
        lazy="select",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_individual_profiles_client_id", "client_id"),
        Index("idx_individual_profiles_tenant_id", "tenant_id"),
        Index("idx_individual_profiles_nationality", "nationality"),
    )

    def __repr__(self) -> str:
        return (
            f"<IndividualProfile(id={self.id}, client_id={self.client_id}, "
            f"name={self.first_name!r} {self.last_name!r})>"
        )
