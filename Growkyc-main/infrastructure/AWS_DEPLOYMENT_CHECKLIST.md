# GrowKYC — AWS Deployment Checklist

**Region:** ap-southeast-2 (Sydney) — mandatory for AUSTRAC AML/CTF data residency  
**Stack prefix:** `growkyc-{env}` where `env` ∈ `prod | staging | dev`

---

## 1. Pre-Flight

- [ ] `AWS_ACCOUNT_ID` confirmed and exported as `CDK_DEFAULT_ACCOUNT`
- [ ] `CDK_ENV` set to target environment (`prod | staging | dev`)
- [ ] `CDK_DEFAULT_REGION` = `ap-southeast-2` — reject any other value
- [ ] AWS CLI profile has sufficient IAM permissions for CDK bootstrap
- [ ] CDK bootstrap run in account/region: `cdk bootstrap aws://<ACCOUNT>/ap-southeast-2`
- [ ] All required env vars documented in `.env.example` are present in Secrets Manager or CI/CD secrets store

---

## 2. VPC and Networking

- [ ] VPC created in `ap-southeast-2` with CIDR from `VPC_CIDR` map in `config.ts`
- [ ] Three AZs used: `ap-southeast-2a`, `ap-southeast-2b`, `ap-southeast-2c`
- [ ] Private subnets for Aurora, Lambda, ECS/App Runner
- [ ] Public subnets for ALB only — no compute resources in public subnets
- [ ] NAT Gateway present for private-subnet egress
- [ ] VPC Flow Logs enabled and writing to CloudWatch (`/growkyc/{env}/vpc-flow-logs`)
- [ ] Security groups follow least-privilege: only ports 443 and 5432 (DB) open within private subnets
- [ ] No `0.0.0.0/0` ingress rules on any security group other than ALB port 443

---

## 3. KMS Keys

- [ ] `growkyc-{env}-database` CMK created with annual rotation enabled
- [ ] `growkyc-{env}-storage` CMK created with annual rotation enabled
- [ ] `growkyc-{env}-secrets` CMK created with annual rotation enabled
- [ ] `growkyc-{env}-cloudtrail` CMK created with annual rotation enabled
- [ ] `growkyc-{env}-auth` CMK created (optional — auth token signing)
- [ ] RDS service principal granted `Encrypt/Decrypt/GenerateDataKey/CreateGrant/DescribeKey` on database key
- [ ] S3 service principal granted equivalent on storage key
- [ ] All CMK ARNs exported as stack outputs and stored in Secrets Manager under `SECRETS_PREFIX`
- [ ] CMK removal policy set to `RETAIN` in all environments

---

## 4. RDS / Aurora

- [ ] Aurora Serverless v2 — PostgreSQL 15.4 cluster deployed in private subnets
- [ ] Writer in `ap-southeast-2a`, reader in `ap-southeast-2b`
- [ ] Cluster encrypted with `growkyc-{env}-database` CMK
- [ ] `rds.force_ssl = 1` enforced via parameter group
- [ ] `pgaudit` enabled: `pgaudit.log = all`
- [ ] Automatic minor version upgrades enabled
- [ ] Deletion protection enabled in `prod`
- [ ] Automated backups: 7-day retention in `dev/staging`, 35-day in `prod`
- [ ] Multi-AZ failover confirmed (automatic within ~30 s)
- [ ] DB credentials stored in Secrets Manager at `{SECRETS_PREFIX}/db-credentials`
- [ ] `DB_HOST`, `DB_READER_HOST`, `DB_PORT`, `DB_NAME`, `DB_KMS_KEY_ARN`, `DB_CREDENTIALS_SECRET_ARN` all resolvable at app bootstrap
- [ ] Timezone parameter set to `Australia/Sydney`


## 5. S3 Buckets

- [ ] All buckets: `BlockPublicAccess = BLOCK_ALL`, `EnforceSSL = true`
- [ ] Evidence bucket lifecycle: delete non-current versions after 7 years (`EVIDENCE_RETENTION_YEARS`)
- [ ] Server-access logging enabled on evidence and staging buckets, writing to access-log bucket
## 6. Secrets Manager

- [ ] `{SECRETS_PREFIX}/app-jwt-signing-key` — 64-char secret, encrypted with secrets CMK
- [ ] Rotation lambdas configured for DB credentials in `prod`
- [ ] IAM role cross-account access denied unless explicitly allowlisted

- [ ] HTTPS listener only; HTTP redirects to HTTPS (301)
- [ ] TLS 1.2 minimum; TLS 1.3 preferred
- [ ] ACM certificate issued for `*.growkyc.com.au` and `growkyc.com.au`
---

## 8. WAF
- [ ] SQL injection rule set (`AWSManagedRulesSQLiRuleSet`) enabled
- [ ] Rate-based rule: block IP after 2,000 requests per 5 minutes
- [ ] WAF logging enabled, writing to CloudWatch or S3
## 9. CloudTrail

- [ ] Organization or account-level trail covering `ap-southeast-2`
- [ ] CloudWatch Events (EventBridge) rule triggers alert on `root` account sign-in

---
- [ ] Audit log group retention = 730 days minimum (AUSTRAC 2-year requirement)
- [ ] App/API log group retention = 365 days minimum
- [ ] SNS ops-alert topic (`growkyc-{env}-ops-alerts`) created; `OPS_ALERT_EMAIL` subscribed in `prod`

## 11. GuardDuty

- [ ] High-severity findings routed to SNS ops-alert topic via EventBridge rule
- [ ] Finding suppression rules reviewed and documented


- [ ] Security Hub enabled with AWS Foundational Security Best Practices standard
- [ ] CIS AWS Foundations Benchmark enabled
---

## 13. Backups
- [ ] S3 versioning on evidence bucket serves as object-level backup — verified
- [ ] Cross-region backup copy rule configured for `prod` (source: `ap-southeast-2`, destination: `ap-southeast-1`)
- [ ] Restore drill completed and documented before first `prod` go-live

Verify each is present and non-empty before deployment proceeds:

DB_READER_HOST=
DB_PORT=5432
DB_NAME=
S3_ACCESS_LOG_BUCKET=
S3_KMS_KEY_ARN=
KMS_DATABASE_KEY_ARN=
SECRETS_PREFIX=/growkyc/prod
APP_URL=
API_URL=
## 15. Tenant Isolation Checks

- [ ] Row-level security (RLS) enabled on all tenant-scoped tables
- [ ] Every query includes `tenant_id` filter — verified via query audit in staging
- [ ] S3 object key prefix follows `{tenant_id}/` convention; bucket policy denies cross-prefix access
- [ ] IAM task roles scoped per-service; no shared wildcard policies
- [ ] API routes return 403 (not 404) on cross-tenant resource access attempts — tested
- [ ] Tenant provisioning creates isolated Secrets Manager paths under `{SECRETS_PREFIX}/{tenant_id}/`

---

## 16. Audit Logging Checks

- [ ] Every write operation emits a structured audit event to `/growkyc/{env}/audit` log group
- [ ] Audit events include: `action`, `tenant_id`, `occurred_at`, `actor_id` (where applicable)
- [ ] `emitNotificationServiceAuditEvent` and scheduler audit hooks confirmed active in `prod` config
- [ ] Audit log group has a resource policy preventing deletion by non-root principals
- [ ] Audit log retention meets 730-day AUSTRAC minimum — confirmed in `AwsAuditLoggingConfig`
- [ ] `validateAwsDeploymentEnvironmentConfig` passes with zero errors before app start

---

## 17. Retention and Legal Hold Checks

- [ ] Evidence bucket Object Lock mode = `COMPLIANCE` in `prod` (not `GOVERNANCE`)
- [ ] Object Lock default retention = 7 years (`EVIDENCE_RETENTION_YEARS = 7`)
- [ ] Legal hold API endpoint tested — confirmed objects cannot be deleted while hold is active
- [ ] Lifecycle rule does not transition or delete objects still under legal hold
- [ ] Aurora automated backup retention matches or exceeds document retention requirements
- [ ] Retention policy documented and signed off by compliance team before go-live

---

## 18. Pre-Production Validation

- [ ] `cdk synth` produces no errors or warnings in `staging` environment
- [ ] `cdk diff` reviewed and approved before `cdk deploy`
- [ ] All stack outputs (bucket names, secret ARNs, cluster endpoints) match expected values
- [ ] `validateAwsDeploymentEnvironmentConfig` called at app startup with no validation errors
- [ ] `assertSydneyRegion(process.env.AWS_REGION)` called at startup — confirmed to pass
- [ ] Integration tests pass against `staging` Aurora cluster
- [ ] Evidence upload → S3 scan staging → promote to evidence bucket flow tested end-to-end
- [ ] Notification service (`sendNotification`) tested for `email` channel in `staging`
- [ ] Scheduler runner (`runScheduledJob`) tested for `periodic_rescreening` and `document_expiry_check` in `staging`
- [ ] Penetration test or automated security scan run against `staging` before `prod` promotion

---

## 19. Production Rollout Validation

- [ ] Change freeze window communicated to stakeholders
- [ ] `cdk deploy --require-approval broadening` run — no broadening permission changes accepted without review
- [ ] ALB health check returns 200 within 2 minutes of deploy
- [ ] CloudWatch dashboard shows zero 5xx errors for 30 minutes post-deploy
- [ ] One real notification sent and confirmed delivered in `prod`
- [ ] GuardDuty and Security Hub show no new HIGH/CRITICAL findings in the 24 hours post-deploy
- [ ] Rollback plan documented: snapshot restore point identified, blue/green cutover steps written
- [ ] Post-deploy sign-off recorded with timestamp and deployer identity
