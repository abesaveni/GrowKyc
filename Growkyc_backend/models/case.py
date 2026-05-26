"""
models/case.py
==============
Case workflow models — Case, Approval, ReviewApproval, ReviewIssue, OverrideReason.

These five models are grouped here because they represent a single tightly-coupled
governance workflow. All five are preserved verbatim from the original monolith.

Added: tenant_id (nullable=True) on Case and Approval for Phase 1 multi-tenancy.

Imports: use `from models import Case, Approval, ReviewApproval, ReviewIssue,
OverrideReason` (unchanged in all consumers).
"""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from core.enums import CaseStatus
from models.base import Base


class Case(Base):
    """Case model representing a specific compliance process for a Client."""

    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(CaseStatus), default=CaseStatus.OPEN, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---- Relationships ----
    client = relationship("Client", back_populates="cases")
    approvals = relationship(
        "Approval",
        back_populates="case",
        cascade="all, delete-orphan",
    )
    review_approvals = relationship(
        "ReviewApproval",
        back_populates="case",
        cascade="all, delete-orphan",
    )
    review_issues = relationship(
        "ReviewIssue",
        back_populates="case",
        cascade="all, delete-orphan",
    )
    override_reasons = relationship(
        "OverrideReason",
        back_populates="case",
        cascade="all, delete-orphan",
    )
    case_alerts = relationship(
        "Alert",
        back_populates="case",
        lazy="select",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_cases_client_id", "client_id"),
        Index("idx_cases_status", "status"),
        Index("idx_cases_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<Case(id={self.id}, client_id={self.client_id}, "
            f"status={self.status})>"
        )


class Approval(Base):
    """Approval model representing sign-offs or reviews for a Case/Client."""

    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(
        Integer,
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    approved_by = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    role = Column(String(50), nullable=False)
    status = Column(String(50), default="Pending", nullable=False)
    timestamp = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Phase 1: Multi-tenancy preparation (nullable=True) ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ---- Relationships ----
    case = relationship("Case", back_populates="approvals")
    client = relationship("Client", back_populates="approvals")
    approver = relationship("User", foreign_keys=[approved_by])

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_approvals_case_id", "case_id"),
        Index("idx_approvals_client_id", "client_id"),
        Index("idx_approvals_status", "status"),
        Index("idx_approvals_tenant_id", "tenant_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<Approval(id={self.id}, case_id={self.case_id}, "
            f"status={self.status!r})>"
        )


class ReviewApproval(Base):
    """Governance review approval step for a Case."""

    __tablename__ = "review_approvals"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(
        Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False
    )
    reviewer_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    reviewer_role = Column(String(50), nullable=False)
    decision = Column(String(50), nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Relationships ----
    case = relationship("Case", back_populates="review_approvals")
    reviewer = relationship(
        "User",
        foreign_keys=[reviewer_id],
        back_populates="review_approvals",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_review_approvals_case_role", "case_id", "reviewer_role"),
        Index("idx_review_approvals_reviewer_id", "reviewer_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<ReviewApproval(id={self.id}, case_id={self.case_id}, "
            f"decision={self.decision!r})>"
        )


class ReviewIssue(Base):
    """Governance review issue raised against a Case."""

    __tablename__ = "review_issues"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(
        Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False
    )
    issue_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Relationships ----
    case = relationship("Case", back_populates="review_issues")

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_review_issues_case_status", "case_id", "status"),
    )

    def __repr__(self) -> str:
        return (
            f"<ReviewIssue(id={self.id}, case_id={self.case_id}, "
            f"status={self.status!r})>"
        )


class OverrideReason(Base):
    """Captured reason when a reviewer overrides a previous decision."""

    __tablename__ = "override_reasons"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(
        Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False
    )
    reviewer_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    original_decision = Column(String(50), nullable=False)
    override_decision = Column(String(50), nullable=False)
    reason_code = Column(String(100), nullable=False)
    comments = Column(Text, nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ---- Relationships ----
    case = relationship("Case", back_populates="override_reasons")
    reviewer = relationship(
        "User",
        foreign_keys=[reviewer_id],
        back_populates="override_reasons",
    )

    # ---- Indexes ----
    __table_args__ = (
        Index("idx_override_reasons_case_id", "case_id"),
        Index("idx_override_reasons_reviewer_id", "reviewer_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<OverrideReason(id={self.id}, case_id={self.case_id}, "
            f"reason_code={self.reason_code!r})>"
        )
