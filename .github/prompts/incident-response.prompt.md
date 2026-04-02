---
description: "Use when: deployment emergency, production incident, critical failures, incident investigation, post-incident review"
argument-hint: "Example: /incident-response for v2.5.0 database migration failure"
---

# Incident Response & Emergency Procedures

For critical production issues requiring rapid response and investigation.

## Emergency Alert 🚨

**Incident**: (describe the problem)
**Severity**: CRITICAL / HIGH / MEDIUM / LOW
**Time detected**: (when issue first appeared)
**Affected systems**: (what's impacted)
**User impact**: (how many users affected)

---

## Step 1: Immediate Triage (0-5 min)

### Quick severity assessment

- [ ] Can users complete critical workflows?
- [ ] Is data at risk?
- [ ] Are other systems failing due to cascade?
- [ ] Is security compromised?

**Decision tree:**

- **YES to any above** → CRITICAL SEVERITY → Go to Emergency Stopping
- **NO to all above** → Proceed with diagnosis

---

## Emergency Stopping Procedures ⛔

### If Critical: Immediate Rollback

**Ask me to invoke: Infrastructure & Deployment Agent**

```
EMERGENCY ROLLBACK:
- Revert to last known-good version immediately
- Minimal validation - speed is priority
- Monitor metrics during rollback
- No time for gradual rollback - full revert
```

**Parallel actions during rollback:**
1. Notify all stakeholders immediately
2. Post status update to incident channel
3. Monitor error rates and latency
4. Prepare customer communication

**After rollback:**
- ✅ Confirm system healthy
- ✅ Metrics back to baseline
- ✅ Critical workflows functional
- ✅ No data loss
- ✅ Then proceed to investigation

---

## Step 2: Detailed Diagnosis

### What went wrong?

**Ask me to invoke: Relevant Agent** (depends on issue type)

#### If Database Issue 🗄️
**Database Migration Agent**:
```
Diagnose database failure:
- Check migration execution status
- Look for data integrity issues
- Review rollback safety
- Verify backup integrity
```

#### If Performance Crashed ⚡
**Performance Testing Agent**:
```
Analyze performance failure:
- Identify bottleneck (database, API, frontend?)
- Check for resource exhaustion
- Look for N+1 queries or similar
- Compare to load test baselines
```

#### If CI/CD Failed 🔄
**CI/CD Pipeline Agent**:
```
Debug deployment pipeline:
- Check workflow logs for errors
- Look for failed build steps
- Review artifact creation
- Check deployment script execution
```

#### If Security Issue 🔒
**Security & Vulnerability Agent**:
```
Investigation security incident:
- Check logs for suspicious activity
- Look for unauthorized access
- Verify secrets weren't exposed
- Check for injection attacks
- Review access logs
```

#### If Infrastructure Down 🏗️
**Infrastructure & Deployment Agent**:
```
Diagnose infrastructure failure:
- Check AWS resource health
- Look for auto-scaling issues
- Review network connectivity
- Check DNS/CDN
- Examine database connectivity
```

#### If Data Corrupted 💥
**Database Migration Agent** + **Compliance Agent**:
```
Assess data corruption:
- Identify scope (how much data affected?)
- Review backup integrity
- Determine if restoreable
- Check compliance impact
- Plan data recovery
```

---

## Step 3: Root Cause Analysis

### Five Whys Investigation

**Question 1**: Why did it fail?
**Answer**: (example: Database query timeout)

**Question 2**: Why did that happen?
**Answer**: (example: Migration added unindexed column)

**Question 3**: Why wasn't it caught?
**Answer**: (example: Load test didn't use realistic data volume)

**Question 4**: Why did testing miss this?
**Answer**: (example: Staging database 10x smaller than production)

**Question 5**: What process change prevents recurrence?
**Answer**: (example: Load tests must use production-scale data)

---

## Step 4: Communication

### Stakeholder Updates

**Immediately notify:**
- [ ] Engineering team
- [ ] Product/leadership
- [ ] Support/customer service
- [ ] On-call manager

**Status updates every 15 min** until resolved:
- "Investigating database performance issue"
- "Rollback in progress, ETA 10 min"
- "Rollback complete, validating system health"
- "System healthy, monitoring for issues"

**Customer communication** (if external-facing):
- Brief, honest explanation
- When normal service will resume
- What's being done
- Apologize for interruption

---

## Step 5: Resolution & Recovery

### Getting back to normal

**Option A: Fix Forward** (if rollback not required)
- Identify specific fix needed
- Escalate to relevant agent for quick fix
- Deploy fix with minimal testing
- Validate thoroughly post-fix
- Keep fix minimal (don't bundle other changes)

**Option B: Stay on Rollback** (if rollback was executed)
- Stabilize on previous version
- Plan how to reintroduce the change safely
- Get agreement on timeline to re-attempt
- Don't rush back to the broken version

---

## Step 6: Post-Incident Review

### Schedule within 24-48 hours

**Participants**: Engineers who worked incident, product, leadership

**Agenda:**

1. **Timeline**: What happened and when
   - 09:00 Deploy v2.5.0
   - 09:03 Error spike detected
   - 09:08 Rollback initiated
   - 09:12 System stable
   - **Total downtime: 12 minutes**

2. **Root Cause**: Why it happened
   - Migration added unindexed column
   - Query plans changed
   - Timeout on large table scan

3. **Impact Assessment**
   - X users affected
   - Y transactions failed
   - Z minutes of downtime
   - $$ revenue impact

4. **What Went Well** ✅
   - Monitoring caught issue quickly
   - Team responded fast
   - Rollback worked smoothly
   - Communication clear

5. **What Could Improve** 🔄
   - Load tests need prod-scale data
   - Need query analysis before deploying index changes
   - Alert threshold could be higher to reduce false positives
   - Runbook for this type of issue should be documented

6. **Action Items**
   - [ ] Update load test data generation
   - [ ] Add migration pre-validation step to CD pipeline
   - [ ] Document database migration checklist
   - [ ] Adjust alert thresholds
   - [ ] Owner and due date for each action item

---

## Common Incident Types & Quick Fixes

### Database Query Timeout
- **Symptom**: API latency spike, timeout errors
- **Quick check**: New migration? Missing index?
- **Fast fix**: Add index, or reduce query scope
- **Decision**: Fix forward if quick (5 min), else rollback

### OUT OF MEMORY
- **Symptom**: Process crashes, service down
- **Quick check**: New dependency? Memory leak?
- **Decision**: Almost always rollback (memory issues require investigation)

### Cascading Failures
- **Symptom**: Multiple services failing
- **Quick check**: Dependency issue? API change?
- **Decision**: Rollback immediately, investigate offline

### Data Loss/Corruption
- **Symptom**: Missing records, wrong values
- **Quick check**: Migration executed on wrong environment?
- **Decision**: Stop immediately, assess backup options, possible restore

### Security Breach
- **Symptom**: Unauthorized access, data exposure
- **Quick check**: Secret exposed? New auth vulnerability?
- **Decision**: Isolate systems, rollback, investigate offline

### Performance Degradation
- **Symptom**: Slow load times, timeouts
- **Quick check**: New query pattern? Increased traffic?
- **Decision**: If severe, rollback; else optimize

---

## Incident Metrics (Track Every Incident)

- **Time to Detection**: How fast was issue caught?
- **Time to Triage**: How fast was severity assessed?
- **Time to Mitigation**: How fast was rollback/fix deployed?
- **Total Downtime**: Minutes of service unavailability
- **Root Cause**: What actually broke?
- **Resolution**: Was it rollback or fix-forward?
- **Prevention**: What changed to prevent recurrence?

---

## Preventing Future Incidents

### Pre-Deployment Improvements
- [ ] Add more realistic load tests (production data volume)
- [ ] Test migrations on production-sized databases
- [ ] Add migration dry-run validation
- [ ] Stress test before deployments
- [ ] Security audit pre-deployment
- [ ] Compliance validation pre-deployment

### CI/CD Improvements
- [ ] Add pre-deployment safety gates
- [ ] Automated performance regression detection
- [ ] Required code review for risky changes (migrations, auth)
- [ ] Automated database backup before migrations
- [ ] Gradual rollout (canary deployments)

### Monitoring Improvements
- [ ] Tighter alert thresholds
- [ ] Anomaly detection alerts
- [ ] Synthetic monitoring of critical paths
- [ ] Error rate alerts per endpoint
- [ ] Performance regression alerts

### Team Process
- [ ] On-call rotation and handoff procedures
- [ ] Incident response runbooks
- [ ] Regular incident simulations (game days)
- [ ] Post-incident review process
- [ ] Documentation of lessons learned

---

## After-Action Items

**Convert findings into:**
1. Updated deployment checklist (pre-deployment.prompt.md)
2. New monitoring alerts
3. CI/CD pipeline improvements  
4. Test automation additions
5. Documentation updates
6. Team training sessions

---

## Resources During Incident

**Ask me to invoke:**
- **Infrastructure & Deployment** — For rollback, AWS debugging
- **Monitoring & Observability** — For analyzing metrics/logs
- **Database Migration** — For database incidents
- **Performance Testing** — For performance issues
- **Security & Vulnerability** — For security incidents
- **CI/CD Pipeline** — For deployment/build issues

**External resources:**
- AWS Console (ec2, RDS, CloudWatch)
- Supabase dashboard
- GitHub Actions logs
- Application logs (CloudWatch, ELK, etc.)
- Incident tracking tool

---

## Recovery Confidence Checklist

✅ **System is recovered** when:

- [ ] Primary service accessible and responding
- [ ] Critical workflows completing successfully
- [ ] Error rate back to normal baseline
- [ ] Performance metrics normal
- [ ] Data integrity verified
- [ ] No cascading failures
- [ ] Monitoring shows stability
- [ ] Team confidence high
- [ ] 30+ minutes of stability observed
