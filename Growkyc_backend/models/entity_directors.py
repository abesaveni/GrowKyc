"""
models/entity_directors.py
==========================
Entity Directors table representing corporate officers, secretaries,
and authorized signatories for KYB compliance.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import relationship

from models.base import Base


class EntityDirector(Base):
    __tablename__ = "entity_directors"

    id = Column(Integer, primary_key=True, index=True)

    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )

    full_name = Column(String(500), nullable=False)
    role = Column(
        String(100), nullable=False, comment="director|secretary|signatory|controller"
    )
    appointment_date = Column(DateTime, nullable=True)
    nationality = Column(String(100), nullable=True)
    dob = Column(DateTime, nullable=True)
    identification_reference = Column(String(100), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    client = relationship("Client", backref="directors", lazy="select")

    __table_args__ = (
        Index("idx_entity_directors_client_id", "client_id"),
        Index("idx_entity_directors_tenant_id", "tenant_id"),
    )

    def __repr__(self):
        return (
            f"<EntityDirector(id={self.id}, name={self.full_name}, role={self.role})>"
        )
