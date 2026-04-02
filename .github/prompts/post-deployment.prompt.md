---
description: "Use when: monitoring production after deployment, validating release success, handling post-deployment issues, analyzing deployment metrics"
argument-hint: "Example: /post-deployment for v2.5.0"
---

# Post-Deployment Validation & Monitoring

I'll guide you through post-deployment validation and monitoring to confirm your release is successful.

## Deployment Complete ✅

**Released version**: (e.g., v2.5.0)
**Deployment timestamp**: (time deployed)
**Environments deployed**: dev / staging / production

---

## Phase 1: Immediate Health Check (0-15 min)

### Quick validation that system is up

**Check these immediately:**

- [ ] Frontend loads without errors
- [ ] API endpoints responding (status 200)
- [ ] Database connections healthy
- [ ] Authentication working
- [ ] Critical user workflows functioning
- [ ] No spike in error rates

**If issues**: Stop here and escalate to **Infrastructure & Deployment Agent** for emergency rollback assessment.

---

## Phase 2: Monitoring Dashboard Review (15-60 min)

### Ask me to invoke: **Monitoring & Observability Agent**

```
Validate monitoring dashboards during first hour post-deployment:
- Error rate compared to baseline (expect slight increase, should stabilize)
- Response times normal vs pre-deployment
- Database query performance acceptable
- Resource utilization (CPU, memory) within expected ranges
- No alert storms or cascading failures
- Log volume normal
```

**Alert if:**
- 🔴 Error rate > 2x baseline = investigate immediately
- 🟡 Error rate > 1.5x baseline = monitor closely
- 🟡 Response time > baseline + 10% = check for bottlenecks
- 🔴 Critical services down = initiate rollback

**Expected behaviors:**
- ✅ Slight error spike immediately post-deploy (cache warming, etc.)
- ✅ Gradual error rate stabilization
- ✅ Normal traffic patterns resuming
- ✅ Database indexes building (if new schema)

---

## Phase 3: Functional Validation (1-4 hours)

### Test critical user workflows

**Ask me to invoke: Testing & Quality Agent** (if automated tests exist)

```
Validate critical KYC workflows are functioning:
- User registration and KYC flow
- Document upload and verification
- Real-time data updates working
- Payment processing (if applicable)
- Admin dashboard accessible
- Reports generating correctly
- Scheduled jobs executing
```

**Manual testing checklist:**
- [ ] Create test KYC user → verify flow completes
- [ ] Upload test document → verify processing
- [ ] Check admin dashboard → no missing data
- [ ] Verify notifications sending
- [ ] Test error handling → appropriate messages

---

## Phase 4: Performance Analysis (4-24 hours)

### Ask me to invoke: **Performance Testing Agent**

```
Compare post-deployment performance vs baseline:
- Response time distribution (p50, p95, p99)
- Throughput (requests/sec)
- Database query performance
- Frontend load time (Lighthouse)
- API latency across endpoints
- Cache effectiveness
```

**Performance regression check:**
- ✅ Accept if < 5% degradation
- 🟡 Investigate if 5-10% degradation
- 🔴 Escalate if > 10% degradation

---

## Phase 5: Data Integrity Validation (1-24 hours)

### Ask me to invoke: **Database Migration Agent**

```
If database migrations were deployed:
- Row counts compare to pre-migration baseline
- No orphaned records or corrupted data
- Indexes created successfully
- Foreign key constraints intact
- Data validation queries passed
- Backup verified and accessible
```

**Run data validation queries:**
- Count records in affected tables
- Check for NULL values in critical fields
- Verify referential integrity
- Test derived data correctness (sums, aggregates)

---

## Phase 6: Compliance & Safety Verification

### Ask me to invoke: **Compliance & Regulatory Agent** (if compliance changes deployed)

```
Validate regulatory and security requirements:
- KYC/AML processes still functioning
- Audit trails recording correctly
- Data retention policies enforced
- Privacy controls intact
- Regulatory reporting ready
```

---

## Phase 7: Security Post-Deployment

### Ask me to invoke: **Security & Vulnerability Agent**

```
Run security validation after deployment:
- No new secrets exposed in logs
- Authentication still working correctly
- Authorization rules enforced
- Security headers present
- CORS policies correct
- No suspicious network activity
```

---

## Phase 8: Dependency & Configuration Check

### Ask me to invoke: **Dependency Management Agent** (if dependencies updated)

```
Validate dependency updates deployed correctly:
- New package versions loaded
- No module resolution errors
- Version conflicts resolved
- Version-specific behaviors working
- Rollback to previous versions possible
```

---

## 24-Hour Sign-Off Checklist

After 24 hours of monitoring, confirm:

- [ ] **Phase 1**: System healthy and responding
- [ ] **Phase 2**: Monitoring dashboards normal
- [ ] **Phase 3**: Critical workflows functioning
- [ ] **Phase 4**: Performance acceptable (< 5% degradation)
- [ ] **Phase 5**: Data integrity verified
- [ ] **Phase 6**: Compliance requirements met
- [ ] **Phase 7**: Security validation passed
- [ ] **Phase 8**: Dependencies functioning correctly
- [ ] **User Feedback**: No critical issues reported
- [ ] **Error Logs**: No unexpected errors
- [ ] **On-Call**: No escalations required

---

## If Issues Detected 🚨

### Severity: CRITICAL 🔴
- System down or core workflows broken
- Data corruption detected
- Security vulnerability exploited
- **Action**: Engage **Infrastructure & Deployment Agent** for **EMERGENCY ROLLBACK**

### Severity: HIGH 🟡
- Significant performance degradation (> 20%)
- Many errors in logs
- Compliance requirements not met
- **Action**: Investigate with relevant agent, may need rollback

### Severity: MEDIUM 🟠
- Minor performance impact (5-10%)
- Specific feature broken (non-critical)
- Some users affected
- **Action**: Investigate, plan fix for next release

### Severity: LOW 🔵
- Small issues, workarounds exist
- Cosmetic or minor UX problems
- Single user affected
- **Action**: Log for future sprint, no rollback needed

---

## Rollback Procedure

**If rollback necessary:**

1. **Infrastructure Agent**: Coordinate rollback to previous version
2. **Database Migration Agent**: Reverse database migrations if needed
3. **Infrastructure Agent**: Monitor rollback execution
4. **Monitoring Agent**: Verify metrics return to baseline
5. **Post-Deployment Agent**: Re-validate system health
6. **Documentation**: Document what triggered rollback
7. **Post-Incident**: Schedule engineering review

**Typical rollback time**: 5-30 min depending on complexity

---

## Success Criteria (24+ hours post-deploy)

✅ **Deployment successful** if:

- No critical errors for 24+ hours
- Performance within acceptable range
- All critical workflows functioning
- Data integrity verified
- Compliance requirements met
- Security validation passed
- User feedback positive or neutral
- On-call engineer confident in stability

---

## Weekly Follow-Up (Post-Deployment Week)

### Monitor these metrics for one week:

- [ ] Error rate stable (no anomalies)
- [ ] Performance consistent day-over-day
- [ ] No delayed failures (cache issues, batch job failures)
- [ ] User adoption of new features (if applicable)
- [ ] No security incidents or suspicious activity
- [ ] All scheduled jobs completing successfully
- [ ] Database performance stable

### Success Criteria:

✅ Release deemed stable and successful after 1 week with no critical issues

---

## Documentation & Knowledge Capture

After successful deployment:

1. **Update runbooks** with new procedures
2. **Document any anomalies** encountered and how resolved
3. **Capture performance baseline** for future comparisons
4. **Post-incident review** if rollback occurred
5. **Deploy success summary** to team

---

## Next Steps

- ✅ Lock down release (no hotfixes unless critical)
- ✅ Plan next sprint work
- ✅ Monitor for delayed issues (next 2 weeks)
- ✅ Update documentation/runbooks
- ✅ Schedule retrospective if issues occurred
