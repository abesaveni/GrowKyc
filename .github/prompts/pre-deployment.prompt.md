---
description: "Use when: preparing for production deployment, coordinating pre-deployment checks, validating release readiness, multi-stage deployment planning"
argument-hint: "Example: /pre-deployment for version 2.5.0"
---

# Pre-Deployment Validation Checklist

I'll guide you through comprehensive pre-deployment validation, coordinating multiple specialized agents to ensure your release is safe and ready.

## Where are we deploying?

**Environment**: dev / staging / **production** (select one)

---

## Stage 1: Code & Dependency Review ⚙️

### Check dependencies and security

Ask me to invoke: **Dependency Management Agent**

```
Review package.json for outdated packages and security vulnerabilities. Check for:
- Critical/high severity vulnerabilities
- Major version updates needed
- Breaking changes that require code updates
- Supply chain security issues
```

**Acceptance criteria:**
- ✅ No critical or high vulnerabilities unpatched
- ✅ All security patches tested in staging
- ✅ Breaking changes identified and mitigated

---

## Stage 2: Database Safety 🗄️

### Plan and validate migrations

Ask me to invoke: **Database Migration Agent**

```
Review all database migrations in this release:
- Zero-downtime migration strategy
- Rollback procedures
- Data consistency validation
- Performance impact analysis
- Backup procedures before migration
```

**Acceptance criteria:**
- ✅ Migration tested with production-like data in staging
- ✅ Rollback procedure documented and tested
- ✅ Data validation queries prepared
- ✅ Backup schedule confirmed

---

## Stage 3: Performance Validation ⚡

### Load test and benchmark

Ask me to invoke: **Performance Testing Agent**

```
Run performance tests before deployment:
- Load test with realistic user patterns
- Stress test to find breaking points
- Compare against baseline metrics
- Identify new bottlenecks
```

**Acceptance criteria:**
- ✅ Load tests pass at 2x expected peak load
- ✅ No performance regressions detected
- ✅ Response times within SLA targets
- ✅ Database query performance acceptable

---

## Stage 4: Security Hardening 🔒

### Vulnerability and compliance scan

Ask me to invoke: **Security & Vulnerability Agent**

```
Run security audit before deployment:
- Scan all dependencies for vulnerabilities
- Check for hardcoded secrets or credentials
- Validate OWASP Top 10 compliance
- Review authentication/authorization logic
- Compliance validation for KYC/AML requirements
```

**Acceptance criteria:**
- ✅ No unpatched critical/high vulnerabilities
- ✅ No secrets found in code
- ✅ OWASP compliance validated
- ✅ Regulatory requirements met (escalate to Compliance Agent if needed)

---

## Stage 5: Release Preparation 📦

### Plan release and document changes

Ask me to invoke: **Release Management Agent**

```
Prepare for release:
- Determine version number (semantic versioning)
- Generate release notes from commits
- Update CHANGELOG.md with changes
- Plan deployment sequence if multi-service
- Create release branch and tags
```

**Acceptance criteria:**
- ✅ Version number determined
- ✅ Release notes written and reviewed
- ✅ CHANGELOG.md updated
- ✅ Deployment sequence documented
- ✅ All stakeholders notified of release

---

## Stage 6: CI/CD Pipeline 🔄

### Validate workflow and build

Ask me to invoke: **CI/CD Pipeline Agent**

```
Ensure deployment pipeline is ready:
- All GitHub Actions workflows passing
- Build artifacts created successfully
- Deployment scripts tested
- Rollback procedures in pipeline
- Pipeline logs clean (no warnings/errors)
```

**Acceptance criteria:**
- ✅ All workflows passing on main branch
- ✅ Build runs in under target time
- ✅ Deployment script validated in staging
- ✅ No unexpected output or warnings

---

## Stage 7: Infrastructure Readiness 🏗️

### Confirm AWS and deployment setup

Ask me to invoke: **Infrastructure & Deployment Agent**

```
Validate infrastructure for deployment:
- Environment-specific configs ready (dev/staging/prod)
- Secrets configured correctly in AWS
- Load balancer health checks working
- Auto-scaling policies appropriate
- DNS and CDN configured
- Infrastructure monitoring active
```

**Acceptance criteria:**
- ✅ All AWS resources healthy
- ✅ Secrets accessible and rotated
- ✅ Environment-specific configs validated
- ✅ Load testing passed on target infrastructure
- ✅ Rollback infrastructure prepared

---

## Stage 8: Observability Setup 📊

### Prepare monitoring and alerting

Ask me to invoke: **Monitoring & Observability Agent**

```
Configure post-deployment monitoring:
- Dashboards deployed and visible
- Alert rules created for critical metrics
- Log queries configured for common issues
- Error tracking enabled
- SLO/SLA metrics defined
- On-call runbooks prepared
```

**Acceptance criteria:**
- ✅ Dashboards showing real-time metrics
- ✅ Alerts configured for failures/anomalies
- ✅ Logs aggregated and searchable
- ✅ Error tracking capturing exceptions
- ✅ Runbooks documented for common alerts

---

## Stage 9: Environment Configuration ✅

### Confirm all configs ready

Ask me to invoke: **Environment & Secrets Agent** (Review only)

```
Verify all environment-specific configuration:
- All required .env variables documented
- Secrets are set in target environment
- Configuration inheritance correct across dev/staging/prod
- Database connection strings verified
- API endpoint URLs correct for target environment
```

**Acceptance criteria:**
- ✅ All .env variables documented and required ones set
- ✅ No secrets committed to repo
- ✅ Configuration differs correctly per environment
- ✅ Database/API endpoints point to correct targets

---

## Pre-Deployment Sign-Off ✋

Before clicking deploy, confirm:

- [ ] **Code Review**: All changes reviewed and approved
- [ ] **Stage 1 ✅**: Dependencies reviewed, no critical vulns
- [ ] **Stage 2 ✅**: Migrations tested and reversible
- [ ] **Stage 3 ✅**: Performance tests pass
- [ ] **Stage 4 ✅**: Security audit complete
- [ ] **Stage 5 ✅**: Release documented and versioned
- [ ] **Stage 6 ✅**: CI/CD pipeline passing
- [ ] **Stage 7 ✅**: Infrastructure ready
- [ ] **Stage 8 ✅**: Monitoring active
- [ ] **Stage 9 ✅**: Configs verified
- [ ] **Communication**: Stakeholders notified
- [ ] **Rollback Plan**: Documented and tested
- [ ] **On-Call**: Engineer available during deployment

---

## Deployment Execution

Once all stages ✅, coordinate with **Infrastructure & Deployment Agent** for:

1. **Pre-deployment**: Final infrastructure checks
2. **During deployment**: Monitor critical metrics
3. **Post-deployment**: Validate functionality
4. **Monitoring**: Watch for anomalies for 24 hours
5. **Rollback**: Ready to execute if issues occur

---

## Post-Deployment (Next 24 Hours)

**Critical things to watch:**
- 🔴 Error spike vs baseline
- 🟡 Latency increase > 10%
- 🔴 Failed batch jobs or scheduled tasks
- 🟡 Database query slowdown
- 🔴 Failed external API calls

**If issues detected:**
1. Gather logs and metrics
2. Assess severity (rollback vs fix-forward)
3. Execute rollback if critical
4. Post-incident review

**Success criteria:**
- ✅ No critical errors for 24 hours
- ✅ Performance metrics normal
- ✅ All automated tests passing
- ✅ User reports positive or neutral
