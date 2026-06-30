# GrowKYC — QA Bug Report (API / RBAC test round)

**Date:** 2026-06-30
**Scope:** All 7 demo roles tested against the live API (RBAC matrix + workflow edge cases + security probes).
**Environment:** `kyc_api` @ localhost:18000 · branch `main` / `feature/production-hardening`.
**Theme:** Most RBAC bugs share one root cause — endpoints hardcode stale role lists instead of using the central permission matrix (`core/permissions.py` / `dependencies.STAFF_ROLES`).

**RESOLUTION (2026-06-30):** All 9 items fixed and re-verified live. `BUG-7` could not be reproduced (admin create works with a valid payload). Also added an `Auditor` backend role + `mlro@` and `auditor@` demo accounts. See the `Status` column per row.

## Bug list

| ID | Severity | Area | Title | Steps to Reproduce | Expected | Actual | Root Cause / Location | Suggested Fix | Status |
|----|----------|------|-------|--------------------|----------|--------|-----------------------|---------------|--------|
| BUG-1 | High | Security / Privacy | Audit log readable by any user (incl. Client) | Login as client@growkyc.com; GET /api/v1/audit-events | Staff/admin-only; client gets 403 | 200 — returns events for OTHER actors (e.g. officer@) = full system audit trail leak | routers/compatibility.py:350 compat_audit_events uses Depends(get_current_user) | Gate with get_admin_or_agent_user (or admin-only) and scope by tenant | Fixed ✓ (verified) |
| BUG-2 | High | RBAC | SAR access denied to Head of Compliance / Senior CO; Head cannot file/decline | GET /api/v1/sars as head@/senior@/analyst@/partner@ → 403; POST /sars/{id}/file as head@ → 403 | Head of Compliance (acts as MLRO) + Senior CO can view; Head can file/decline | 403 for those roles; only Admin+CO can view, only Admin+MLRO can file | routers/sar.py:24 _COMPLIANCE_ROLES = [Admin, Compliance_Officer, MLRO]; file/decline use [Admin, MLRO] (lines 106/128) | Add Head_of_Compliance + Senior_Compliance_Officer; map Head_of_Compliance as MLRO for file/decline | Fixed ✓ (verified) |
| BUG-3 | High | RBAC | Dashboard endpoint 403 for Senior CO / Head of Compliance / Managing Partner | GET /api/v1/dashboard/ as senior@/head@/partner@ | 200 for all compliance staff | 403 (admin/analyst/officer get 200) — their live KPI strip shows nothing | routers/dashboard.py:22 require_role([ADMIN, ANALYST, COMPLIANCE_OFFICER, MLRO]) — missing Senior/Head/Partner | Use shared STAFF_ROLES set from dependencies.py | Fixed ✓ (verified) |
| BUG-4 | Medium | Robustness | Negative pagination returns HTTP 500 | GET /api/v1/cases?limit=-5&skip=-1 | Clamp to valid range or 422 | 500 server error (unhandled) | routers/cases.py list_cases has no bounds checking; likely also /alerts /edd /sars | Clamp skip>=0 and 1<=limit<=100 (as /kyc/list already does) | Fixed ✓ (verified) |
| BUG-5 | Medium | Validation | report_type not validated | POST /api/v1/reports/generate {client_id:3, report_type:"NONSENSE"} | Reject unknown report types | 201 — generates a report with bogus type | routers/reports.py generate_regulatory_report | Validate report_type against an allowed enum (SMR/TTR/IFTI/...) | Fixed ✓ (verified) |
| BUG-6 | Medium | RBAC / Product | Client (USER) can create and list client profiles | As client@: POST /api/v1/clients/individual → 201; GET /api/v1/clients → 200 | Clarify intent — Client should not create/list client records unless self-onboarding | 201/200 (list is filtered to own; creation is ungated) | routers/clients.py uses get_current_user | Confirm product intent; gate creation/listing if not self-onboarding | Fixed ✓ (client create now 403, officer 201) |
| BUG-7 | Low | Verify | POST /admin/users returned 422 for admin with populated body | POST /api/v1/admin/users {name,email,password,role:"User"} as admin@ | 201 created | 422 (Admin UI creates users fine — likely payload-contract mismatch) | routers/admin.py:36 CreateUserRequest; role must be in ASSIGNABLE_ROLES | Document exact required schema; verify expected role strings | Not reproducible — admin create works (201) with valid payload |
| GAP-1 | Low | Coverage | No backend "auditor" role/account | Frontend uses selectedRole==='auditor' but no AUDITOR enum or seeded user | Auditor role testable/loginable | Auditor cannot be logged in or tested | core/enums.py UserRole has no AUDITOR; seed_roles.py has no auditor | Add AUDITOR role + seed account, or remove the frontend auditor view | Fixed ✓ (verified) |
| GAP-2 | Low | Coverage | Demo seed missing MLRO (and Agent) accounts | seed_roles.py seeds 7 roles; no MLRO | MLRO testable | SAR file/decline only possible as admin (compounds BUG-2) | Growkyc_backend/seed_roles.py | Seed an MLRO demo account | Fixed ✓ (verified) |

## Verified working (passed)
| Check | Result |
|-------|--------|
| Create case with invalid client_id | 400 (correct) |
| Create case missing required title | 422 (correct) |
| Alert invalid severity / invalid status | 400 (correct) |
| KYC approve without documents | 400 — compliance control enforced (correct) |
| SAR file as Compliance Officer | 403 — segregation of duties (correct) |
| Escalate an already-escalated alert | 200 idempotent (already_linked) (correct) |
| EDD double-initiate | Idempotent — returns existing active workflow (correct) |
| Client reads another client by id | 404 — tenant/owner filtered (correct) |
| alert -> case -> SAR cross-module chain | Works end-to-end |

## RBAC matrix (HTTP status by role)
| Endpoint | admin | client | analyst | officer | senior | head | partner |
|----------|-------|--------|---------|---------|--------|------|---------|
| GET /dashboard/ | 200 | 403 | 200 | 200 | 403 | 403 | 403 |
| GET /clients | 200 | 200 | 200 | 200 | 200 | 200 | 200 |
| POST /clients/individual | 201 | 201 | 201 | 201 | 201 | 201 | 201 |
| GET /cases | 200 | 403 | 200 | 200 | 200 | 200 | 200 |
| GET /alerts/stats | 200 | 403 | 200 | 200 | 200 | 200 | 200 |
| POST /alerts/generate | 200 | 403 | 200 | 200 | 200 | 200 | 200 |
| GET /edd | 200 | 403 | 200 | 200 | 200 | 200 | 200 |
| GET /sars | 200 | 403 | 403 | 200 | 403 | 403 | 403 |
| GET /reports | 200 | 403 | 200 | 200 | 200 | 200 | 200 |
| GET /admin/kyc/pending | 200 | 403 | 200 | 200 | 200 | 200 | 200 |
| GET /admin/users | 200 | 403 | 403 | 403 | 403 | 403 | 403 |
| GET /audit-events | 200 | 200 | 200 | 200 | 200 | 200 | 200 |
| GET /notifications | 200 | 200 | 200 | 200 | 200 | 200 | 200 |
| GET /admin/roles | 200 | 403 | 403 | 403 | 403 | 403 | 403 |

> Red flags in the matrix: GET /dashboard/ (senior/head/partner = 403 → BUG-3), GET /sars (analyst/senior/head/partner = 403 → BUG-2), GET /audit-events (client = 200 → BUG-1), POST /clients/individual + GET /clients (client = 201/200 → BUG-6).
