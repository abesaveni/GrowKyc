"""
models/case_comments.py
=======================
Case investigation comments.
"""
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, Text
from sqlalchemy.orm import relationship

from models.base import Base


class CaseComment(Base):
    """
    Analyst notes and comments on a Case.
    """

    __tablename__ = "case_comments"

    id = Column(Integer, primary_key=True, index=True)

    # ---- Links ----
    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="NO ACTION"),
        nullable=False,
        index=True,
    )
    case_id = Column(
        Integer,
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    author_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # ---- Content ----
    content = Column(Text, nullable=False, comment="Markdown supported")

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
    case = relationship("Case", backref="comments", lazy="select")
    author = relationship("User", foreign_keys=[author_id])

    def __repr__(self):
        return f"<CaseComment(id={self.id}, case_id={self.case_id})>"
