# Go-Live Readiness Summary

Date: 2026-03-29
Scope: backend and AWS go-live readiness (no UI scope)

## Fully Operational
- Core tenant isolation, RBAC, audit event coverage, and workflow persistence checks are defined and testable.
- Retention and legal hold coverage exists in schema and QA controls.
- Environment readiness validators and Sydney region checks are in place.
- Export/report persistence models and status tracking are implemented.
- Staging/pre-production validation checklist is defined (config, integration, scheduler, notification smoke).

## Scaffolded but Still Needs Provider Keys
- External KYC/AML provider integrations are scaffolded; production credentials still need Secrets Manager population per tenant.
- Notification providers are scaffolded; delivery credentials and sender configuration still need production values.
- Any provider webhook signing secrets/API keys must be loaded and rotation policy confirmed before cutover.

## Still Needs AWS Provisioning
- Cognito User Pool and production auth configuration.
- Aurora PostgreSQL production cluster and final migration run.
- S3 evidence + staging + access-log buckets with KMS and Object Lock compliance settings.
- API Gateway + Lambda production deployment path.
- CloudFront/WAF/DNS production cutover components.
- Security services final enablement: GuardDuty, Security Hub, CloudTrail/AWS Config rules, production alarms.

## Still Needs PDF Rendering Completion
- Finalize backend PDF renderer for audit packs/reports (template + deterministic output).
- Add regression checks for PDF correctness (content completeness, timestamp, actor, tenant scope).
- Confirm storage + retrieval path for rendered PDFs in production buckets.

## Still Needs Notification Channel Completion
- Complete production channel wiring for email/SMS/webhook where required.
- Validate send path observability (delivery success/failure, retry, dead-letter handling).
- Run end-to-end production-like notification test and confirm analyst delivery.

## Recommended Pre-Production Test Order
1. AWS environment config validation (region, KMS, S3, IAM, secrets).
2. Tenant isolation + RBAC negative tests.
3. Core workflow tests (review/approval/override/escalation).
4. Audit trail completeness and append-only event verification.
5. Retention/legal hold enforcement checks.
6. Evidence upload/download and metadata integrity.
7. Periodic scheduler jobs (`periodic_rescreening`, `document_expiry_check`).
8. Report generation + PDF rendering validation.
9. Notification channel end-to-end validation.
10. Security regression + penetration scan before prod promotion.

## Recommended Production Rollout Order
1. Change freeze and rollback checkpoint approval.
2. Provision/deploy AWS core stacks (identity, data, storage, compute, edge).
3. Apply migrations and verify startup readiness checks pass.
4. Load provider keys/secrets and verify least-privilege access.
5. Run production smoke tests (auth, case flow, evidence, reports, notifications).
6. Canary tenant rollout.
7. Observe logs/alarms and audit events during stabilization window.
8. Expand rollout in controlled phases to full tenant set.

## Top 10 Go-Live Risks to Validate
1. Missing/incorrect provider keys causing failed verification flows.
2. Tenant boundary regression in read/export endpoints.
3. Notification delivery failures without alerting.
4. PDF generation producing incomplete or non-compliant exports.
5. Retention/legal hold policies misapplied or bypassable.
6. Region/config drift from `ap-southeast-2` and required KMS resources.
7. Migration/index mismatch causing report/query performance issues.
8. Audit event gaps (missing actor/tenant/action/outcome fields).
9. Scheduler failures for periodic rescreening/document expiry jobs.
10. Incomplete rollback readiness (restore point, runbook, ownership).
