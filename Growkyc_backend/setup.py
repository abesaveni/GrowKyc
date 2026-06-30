"""
setup.py — idempotent environment bootstrap.
============================================

Single entrypoint to make a fresh (or existing) database fully usable:

  1. create_all_tables()  — creates any missing tables (alerts, edd_workflows, …)
  2. lightweight column migrations for tables that predate newer columns
     (additive, `ADD COLUMN IF NOT EXISTS`, safe to re-run)
  3. seed the default tenant + one demo user per role (delegates to seed_roles)

Run inside the API container:

    docker exec -i kyc_api python setup.py

Re-running is safe: every step is idempotent.
"""

import logging

from sqlalchemy import text

from database import create_all_tables, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("setup")

# Additive column migrations: (table, column, DDL type clause). Each is applied
# with ADD COLUMN IF NOT EXISTS so it is safe on databases that already have it.
COLUMN_MIGRATIONS = [
    ("sars", "case_id", "INTEGER REFERENCES cases(id) ON DELETE SET NULL"),
]


def run_column_migrations() -> None:
    with engine.connect() as conn:
        for table, column, ddl in COLUMN_MIGRATIONS:
            try:
                conn.execute(
                    text(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {column} {ddl}")
                )
                conn.commit()
                print(f"migration ok : {table}.{column}")
            except Exception as e:  # noqa: BLE001
                print(f"migration skip: {table}.{column} ({e})")


def main() -> None:
    print("== creating tables ==")
    create_all_tables()
    print("== column migrations ==")
    run_column_migrations()
    print("== seeding tenant + role users ==")
    import seed_roles

    seed_roles.main()
    print("\nSetup complete.")


if __name__ == "__main__":
    main()
