"""
migrations/env.py
=================
Alembic environment configuration for GrowKYC modular models.

Key design decisions:
- DATABASE_URL is read from the environment (same as database.py) — no hardcoding.
- Base.metadata is imported from the models/ package, which automatically
  includes ALL registered tables (existing + new enterprise models).
- Supports both offline (SQL script) and online (direct DB) migration modes.
- Compatible with PostgreSQL, SQL Server, and SQLite.

Usage:
    alembic revision --autogenerate -m "add_tenant_id_to_users"
    alembic upgrade head
    alembic downgrade base
"""

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# ---------------------------------------------------------------------------
# Ensure the project root is on sys.path so `from models import Base` works
# when alembic is run from any working directory.
# ---------------------------------------------------------------------------
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ---------------------------------------------------------------------------
# Import the shared Base — this single import triggers all model module
# imports via models/__init__.py, registering every table in Base.metadata.
# ---------------------------------------------------------------------------
from models import Base  # noqa: E402

# Alembic Config object — provides access to values in alembic.ini
config = context.config

# Override sqlalchemy.url with the live DATABASE_URL from environment.
# This ensures alembic always targets the same DB as the FastAPI app.
_db_url = os.getenv("DATABASE_URL", "sqlite:///./kyc.db")
config.set_main_option("sqlalchemy.url", _db_url)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata for autogenerate support.
# All tables defined in models/* are included automatically.
target_metadata = Base.metadata


# ---------------------------------------------------------------------------
# Offline migration mode — generates SQL scripts without a live DB connection
# ---------------------------------------------------------------------------

def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    Configures the context with just a URL and not an Engine.
    Calls to context.execute() emit the given string to the script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # Render column-level server defaults in migration scripts
        render_as_batch=True,   # Required for SQLite ALTER TABLE support
        compare_type=True,      # Detect column type changes
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# ---------------------------------------------------------------------------
# Online migration mode — runs migrations against a live DB connection
# ---------------------------------------------------------------------------

def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    Creates an Engine and associates a connection with the context.
    """
    # Build engine from alembic.ini [alembic] section (url already overridden above)
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,    # Use NullPool for migrations (no connection reuse)
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,   # Required for SQLite ALTER TABLE support
            compare_type=True,      # Detect column type changes
            compare_server_default=True,
            # Include all schemas (important for multi-schema PostgreSQL setups)
            include_schemas=False,
        )

        with context.begin_transaction():
            context.run_migrations()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
