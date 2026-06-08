"""
models/ownership_relationships.py
=================================
Edge table for establishing complex M:N ownership graphs (UBO layers).
"""

from datetime import datetime, timezone

from sqlalchemy import (Column, DateTime, Float, ForeignKey, Index, Integer,
                        String)
from sqlalchemy.orm import relationship

from models.base import Base


class OwnershipRelationship(Base):
    """
    Connects two BeneficialOwner records in a parent/child relationship
    to model layered holding companies, trusts, and shell structures.
    """

    __tablename__ = "ownership_relationships"

    id = Column(Integer, primary_key=True, index=True)

    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )

    # Parent owner (e.g. the Holding Company or Trust)
    parent_owner_id = Column(
        Integer,
        ForeignKey("beneficial_owners.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )
    # Child owner (e.g. the Subsidiary or natural person)
    child_owner_id = Column(
        Integer,
        ForeignKey("beneficial_owners.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )

    relationship_type = Column(
        String(100), nullable=False, comment="owns|controls|trustee_of"
    )
    percentage_control = Column(Float, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    parent_owner = relationship(
        "BeneficialOwner", foreign_keys=[parent_owner_id], backref="child_relationships"
    )
    child_owner = relationship(
        "BeneficialOwner", foreign_keys=[child_owner_id], backref="parent_relationships"
    )

    __table_args__ = (Index("idx_ownership_rels_tenant_id", "tenant_id"),)
