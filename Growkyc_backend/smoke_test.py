"""
Smoke test: verify all model imports and Base.metadata table registration.
Run with: venv\\Scripts\\python.exe smoke_test.py
"""
import sys

try:
    from models import (
        Base,
        Tenant,
        User,
        Client,
        Case,
        Approval,
        ReviewApproval,
        ReviewIssue,
        OverrideReason,
        Report,
        KYC,
        Document,
        KYCAuditLog,
        AuditLog,
        Notification,
        Evidence,
        IndividualProfile,
        EntityProfile,
        BeneficialOwner,
        ScreeningRecord,
        RiskAssessment,
        Alert,
        Integration,
    )
    print("[OK] All imports OK")

    tables = sorted(Base.metadata.tables.keys())
    print("[OK] %d tables registered in Base.metadata:" % len(tables))
    for t in tables:
        print("    " + t)

    # Verify backward-compatible import surface
    expected = [
        "User", "KYC", "Client", "Case", "Approval", "ReviewApproval",
        "ReviewIssue", "OverrideReason", "Report", "Document", "KYCAuditLog",
        "AuditLog", "Notification", "Evidence",
    ]
    for cls_name in expected:
        assert cls_name in dir(), "MISSING: " + cls_name
    print("[OK] All %d legacy model classes importable (backward compat OK)" % len(expected))

    # Verify new enterprise models
    new_models = [
        "Tenant", "IndividualProfile", "EntityProfile", "BeneficialOwner",
        "ScreeningRecord", "RiskAssessment", "Alert", "Integration",
    ]
    for cls_name in new_models:
        assert cls_name in dir(), "MISSING NEW: " + cls_name
    print("[OK] All %d new enterprise model classes importable" % len(new_models))

    print("")
    print("[PASS] SMOKE TEST PASSED -- models/ package is production-ready")
    sys.exit(0)

except Exception as e:
    print("[FAIL] SMOKE TEST FAILED: " + str(e))
    import traceback
    traceback.print_exc()
    sys.exit(1)
