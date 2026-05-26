---
name: Growkyc Agent Routing
description: "Routes tasks to specialized agents based on file types and domains"
---

# Growkyc Specialized Agents

This configuration automatically routes your work to specialized agents based on the files you're editing. You can also manually select agents from the agent picker.

## Auto-Invocation Routes

### Infrastructure & Deployment Agent
**Triggers on**: AWS CDK, deployment configs, infrastructure code
- `infrastructure/cdk/**` — CDK stacks, configuration
- `**/cdk.json`, `**/cdk.yaml`
- `AWS_MIGRATION_REPORT.md` (infrastructure sections)

**When to use manually**: 
- Planning infrastructure changes
- Debugging deployment failures
- Optimizing cloud costs
- Managing environments (dev/staging/prod)

### CI/CD Pipeline Agent
**Triggers on**: GitHub Actions workflow files
- `workflows/**/*.yml`, `workflows/**/*.yaml`
- `.github/workflows/**`

**When to use manually**:
- Debugging failed builds
- Optimizing pipeline performance
- Adding new build stages
- Monitoring pipeline health

### Release Management Agent
**Triggers on**: Release planning and version management
- `CHANGELOG.md`, `package.json` (version changes)
- Release branch names (`release/**`, `v*` tags)

**When to use manually**:
- Planning a release
- Writing release notes
- Determining version bumps
- Coordinating multi-service deployments

### Environment & Secrets Agent
**Triggers on**: Configuration and secrets setup
- `.env*` files (never in repo)
- `*.env.example` files
- Configuration file changes

**When to use manually**:
- Setting up local development environment
- Adding new environment variables
- Rotating secrets
- Documenting config requirements

### Dependency Management Agent
**Triggers on**: npm package updates
- `package.json`, `package-lock.json`
- `npm-shrinkwrap.json`

**When to use manually**:
- Updating packages
- Resolving dependency conflicts
- Analyzing security patches
- Planning major upgrades

### Database Migration Agent
**Triggers on**: Database schema changes
- `supabase/migrations/**`
- SQL script changes

**When to use manually**:
- Planning schema migrations
- Ensuring zero-downtime deployments
- Designing rollback procedures
- Validating data consistency

### Performance Testing Agent
**Triggers on**: Performance test code
- `**/*.perf.ts`, `**/*.load.js`
- `scripts/**/*test*`, `tests/**/*performance*`

**When to use manually**:
- Load testing before deployment
- Benchmarking performance regressions
- Stress testing capacity
- Planning scaling strategy

### Security & Vulnerability Agent
**Triggers on**: Security-related code and configs
- `scripts/security-test.js`
- Authentication/authorization code
- Security-sensitive components

**When to use manually**:
- Running security audits
- Scanning for vulnerabilities
- Reviewing for OWASP compliance
- Planning security hardening

### Monitoring & Observability Agent
**Triggers on**: Monitoring and logging configuration
- Monitoring/alerting code
- Error tracking setup
- Log analysis

**When to use manually**:
- Setting up post-deployment monitoring
- Creating dashboards and alerts
- Analyzing production logs
- Defining SLOs/SLAs

### Compliance & Regulatory Agent
**Triggers on**: Compliance documentation, regulatory requirements
- `*COMPLIANCE*.md` — All compliance-related docs
- `AUSTRAC_MODULE_DOCUMENTATION.md`
- `AI_COMPLIANCE*.md`
- `AML_CHECKS*.md`

**When to use manually**:
- Reviewing code for compliance gaps
- Ensuring KYC/AML procedures are followed
- Planning regulatory audits
- Validating data protection measures

### Frontend Development Agent
**Triggers on**: React components and UI code
- `src/**/*.tsx` — React components
- `src/**/*.css`, `src/styles/**` — Component styling
- `src/app/components/**`

**When to use manually**:
- Building new UI features
- Refactoring components
- Redesigning dashboard interfaces
- Improving accessibility

### Backend & Data Agent
**Triggers on**: Database and API code
- `supabase/migrations/**` — Database migrations
- `supabase/functions/**` — Supabase edge functions
- `src/services/**` — Backend services
- `src/lib/**` — API utilities

**When to use manually**:
- Designing data models
- Building APIs and endpoints
- Optimizing database queries
- Managing real-time subscriptions

### Architecture & Documentation Agent
**Triggers on**: System design and documentation
- `DEVELOPER_GUIDE*.md`
- `GROWTH_KYC*.md` (architecture sections)
- `SYSTEM_ARCHITECTURE.md`
- `INTEGRATION_ARCHITECTURE.md`
- `README*.md`

**When to use manually**:
- Planning system redesigns
- Documenting new features
- Creating architecture diagrams
- Reviewing component boundaries

### Testing & Quality Agent
**Triggers on**: Test code and validation
- `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.js`
- `scripts/security-test.js`
- `**/__tests__/**`

**When to use manually**:
- Creating test strategies
- Building test automation
- Performing security reviews
- Planning QA improvements

## Manual Agent Selection

Type `/` in chat and select an agent, or specify one of:
- **Infrastructure-Deployment** — AWS CDK, deployments
- **CI/CD-Pipeline** — GitHub Actions, build pipelines
- **Release-Management** — Versioning, release coordination
- **Environment-Secrets** — Configuration, secrets, .env
- **Dependency-Management** — npm packages, updates
- **Database-Migration** — Schema migrations, zero-downtime
- **Performance-Testing** — Load testing, benchmarks
- **Security-Vulnerability** — Security audits, vulnerability scanning
- **Monitoring-Observability** — Logging, alerting, dashboards
- **Compliance-Regulatory** — KYC/AML, compliance
- **Frontend-Development** — React, UI components
- **Backend-Data** — Supabase, APIs, database
- **Architecture-Documentation** — System design, docs
- **Testing-Quality** — Tests, QA, security

## Examples

**Scenario**: You're editing `infrastructure/cdk/lib/stacks/app.ts`
→ **Infrastructure & Deployment Agent** auto-selected

**Scenario**: You're debugging a failing GitHub Actions workflow
→ Open `workflows/deploy.yml` → **CI/CD Pipeline Agent** auto-selected

**Scenario**: You're creating a database migration for new KYC fields
→ Edit `supabase/migrations/003_*.sql` → **Database Migration Agent** auto-selected

**Scenario**: You're updating npm dependencies with security patches
→ Edit `package.json` → **Dependency Management Agent** auto-selected

**Scenario**: You're working on a React KYC form component
→ Edit `src/app/components/KycForm.tsx` → **Frontend Development Agent** auto-selected

**Scenario**: You need to plan a release with changelog, versioning, and deployment
→ Type `/` and select **Release Management Agent**

**Scenario**: You need to set up monitoring and alerts for production
→ Type `/` and select **Monitoring & Observability Agent**

**Scenario**: You need to run a security audit before deployment
→ Type `/` and select **Security & Vulnerability Agent**

---

## Key Principles

✅ **Focused expertise**: Each agent has specialized knowledge for their domain

✅ **Tool restrictions**: Agents only access tools they need to avoid mistakes

✅ **Clear handoffs**: Agents know when to escalate to other specialists

✅ **Rapid context**: Auto-selection means answers come fast without context-switching

## Deployment Workflow Prompts

Three guided workflows coordinate all agents through the deployment lifecycle:

### `/pre-deployment` — Before going live
**Coordinates**: 9 sequential stages
1. Dependency & security review
2. Database migration validation
3. Performance testing
4. Security audit
5. Release preparation
6. CI/CD pipeline check
7. Infrastructure readiness
8. Monitoring setup
9. Environment configuration

**Use when**: You're ready to test and validate before a release

**Example**: `/pre-deployment for v2.5.0`

### `/post-deployment` — After going live
**Coordinates**: 8 validation phases
1. Immediate health check
2. Monitoring dashboard review
3. Functional workflow testing
4. Performance baseline comparison
5. Data integrity validation
6. Compliance verification
7. Security validation
8. Dependency check

**Use when**: You've just deployed and need to monitor stability

**Example**: `/post-deployment for v2.5.0`

### `/incident-response` — Emergency procedures
**Coordinates**: Emergency triage and recovery
1. Immediate triage (CRITICAL/HIGH/MEDIUM/LOW)
2. Emergency rollback if needed
3. Root cause diagnosis
4. Five whys analysis
5. Communication with stakeholders
6. Resolution & recovery
7. Post-incident review
8. Prevention improvements

**Use when**: Production incident or deployment failure detected

**Example**: `/incident-response for database migration failure`

## Getting Started

1. Open any file and start editing
2. Notice which agent loads automatically based on file type
3. For questions spanning multiple domains, start with the primary domain agent
4. Use manual selection (`/`) when you need a specific agent
