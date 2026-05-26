"""
models/base.py
==============
Single source of truth for the SQLAlchemy DeclarativeBase.

ALL model files in this package must import Base from here.
Never create a second Base elsewhere — duplicate metadata causes
mapper initialization errors and confuses Alembic autogenerate.

SQLAlchemy 2.0 style: DeclarativeBase subclass.
Compatible with Column() (1.x style) and Mapped[] (2.0 style) simultaneously.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Project-wide SQLAlchemy declarative base.

    All ORM models inherit from this class. Alembic env.py imports
    Base.metadata for autogenerate support.
    """

    pass
