"""
models.py — COMPATIBILITY SHIM
================================
THIS FILE HAS BEEN SUPERSEDED by the models/ package.

In Python, a package directory (models/) takes precedence over a module
file (models.py) of the same name in the same directory. This file is
therefore DEAD CODE — it will never be imported while models/__init__.py
exists.

It is retained here only as a Phase 1 safety net and documentation aid.

ACTION REQUIRED (Phase 2):
  Delete this file once the models/ package has been verified stable.
  Command: del models.py  (Windows) or rm models.py (Unix)

DO NOT add new models or change anything here.
All model definitions live in:
  models/base.py              — DeclarativeBase
  models/mixins.py            — Reusable mixins
  models/tenant.py            — Tenant
  models/user.py              — User
  models/client.py            — Client
  models/case.py              — Case, Approval, ReviewApproval,
                                ReviewIssue, OverrideReason
  models/report.py            — Report
  models/kyc.py               — KYC
  models/document.py          — Document
  models/audit.py             — KYCAuditLog, AuditLog
  models/notification.py      — Notification
  models/evidence.py          — Evidence
  models/individual_profile.py — IndividualProfile  [NEW]
  models/entity_profile.py    — EntityProfile       [NEW]
  models/beneficial_owner.py  — BeneficialOwner     [NEW]
  models/screening.py         — ScreeningRecord     [NEW]
  models/risk.py              — RiskAssessment      [NEW]
  models/alert.py             — Alert               [NEW]
  models/integration.py       — Integration         [NEW]
  models/__init__.py          — Public API (re-exports all classes)
"""
