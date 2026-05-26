---
title: GrowKYC Current-State Assessment & AWS Sydney Migration Plan
version: 1.0
date: 2026-03-29
status: Draft
audience: Product, Engineering, Security, Compliance
---

# GrowKYC Codebase Assessment & AWS Sydney Migration Plan

## Executive Summary

GrowKYC is a **regulatory operating system** for financial services compliance with comprehensive KYC/AML/CTF capabilities. The platform demonstrates strong architectural foundations with:

- ✅ Clean separation of concerns (React frontend, TypeScript services)
- ✅ Multi-tenant architecture pattern (organizations, tenants, roles)
- ✅ Audit event model (BotAuditService, audit_logs table)
- ✅ AWS CDK infrastructure-as-code (Sydney region, VPC, RDS, KMS, S3)
- ✅ AUSTRAC-aligned database configuration
- ✅ 70+ components, 22 AI bots, 50+ integrations

**Current state**: Functional platform using Supabase for authentication + custom backend services, with CDK infrastructure half-implemented.

**Target state**: Bank-grade, production-ready AWS-hosted platform in Sydney (ap-southeast-2) with:
- Complete multi-AZ deployment
- Immutable audit trails
- Strict tenant isolation
- ISO 27001/27701/22301 readiness
- 7-year compliance retention
- Full RBAC with audit traceability

---

## Part 1: Module Classification (Keep / Improve / Replace / Add)

### KEEP ✅ (Sound, retain as-is or with minimal changes)

#### Frontend & UI Layer
- **React 18 + TypeScript architecture** — Solid foundation
- **Vite build tooling** — Modern, fast, aligned with Next.js patterns
- **Radix UI + shadcn/ui components** — Enterprise-grade, accessible
- **Tailwind CSS v4** — Proven design system
- **Role-based dashboard architecture** — Partner, Officer, Analyst, Auditor, Borrower, Lender, Investor views
- **Navigation and routing patterns** — Clean component structure

**Rationale**: These are well-structured, provide a strong UX foundation, and don't require cloud-specific changes.

#### Business Logic & Services
- **BotOrchestrator** — Compliance bot execution framework (keep, integrate with Lambda)
- **BotAuditService** — Event logging (extend with CloudTrail integration)
- **EvidencePackBuilder** — Document evidence aggregation (extend for S3 Object Lock)
- **BotPersistence** — Bot execution record storage (migrate to RDS)
- **BotRegistry** — Bot versioning and enablement (keep pattern, move state to RDS)

**Rationale**: Core business logic is sound. These services encapsulate compliance workflows and should be preserved, then migrated to serverless Lambda with RDS backing.

#### Data Models
- **organizations** table — Multi-tenant structure (expand with isolation controls)
- **user_profiles** table — RBAC foundation (enhance with audit traceability)
- **audit_logs** table — Event model (extend with immutability, retention policies)
- **KYC/AML data structures** — Client lifecycle (refine for evidence retention)

**Rationale**: Schema design reflects regulatory requirements. Retain structure, add S3 evidence pointers, enforce retention policies.

#### Infrastructure Patterns
- **VPC with public/private/isolated subnets** — Correct layering
- **Aurora PostgreSQL Serverless v2** — Excellent choice for compliance (encryption, audit logging, automatic failover)
- **RDS parameter group with pgaudit** — Security-focused configuration
- **KMS key for encryption at rest** — Proper key management
- **CloudWatch log exports** — Audit log capture

**Rationale**: CDK stacks demonstrate compliance understanding. Minimal changes needed, mostly completion.

#### Compliance Framework
- **AUSTRAC-aligned configuration** — 35-day backup window, timezone Australia/Sydney, forced SSL
- **Evidence and retention design** — Fields for audit evidence in schema
- **Multi-jurisdiction awareness** — Modular bot framework supports country-specific logic

**Rationale**: Compliance thinking is built-in. Keep and operationalize with S3 Object Lock and CloudTrail.

---

### IMPROVE 🔄 (Keep core logic, enhance for production)

#### Authentication & Authorization
**Current**: Supabase Auth + custom role/permission model in user_profiles
**Issues**:
- Dependency on Supabase (not self-hosted on AWS)
- Permissions stored as JSONB without audit trail per permission change
- MFA optional, not enforced for admin/privileged roles
- No session audit trail (login IP, session ID, termination events)

**Improvements**:
- Migrate to AWS Cognito + IAM Identity Center (SSO support)
- Store role/permission changes in audit_logs with effective dates
- Enforce MFA for admin, approver, auditor roles
- Add session management: session_id, login_ip, login_time, logout_time, device_fingerprint
- Implement least-privilege IAM roles per environment (dev/staging/prod)

**Implementation effort**: **Medium** (3-4 weeks)
**Priority**: **High** (foundation for all security controls)

#### Database Migration Safety
**Current**: Migrations stored in supabase/migrations/ with Supabase-style versioning
**Issues**:
- Supabase dependency prevents self-hosted RDS usage
- No rollback procedures documented
- No data validation hooks
- No pre-flight checks for production migrations

**Improvements**:
- Convert to AWS RDS-compatible migration framework (db-migrate or Flyway)
- Add schema change validation (no breaking changes detection)
- Implement pre/post migration data integrity checks
- Create rollback tests (backward compatibility validation)
- Add run-books for multi-AZ migration procedures
- Enable point-in-time recovery (PITR) validation

**Implementation effort**: **Medium** (2-3 weeks)
**Priority**: **High** (de-risks compliance data)

#### API Layer & Service Integration
**Current**: Frontend directly calls Supabase + custom services
**Issues**:
- No API gateway (no rate limiting, no request audit)
- No request/response logging for compliance
- No data masking for sensitive fields in logs
- Service integrations (IDV, sanctions, PEP checks) appear to be mock data

**Improvements**:
- Add AWS API Gateway in front of Lambda functions
- Implement request/response logging with CloudTrail
- Add field-level masking for PII in logs
- Integrate real provider adapters: IDV (AWS Rekognition + provider SDKs), sanctions (WorldCompliance), PEP (Refinitiv), adverse media (LexisNexis)
- Add rate limiting, request validation, input sanitization
- Implement distributed tracing (X-Ray)

**Implementation effort**: **Medium-High** (4-6 weeks)
**Priority**: **High** (compliance requirement)

#### Evidence & Document Management
**Current**: EvidencePackBuilder aggregates evidence, unclear persistence
**Issues**:
- No encrypted storage documented
- No retention policies enforced
- No Object Lock for immutability
- No version history

**Improvements**:
- Move all evidence to S3 with:
  - KMS encryption at rest
  - TLS encryption in transit
  - Versioning enabled
  - Object Lock in Governance mode (retention + legal hold)
  - Lifecycle rules (transition to Glacier after 1 year, delete after 7 years for AUSTRAC)
- Add evidence metadata: origination_date, retention_until, classification, audit_trail
- Implement digital signatures (AWS Signer)
- Add tamper-detection via S3 Object Tags + versioning

**Implementation effort**: **Medium** (3-4 weeks)
**Priority**: **High** (audit-ready requirement)

#### Monitoring & Observability
**Current**: CloudWatch logs exports from RDS, but no analysis framework
**Issues**:
- No centralized security event detection
- No performance baselines
- No anomaly alerting
- No compliance evidence dashboard

**Improvements**:
- Implement CloudWatch Insights queries for security events
- Add AWS Security Hub integration (centralized findings)
- Integrate GuardDuty for threat detection
- Create compliance dashboard (audit events by type, user, organization)
- Set up automated alerts for suspicious patterns (high volume queries, failed auth attempts, data exports)
- Implement SLO monitoring (AUSTRAC/ISO 27001 readiness dashboards)

**Implementation effort**: **Medium** (3-4 weeks)
**Priority**: **Medium-High** (post-launch hardening)

---

### REPLACE 🔄 (Remove current implementation, adopt new approach)

#### Supabase Dependency
**Current**: Uses Supabase for auth, realtime, storage abstraction
**Rationale for replacement**: 
- Adds vendor lock-in outside AWS
- Supabase-managed hosting not in Sydney region (affects data residency)
- Simpler to manage single-cloud stack (AWS services, no external dependencies)

**Replacement**:
- **Auth**: AWS Cognito + IAM Identity Center
- **Realtime**: WebSocket via API Gateway + Lambda (simple pub/sub for compliance events)
- **Storage abstraction**: Direct S3 SDK calls
- **Database**: Migrate from Supabase (PostgreSQL wrapper) → AWS RDS Aurora PostgreSQL native

**Implementation effort**: **High** (6-8 weeks)
**Priority**: **Critical** (foundational migration)
**Approach**: Parallel run (Supabase → AWS in staging, validate compliance logic, then cutover)

#### Mock Data / Simulated Providers
**Current**: AMLHitsData.ts, AssociateLegalData.ts, AustracReportingData.ts appear to be mock implementations
**Issues**:
- Simulate realistic compliance checks but aren't calling real providers
- IDV, sanctions, PEP, adverse media are hardcoded responses

**Rationale for replacement**:
- For production, real provider integrations are mandatory
- Compliance auditors will validate actual screening hits
- Mock data acceptable for dev/test, not for production

**Replacement**:
- **IDV (Identity Verification)**: 
  - Primary: AWS Rekognition (document analysis) + GreenID API (Australian verification)
  - Fallback: Stripe Identity, Onfido
- **Sanctions/PEP**: 
  - Primary: WorldCompliance API
  - Fallback: OFAC SDN list (US), consolidated lists (EU, AU)
- **Adverse Media**: 
  - Refinitiv eSpeed or similar
- **Company Registry**: 
  - ASIC (Australian Securities & Investments Commission) API for company verification

**Implementation effort**: **High** (8-10 weeks, dependent on vendor onboarding)
**Priority**: **Critical** (audit requirement)
**Note**: Each provider integration is a separate module; can be rolled out incrementally

---

### ADD ➕ (New capabilities for production readiness)

#### Immutable Audit Event Store
**Current**: audit_logs table is standard RDS table (updatable, deletable)
**New requirement**: Immutable, tamper-evident audit trail

**Add**:
- Create **audit_events_immutable** table with:
  - Hardware-backed sequence numbering (RDS sequence + cryptographic hash chain)
  - Fields: event_id (UUID), organization_id, actor_id, action, resource_type, resource_id, timestamp (UTC), data (JSONB), hash_of_previous_event, digital_signature
  - Remove UPDATE/DELETE permissions from application role
  - Enable database-level encryption
  - Integrate with CloudTrail for AWS API auditing
  - Archive to S3 Object Lock after 90 days (immutable retention)
  - Implement hash chain validation (detect tampering)

**Implementation effort**: **High** (6-8 weeks, including validation logic)
**Priority**: **Critical** (ISO 27001/audit-ready)

#### Tenant Isolation Enforcement
**Current**: organizations table exists but no row-level security (RLS) enforced
**New requirement**: Strict isolation between organizations (bank-grade)

**Add**:
- Enable PostgreSQL RLS on all tables:
  - user_profiles: SELECT only if organization_id = current_user_org
  - audit_logs: SELECT only if organization_id = current_user_org
  - clients: SELECT only if organization_id = current_user_org
  - All evidence: S3 bucket policies + object prefixes per organization
- Add isolation validation tests (every query, verify organization context)
- Add CloudTrail logging of IAM policy changes (prevent accidental cross-org access)
- Test cross-organization access attempts (should fail)

**Implementation effort**: **Medium** (3-4 weeks)
**Priority**: **Critical** (regulatory and security requirement)

#### Secrets Management & Rotation
**Current**: Secrets stored in environment variables or Secrets Manager, rotation not automated
**New requirement**: Automated rotation, audit trail of access

**Add**:
- AWS Secrets Manager with automatic rotation:
  - Database credentials (60-day rotation)
  - API keys for integrations (90-day rotation)
  - Lambda execution role credentials (auto-rotated by AssumeRole)
- Implement rotation Lambda for third-party APIs (where supported)
- Log all secret access via CloudTrail
- Add cross-region replica for disaster recovery
- Implement secret tagging (environment, vendor, criticality)

**Implementation effort**: **Medium** (2-3 weeks)
**Priority**: **High** (security baseline)

#### Disaster Recovery & PITR
**Current**: RDS backup configured (35 days) but no tested DR procedure
**New requirement**: Tested RTO/RPO, documented runbooks, cross-region replica

**Add**:
- Enable RDS cross-region backup replication (to ap-southeast-1 if needed)
- Implement PITR validation: restore to a test DB, validate integrity
- Create DR runbook: failover steps, data sync verification, application reconnection
- Test quarterly: full DR drill, measure RTO/RPO
- Set RTO target: < 4 hours, RPO: < 15 minutes (AUSTRAC compliance)
- Document cutover procedures for multi-AZ failure

**Implementation effort**: **Medium** (3-4 weeks)
**Priority**: **High** (compliance requirement, ISO 22301)

#### Compliance Evidence & Legal Hold
**Current**: No model for legal hold, evidence retention policies
**New requirement**: Support for litigation holds, evidence preservation

**Add**:
- Add **legal_holds** table: organization_id, hold_id, initiator, reason, effective_date, release_date, email_notification
- Modify S3 lifecycle rules to respect legal holds (don't delete if hold active)
- Add **evidence_retention_policies** table: organization_id, policy_id, policy_type, retention_period_years, classification, audit_rule
- Implement audit checks: weekly verification that held evidence hasn't been deleted
- Add dashboard: active holds, evidence under hold, notification trail

**Implementation effort**: **Medium** (3-4 weeks)
**Priority**: **Medium-High** (regulatory readiness, not immediate)

#### Provider-Agnostic Integration Abstraction
**Current**: Integrations appear mixed in components
**New requirement**: Pluggable provider pattern for IDV, sanctions, PEP, adverse media

**Add**:
```
interface ComplianceProvider {
  name: string;
  version: string;
  config: { apiKey, endpoint, ... };
  methods: {
    checkIdentity(client) -> IdentityResult
    checkSanctions(person) -> SanctionsResult
    checkPEP(person) -> PEPResult
    checkAdverseMedia(person) -> AdverseMediaResult
  };
  audit: { callCount, hitRate, cost }
}

registry: {
  'idv-greenid': GreenIDProvider,
  'idv-stripe': StripeIdentityProvider,
  'sanctions-worldcompliance': WorldComplianceProvider,
  ...
}
```

**Add**:
- Provider registry (stores enabled providers, failover order, feature matrix)
- Provider audit (logs each call, cost, latency, result)
- Provider health checks (uptime monitoring)
- Fallback strategy (if primary fails, try secondary)
- Cost tracking per provider per organization

**Implementation effort**: **Medium-High** (4-6 weeks)
**Priority**: **Medium** (post-launch, improves maintainability)

#### Penetration Testing & Vulnerability Management
**Current**: No automated security scanning documented
**New requirement**: Continuous vulnerability assessment readiness

**Add**:
- AWS CodePipeline integration with SAST/DAST tools:
  - SAST: SonarQube or AWS CodeGuru (code vulnerabilities)
  - DAST: AWS WAF logs + scheduled penetration tests
  - Dependency scanning: npm audit + Snyk
- Implement bug bounty preparation (security.txt, vulnerability report process)
- Add security headers: CSP, X-Frame-Options, X-Content-Type-Options, HSTS
- Enable AWS WAF rules (SQL injection, XSS, rate limiting)
- Quarterly external penetration testing

**Implementation effort**: **Medium** (3-4 weeks)
**Priority**: **Medium-High** (post-launch security hardening)

---

## Part 2: Current-State Assessment

### Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    CURRENT STATE                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  FRONTEND                                                │
│  ├─ React 18 + TypeScript                              │
│  ├─ Vite (bundler)                                      │
│  ├─ Tailwind CSS v4                                     │
│  └─ 70+ UI components (Radix + shadcn)                 │
│                                                          │
│  ↓ (HTTP/REST)                                         │
│                                                          │
│  BACKEND (Partially Deployed)                          │
│  ├─ Supabase Auth (external)                           │
│  ├─ BotOrchestrator (client-side / Lambda-ready)       │
│  ├─ BotAuditService (client-side / Lambda-ready)       │
│  ├─ EvidencePackBuilder (client-side / needs S3)      │
│  └─ Custom services (TypeScript, need Lambda wrap)    │
│                                                          │
│  ↓ (PostgreSQL)                                        │
│                                                          │
│  DATABASE                                               │
│  ├─ Supabase PostgreSQL (external, not Sydney)        │
│  │  OR                                                   │
│  ├─ AWS Aurora PostgreSQL (CDK-defined, in Sydney)    │
│  └─ Schema: organizations, users, audit_logs, clients │
│                                                          │
│  ↓ (S3 SDK / Supabase Storage)                        │
│                                                          │
│  STORAGE                                                │
│  ├─ Supabase Storage (external)                        │
│  │  OR                                                   │
│  ├─ AWS S3 (CDK-defined, in Sydney)                    │
│  └─ Evidence, documents, uploads                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Current | Status |
|-------|---------|--------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind, Radix UI | ✅ Production-ready |
| **Build** | Vite, npm | ✅ Good |
| **Runtime** | Browser (client-side logic) + Supabase / Lambda (server) | ⚠️ Hybrid |
| **Auth** | Supabase Auth + custom RBAC | ⚠️ External dependency |
| **Database** | PostgreSQL (Supabase or RDS) | ⚠️ Supabase outside Sydney |
| **Cache** | Not documented | ❌ Missing |
| **Storage** | Supabase Storage or S3 | ⚠️ Unclear |
| **Secrets** | Env vars or Secrets Manager | ⚠️ Undocumented |
| **Logging** | CloudWatch logs (RDS) | ✅ Configured |
| **Monitoring** | CloudWatch | ⚠️ Basic |
| **Deployment** | AWS CDK (defined but not fully deployed) | ⚠️ Partial |
| **Security** | VPC, RDS encryption, KMS | ✅ Good foundations |

### Deployed Infrastructure (AWS Sydney)

**✅ Defined in CDK, partially deployed:**

- VPC (3 AZs: ap-southeast-2a, b, c) — DEFINED
- RDS Aurora PostgreSQL Serverless v2 — DEFINED
- Security Groups (app, Lambda, DB, VPC endpoints) — DEFINED
- VPC Endpoints (S3, DynamoDB, Secrets Manager, KMS, CloudWatch Logs) — DEFINED
- KMS key for encryption — DEFINED
- CloudWatch log groups — DEFINED
- IAM roles and policies — PARTIALLY DEFINED

**❌ Missing / Not fully implemented:**

- API Gateway (no HTTP entry point)
- Lambda functions (business logic needs wrapping)
- ECS/Fargate (no container orchestration for frontend)
- CloudFront (no edge caching)
- WAF (no protection on API Gateway)
- GuardDuty (no threat detection enabled)
- Security Hub (no centralized findings)
- CloudTrail (AWS API audit logging not fully enabled)
- S3 buckets with proper retention policies
- Application Load Balancer (no front-end load balancing)

### Current Compliance Posture

| Requirement | Status | Gap |
|---|---|---|
| **ISO 27001** | Partial | No documented access controls, incomplete MFA, no evidence of vulnerability management |
| **ISO 27701** (Privacy) | Partial | No privacy policy automation, no consent management auditing |
| **ISO 22301** (Business Continuity) | Partial | No tested DR procedure, RTO/RPO not documented |
| **AUSTRAC AML/CTF** | Partial | No real provider integrations yet (mock data), audit trail exists, 7-year retention structure ready |
| **Data Residency** | Partial | **CRITICAL GAP**: Supabase not in Sydney region |
| **Multi-tenancy** | Partial | No RLS enforcement, audit isolation possible but not enforced |
| **Audit Trail** | Good | audit_logs table, BotAuditService, but not immutable |
| **Encryption** | Good | RDS + S3 encryption at rest via KMS, TLS in transit not documented |
| **Backup & Recovery** | Partial | RDS backups configured, no tested runbook |

### Compliance Gaps (Critical)

1. **Data Residency Violation** 🔴 CRITICAL
   - If using Supabase: Data stored outside Sydney (may violate AUSTRAC/privacy requirements)
   - **Fix**: Migrate to RDS Aurora (already in CDK, just deploy it)

2. **Immutable Audit Trail** 🔴 CRITICAL
   - Current audit_logs table is mutable (can be updated/deleted)
   - **Fix**: Implement immutable audit event store with hash chain + S3 Object Lock archival

3. **Tenant Isolation Not Enforced** 🔴 CRITICAL
   - No row-level security (RLS) at database level
   - **Fix**: Enable PostgreSQL RLS + validation tests

4. **Real Compliance Provider Integrations Missing** 🔴 CRITICAL
   - IDV, sanctions, PEP, adverse media are mock data
   - **Fix**: Implement real provider SDKs (GreenID, WorldCompliance, Refinitiv, etc.)

5. **MFA Not Enforced** 🟡 HIGH
   - MFA optional in schema, not enforced for privileged roles
   - **Fix**: Cognito + enforce MFA for admin/approver/auditor roles

6. **No System-Level Audit Trail** 🟡 HIGH
   - CloudTrail not fully enabled for AWS API audit
   - **Fix**: Enable CloudTrail, store in S3 Object Lock

7. **Secrets Rotation Not Automated** 🟡 HIGH
   - No automated rotation documented
   - **Fix**: Implement Secrets Manager rotation + Lambda

8. **Session Management Missing** 🟡 MEDIUM
   - No session audit trail (login IP, session ID, terminations)
   - **Fix**: Implement session_events table + audit logging

9. **Evidence Management Incomplete** 🟡 MEDIUM
   - No S3 Object Lock, versioning, or retention policies
   - **Fix**: Configure S3 with Object Lock (Governance mode), lifecycle rules, versioning

10. **No Legal Hold Support** 🟡 MEDIUM
    - Cannot legally hold evidence during litigation
    - **Fix**: Implement legal_holds table + S3 lifecycle blocking

---

## Part 3: AWS Sydney Target Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GROW COMPLIANCE OS                              │
│                      AWS Sydney (ap-southeast-2)                         │
│                    Bank-Grade, Audit-Ready, Multi-AZ                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  EDGE & PROTECTION LAYER (Optional)                                      │
│  ├─ CloudFront (if geo-distribution needed, Sydney origin only)          │
│  ├─ AWS WAF (SQL injection, XSS, rate limiting)                          │
│  ├─ AWS Shield (DDoS protection)                                          │
│  └─ Route 53 (DNS, health checks)                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  NORTH-SOUTH TRAFFIC TIER (Dual-AZ / Active-Active)                    │
│  ├─ Application Load Balancer (ap-southeast-2a, 2b)                     │
│  │  └─ Listener: HTTPS (443) → API Gateway                             │
│  ├─ API Gateway (regional, in Sydney)                                    │
│  │  ├─ Methods: /api/kyc/*, /api/aml/*, /api/audit/*                   │
│  │  └─ CloudTrail → S3 Object Lock                                      │
│  └─ Cross-AZ automatic failover, health checks every 30s                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  VPC (10.0.0.0/16) with 3 Availability Zones (a, b, c)                 │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ PUBLIC SUBNETS (ALB endpoint, NAT Gateways)                        ││
│  │ ├─ ap-southeast-2a: 10.0.0.0/24                                   ││
│  │ ├─ ap-southeast-2b: 10.0.1.0/24                                   ││
│  │ └─ ap-southeast-2c: 10.0.2.0/24                                   ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ PRIVATE SUBNETS WITH EGRESS (Lambda, ECS tasks, containers)       ││
│  │ ├─ ap-southeast-2a: 10.0.16.0/20                                  ││
│  │ ├─ ap-southeast-2b: 10.0.32.0/20                                  ││
│  │ └─ ap-southeast-2c: 10.0.48.0/20                                  ││
│  │ Route: 0.0.0.0/0 → NAT Gateway (egress for AWS API calls)         ││
│  │                                                                    ││
│  │ Contains:                                                           ││
│  │ ├─ Lambda functions (BotOrchestrator, integrations)                ││
│  │ ├─ ECS Fargate tasks (frontend, if not Next.js static)            ││
│  │ └─ VPC Endpoint clients (Secrets Manager, KMS, S3, CloudWatch)    ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ PRIVATE ISOLATED SUBNETS (Aurora PostgreSQL, no egress)           ││
│  │ ├─ ap-southeast-2a: 10.0.64.0/28                                  ││
│  │ ├─ ap-southeast-2b: 10.0.64.16/28                                 ││
│  │ └─ ap-southeast-2c: 10.0.64.32/28                                 ││
│  │                                                                    ││
│  │ Contains:                                                           ││
│  │ └─ RDS Aurora PostgreSQL (writer + reader replicas)               ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ VPC ENDPOINTS (private, no egress via NAT)                         ││
│  │ ├─ S3 Gateway Endpoint (evidence storage, no data transfer cost)   ││
│  │ ├─ DynamoDB Gateway Endpoint (if using for sessions/cache)        ││
│  │ ├─ SecretsManager Interface Endpoint (HTTPS, private DNS)         ││
│  │ ├─ KMS Interface Endpoint (envelope encryption)                    ││
│  │ ├─ CloudWatch Logs Interface Endpoint (logging without NAT)       ││
│  │ └─ STS Interface Endpoint (temporary credentials for roles)        ││
│  └────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  COMPUTE LAYER                                                           │
│                                                                          │
│  Option A: Lambda + ECS Fargate (Recommended)                           │
│  ├─ API Handlers: Lambda (synchronous, auto-scaling)                   │
│  │  ├─ POST /api/kyc/initiate → Lambda (identity verification)       │
│  │  ├─ GET /api/aml/check → Lambda (sanctions screening)             │
│  │  ├─ POST /api/audit/log → Lambda (immutable audit)                │
│  │  └─ POST /api/evidence/upload → Lambda → S3                       │
│  │                                                                    │
│  ├─ Async Jobs: SQS + Lambda (bot orchestration, integrations)       │
│  │  ├─ RunBotOrchestrator (execute compliance bots in background)    │
│  │  ├─ FetchProviderData (IDV, sanctions, adverse media)             │
│  │  └─ GenerateReports (weekly compliance reports)                   │
│  │                                                                    │
│  ├─ Frontend: ECS Fargate + CloudFront (React frontend)              │
│  │  └─ Or: S3 Static Website + CloudFront (if using Next.js static) │
│  │                                                                    │
│  │ Lambda Runtime: Node.js 20.x + TypeScript                         │
│  │ VPC: Private subnets (RDS, Secrets Manager access)               │
│  │ Concurrency: Reserved 10, Provisional 100 (prod scaling)          │
│  │ Timeout: 30s (typical), 300s (batch jobs)                        │
│  │ Memory: 1024MB - 3008MB (CPU scaling with memory)                │
│  │ Ephemeral storage: /tmp 10 GB (enough for evidence files)        │
│  │                                                                    │
│  │ Option B: EKS (Kubernetes, if complex orchestration needed)       │
│  │ ├─ Not recommended for compliance platform (Lambda simpler)       │
│  │ └─ If needed: managed node groups in 3 AZs, IAM roles per pod    │
│  │                                                                    │
│  │ Option C: EC2 (only if justified, higher overhead)                │
│  │ └─ Not recommended unless specific requirements                   │
│  │                                                                    │
│  └─ Monitoring: CloudWatch Logs, CloudWatch Metrics, X-Ray          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  DATA TIER                                                               │
│                                                                          │
│  RELATIONAL (Primary)                                                    │
│  ├─ RDS Aurora PostgreSQL Serverless v2                                │
│  │  ├─ Writer: ap-southeast-2a (primary)                              │
│  │  ├─ Reader: ap-southeast-2b (read replica)                         │
│  │  ├─ Failover: Automatic (< 30 seconds to ap-southeast-2c)          │
│  │  ├─ Engine: PostgreSQL 15.4                                        │
│  │  ├─ Min Capacity: 0.5 ACU (dev), 2 ACU (staging/prod)             │
│  │  ├─ Max Capacity: 4 ACU (dev), 16 ACU (staging), 64 ACU (prod)   │
│  │  ├─ Storage: Auto-scaling, encrypted with KMS                     │
│  │  ├─ Backup: 35 days retention (AUSTRAC), cross-region replica     │
│  │  ├─ PITR: 7 days (point-in-time recovery)                         │
│  │  ├─ Audit Logging: pgaudit enabled (all DDL, parameter logging)   │
│  │  ├─ Monitoring: Enhanced Monitoring, Performance Insights         │
│  │  ├─ SSL/TLS: Enforced (rds.force_ssl = 1)                         │
│  │  ├─ Schema:                                                         │
│  │  │  ├─ organizations (multi-tenant)                               │
│  │  │  ├─ user_profiles (users + RBAC)                               │
│  │  │  ├─ audit_logs (mutable, daily export to S3 Object Lock)       │
│  │  │  ├─ audit_events_immutable (immutable, hash chain)             │
│  │  │  ├─ session_events (login/logout/session lifecycle)            │
│  │  │  ├─ clients (KYC subjects)                                     │
│  │  │  ├─ screening_results (SAM, PEP, AML hits)                     │
│  │  │  ├─ evidence_metadata (pointers to S3 objects)                 │
│  │  │  ├─ legal_holds (litigation holds on evidence)                 │
│  │  │  ├─ retention_policies (automated retention rules)             │
│  │  │  ├─ provider_calls (audit of external API calls)               │
│  │  │  └─ bot_runs (compliance bot execution)                        │
│  │  └─ IAM Auth: Lambda assumes role, no passwords in code           │
│  │                                                                    │
│  │ Access Pattern:                                                     │
│  │ ├─ Write: Lambda (API handlers) via private subnet                │
│  │ ├─ Read: Lambda + read replicas (query scaling)                   │
│  │ └─ Audit: Direct table access via pgaudit logs                    │
│  │                                                                    │
│  └─ No password-based auth in application code (IAM-based)           │
│                                                                          │
│  OBJECT STORAGE (Evidence, Documents, Audit Logs)                       │
│  ├─ S3 Bucket: growkyc-evidence-prod-sydney                             │
│  │  ├─ Region: ap-southeast-2 (Sydney only)                           │
│  │  ├─ Versioning: Enabled (audit trail per object)                   │
│  │  ├─ Encryption: KMS (customer-managed key)                         │
│  │  ├─ Object Lock: Enabled, Governance mode                          │
│  │  │  └─ Retention: AUSTRAC 7-year rule (per object or default)     │
│  │  │  └─ Legal Hold: Yes (litigation support)                        │
│  │  ├─ Lifecycle Rules:                                                │
│  │  │  ├─ 0-1 year: STANDARD (hot, frequently accessed)              │
│  │  │  ├─ 1-7 years: GLACIER (compliance archive, rare access)       │
│  │  │  └─ 7+ years: DELETE (AUSTRAC minimum satisfied)               │
│  │  ├─ Access Control: Private (no public)                             │
│  │  ├─ Block Public Access: Yes (all 4 settings)                      │
│  │  ├─ MFA Delete: Yes (protect against accidental deletion)          │
│  │  ├─ Logging: S3 access logs → separate bucket (audit trail)        │
│  │  ├─ Monitoring: CloudWatch bucket metrics, S3 Inventory           │
│  │  └─ Cost: ~$0.023/GB/month (Sydney), glacier $0.005/GB/month     │
│  │                                                                    │
│  │ Folder Structure (by organization):                                 │
│  │ s3://growkyc-evidence-prod-sydney/                                 │
│  │  └─ {org-id}/                                                      │
│  │     ├─ evidence/{case-id}/{doc-timestamp}-{hash}.pdf              │
│  │     ├─ kyc/{client-id}/{idv-timestamp}-idv.json                   │
│  │     ├─ screening/{client-id}/{screening-timestamp}-results.json   │
│  │     ├─ audit-logs/{date}/{hour}-audit-export.jsonl (import daily) │
│  │     └─ system-logs/{date}/{hour}-system-logs.jsonl                │
│  │                                                                    │
│  │ Access Pattern:                                                     │
│  │ ├─ Write: Lambda uploads with owner=organization_id, via private  │
│  │ ├─ Read: Lambda reads (presigned URLs for UI download)            │
│  │ └─ Audit: CloudTrail logs all reads/writes                        │
│  │                                                                    │
│  ├─ S3 Bucket: growkyc-audit-logs-prod-sydney (separate)              │
│  │  └─ Immutable storage for CloudTrail logs (Object Lock)            │
│  │                                                                    │
│  └─ S3 Bucket: growkyc-backups-prod-sydney (RDS snapshots)            │
│     ├─ Cross-region replication enabled (ap-southeast-1)               │
│     └─ Object Lock for backup immutability                             │
│                                                                          │
│  CACHE (Optional)                                                        │
│  ├─ ElastiCache Redis (if frequent lookups of sanctions lists)         │
│  │  ├─ For: Client cache (by client_id), sanctions list (daily regen)│
│  │  ├─ TTL: 24 hours (sanctions), 1 hour (client cache)              │
│  │  └─ Private subnet (no public internet)                           │
│  │                                                                    │
│  └─ DynamoDB (optional, for session management)                        │
│     ├─ Table: sessions_prod                                           │
│     ├─ Partition key: session_id, GSI on user_id, org_id             │
│     ├─ TTL: auto-delete after 24 hours (inactive sessions)           │
│     └─ Encrypted at rest (default AWS-managed or KMS)                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  SECURITY & KEY MANAGEMENT                                              │
│                                                                          │
│  AWS KMS (Encryption)                                                    │
│  ├─ Customer-Managed Key (CMK): KMS key 'growkyc-master-key'           │
│  ├─ Key Policy: Restrict to prod account, specific roles               │
│  ├─ Usage:                                                              │
│  │  ├─ RDS encryption (EBS volumes, snapshots)                        │
│  │  ├─ S3 encryption (envelope encryption)                            │
│  │  ├─ Secrets Manager encryption (secrets at rest)                   │
│  │  └─ Lambda environment variables encryption                        │
│  ├─ Key Rotation: Annual (automatic)                                   │
│  ├─ Audit: CloudTrail logs all key usage                              │
│  └─ Backup: Multi-region key backup enabled                           │
│                                                                          │
│  AWS Secrets Manager                                                     │
│  ├─ growkyc/prod/db-credentials (RDS)                                  │
│  │  ├─ Rotated every 60 days                                          │
│  │  ├─ Rotation Lambda: Resets password in RDS                        │
│  │  └─ Access: Lambda IAM role only                                   │
│  │                                                                    │
│  ├─ growkyc/prod/provider-apikeys (GreenID, WorldCompliance, etc.)    │
│  │  ├─ Rotated per vendor SLA (30-90 days)                            │
│  │  ├─ Access: Specific Lambda functions                              │
│  │  └─ Audit: CloudTrail + secret version history                    │
│  │                                                                    │
│  ├─ growkyc/prod/jwt-signing-key (API token signing)                  │
│  │  ├─ Rotated annually                                               │
│  │  └─ Access: API Gateway + Lambda authx                             │
│  │                                                                    │
│  └─ Cross-region replica: ap-southeast-1 (disaster recovery)          │
│                                                                          │
│  AWS Cognito (Identity & Access)                                        │
│  ├─ User Pool: growkyc-prod-pool                                       │
│  │  ├─ MFA: Mandatory for admin/approver/auditor roles                │
│  │  ├─ Password Policy: 12+ chars, uppercase, numbers, symbols       │
│  │  ├─ Session Timeout: 1 hour (inactivity), refresh tokens 30 days  │
│  │  ├─ User Attributes: email, phone, custom:organization_id        │
│  │  ├─ Pre/Post hooks: Lambda triggers for custom logic              │
│  │  │  ├─ Post-authentication: Log session event, mark last login   │
│  │  │  └─ Pre-token-generation: Add org_id, roles to JWT            │
│  │  └─ Audit: CloudTrail logs auth events                            │
│  │                                                                    │
│  ├─ Identity Provider:                                                 │
│  │  ├─ Cognito User Pool (primary)                                    │
│  │  ├─ SAML/OIDC (enterprise SSO, optional)                           │
│  │  └─ Social (Google, Microsoft, optional)                           │
│  │                                                                    │
│  └─ IAM Identity Center (AWS SSO, optional for enterprise)            │
│     ├─ Sync from Okta/Azure AD (if using)                             │
│     └─ Grant access to AWS console + custom apps                      │
│                                                                          │
│  IAM Roles (Least Privilege)                                            │
│  ├─ LambdaExecutionRole                                                │
│  │  ├─ Permissions:                                                    │
│  │  │  ├─ rds:DescribeDBClusters (read-only)                          │
│  │  │  ├─ s3:GetObject, s3:PutObject (evidence bucket)                │
│  │  │  ├─ secretsmanager:GetSecretValue (creds)                       │
│  │  │  ├─ kms:Decrypt, kms:GenerateDataKey                            │
│  │  │  ├─ logs:CreateLogGroup, logs:PutLogEvents                      │
│  │  │  ├─ xray:PutTraceSegments (distributed tracing)                 │
│  │  │  └─ sqs:ReceiveMessage, sqs:DeleteMessage (async jobs)         │
│  │  └─ Conditions: Restrict to app VPC (if needed)                     │
│  │                                                                    │
│  ├─ ECSTaskRole (if using ECS for frontend)                           │
│  │  ├─ Permissions: Minimal (read S3 for static assets)              │
│  │  └─ Conditions: Restrict to task definition                        │
│  │                                                                    │
│  ├─ AdminRole (operations team)                                         │
│  │  ├─ Permissions: Limited read-only on RDS, S3, CloudWatch        │
│  │  ├─ Conditions: Require MFA, restrict to known IPs (VPN)          │
│  │  └─ Audit: All actions logged to CloudTrail                        │
│  │                                                                    │
│  └─ AuditRole (compliance team)                                        │
│     ├─ Permissions: Read-only on audit logs, evidence, metrics       │
│     └─ Conditions: Restrict to CloudWatch, S3 read                     │
│                                                                          │
│  AWS WAF (Web Application Firewall)                                     │
│  ├─ Rules:                                                              │
│  │  ├─ SQL Injection (AWS Managed Rule Group)                         │
│  │  ├─ XSS Protection (AWS Managed Rule Group)                        │
│  │  ├─ Rate Limiting: 2000 requests/5 minutes per IP                 │
│  │  ├─ Geo-blocking: Only allow Australia (if needed)                │
│  │  └─ Custom: Block suspicious patterns (empty User-Agent, etc.)    │
│  │                                                                    │
│  └─ Logging: WAF logs → CloudWatch Logs + S3                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  MONITORING, LOGGING & COMPLIANCE                                       │
│                                                                          │
│  AWS CloudTrail (System Audit)                                           │
│  ├─ Enabled: Yes, all AWS API calls                                     │
│  ├─ Storage: S3 bucket (growkyc-cloudtrail-logs-prod-sydney)            │
│  │  ├─ Encryption: KMS                                                 │
│  │  ├─ Object Lock: Enabled (immutable, 7-year retention)              │
│  │  └─ Logging: S3 access logs for who accessed CloudTrail logs       │
│  │                                                                    │
│  ├─ Events Logged:                                                      │
│  │  ├─ Management Events: All IAM, RDS, S3, KMS, Cognito changes     │
│  │  ├─ Data Events: S3 GetObject/PutObject (evidence buckets)         │
│  │  └─ Insights: Unusual API activity (unauthorized access attempts) │
│  │                                                                    │
│  └─ Retention: Indefinite (S3 Object Lock)                             │
│                                                                          │
│  AWS CloudWatch (Application Metrics & Logs)                            │
│  ├─ Log Groups:                                                         │
│  │  ├─ /aws/lambda/kyc-verify: Identity verification function         │
│  │  ├─ /aws/lambda/aml-check: AML screening                           │
│  │  ├─ /aws/lambda/audit-log: Immutable audit logger                  │
│  │  ├─ /aws/rds/cluster/growkyc-prod: PostgreSQL logs                │
│  │  └─ [Custom] /growkyc/application: Application logs                │
│  │                                                                    │
│  ├─ Log Retention: 90 days (live), archive to Glacier after           │
│  ├─ Log Insights Queries (compliance dashboards):                     │
│  │  ├─ SELECT * WHERE eventName like 'auth.*' (auth attempts)       │
│  │  ├─ SELECT * WHERE sourceIPAddress NOT IN (allowlist)  (abuse)   │
│  │  ├─ SELECT * WHERE errorCode (all errors)                         │
│  │  ├─ Privilege escalation: SELECT * WHERE action like 'Assumer*'   │
│  │  └─ Unauthorized access: SELECT * WHERE errorCode = 'AccessDenied'│
│  │                                                                    │
│  ├─ CloudWatch Metrics:                                                 │
│  │  ├─ Lambda: Duration, Errors, Throttles, ConcurrentExecutions    │
│  │  ├─ RDS: CPU, DatabaseConnections, ReadLatency, WriteLatency      │
│  │  ├─ S3: PUT/GET requests, data transfer (cost tracking)           │
│  │  ├─ API Gateway: Latency, 4xx/5xx errors, rate limiting hits     │
│  │  └─ Custom: Compliance events per org, evidence stored, retention │
│  │                                                                    │
│  ├─ Dashboards:                                                         │
│  │  ├─ Security: Auth failures, privilege escalations, data access   │
│  │  ├─ Compliance: Audit trail completeness, evidence retention      │
│  │  ├─ Performance: API latency, database query performance          │
│  │  └─ Cost: Monthly spend by service, forecast                      │
│  │                                                                    │
│  └─ Alarms:                                                             │
│     ├─ Critical: Lambda error rate > 1%, RDS CPU > 80%, API 5xx > 10 │
│     ├─ High: Lambda duration > threshold, RDS connections > 150      │
│     ├─ Medium: S3 access anomalies, Cognito failed auth > 100        │
│     └─ Action: SNS → Slack + PagerDuty for on-call                    │
│                                                                          │
│  AWS Security Hub (Centralized Findings)                                │
│  ├─ Enabled: Yes, all AWS accounts                                     │
│  ├─ Standards:                                                          │
│  │  ├─ AWS Foundational Security Best Practices                       │
│  │  ├─ CIS AWS Foundations Benchmark                                  │
│  │  └─ PCI DSS v3.2.1 (if needed for payment processing)             │
│  │                                                                    │
│  ├─ Custom Insights:                                                    │
│  │  ├─ Misconfigurations in compliance-critical resources             │
│  │  ├─ Unencrypted data stores                                        │
│  │  ├─ Overly-permissive access policies                              │
│  │  └─ Missing MFA on privileged accounts                             │
│  │                                                                    │
│  └─ Integration: Splunk, Slack, auto-remediation (Lambda)             │
│                                                                          │
│  Amazon GuardDuty (Threat Detection)                                    │
│  ├─ Enabled: Yes, all regions relevant                                 │
│  ├─ Detects:                                                            │
│  │  ├─ Unusual API calls (data exfiltration patterns)                 │
│  │  ├─ Compromised instance behavior (EC2, containers)                │
│  │  ├─ Malicious input detection (SQL injection, XSS)                 │
│  │  └─ Cryptocurrency mining or unauthorized resource usage           │
│  │                                                                    │
│  └─ Findings → S3 Export + SNS → Slack/SIEM                           │
│                                                                          │
│  AWS X-Ray (Distributed Tracing)                                        │
│  ├─ Enabled for: Lambda → RDS, Lambda → S3, API Gateway → Lambda     │
│  ├─ Insights: Slowness detection, error propagation, latency by tier  │
│  └─ Compliance: Full request trace (audit trail for sensitive ops)    │
│                                                                          │
│  Application Audit Logging (Database Level)                             │
│  ├─ PostgreSQL pgaudit: All DDL, parameter logging                     │
│  ├─ Immutable audit_events_immutable table with:                       │
│  │  ├─ Organization isolation (RLS)                                    │
│  │  ├─ Hash chain (cryptographic proof of integrity)                  │
│  │  ├─ Digital signatures (AWS Signer)                                │
│  │  └─ Daily export to S3 Object Lock (immutable archive)             │
│  │                                                                    │
│  └─ Evidence metadata: origination, retention_until, classification    │
│                                                                          │
│  Incident Detection & Response                                          │
│  ├─ Monthly Security Hub review (automated + manual)                   │
│  ├─ Quarterly Penetration Testing (AWS-approved testers)              │
│  └─ Runbook: incident-response.md (detection → containment → recovery)│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  DISASTER RECOVERY & BUSINESS CONTINUITY (ISO 22301)                   │
│                                                                          │
│  RTO/RPO Targets                                                         │
│  ├─ RTO (Recovery Time Objective): 4 hours                             │
│  ├─ RPO (Recovery Point Objective): 15 minutes (hourly snapshots)      │
│  └─ Justification: Compliance platform, must be available, but 4h      │
│                    acceptable for most use cases                        │
│                                                                          │
│  Single-Region (Sydney) Strategy                                         │
│  ├─ Multi-AZ Deployment: 3 AZs (a, b, c) within Sydney                │
│  ├─ RDS Automatic Failover: < 30 seconds (Aurora)                     │
│  ├─ Lambda Auto-Scaling: Rapid startup (cold starts < 1s)             │
│  ├─ S3 Cross-Region Replication: Optional (ap-southeast-1 backup)     │
│  │  └─ Enables: Restore from backup if primary region fails          │
│  │                                                                    │
│  └─ Benefits: Simple, low latency, cost-effective                     │
│                                                                          │
│  Cross-Region Backup (Optional, if DR essential)                        │
│  ├─ RDS: Automated snapshots → S3 XCopy → ap-southeast-1              │
│  ├─ DynamoDB: Global Tables (if using DynamoDB)                       │
│  ├─ S3: Cross-region replication (objects replicated automatically)   │
│  └─ Secrets: Multi-region secret replicas                              │
│                                                                          │
│  Tested Procedures                                                       │
│  ├─ Quarterly DR drill: Failover to backup, verify data integrity    │
│  ├─ Runbook: failover.md (steps, timing, verification)                │
│  └─ Documentation: RTO/RPO proof, team training                        │
│                                                                          │
│  Data Backup & Snapshots                                                │
│  ├─ RDS:                                                                │
│  │  ├─ Automated daily snapshot (35-day window, AUSTRAC requirement)   │
│  │  ├─ PITR enabled (7 day window, restore to any point)              │
│  │  ├─ Cross-region replica (snapshot copy to ap-southeast-1)         │
│  │  └─ Test restores monthly (validation)                             │
│  │                                                                    │
│  ├─ S3:                                                                 │
│  │  ├─ Versioning enabled (all evidence versions kept)                │
│  │  ├─ Object Lock (immutable, prevents deletion)                      │
│  │  ├─ Lifecycle: Move to Glacier (1 year), delete (7+ years)         │
│  │  └─ Cross-region backup (optional, additional cost)                │
│  │                                                                    │
│  └─ Secrets:                                                            │
│     ├─ Automatic multi-region replication                              │
│     └─ Version history (rollback if needed)                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  COMPLIANCE & EVIDENCE GENERATION                                        │
│                                                                          │
│  ISO 27001 (Information Security)                                        │
│  ├─ 13.2 Information transfer policies (encrypted in transit, TLS 1.2+)│
│  ├─ 13.2.3 Segregation (VPC network isolation, security groups)       │
│  ├─ 14.2 System acceptability testing (UAT before prod deployment)    │
│  ├─ Evidence: CloudTrail logs, VPC Flow Logs, network config          │
│  └─ Audit Readiness: Monthly compliance dashboard                      │
│                                                                          │
│  ISO 27701 (Privacy)                                                     │
│  ├─ Consent Management: consent_records table (per person, per use)   │
│  ├─ Data Subject Rights: Export/Delete API endpoints (Lambda)          │
│  ├─ Privacy by Design: Data minimization, retention policies          │
│  └─ Evidence: Deletion logs, subject export audit trail                │
│                                                                          │
│  ISO 22301 (Business Continuity)                                        │
│  ├─ RTO/RPO targets: 4 hours / 15 minutes (documented, tested)        │
│  ├─ Multi-AZ deployment: Automatic failover                            │
│  ├─ Backup validation: Quarterly restore drills                        │
│  └─ Runbooks: Documented procedures, team training                     │
│                                                                          │
│  AUSTRAC AML/CTF                                                         │
│  ├─ Data Residency: All production data in Sydney (ap-southeast-2)    │
│  ├─ Record Retention: 7-year minimum (S3 Object Lock, lifecycle rules) │
│  ├─ Suspicious Matter Reports: Audit trail (SMR filing timestamp, etc.)│
│  ├─ Transaction Monitoring: Suspicious pattern logging (high volume)   │
│  ├─ KYC Evidence: Documents retained in S3 with immutability           │
│  └─ Audit Readiness: Monthly AUSTRAC compliance checklist              │
│                                                                          │
│  PCI DSS (if processing payments)                                        │
│  ├─ Not stored internally (payment gateway only)                       │
│  ├─ TLS 1.2+ for all data in transit                                   │
│  ├─ No sensitive auth data in code or logs                             │
│  └─ Annual penetration testing                                          │
│                                                                          │
│  Audit Evidence Collection                                               │
│  ├─ CloudTrail logs (AWS API audit)                                    │
│  ├─ VPC Flow Logs (network traffic)                                    │
│  ├─ RDS audit logs (pgaudit output)                                    │
│  ├─ Application audit table (audit_events_immutable)                   │
│  ├─ CloudWatch logs (application events)                               │
│  ├─ Security Hub findings (misconfigurations)                          │
│  ├─ GuardDuty findings (threats)                                       │
│  ├─ WAF logs (web attacks blocked)                                     │
│  └─ Certificate inventory (TLS cert expiration tracking)                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Infrastructure-as-Code: AWS CDK Structure

```
infrastructure/cdk/
├── bin/
│   ├── app.ts (Main entry, creates stacks)
│   └── config.ts (Sydney region, AZs, tags, retention)
│
├── lib/
│   ├── stacks/
│   │   ├── NetworkStack.ts (VPC, subnets, security groups, VPC endpoints)
│   │   ├── DatabaseStack.ts (Aurora PostgreSQL, Enhanced Monitoring)
│   │   ├── StorageStack.ts (S3 buckets, Object Lock, lifecycle)
│   │   ├── KmsStack.ts (Customer-managed keys, key policies)
│   │   ├── SecretsStack.ts (Secrets Manager, rotation Lambda)
│   │   ├── AuthStack.ts (Cognito User Pool + IAM Identity Center)
│   │   ├── ComputeStack.ts (Lambda, IAM roles, API Gateway)
│   │   ├── MonitoringStack.ts (CloudWatch, Security Hub, GuardDuty)
│   │   ├── TrailStack.ts (CloudTrail, S3 Object Lock for logs)
│   │   └── FrontendStack.ts (CloudFront, ECS/Fargate or S3 static)
│   │
│   ├── constructs/
│   │   ├── VpcConstruct.ts (Reusable VPC setup)
│   │   ├── LambdaFunction.ts (Wrapper for compliance Lambda)
│   │   ├── RdsCluster.ts (Aurora with monitoring)
│   │   └── S3WithObjectLock.ts (S3 bucket with audit config)
│   │
│   └── utils/
│       ├── tags.ts (Common resource tags)
│       └── naming.ts (Consistent resource naming)
│
└── tests/
    ├── network.test.ts
    ├── database.test.ts
    └── security.test.ts
```

---

## Part 4: Security Control Gaps & Mitigations

### Critical Security Gaps

| # | Gap | Risk | Mitigation | Effort | Timeline |
|---|-----|------|-----------|--------|----------|
| 1 | **Data Residency** | CRITICAL: Data may be stored outside Sydney | Migrate to RDS Aurora (already in CDK) | Low (2 weeks) | Phase 1 |
| 2 | **Immutable Audit Trail** | CRITICAL: Audit logs can be modified/deleted | Implement immutable event store + S3 Object Lock | Medium (6 weeks) | Phase 1 |
| 3 | **Tenant Isolation** | CRITICAL: No RLS enforcement | Enable PostgreSQL RLS + validation tests | Medium (4 weeks) | Phase 1 |
| 4 | **Provider Integrations Mock** | CRITICAL: Not using real compliance providers | Onboard real IDV, sanctions APIs | High (8 weeks) | Phase 2 |
| 5 | **Supabase Dependency** | HIGH: Vendor lock-in, external to AWS | Migrate to Cognito + RDS native | High (8 weeks) | Phase 1 |
| 6 | **MFA Not Enforced** | HIGH: Optional MFA for privileged users | Mandate MFA for admin/approver/auditor | Medium (3 weeks) | Phase 1 |
| 7 | **No Session Audit** | HIGH: No login/logout tracking | Implement session_events table | Medium (3 weeks) | Phase 1 |
| 8 | **Secrets Rotation** | HIGH: Manual, not automated | Implement Secrets Manager rotation | Medium (3 weeks) | Phase 1 |
| 9 | **No API Gateway** | HIGH: No rate limiting, request audit | Add API Gateway + WAF | Medium (4 weeks) | Phase 1 |
| 10 | **Evidence Management** | MEDIUM: No S3 Object Lock, lifecycle | Configure S3 with retention policies | Medium (3 weeks) | Phase 1 |
| 11 | **No Legal Hold Support** | MEDIUM: Cannot preserve evidence for litigation | Implement legal_holds table + S3 blocking | Medium (3 weeks) | Phase 2 |
| 12 | **Security Hub/GuardDuty** | MEDIUM: No automated threat detection | Enable Security Hub + GuardDuty | Low (2 weeks) | Phase 1 |
| 13 | **Penetration Testing** | MEDIUM: No security testing framework | Schedule quarterly pen tests + code scanning | Medium (3 weeks) | Phase 2 |

---

## Part 5: Migration Path & Phased Implementation Plan

### Phased Approach (12-16 weeks total)

#### **PHASE 1: Foundation & Compliance Core (Weeks 1-8)**
*Goal: De-risk critical compliance gaps, establish secure baseline*

**Week 1-2: Infrastructure Hardening**
- [ ] Deploy VPC, Security Groups, VPC Endpoints (NetworkStack)
- [ ] Deploy Aurora PostgreSQL with RDS encryption (DatabaseStack)
- [ ] Deploy KMS customer-managed key (KmsStack)
- [ ] Enable RDS audit logging (pgaudit)
- [ ] Cost: ~$2,000/month (Aurora+RDS, prod config)

**Week 2-3: Authentication & Identity**
- [ ] Set up AWS Cognito User Pool (cognito-setup)
- [ ] Migrate users from Supabase → Cognito (one-way, no rollback)
- [ ] Implement MFA enforcement for privileged roles
- [ ] Configure session management (session_events table)
- [ ] Update frontend auth logic (supabase auth → Cognito SDK)

**Week 3-4: Data Migration & Isolation**
- [ ] Migrate Supabase PostgreSQL → AWS RDS (parallel run)
- [ ] Enable PostgreSQL RLS on all tables (strict tenant isolation)
- [ ] Create immutable audit_events_immutable table (hash chain)
- [ ] Validation tests: Cross-org queries should fail
- [ ] Parallel run: Both DBs live for 1 week, then cutover

**Week 4-5: Secrets & Key Management**
- [ ] Set up AWS Secrets Manager (database credentials, API keys)
- [ ] Implement automated secret rotation Lambda
- [ ] Migrate env vars → Secrets Manager (no secrets in code)
- [ ] Update Lambda execution role policies

**Week 5-6: API Layer & Compliance Logging**
- [ ] Create API Gateway endpoints (/api/kyc/*, /api/aml/*, etc.)
- [ ] Wrap BotOrchestrator, evidence services in Lambda
- [ ] Enable CloudTrail for all AWS API audit
- [ ] Export CloudTrail logs to S3 Object Lock
- [ ] Implement request/response logging with PII masking

**Week 6-7: Evidence Management & S3**
- [ ] Create S3 buckets with Object Lock enabled (GOVERNANCE mode)
- [ ] Set lifecycle rules: 1 year STANDARD → GLACIER, 7+ year DELETE
- [ ] Migrate evidence from Supabase Storage → S3
- [ ] Implement evidence metadata tracking (origination, retention_until)
- [ ] Enable versioning + MFA delete protection

**Week 7-8: Monitoring, Security Hub, GuardDuty**
- [ ] Enable AWS Security Hub (all standards)
- [ ] Enable Amazon GuardDuty (threat detection)
- [ ] Create CloudWatch dashboards (compliance, security, performance)
- [ ] Set up SNS → Slack/PagerDuty alerting
- [ ] Test alerts (trigger-test events, validate delivery)

**Phase 1 Deliverables:**
- ✅ All production data in Sydney (RDS Aurora)
- ✅ Immutable audit trail (audit_events_immutable + CloudTrail)
- ✅ Tenant isolation enforced (RLS)
- ✅ Secrets rotation automated
- ✅ No Supabase dependency (auth + database)
- ✅ API Gateway in place (rate limiting, WAF-ready)
- ✅ Security monitoring enabled (GuardDuty, Security Hub)

**Phase 1 Cost:** ~$8,000/month (Aurora, S3, KMS, monitoring)

---

#### **PHASE 2: Compliance Integrations & Real Providers (Weeks 8-12)**
*Goal: Integrate real compliance screening providers, legal hold support*

**Week 8-9: Provider Integration Framework**
- [ ] Design provider-agnostic abstraction (abstract interface)
- [ ] Create ProviderRegistry + health checks
- [ ] Implement provider audit logging (call count, latency, cost)
- [ ] Set up provider secret storage (API keys in Secrets Manager)

**Week 9-10: IDV Provider Integration**
- [ ] Onboard GreenID (Australian IDV primary)
- [ ] Implement document upload + verification flow
- [ ] Fallback provider: Stripe Identity (if GreenID unavailable)
- [ ] Audit: Log all IDV calls + results
- [ ] Testing: Validate with test accounts

**Week 10-11: Sanctions & PEP Screening**
- [ ] Onboard WorldCompliance API (primary)
- [ ] Fallback: OFAC SDN + consolidated lists
- [ ] PEP screening integration
- [ ] Adverse media: Refinitiv or LexisNexis (quote cycle)
- [ ] Testing: Verify screening hits are captured

**Week 11-12: Legal Hold & Compliance Enhancements**
- [ ] Implement legal_holds table (litigation support)
- [ ] Modify S3 lifecycle to respect legal holds
- [ ] Communicate hold events to users (legal notification)
- [ ] Create legal hold dashboard (compliance team view)
- [ ] Testing: Verify held evidence cannot be deleted

**Phase 2 Deliverables:**
- ✅ Real IDV provider (GreenID)
- ✅ Real sanctions screening (WorldCompliance)
- ✅ PEP & adverse media screening
- ✅ Provider health monitoring + failover
- ✅ Legal hold support
- ✅ AUSTRAC compliance evidence (providers integrated)

**Phase 2 Cost:** ~$10,000/month (Aurora, providers, S3, monitoring)

---

#### **PHASE 3: Security Hardening & Audit Readiness (Weeks 12-16)**
*Goal: Penetration testing, documentation, audit readiness*

**Week 12-13: Security Scanning & Hardening**
- [ ] Enable CodePipeline with SAST (SonarQube or CodeGuru)
- [ ] Enable DAST (API endpoint security testing)
- [ ] Dependency scanning: npm audit + Snyk integration
- [ ] Security headers: CSP, X-Frame-Options, HSTS
- [ ] WAF rules: SQL injection, XSS, rate limiting (AWS managed)

**Week 13-14: External Penetration Testing**
- [ ] Engage AWS-approved penetration testing firm
- [ ] Define scope: API, frontend, infrastructure, data access
- [ ] Execute pen test (1-2 weeks)
- [ ] Remediate findings (severity-based timeline)
- [ ] Generate audit-ready report

**Week 14-15: Compliance Documentation & Runbooks**
- [ ] Write runbook: failover procedures (RTO/RPO validation)
- [ ] Document incident response procedures
- [ ] Create audit checklists (ISO 27001, AUSTRAC, ISO 22301)
- [ ] Evidence collection procedures (CloudTrail, logs, metrics)
- [ ] Team training (security, on-call, incident response)

**Week 15-16: Audit Readiness & Monthly Drills**
- [ ] Schedule quarterly DR drill (test RTO/RPO)
- [ ] Schedule monthly security hub review
- [ ] Document compliance evidence (collect baseline)
- [ ] Create audit dashboard (real-time compliance metrics)
- [ ] Prepare for external audit (ASIC, AUSTRAC, SOC 2)

**Phase 3 Deliverables:**
- ✅ Penetration test complete (external firm)
- ✅ Security vulnerabilities remediated
- ✅ Audit documentation ready
- ✅ Compliance dashboards live
- ✅ Team trained on procedures
- ✅ Monthly metrics for ISO/AUSTRAC compliance

**Phase 3 Cost:** ~$12,000/month (includes pen testing, external audit prep)

---

### Migration Timeline Gantt Chart

```
PHASE 1: Foundation & Compliance (Weeks 1-8)
  Infrastructure Hardening         [===================================]
  Auth Migration (Cognito)                     [======================]
  Data Migration (RDS)                           [=====================]
  Secrets Management                              [==================]
  API Gateway & Logging                                  [==========]
  Evidence (S3 + Object Lock)                             [========]
  Monitoring (Security Hub)                                 [====]

PHASE 2: Integrations (Weeks 8-12)
  Provider Framework                [==========]
  IDV Integration (GreenID)               [========================]
  Sanctions/PEP (WorldCompliance)            [=====================]
  Legal Hold Support                              [============]

PHASE 3: Security & Audit (Weeks 12-16)
  Security Scanning                        [=====]
  Penetration Testing                      [============]
  Documentation & Runbooks                     [===========]
  Audit Readiness (drills, training)               [========]

TOTAL TIMELINE: 16 weeks (4 months) for production-ready, audit-ready platform
```

---

## Implementation Checklist

### Pre-Implementation (Week 0)

- [ ] Get AWS account approval & budget authorization
- [ ] Form implementation team (AWS architect, security lead, compliance officer, product)
- [ ] Procurement process for compliance providers (IDV, sanctions, PEP, adverse media)
- [ ] Create detailed project plan with dependencies
- [ ] Schedule weekly sync (all stakeholders)
- [ ] Prepare dev/staging/prod account structure (separate, with same security model)

### During Implementation

- [ ] Weekly progress review (blockers, risks, timelines)
- [ ] Continuous integration: deploy to Dev after each feature
- [ ] Continuous testing: automated tests for isolation, audit compliance
- [ ] Change control: all changes to staging/prod require approval
- [ ] Parallel run: old system (Supabase) + new system (AWS) side-by-side during migration

### Post-Implementation

- [ ] Cutover validation: confirm all functionality works on new platform
- [ ] Performance baseline: capture metrics for future comparison
- [ ] Load testing: verify system can handle peak load
- [ ] Security assessment: final pen test, address findings
- [ ] Compliance audit: prepare for external ISO/AUSTRAC audit
- [ ] Training: team on new infrastructure, runbooks, incident response
- [ ] Documentation: maintain runbooks, architecture decision records (ADRs)

---

## Cost Projection (Monthly, Prod Config)

| Component | Dev | Staging | Prod | Notes |
|-----------|-----|---------|------|-------|
| **RDS Aurora** | $100 | $300 | $1,200 | Serverless v2, auto-scaling |
| **S3 (Evidence)** | $50 | $150 | $500 | ~20GB/month, lifecycle to Glacier |
| **S3 (Audit Logs)** | $20 | $50 | $200 | CloudTrail + app audit exports |
| **KMS** | $10 | $10 | $10 | CMK + usage |
| **Secrets Manager** | $10 | $10 | $10 | Secrets rotation |
| **Lambda** | $50 | $100 | $300 | API handlers, integrations |
| **API Gateway** | $15 | $25 | $100 | Requests + data transfer |
| **CloudWatch** | $20 | $30 | $100 | Logs, metrics, storage |
| **Security Hub** | $0 | $0 | $100 | Standards compliance |
| **GuardDuty** | $0 | $0 | $100 | Threat detection |
| **VPC (Endpoints)** | $20 | $30 | $50 | Interface endpoints |
| **Compliance Providers** | $0 | $500 | $2,000 | IDV, sanctions, PEP, adverse media |
| **Data Transfer (out)** | $5 | $20 | $100 | Cross-AZ, cross-region (if used) |
| **CloudFront (optional)** | $0 | $0 | $200 | If geo-distribution needed |
| **Other (monitoring, support)** | $50 | $100 | $200 | Support, misc services |
| | | | | |
| **TOTAL** | **$345** | **$1,325** | **$5,070** | Per month, scales with usage |

**Annual Prod Cost: ~$60,000/year** (before volume discounts, RI pricing)

---

## Success Criteria

### Compliance & Audit
- ✅ Zero data residency violations (all data in Sydney)
- ✅ Immutable audit trail with cryptographic proof
- ✅ All compliance providers integrated (IDV, sanctions, PEP)
- ✅ 7-year evidence retention enforced (S3 Object Lock)
- ✅ AUSTRAC audit-ready (evidence collection, reporting)
- ✅ ISO 27001 findings resolved (access controls, encryption, MFA)

### Security
- ✅ MFA enforced for admin/approver roles
- ✅ No secrets in code or logs
- ✅ Tenant isolation enforced (RLS, bucket policies)
- ✅ Penetration test findings remediated
- ✅ Security scanning enabled (SAST, DAST, dependency audit)

### Performance & Availability
- ✅ API latency < 200ms (p95) for normal operations
- ✅ Database query < 100ms (p95) for typical workload
- ✅ RTO < 4 hours, RPO < 15 minutes (tested quarterly)
- ✅ 99.9% uptime (multi-AZ, automatic failover)

### Operations & Support
- ✅ Runbooks documented (failover, disaster recovery, incident response)
- ✅ Team trained on new infrastructure
- ✅ Monitoring dashboards live (compliance, security, performance)
- ✅ Alerts configured (critical, high, medium severity)

---

## Conclusion

GrowKYC has strong architectural foundations and clear compliance intent. The migration to AWS Sydney represents a critical step toward production-ready, audit-ready, bank-grade compliance infrastructure.

**Key outcomes after 16-week implementation:**
- Bank-grade security posture (ISO 27001, AUSTRAC audit-ready)
- Multi-AZ resilience in Sydney region only
- Real compliance provider integrations
- Immutable, tamper-evident audit trails
- Full RBAC with audit traceability
- 7-year evidence retention capabilities

**Risk mitigation:**
- Phased approach allows incremental value delivery
- Parallel run during migration de-risks cutover
- Regular compliance checks throughout (weekly validation)
- External pen testing before go-live

**Next steps:** Review and approve Phase 1 scope, form implementation team, and begin AWS account setup.

