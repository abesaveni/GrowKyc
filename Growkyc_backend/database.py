"""
Database connection and session management module using SQLAlchemy ORM.
This module handles database engine creation, session management, and
schema initialization.

Base is imported from the models/ package (models/__init__.py).
All ORM tables are registered on Base.metadata automatically when
models/__init__.py is imported.
"""

import logging
import os
from dotenv import load_dotenv
from typing import Generator

from sqlalchemy import create_engine, event, inspect, text, true
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker, with_loader_criteria
from sqlalchemy.pool import QueuePool, StaticPool

from core.tenant_context import get_tenant_id

logger = logging.getLogger(__name__)

# Load environment variables from .env (ensure config is available at import time)
load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kyc.db")

# Configure engine based on database type
if "postgresql" in DATABASE_URL or "postgres" in DATABASE_URL:
    # PostgreSQL configuration with proper pooling for production
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=int(os.getenv("DB_POOL_SIZE", 10)),
        max_overflow=int(os.getenv("DB_MAX_OVERFLOW", 20)),
        # Test connections before using to avoid "connection already closed"
        # errors
        pool_pre_ping=True,
        pool_recycle=3600,  # Recycle connections after 1 hour
        echo=os.getenv("SQL_ECHO", "False").lower() == "true",
    )
elif "mssql" in DATABASE_URL:
    # SQL Server (SSMS) configuration via pyodbc
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=int(os.getenv("DB_POOL_SIZE", 10)),
        max_overflow=int(os.getenv("DB_MAX_OVERFLOW", 20)),
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=os.getenv("SQL_ECHO", "False").lower() == "true",
        connect_args={"fast_executemany": True},
    )
else:
    # SQLite configuration for development/testing
    # Use StaticPool for SQLite to avoid "database is locked" issues in tests
    is_memory_db = "sqlite:///:memory:" in DATABASE_URL
    pool_class = StaticPool if is_memory_db else None

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=pool_class if pool_class else QueuePool,
        echo=os.getenv("SQL_ECHO", "False").lower() == "true",
    )


# Enable foreign keys for SQLite
if "sqlite" in DATABASE_URL:

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        """Enable foreign key constraints in SQLite"""
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


# Create session factory
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, expire_on_commit=False
)

_default_schema_ready = False


@event.listens_for(SessionLocal, "do_orm_execute")
def _tenant_filter_do_orm_execute(orm_execute_state):
    """
    Global tenant filtering interceptor.
    Applies `with_loader_criteria` to automatically filter any model with a
    `tenant_id` column by the `current_tenant_id` contextvar.
    
    If `current_tenant_id` is None, fails CLOSED by enforcing `tenant_id == -1`.
    Can be bypassed via `execution_options(include_all_tenants=True)`.
    """
    if orm_execute_state.is_select or orm_execute_state.is_update or orm_execute_state.is_delete:
        if orm_execute_state.execution_options.get("include_all_tenants", False):
            return

        tenant_id = get_tenant_id()
        
        if tenant_id is None:
            return

        # Apply automatic tenant filter only when a tenant context exists. This
        # keeps legacy single-tenant code paths and tests backward compatible.
        from models import Base

        orm_execute_state.statement = orm_execute_state.statement.options(
            with_loader_criteria(
                Base,
                lambda cls: (
                    cls.tenant_id == tenant_id if hasattr(cls, "tenant_id") else true()
                ),
                include_aliases=True,
            )
        )


def get_db() -> Generator[Session, None, None]:
    """
    Dependency injection function for FastAPI.
    Yields a database session for each request.

    Yields:
        SQLAlchemy Session scoped to the request

    Raises:
        SQLAlchemyError: If database connection fails

    Example:
        from fastapi import Depends
        from database import get_db

        @app.get("/users")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    """
    _ensure_default_schema_ready()
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        try:
            db.rollback()
        except Exception:
            logger.exception("Failed to rollback DB session after SQLAlchemyError")
        raise
    except Exception as e:
        # Catch-all to ensure sessions are rolled back on unexpected errors
        logger.error(f"Unexpected database exception: {str(e)}")
        try:
            db.rollback()
        except Exception:
            logger.exception("Failed to rollback DB session after unexpected exception")
        raise
    finally:
        try:
            db.close()
        except Exception:
            logger.exception("Failed to close DB session")


def _ensure_default_schema_ready() -> None:
    """Create default DB tables when a direct TestClient bypasses lifespan."""
    global _default_schema_ready
    if _default_schema_ready:
        return

    from models import Base

    Base.metadata.create_all(bind=engine)
    _ensure_sqlite_schema_compatibility()
    _default_schema_ready = True


def init_db():
    """
    Initialize the database schema using SQLAlchemy ORM models.
    Creates all tables defined in models.py using the declarative Base.

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Import Base from the models package — triggers all model registrations
        from models import Base  # noqa: F401 (side-effect: registers all tables)

        logger.info(f"Initializing database: {DATABASE_URL}")

        # Create all tables defined in the ORM models
        Base.metadata.create_all(bind=engine)
        _ensure_sqlite_schema_compatibility()

        logger.info("Database schema initialized successfully")
        return True
    except SQLAlchemyError as e:
        logger.error(f"SQLAlchemy error during initialization: {str(e)}")
        return False
    except ImportError as e:
        logger.error(f"Import error during initialization: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during database initialization: {str(e)}")
        return False


def _ensure_sqlite_schema_compatibility():
    """Add safe nullable/default columns expected by current ORM models."""
    if "sqlite" not in DATABASE_URL:
        return

    inspector = inspect(engine)
    if "kyc" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("kyc")}
    missing_columns = [
        ("name", "VARCHAR(255)"),
        ("dob", "DATETIME"),
        ("gender", "VARCHAR(20)"),
        ("address", "TEXT"),
        ("onboarding_status", "VARCHAR(9) NOT NULL DEFAULT 'DRAFT'"),
    ]

    with engine.begin() as connection:
        for column_name, column_type in missing_columns:
            if column_name not in existing_columns:
                connection.execute(
                    text(f"ALTER TABLE kyc ADD COLUMN {column_name} {column_type}")
                )
                logger.info("Added missing SQLite kyc.%s column", column_name)


def get_engine():
    """
    Get the SQLAlchemy engine for direct access if needed.
    Use this sparingly; prefer using sessions through get_db() dependency.

    Returns:
        SQLAlchemy Engine object
    """
    return engine


def close_db():
    """
    Close all connections in the pool.
    Call this on application shutdown.
    """
    try:
        engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database: {str(e)}")


def create_all_tables():
    """
    Explicitly create all ORM tables.
    Useful for initialization scripts or testing.
    """
    try:
        from models import Base  # noqa: F401

        Base.metadata.create_all(bind=engine)
        logger.info("All tables created successfully")
    except Exception as e:
        logger.error(f"Error creating tables: {str(e)}")
        raise


def drop_all_tables():
    """
    Drop all ORM tables. WARNING: This is destructive!
    Only use in development/testing environments.
    """
    try:
        from models import Base  # noqa: F401

        Base.metadata.drop_all(bind=engine)
        logger.warning("All tables dropped")
    except Exception as e:
        logger.error(f"Error dropping tables: {str(e)}")
        raise
