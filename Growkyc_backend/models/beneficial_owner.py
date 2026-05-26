"""
models/beneficial_owner.py
==========================
BeneficialOwner — Ultimate Beneficial Owner (UBO) records for a Client.

NEW enterprise table. Uses tenant_id nullable=False (new table from inception).

Supports:
- Direct and indirect ownership percentages
- Control persons (directors, trustees, signatories)
- Layered ownership structures (nested via parent_owner_id)
- Trust structure metadata
- PEP / sanctions flags at owner level
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from models.base import Base


class BeneficialOwner(Base):
    """
    Ultimate Beneficial Owner record linked to a Client.

    FATF Recommendation 10 compliance: entities must identify and verify
    all natural persons who own or control more than a threshold
    (typically 10–25%) of the client entity, or who otherwise exercise
    control through other means.

    Supports layered structures via self-referential parent_owner_id.
    """

    __tablename__ = "beneficial_owners"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Parent client ----
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ---- Mandatory tenant scope ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,  # New table: mandatory tenant scope
        index=True,
    )

    # ---- Removed parent_owner_id (Moved to OwnershipRelationship) ----

    # ---- Identity ----
    full_name = Column(String(500), nullable=False)
    dob = Column(DateTime, nullable=True)
    nationality = Column(String(100), nullable=True)
    country_of_residence = Column(String(100), nullable=True)
    id_document_type = Column(String(100), nullable=True)
    id_document_number = Column(String(100), nullable=True)
    id_document_expiry = Column(DateTime, nullable=True)
    tax_identification_number = Column(String(100), nullable=True)

    # ---- Ownership details ----
    ownership_percentage = Column(
        Float, nullable=True,
        comment="Direct ownership percentage (0.0 – 100.0)",
    )
    ownership_type = Column(
        String(100), nullable=True,
        comment="direct | indirect | trust_beneficiary | trustee | settlor",
    )
    is_control_person = Column(
        Integer, default=0, nullable=False,
        comment="1 if the person exercises control regardless of ownership %",
    )
    control_mechanism = Column(
        String(255), nullable=True,
        comment="e.g. director, trustee, power_of_attorney, signatory",
    )

    # ---- Trust structure support ----
    is_trust_structure = Column(Integer, default=0, nullable=False)
    trust_name = Column(String(500), nullable=True)
    trust_type = Column(String(100), nullable=True)
    trust_jurisdiction = Column(String(100), nullable=True)

    # ---- Compliance flags ----
    is_pep = Column(Integer, default=0, nullable=False)
    pep_details = Column(Text, nullable=True)
    is_sanctioned = Column(Integer, default=0, nullable=False)
    sanctions_details = Column(Text, nullable=True)
    is_adverse_media = Column(Integer, default=0, nullable=False)

    # ---- Verification status ----
    verification_status = Column(
        String(50), default="pending", nullable=False,
        comment="pending | verified | failed | requires_review",
    )
    verification_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)

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
        back_populates="beneficial_owners",
        lazy="select",
    )
    # The parent/child relationships are handled dynamically via OwnershipRelationship backrefs

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_beneficial_owners_client_id", "client_id"),
        Index("idx_beneficial_owners_tenant_id", "tenant_id"),
        Index("idx_beneficial_owners_is_pep", "is_pep"),
        Index("idx_beneficial_owners_is_sanctioned", "is_sanctioned"),
    )

    def __repr__(self) -> str:
        return (
            f"<BeneficialOwner(id={self.id}, client_id={self.client_id}, "
            f"name={self.full_name!r}, ownership={self.ownership_percentage}%)>"
        )
