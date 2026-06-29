"""Seed one demo user per role for UI / RBAC walkthroughs.

Idempotent: upserts by email, so it is safe to re-run. Every account uses the
same password (see PASSWORD). Run inside the API container:

    docker exec -i kyc_api python seed_roles.py

or locally with the backend env (DATABASE_URL) configured:

    python seed_roles.py
"""

from database import SessionLocal
from models.user import User
from models.tenant import Tenant
from core.enums import UserRole
from core.security import hash_password

PASSWORD = "GrowKyc@2026"

SEED = [
    ("admin@growkyc.com",   "System Admin",              UserRole.ADMIN),
    ("client@growkyc.com",  "Demo Client",               UserRole.USER),
    ("analyst@growkyc.com", "AML Analyst",               UserRole.ANALYST),
    ("officer@growkyc.com", "Compliance Officer",        UserRole.COMPLIANCE_OFFICER),
    ("senior@growkyc.com",  "Senior Compliance Officer", UserRole.SENIOR_COMPLIANCE_OFFICER),
    ("head@growkyc.com",    "Head of Compliance",        UserRole.HEAD_OF_COMPLIANCE),
    ("partner@growkyc.com", "Managing Partner",          UserRole.PARTNER),
]


def main() -> None:
    db = SessionLocal()
    hashed = hash_password(PASSWORD)
    try:
        # A default tenant is required: tenant-scoped tables (individual_profiles,
        # case_assignments, ...) are NOT NULL on tenant_id, so users must belong to
        # a tenant for client onboarding and case creation to succeed.
        tenant = db.query(Tenant).filter(Tenant.slug == "growkyc-demo").first()
        if not tenant:
            tenant = Tenant(
                company_name="GrowKYC Demo",
                slug="growkyc-demo",
                status="active",
                subscription_plan="enterprise",
            )
            db.add(tenant)
            db.commit()
            db.refresh(tenant)
            print(f"created   tenant 'growkyc-demo' (id={tenant.id})")
        else:
            print(f"exists    tenant 'growkyc-demo' (id={tenant.id})")

        for email, name, role in SEED:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.name, user.role, user.password, user.is_active = name, role, hashed, True
                user.tenant_id = user.tenant_id or tenant.id
                action = "updated"
            else:
                db.add(User(email=email, name=name, role=role, password=hashed,
                            is_active=True, tenant_id=tenant.id))
                action = "created"
            print(f"{action:8} {email:24} {role.value}")

        # Backfill any pre-existing users that still have no tenant.
        db.query(User).filter(User.tenant_id.is_(None)).update({User.tenant_id: tenant.id})
        db.commit()
        print(f"\nAll done. Password for every account: {PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
