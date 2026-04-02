# AWS Sydney Migration Report — GrowKYC/AML Platform

> **Region:** ap-southeast-2 (Sydney)  
> **Standard:** Bank-grade, ISO 27001-aligned, AUSTRAC-ready  
> **Date:** 2026-03-29  

---

## 1. What Exists Now

### 1.1 Frontend
| Layer | Technology | Status |
|---|---|---|
| Framework | React 18 + TypeScript + Vite | Production |
| Styling | Tailwind CSS v4 + Radix UI | Production |
| Routing | React Router v7 | Production |
| Deployment | Vercel (GitHub Actions → amondnet/vercel-action) | Active |
| Error tracking | Sentry (browser SDK only) | Active |
| Build | Vite 6, esbuild, static SPA | Production |

### 1.2 Backend
| Layer | Technology | Status |
|---|---|---|
| Runtime | Supabase Edge Functions — Deno + Hono | Active |
| Endpoints | `/health`, `/files/upload`, `/files/download/:path` | Active |
| Middleware | CORS (wildcard), JWT auth, rate-limit (100/min), logging | Active |
| Auth | Supabase Auth JWT verification | Active |
| File upload | Supabase Storage bucket `make-b186a255-documents` | Active |
| Signed URLs | Supabase `createSignedUrl` (3600s) | Active |

### 1.3 Database
| Layer | Technology | Status |
|---|---|---|
| Engine | Supabase-managed PostgreSQL | Active |
| Auth tables | `auth.users` (Supabase-owned schema) | Locked to Supabase |
| Core tables | `organizations`, `user_profiles`, `audit_logs`, `user_invitations`, `user_sessions`, `security_events`, `kv_store` | Active |
| Bot tables | `bot_registry`, `bot_runs`, `bot_results`, `bot_result_evidence`, `bot_audit_events`, `evidence_packs`, `evidence_pack_items` | Active |
| RLS | 20+ row-level security policies enforced via Supabase JWT claims | Supabase-only |
| Migrations | Supabase CLI, 3 migration files (including AWS compatibility migration `003`) | Active |

### 1.4 Authentication
| Feature | Implementation |
|---|---|
| Method | Supabase Auth (JWT, email/password) |
| MFA | TOTP via `auth.mfa.enroll` / `auth.mfa.verify` |
| OAuth | Google, Microsoft |
| Session | Supabase managed, auto-refresh |
| RBAC | `user_profiles.role` + `permissions[]` |

### 1.5 Storage
| Feature | Implementation |
|---|---|
| Bucket | `make-b186a255-documents` (Supabase private) |
| Upload path | `{orgId}/{module}/{folder}/{ts}_{filename}` |
| Access | Signed URLs (3600s), org-boundary enforced |
| Encryption | Supabase default (provider-managed) |
| Retention/WORM | None |

### 1.6 Audit & Observability
| Feature | Implementation |
|---|---|
| App-level audit | `audit_logs` + `security_events` + `bot_audit_events` tables |
| Infrastructure audit | AWS CDK `SecurityStack.ts` defines CloudTrail + log bucket + integrity validation |
| Security detection | AWS CDK `SecurityStack.ts` defines GuardDuty + Security Hub + AWS Config rules |
| Error tracking | Sentry (browser only) |
| Metrics | AWS CDK `MonitoringStack.ts` defines CloudWatch log groups, alarms, dashboard |

### 1.7 Infrastructure
| Feature | Status |
|---|---|
| IaC | **Present** — CDK app + stacks under `infrastructure/cdk` |
| VPC | **Defined** — `NetworkStack.ts` with public/private/isolated subnets across 3 AZs |
| KMS | **Defined** — `KmsStack.ts` for DB/storage/trail keys |
| Secrets | **Partial** — DB credentials generated in Aurora secret; app still uses env/Supabase in runtime paths |
| AWS usage | **Defined + Partial Runtime** — Aurora, S3 Object Lock, Cognito, CloudTrail, GuardDuty, Security Hub in CDK; runtime still bridges Supabase |

---

## 2. What Must Change for AWS Migration

### 2.1 Hard Blockers (must remove)
| Current | Problem | AWS Replacement |
|---|---|---|
| `auth.users` schema (Supabase) | Owned by Supabase, not portable | `public.users` table, managed by app + Cognito sub |
| Supabase RLS policies | JWT claims injected by Supabase proxy — not available in Aurora | Application-layer enforced RBAC in Lambda |
| Supabase Auth SDK | Provider-specific client library | AWS Cognito + AWS Amplify Auth |
| Supabase Edge Functions | Deno runtime, `supabase functions deploy` | API Gateway + Lambda (Node.js 22) |
| Supabase Storage | `supabase.storage.from().upload()` | S3 + KMS + presigned URLs |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` in env | Supabase-specific credentials | Cognito Pool ID, App Client ID, API Gateway URL |
| Vercel deployment | Third-party hosting | Amazon CloudFront + S3 (static site) or AWS Amplify Hosting |

### 2.2 Required Security Upgrades
| Requirement | Gap | Implementation |
|---|---|---|
| Bank-grade encryption at rest | Provider-managed (opaque) | KMS CMK per resource type |
| Evidence immutability (WORM) | None | S3 Object Lock (Compliance mode) |
| Secrets management | GitHub Actions secrets + env vars | AWS Secrets Manager (`/growkyc/prod/*`) |
| Infrastructure audit | None | CloudTrail (multi-account, KMS-encrypted, SQS fanout) |
| Threat detection | None | GuardDuty (all threat types), Security Hub (CIS + FSBP standards) |
| Network isolation | None | VPC, private subnets, no public DB, security groups, NACLs |
| VPC endpoints | None | S3 gateway endpoint, KMS+Secrets Manager interface endpoints |
| Compliance logging | DB tables only | CloudTrail + CloudWatch Logs (90-day retention) + DB tables |
| Key rotation | None | Automatic KMS key rotation (annual) |
| CORS | Wildcard `*` | Restricted to app domain in API Gateway + CloudFront origins |
| MFA | Optional TOTP | Required TOTP (Cognito: MFA required) |

### 2.3 Schema Changes Required
| Change | Reason |
|---|---|
| Remove `REFERENCES auth.users ON DELETE CASCADE` | `auth.users` is Supabase-only; replace with `REFERENCES public.users` |
| Add `public.users` table | Stores Cognito `sub` as primary key, replaces Supabase user record |
| Remove Supabase UUID extension dependency | Use `gen_random_uuid()` (PostgreSQL 13+ native) |
| Add `sequence_number BIGSERIAL` to `audit_logs` | Immutability / tamper detection (gaps in sequence detectable) |
| Add evidence S3 metadata columns | `s3_key`, `s3_bucket`, `s3_version_id`, `s3_etag` in evidence tables |
| Partition `audit_logs` by month | Performance at scale |
| Add `deleted_at` removal | Use `status` columns instead of soft-delete for compliance |

### 2.4 Code Changes Required
| File | Change |
|---|---|
| `src/lib/auth.ts` | Replace `supabase.auth.*` calls with `IAuthProvider` interface |
| `src/app/contexts/SecurityContext.tsx` | Replace direct Supabase subscription with `IAuthProvider.onAuthStateChange()` |
| `src/app/services/BotPersistence.ts` | ✅ Updated to use provider registry (`IDatabaseProvider` + `IAuditProvider`) with local fallback |
| `src/app/lib/providers/interfaces.ts` | ✅ Added provider interfaces (`IAuthProvider`, `IStorageProvider`, `IAuditProvider`, `IDatabaseProvider`) |
| `src/app/lib/providers/providerRegistry.ts` | ✅ Added adapter registry with `aws` and `supabase-bridge` runtime switch |
| `src/app/lib/providers/adapters/aws/*` | ✅ Added AWS adapter stubs for Cognito/API/S3/Audit routing |
| `src/app/lib/providers/adapters/supabase/*` | ✅ Added Supabase bridge adapters for incremental migration |
| `supabase/functions/server/index.tsx` | Rewrite as Lambda handler (Phase 2) |
| `supabase/functions/server/auth.tsx` | Rewrite as Lambda middleware (Phase 2) |
| `supabase/functions/server/kv_store.tsx` | Replace with ElastiCache Redis or DynamoDB (Phase 2) |
| `workflows/deploy.yml` | Replace Vercel + Supabase with CDK deploy + S3/CloudFront (Phase 6) |

---

## 3. Phased Implementation Plan

### Phase 1 — Infrastructure as Code + Abstraction Layer *(THIS PHASE)*
- [x] AWS CDK stacks: VPC, KMS, Aurora, S3, Cognito, CloudTrail, GuardDuty, Security Hub, Monitoring
- [x] Provider-agnostic interfaces: `IAuthProvider`, `IStorageProvider`, `IAuditProvider`, `IDatabaseProvider`
- [x] AWS adapter implementations: Cognito, S3, CloudWatch/DB audit
- [x] Supabase bridge adapters (keep existing code working during migration)
- [x] AWS-compatible database migrations (Aurora PostgreSQL, no `auth.users` refs)
- [x] Evidence vault schema with S3 metadata columns
- [x] Immutable audit event model with sequence numbers
- [x] Updated `BotPersistence.ts` to use interfaces

**Phase 1 implementation details committed in repo:**
- `supabase/migrations/003_aws_sydney_phase1_foundation.sql` adds `public.users`, moves FK references off `auth.users`, adds immutable audit sequence, and S3 evidence metadata columns.
- Runtime provider adapters and bridge mode are implemented under `src/app/lib/providers/`.
- Existing business logic (`BotOrchestrator`, `BotAuditService`, `EvidencePackBuilder`) is reused.

### Phase 2 — Authentication Migration
- [ ] Provision Cognito User Pool via CDK (`AuthStack.ts`)
- [ ] Migrate user data: export from Supabase, import to Cognito + `public.users`
- [ ] Wire `cognitoAdapter.ts` as active `IAuthProvider`
- [ ] Update `SecurityContext.tsx` to use Cognito session tokens
- [ ] Enable Advanced Security Mode (risk-based MFA)
- [ ] Test MFA flows, session refresh, RBAC

### Phase 3 — Database Migration
- [ ] Provision Aurora cluster via CDK (`DatabaseStack.ts`)
- [ ] Run migrations `001`–`003` against Aurora
- [ ] Migrate data: `pg_dump` from Supabase → `psql` to Aurora (in-VPC)
- [ ] Validate all queries, indexes, and FK integrity
- [ ] Enable Enhanced Monitoring + Performance Insights
- [ ] Remove `auth.users` foreign key references fully

### Phase 4 — Storage Migration
- [ ] Provision S3 evidence bucket with Object Lock via CDK (`StorageStack.ts`)
- [ ] Migrate existing documents from Supabase Storage to S3
- [ ] Wire `s3EvidenceAdapter.ts` as active `IStorageProvider`
- [ ] Lambda function: presigned URL generation (15-min TTL)
- [ ] Test evidence upload/download end-to-end
- [ ] Validate Object Lock (WORM) and KMS encryption

### Phase 5 — Backend API Migration
- [ ] Rewrite Supabase Edge Functions as Lambda handlers (Node.js 22)
- [ ] API Gateway HTTP API: routes, JWT authorizer (Cognito), rate limiting
- [ ] Lambda layers: `pg` driver, JWT utilities, shared types
- [ ] Deploy Lambda + API Gateway via CDK (`AppStack.ts`)
- [ ] Update frontend `VITE_API_URL` to API Gateway URL
- [ ] Load testing + security scan

### Phase 6 — Frontend Deployment Migration
- [ ] Build static SPA artifact in CI
- [ ] CDK: S3 static hosting bucket + CloudFront distribution + ACM certificate
- [ ] GitHub Actions: deploy to S3 + invalidate CloudFront cache
- [ ] DNS cutover: Route 53 CNAME update
- [ ] Decommission Vercel

### Phase 7 — Full Security Activation
- [ ] Enable GuardDuty (all finding types)
- [ ] Enable Security Hub (CIS AWS Foundations, AWS FSBP standards)
- [ ] Enable AWS Config rules: `rds-storage-encrypted`, `s3-bucket-ssl-requests-only`, `cloudtrail-enabled`, etc.
- [ ] Enable CloudTrail Insights (anomaly detection)
- [ ] CloudWatch alarms: failed logins, unusual data exports, DB latency
- [ ] SNS → security team notifications + PagerDuty
- [ ] WAF rules on CloudFront/API Gateway

### Phase 8 — Compliance Validation
- [ ] AUSTRAC AML/CTF program alignment review
- [ ] ISO 27001 gap assessment
- [ ] Penetration test (API Gateway, Cognito, S3)
- [ ] CloudTrail audit trail completeness review
- [ ] Evidence immutability validation (S3 Object Lock)
- [ ] Disaster recovery test (Aurora point-in-time restore)
- [ ] Decommission Supabase project

---

## Architecture Diagram (Target State)

```
                          ┌─────────────────────────────────────────────────────────┐
                          │                    ap-southeast-2                         │
                          │                                                           │
   Browser/SPA            │   ┌──────────┐    ┌──────────────────────────────────┐  │
   (CloudFront + S3)  ────┼──►│   WAF    │───►│         API Gateway              │  │
                          │   └──────────┘    │     (JWT Authorizer: Cognito)    │  │
                          │                    └──────────┬───────────────────────┘  │
                          │                               │                           │
   ┌──────────────┐       │     ┌────────────────────────┼──────────────────────┐    │
   │   Cognito    │       │     │   Private Subnet (3 AZs)│                     │    │
   │  User Pool   │       │     │                         ▼                     │    │
   │  (MFA req.)  │       │     │              ┌──────────────────┐             │    │
   └──────────────┘       │     │              │  Lambda Functions │             │    │
                          │     │              │  (VPC-attached)   │             │    │
   ┌──────────────┐       │     │              └────┬─────────┬────┘             │    │
   │  CloudTrail  │       │     │                   │         │                  │    │
   │  (KMS enc.)  │       │     │                   ▼         ▼                  │    │
   │   → S3 logs  │       │     │     ┌─────────────────┐  ┌────────────┐       │    │
   └──────────────┘       │     │     │Aurora PostgreSQL │  │     S3     │       │    │
                          │     │     │ (multi-AZ, KMS) │  │ (KMS+WORM) │       │    │
   ┌──────────────┐       │     │     └─────────────────┘  └────────────┘       │    │
   │  GuardDuty   │       │     │                                                 │    │
   │  SecurityHub │       │     │              KMS          Secrets Manager       │    │
   └──────────────┘       │     └─────────────────────────────────────────────────┘   │
                          └─────────────────────────────────────────────────────────┘
```

---

## Key Security Controls (ISO/AUSTRAC Alignment)

| Control | Mechanism | Standard |
|---|---|---|
| Data encryption at rest | KMS CMK (auto-rotation annual) | ISO 27001 A.10 |
| Data encryption in transit | TLS 1.2+ enforced (API GW, CloudFront, Aurora) | ISO 27001 A.10 |
| Evidence immutability | S3 Object Lock (Compliance mode, 7-year retention) | AUSTRAC AML/CTF s.114 |
| Audit trail immutability | Append-only Aurora table + CloudTrail (tamper-evident) | ISO 27001 A.12.4 |
| Network isolation | VPC private subnets, no public DB/cache endpoints | ISO 27001 A.13 |
| MFA mandatory | Cognito User Pool: TOTP required | ISO 27001 A.9.4 |
| Secret management | Secrets Manager (no env vars in code) | ISO 27001 A.10 |
| Threat detection | GuardDuty (ML-based), Security Hub (CIS/FSBP) | ISO 27001 A.12.6 |
| Least privilege | IAM roles per Lambda/service, resource-based policies | ISO 27001 A.9 |
| Cross-AZ redundancy | Aurora multi-AZ writer/reader, multi-AZ Lambda | ISO 22301 |
| RBAC | Cognito Groups + application-layer permission checks | ISO 27001 A.9 |
| Key custody | KMS CMK (AWS-managed HSM), key policy + grants | ISO 27001 A.10 |
