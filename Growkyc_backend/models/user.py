"""
models/user.py
==============
User model — authentication, profile, and role management.

Preserved verbatim from the original monolithic models.py.
Added: tenant_id (nullable=True, Phase 1 multi-tenancy preparation).

Imports: use `from models import User` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import relationship

from core.enums import UserRole
from models.base import Base


class User(Base):
    """User model for authentication and profile management."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)

    # ---- Timestamps ----
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    is_active = Column(Boolean, default=True, nullable=False)

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,  # Phase 1: existing users have no tenant
        index=True,
    )

    # ---- Relationships ----
    tenant = relationship(
        "Tenant",
        back_populates="users",
        foreign_keys=[tenant_id],
        lazy="select",
    )
    kyc_records = relationship(
        "KYC",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    clients = relationship(
        "Client",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    audit_logs = relationship(
        "KYCAuditLog",
        foreign_keys="KYCAuditLog.changed_by",
        back_populates="changed_by_user",
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    review_approvals = relationship(
        "ReviewApproval",
        foreign_keys="ReviewApproval.reviewer_id",
        back_populates="reviewer",
    )
    override_reasons = relationship(
        "OverrideReason",
        foreign_keys="OverrideReason.reviewer_id",
        back_populates="reviewer",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_users_email", "email"),
        Index("idx_users_role", "role"),
        Index("idx_users_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email!r}, role={self.role})>"
