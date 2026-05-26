# QA Checklist

Use this checklist during release validation and mark each item as complete with evidence links (test run, query result, or log reference).

## Tenant Isolation Checks
- [ ] Verify all read/write APIs enforce tenant scoping and reject cross-tenant IDs.
- [ ] Confirm tenant context is derived server-side (not trusted from client payload).
- [ ] Run negative test: Tenant A user cannot access Tenant B records, exports, or reports.

## RBAC Checks
- [ ] Validate role-to-permission matrix for admin, reviewer, approver, and read-only roles.
- [ ] Confirm restricted endpoints return 403 for insufficient role.
- [ ] Verify privilege escalation attempts (role tampering in token/payload) are blocked.

## Audit Event Coverage
- [ ] Confirm create/update/delete/review/approval/override actions emit audit events.
- [ ] Verify audit events include actor, tenant, timestamp, entity ID, action, and outcome.
- [ ] Validate failure events are captured for denied access and validation errors.

## Bot Run Persistence
- [ ] Confirm each bot run persists status transitions (queued, running, completed, failed).
- [ ] Verify run record includes inputs, outputs summary, timestamps, and correlation ID.
- [ ] Re-run same case and confirm historical runs remain immutable and queryable.

## Evidence Storage Metadata
- [ ] Validate evidence records include tenant ID, case ID, source, checksum/hash, and created timestamp.
- [ ] Confirm evidence metadata references storage location and access policy.
- [ ] Verify evidence retrieval enforces RBAC and tenant boundaries.

## Retention and Legal Hold Checks
- [ ] Confirm retention policy is applied per data class and tenant policy.
- [ ] Validate legal hold prevents deletion/expiry for tagged records.
- [ ] Verify policy changes are audited and effective dates are tracked.

## Periodic Rescreening Checks
- [ ] Validate scheduler triggers rescreening at configured interval.
- [ ] Confirm missed jobs are retried and failures are visible in monitoring.
- [ ] Verify rescreening results are linked to prior case history.

## Document Expiry Checks
- [ ] Confirm document expiry dates are computed/stored correctly (timezone-safe).
- [ ] Validate pre-expiry notifications are generated on configured lead times.
- [ ] Verify expired documents block approval where policy requires.

## Review and Approval Workflow Checks
- [ ] Validate state transitions: submitted -> in_review -> approved/rejected.
- [ ] Confirm separation-of-duties: requester cannot self-approve where prohibited.
- [ ] Verify comments/decision rationale are required and persisted.

## Override and Escalation Checks
- [ ] Confirm override requires authorized role and mandatory reason code.
- [ ] Validate escalation path triggers for high-risk or policy-breach scenarios.
- [ ] Verify all overrides/escalations are fully audited with before/after context.

## Export Endpoint Checks
- [ ] Validate export endpoints enforce tenant scope, RBAC, and row-level filters.
- [ ] Confirm exported data excludes sensitive fields not permitted by policy.
- [ ] Verify export jobs are rate-limited, audited, and signed/traceable.

## Reporting Checks
- [ ] Confirm report totals reconcile with source records for sampled date ranges.
- [ ] Validate filters (tenant, status, risk, date) produce consistent results.
- [ ] Verify generated reports include generation timestamp and requesting actor.

## AWS Config Validation Checks
- [ ] Confirm AWS configuration matches expected environment values (region, KMS, S3, IAM roles).
- [ ] Validate encryption at rest/in transit is enabled for storage and database services.
- [ ] Verify CloudWatch logging and alerting exist for auth failures and critical workflow errors.

## Security Regression Checks
- [ ] Re-run authn/authz regression suite after release candidate build.
- [ ] Validate no new high/critical findings from dependency and secret scanning.
- [ ] Confirm API abuse protections (rate limiting, input validation, idempotency) remain effective.
