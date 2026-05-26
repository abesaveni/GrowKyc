# Testing Guide: Decisions Tab – Approval Workflow with SoD

## Testing Strategy Overview

This guide covers unit tests, integration tests, and end-to-end tests for the approval workflow and separation of duties enforcement.

---

## 1. UNIT TESTS

### 1.1 Workflow State Management Tests

**File:** `tests/unit/workflows/workflow-state.test.ts`

```typescript
describe('Workflow State Management', () => {
  describe('Workflow Transitions', () => {
    it('should transition from PENDING to IN_REVIEW when approved by analyst', () => {
      const workflow = createWorkflow();
      workflow.approve('analyst-1', 'initial-review');
      expect(workflow.currentStage).toBe('COMPLIANCE_CHECK');
      expect(workflow.completedStages).toContain('INITIAL_REVIEW');
    });

    it('should not allow transition if approver is not assigned', () => {
      const workflow = createWorkflow();
      expect(() => workflow.approve('unassigned-user', 'initial-review'))
        .toThrow('User not assigned as approver');
    });

    it('should handle rejection and move to REJECTED stage', () => {
      const workflow = createWorkflow();
      workflow.reject('analyst-1', 'initial-review', 'Missing documents');
      expect(workflow.currentStage).toBe('REJECTED');
      expect(workflow.rejectionReason).toBe('Missing documents');
    });

    it('should track timestamp for each stage transition', () => {
      const workflow = createWorkflow();
      const beforeTime = new Date();
      workflow.approve('analyst-1', 'initial-review');
      const afterTime = new Date();
      const transitionTime = workflow.stageHistory[0].completedAt;
      expect(transitionTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(transitionTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });

  describe('Workflow Progress Tracking', () => {
    it('should calculate progress percentage correctly', () => {
      const workflow = createWorkflow(['INITIAL_REVIEW', 'COMPLIANCE_CHECK', 'RISK_ASSESSMENT', 'FINAL_APPROVAL']);
      expect(workflow.getProgress()).toBe(0);
      
      workflow.approve('analyst-1', 'initial-review');
      expect(workflow.getProgress()).toBe(25);
      
      workflow.approve('analyst-2', 'compliance-check');
      expect(workflow.getProgress()).toBe(50);
    });

    it('should return remaining steps count', () => {
      const workflow = createWorkflow(['INITIAL_REVIEW', 'COMPLIANCE_CHECK', 'RISK_ASSESSMENT', 'FINAL_APPROVAL']);
      expect(workflow.getRemainingSteps()).toBe(4);
      
      workflow.approve('analyst-1', 'initial-review');
      expect(workflow.getRemainingSteps()).toBe(3);
    });
  });
});
```

### 1.2 Separation of Duties (SoD) Validation Tests

**File:** `tests/unit/compliance/sod-validation.test.ts`

```typescript
describe('Separation of Duties Validation', () => {
  let sodEngine: SoDEngine;
  let workflow: Workflow;

  beforeEach(() => {
    sodEngine = new SoDEngine();
    workflow = createWorkflow();
  });

  describe('Conflicting Role Detection', () => {
    it('should detect when same person has conflicting roles in workflow', () => {
      const roles = [
        { userId: 'user-1', role: 'ANALYST', stage: 'INITIAL_REVIEW' },
        { userId: 'user-1', role: 'FINAL_APPROVER', stage: 'FINAL_APPROVAL' }
      ];
      
      const conflicts = sodEngine.detectConflicts(roles);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].type).toBe('ANALYST_CANNOT_BE_FINAL_APPROVER');
    });

    it('should prevent approver assignment if SoD conflict exists', () => {
      workflow.assignApprover('user-1', 'INITIAL_REVIEW');
      
      expect(() => workflow.assignApprover('user-1', 'FINAL_APPROVAL'))
        .toThrow('SoD conflict: User cannot hold multiple decision-making roles');
    });

    it('should allow same person in consecutive review-only stages', () => {
      workflow.assignApprover('user-1', 'INITIAL_REVIEW'); // Review role
      workflow.assignApprover('user-1', 'COMPLIANCE_CHECK'); // Review role
      
      // Should not throw - both are review roles
      expect(workflow.assignedApprovers).toContain({ userId: 'user-1', stage: 'COMPLIANCE_CHECK' });
    });
  });

  describe('SoD Compliance Status', () => {
    it('should return COMPLIANT when all SoD rules satisfied', () => {
      const roles = [
        { userId: 'user-1', role: 'ANALYST', stage: 'INITIAL_REVIEW' },
        { userId: 'user-2', role: 'COMPLIANCE_OFFICER', stage: 'COMPLIANCE_CHECK' },
        { userId: 'user-3', role: 'FINAL_APPROVER', stage: 'FINAL_APPROVAL' }
      ];
      
      const status = sodEngine.validateSoD(roles);
      expect(status.status).toBe('COMPLIANT');
      expect(status.violations).toHaveLength(0);
    });

    it('should return NON_COMPLIANT with violation details', () => {
      const roles = [
        { userId: 'user-1', role: 'ANALYST', stage: 'INITIAL_REVIEW' },
        { userId: 'user-1', role: 'FINAL_APPROVER', stage: 'FINAL_APPROVAL' }
      ];
      
      const status = sodEngine.validateSoD(roles);
      expect(status.status).toBe('NON_COMPLIANT');
      expect(status.violations[0].violationType).toBe('ANALYST_CANNOT_APPROVE');
      expect(status.violations[0].details).toContain('user-1');
    });

    it('should flag AT_RISK status when potential conflict exists', () => {
      workflow.assignApprover('user-1', 'INITIAL_REVIEW');
      const potentialAssignment = { userId: 'user-1', stage: 'FINAL_APPROVAL' };
      
      const status = sodEngine.validateSoD([...workflow.assignedApprovers, potentialAssignment]);
      expect(status.status).toBe('AT_RISK');
    });
  });

  describe('SoD Rule Configuration', () => {
    it('should enforce custom SoD rules', () => {
      const customRules = [
        { conflictingRoles: ['ANALYST', 'APPROVER'] },
        { conflictingRoles: ['COMPLIANCE_OFFICER', 'REQUESTER'] }
      ];
      
      sodEngine.loadRules(customRules);
      expect(sodEngine.rules).toHaveLength(2);
    });

    it('should apply organization-specific SoD policies', () => {
      const policy = sodEngine.getPolicyForOrganization('ORG-123');
      expect(policy.minApprovalsRequired).toBe(2);
      expect(policy.requireSeparateChecker).toBe(true);
    });
  });
});
```

### 1.3 Approver Information Tests

**File:** `tests/unit/workflows/approver-info.test.ts`

```typescript
describe('Approver Information', () => {
  it('should return current approver with role and department', () => {
    const workflow = createWorkflow();
    workflow.assignApprover('analyst-1', 'INITIAL_REVIEW');
    
    const approverInfo = workflow.getCurrentApprover();
    expect(approverInfo.userId).toBe('analyst-1');
    expect(approverInfo.role).toBe('COMPLIANCE_ANALYST');
    expect(approverInfo.department).toBe('COMPLIANCE');
    expect(approverInfo.name).toBe('John Smith');
  });

  it('should track assignment timestamp', () => {
    const workflow = createWorkflow();
    const assignmentTime = new Date();
    workflow.assignApprover('analyst-1', 'INITIAL_REVIEW');
    
    const approverInfo = workflow.getCurrentApprover();
    expect(approverInfo.assignedAt.getTime()).toBeCloseTo(assignmentTime.getTime(), -2);
  });

  it('should detect overdue approvals', () => {
    const workflow = createWorkflow();
    workflow.assignApprover('analyst-1', 'INITIAL_REVIEW');
    workflow.approvalTimeout = 48; // 48 hours
    
    // Simulate 72 hours passing
    jest.advanceTimersByTime(72 * 60 * 60 * 1000);
    
    const approverInfo = workflow.getCurrentApprover();
    expect(approverInfo.isOverdue).toBe(true);
    expect(approverInfo.overdueHours).toBe(24);
  });

  it('should support multiple concurrent approvers', () => {
    const workflow = createWorkflow({ requireConcurrentApprovals: true });
    workflow.assignApprovers(['analyst-1', 'analyst-2'], 'INITIAL_REVIEW');
    
    const approvers = workflow.getCurrentApprovers();
    expect(approvers).toHaveLength(2);
    expect(approvers.map(a => a.userId)).toContain('analyst-1');
    expect(approvers.map(a => a.userId)).toContain('analyst-2');
  });
});
```

---

## 2. INTEGRATION TESTS

### 2.1 Workflow Lifecycle Tests

**File:** `tests/integration/workflows/workflow-lifecycle.test.ts`

```typescript
describe('Workflow Lifecycle Integration', () => {
  let workflowService: WorkflowService;
  let sodService: SoDService;
  let auditService: AuditService;
  let db: Database;

  beforeEach(async () => {
    db = new Database();
    await db.connect();
    workflowService = new WorkflowService(db);
    sodService = new SoDService(db);
    auditService = new AuditService(db);
  });

  afterEach(async () => {
    await db.disconnect();
  });

  it('should complete full workflow with SoD compliance checks', async () => {
    // Create decision
    const decision = await workflowService.createDecision({
      applicantId: 'APP-001',
      decisionType: 'KYC_APPROVAL'
    });

    expect(decision.workflowStatus).toBe('PENDING');

    // Stage 1: Initial Review
    await workflowService.assignApprover(decision.id, 'analyst-1', 'INITIAL_REVIEW');
    let sodStatus = await sodService.validateWorkflow(decision.id);
    expect(sodStatus.status).toBe('COMPLIANT');

    await workflowService.approveStage(decision.id, 'analyst-1', 'INITIAL_REVIEW', 'Looks good');
    expect(decision.currentStage).toBe('COMPLIANCE_CHECK');

    // Stage 2: Compliance Check
    await workflowService.assignApprover(decision.id, 'analyst-2', 'COMPLIANCE_CHECK');
    sodStatus = await sodService.validateWorkflow(decision.id);
    expect(sodStatus.status).toBe('COMPLIANT');

    await workflowService.approveStage(decision.id, 'analyst-2', 'COMPLIANCE_CHECK', 'Compliant');
    expect(decision.currentStage).toBe('FINAL_APPROVAL');

    // Stage 3: Final Approval
    await workflowService.assignApprover(decision.id, 'manager-1', 'FINAL_APPROVAL');
    sodStatus = await sodService.validateWorkflow(decision.id);
    expect(sodStatus.status).toBe('COMPLIANT');

    await workflowService.approveStage(decision.id, 'manager-1', 'FINAL_APPROVAL', 'Approved');
    expect(decision.workflowStatus).toBe('COMPLETED');

    // Verify audit trail
    const auditTrail = await auditService.getDecisionAuditTrail(decision.id);
    expect(auditTrail).toHaveLength(3); // 3 approvals
  });

  it('should reject workflow and require restart', async () => {
    const decision = await workflowService.createDecision({
      applicantId: 'APP-002',
      decisionType: 'KYC_APPROVAL'
    });

    await workflowService.assignApprover(decision.id, 'analyst-1', 'INITIAL_REVIEW');
    await workflowService.rejectStage(
      decision.id,
      'analyst-1',
      'INITIAL_REVIEW',
      'Missing documentation'
    );

    expect(decision.workflowStatus).toBe('REJECTED');
    
    // System should allow restart
    const canRestart = await workflowService.canRestartWorkflow(decision.id);
    expect(canRestart).toBe(true);
  });

  it('should handle escalation for overdue approvals', async () => {
    const decision = await workflowService.createDecision({
      applicantId: 'APP-003',
      decisionType: 'KYC_APPROVAL',
      approvalTimeout: 24 // 24 hours
    });

    await workflowService.assignApprover(decision.id, 'analyst-1', 'INITIAL_REVIEW');
    
    // Simulate 36 hours passing
    jest.advanceTimersByTime(36 * 60 * 60 * 1000);

    const escalated = await workflowService.checkAndEscalateOverdue();
    expect(escalated).toContainEqual(expect.objectContaining({ decisionId: decision.id }));
  });
});
```

### 2.2 SoD Rule Enforcement Tests

**File:** `tests/integration/compliance/sod-enforcement.test.ts`

```typescript
describe('SoD Rule Enforcement Integration', () => {
  let sodService: SoDService;
  let workflowService: WorkflowService;
  let db: Database;

  beforeEach(async () => {
    db = new Database();
    await db.connect();
    sodService = new SoDService(db);
    workflowService = new WorkflowService(db);
    await loadSoDRules('compliance-rules-set-1');
  });

  it('should prevent analyst from being final approver', async () => {
    const decision = await workflowService.createDecision({ applicantId: 'APP-004' });

    // Stage 1: Analyst review
    await workflowService.assignApprover(decision.id, 'analyst-1', 'INITIAL_REVIEW');
    await workflowService.approveStage(decision.id, 'analyst-1', 'INITIAL_REVIEW');

    // Try to assign same analyst as final approver
    const canAssign = await sodService.canAssignApprover(decision.id, 'analyst-1', 'FINAL_APPROVAL');
    expect(canAssign).toBe(false);

    expect(() => 
      workflowService.assignApprover(decision.id, 'analyst-1', 'FINAL_APPROVAL')
    ).rejects.toThrow(/SoD violation/i);
  });

  it('should enforce different approvers across critical stages', async () => {
    const decision = await workflowService.createDecision({ applicantId: 'APP-005' });

    const workflow = await workflowService.getWorkflow(decision.id);
    const availableApprovers = await sodService.getAvailableApproversForStage(
      decision.id,
      'FINAL_APPROVAL'
    );

    // Should not include analyst-1 if they're already in the chain
    await workflowService.assignApprover(decision.id, 'analyst-1', 'INITIAL_REVIEW');
    
    const availableAfterAssignment = await sodService.getAvailableApproversForStage(
      decision.id,
      'FINAL_APPROVAL'
    );

    expect(availableAfterAssignment.map(a => a.userId)).not.toContain('analyst-1');
  });

  it('should generate SoD compliance report', async () => {
    const decisions = await workflowService.getRecentDecisions(100);
    const report = await sodService.generateComplianceReport(decisions);

    expect(report).toHaveProperty('totalDecisions');
    expect(report).toHaveProperty('compliantDecisions');
    expect(report).toHaveProperty('violations');
    expect(report).toHaveProperty('compliancePercentage');
  });
});
```

---

## 3. END-TO-END TESTS

### 3.1 UI Workflow Tests

**File:** `tests/e2e/decisions-tab.e2e.ts`

```typescript
describe('Decisions Tab E2E Tests', () => {
  beforeEach(() => {
    cy.login('manager@grow.com');
    cy.visit('/compliance/decisions');
  });

  describe('Decision List View', () => {
    it('should display decisions with workflow status', () => {
      cy.get('[data-testid="decision-list"]')
        .should('exist')
        .find('[data-testid="decision-row"]')
        .should('have.length.greaterThan', 0);

      cy.get('[data-testid="decision-row"]').first().within(() => {
        cy.contains('[data-testid="decision-id"]', /DOC-\d+/).should('exist');
        cy.contains('[data-testid="workflow-status"]', /PENDING|IN_PROGRESS|COMPLETED/).should('exist');
        cy.contains('[data-testid="current-approver"]', /@/).should('exist');
      });
    });

    it('should show progress bar for workflow completion', () => {
      cy.get('[data-testid="decision-row"]').first().within(() => {
        cy.get('[data-testid="progress-bar"]').should('exist');
        cy.get('[data-testid="progress-percentage"]')
          .should('contain', /\d+%/);
      });
    });

    it('should filter decisions by status', () => {
      cy.get('[data-testid="filter-status"]').click();
      cy.get('[data-testid="filter-option-pending"]').click();
      cy.get('[data-testid="decision-row"]').each(row => {
        cy.wrap(row)
          .find('[data-testid="workflow-status"]')
          .should('contain', 'PENDING');
      });
    });

    it('should filter decisions by SoD compliance status', () => {
      cy.get('[data-testid="filter-sod-status"]').click();
      cy.get('[data-testid="filter-option-compliant"]').click();
      
      cy.get('[data-testid="decision-row"]').each(row => {
        cy.wrap(row)
          .find('[data-testid="sod-status-badge"]')
          .should('have.class', 'sod-compliant');
      });
    });
  });

  describe('Decision Detail & Workflow Approval', () => {
    it('should display full workflow timeline', () => {
      cy.get('[data-testid="decision-row"]').first().click();
      
      cy.get('[data-testid="workflow-timeline"]').should('exist');
      cy.get('[data-testid="workflow-stage"]').each(stage => {
        cy.wrap(stage).should('contain', /INITIAL_REVIEW|COMPLIANCE_CHECK|FINAL_APPROVAL/);
      });
    });

    it('should show current approver information', () => {
      cy.get('[data-testid="decision-row"]').first().click();
      
      cy.get('[data-testid="current-approver-card"]').within(() => {
        cy.get('[data-testid="approver-name"]').should('not.be.empty');
        cy.get('[data-testid="approver-role"]').should('contain', /Analyst|Manager|Compliance/);
        cy.get('[data-testid="approver-department"]').should('not.be.empty');
        cy.get('[data-testid="assigned-timestamp"]').should('contain', /ago/);
      });
    });

    it('should display SoD compliance status with details', () => {
      cy.get('[data-testid="decision-row"]').first().click();
      
      cy.get('[data-testid="sod-status-card"]').within(() => {
        cy.get('[data-testid="sod-status-badge"]')
          .should('contain', /Compliant|At Risk|Non-Compliant/);
        
        cy.get('[data-testid="sod-rules-applied"]')
          .find('[data-testid="sod-rule"]')
          .should('have.length.greaterThan', 0);
      });
    });

    it('should allow approver to approve decision', () => {
      cy.login('analyst@grow.com');
      cy.visit('/compliance/decisions');
      
      cy.get('[data-testid="decision-row"]').first().click();
      cy.get('[data-testid="approve-btn"]').should('be.enabled');
      
      cy.get('[data-testid="approval-comment"]').type('All documents verified');
      cy.get('[data-testid="approve-btn"]').click();
      
      cy.get('[data-testid="success-message"]')
        .should('contain', 'Decision approved successfully');
    });

    it('should block approval if SoD conflict detected', () => {
      // Setup scenario where approver has conflicting role
      cy.setupSoDConflict('analyst-1', 'INITIAL_REVIEW', 'FINAL_APPROVAL');
      
      cy.get('[data-testid="decision-row"]').first().click();
      cy.get('[data-testid="approve-btn"]').should('be.disabled');
      
      cy.get('[data-testid="sod-warning"]')
        .should('contain', /cannot hold multiple decision-making roles/i);
    });

    it('should show escalation warning for overdue approvals', () => {
      cy.advanceTime(25, 'hours'); // Move past 24-hour approval window
      cy.visit('/compliance/decisions');
      
      cy.get('[data-testid="decision-row"]').first().within(() => {
        cy.get('[data-testid="escalation-badge"]')
          .should('contain', 'OVERDUE');
      });
    });
  });

  describe('Audit Trail', () => {
    it('should display complete approval history', () => {
      cy.get('[data-testid="decision-row"]').first().click();
      cy.get('[data-testid="audit-trail-tab"]').click();
      
      cy.get('[data-testid="audit-entry"]').each(entry => {
        cy.wrap(entry).should('contain', /(Approved|Rejected|Assigned)/);
        cy.wrap(entry).should('contain', /@/); // Email/user
        cy.wrap(entry).should('contain', /ago/); // Timestamp
      });
    });

    it('should export audit trail for compliance', () => {
      cy.get('[data-testid="decision-row"]').first().click();
      cy.get('[data-testid="audit-trail-tab"]').click();
      cy.get('[data-testid="export-audit-btn"]').click();
      
      cy.readFile('cypress/downloads/audit-trail.pdf')
        .should('exist');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.get('[data-testid="decision-list"]').focus();
      cy.realPress('Tab');
      cy.realPress('Tab');
      cy.realPress('Enter');
      
      cy.url().should('include', '/decisions/');
    });

    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="approve-btn"]')
        .should('have.attr', 'aria-label', 'Approve decision');
      
      cy.get('[data-testid="workflow-progress"]')
        .should('have.attr', 'role', 'progressbar');
    });
  });
});
```

---

## 4. MANUAL TESTING CHECKLIST

### 4.1 Workflow Stage Visibility
- [ ] Navigate to Decisions Tab
- [ ] Verify workflow stages are color-coded (Pending=Yellow, In Progress=Blue, Completed=Green, Blocked=Red)
- [ ] Click decision to view detailed workflow timeline
- [ ] Verify all past stages show completion timestamps
- [ ] Verify current stage is highlighted

### 4.2 Current Approver Information
- [ ] Open decision detail view
- [ ] Verify approver name, role, and department are displayed
- [ ] Verify assignment timestamp shows relative time (e.g., "3 hours ago")
- [ ] For overdue approvals, verify "⚠️ OVERDUE" badge is shown with hours past deadline

### 4.3 Steps Remaining Tracking
- [ ] Verify progress bar shows % completion (e.g., "2 of 5 steps - 40%")
- [ ] Approve a stage and verify progress updates
- [ ] Verify remaining approvers/stages are listed

### 4.4 SoD Enforcement - Compliant Scenario
- [ ] Create new workflow with 3 different approvers
- [ ] Assign: User A (Analyst) → User B (Compliance Officer) → User C (Manager)
- [ ] Verify SoD status badge shows "✓ COMPLIANT"
- [ ] Verify all stages have green checkmarks in SoD column

### 4.5 SoD Enforcement - Conflict Scenario
- [ ] Create workflow and assign User A as Initial Reviewer
- [ ] Try to assign User A as Final Approver
- [ ] Verify system blocks assignment with error message
- [ ] Verify SoD status shows "⚠️ CONFLICT: [User A] cannot hold multiple roles"

### 4.6 SoD Enforcement - At Risk Scenario
- [ ] Create workflow with potential conflict (analyst = final approver possible)
- [ ] Verify SoD status shows "⚠️ AT RISK"
- [ ] Display list of conflicting roles

### 4.7 Approval Actions
- [ ] Open pending decision
- [ ] Verify "Approve" button is enabled
- [ ] Verify "Reject" button is enabled
- [ ] Verify "Request Info" button is enabled
- [ ] Click "Approve", add comment, verify workflow advances

### 4.8 Rejection Workflow
- [ ] Reject a decision with reason "Insufficient documentation"
- [ ] Verify workflow status changes to "REJECTED"
- [ ] Verify option to restart workflow appears
- [ ] Restart and verify workflow resets to first stage

### 4.9 Audit Trail
- [ ] View decision detail page
- [ ] Click "Audit Trail" tab
- [ ] Verify entries show: timestamp, user, action, stage, comments
- [ ] Verify entries cannot be edited/deleted
- [ ] Export audit trail as PDF

### 4.10 Filtering & Search
- [ ] Filter by "Pending" status
- [ ] Filter by "Compliant" SoD status
- [ ] Filter by specific approver
- [ ] Search by decision ID
- [ ] Search by applicant name
- [ ] Combine multiple filters

### 4.11 Performance
- [ ] Load Decisions page with 100+ decisions
- [ ] Verify page loads in < 2 seconds
- [ ] Verify filtering responds in < 500ms
- [ ] Verify scrolling through list is smooth

### 4.12 Responsive Design
- [ ] View on desktop (1920px)
- [ ] View on tablet (768px)
- [ ] View on mobile (375px)
- [ ] Verify workflow timeline collapses properly on mobile
- [ ] Verify action buttons remain accessible

---

## 5. TEST DATA SETUP

### Create Test Decisions

```sql
-- Insert test decisions with various workflow states
INSERT INTO decisions (id, applicant_id, status, created_at) VALUES
('DOC-001', 'APP-001', 'PENDING', NOW()),
('DOC-002', 'APP-002', 'IN_PROGRESS', NOW()),
('DOC-003', 'APP-003', 'COMPLETED', NOW() - INTERVAL '2 days');

-- Insert workflow stages
INSERT INTO workflow_stages (decision_id, stage_name, status, assigned_approver, assigned_at) VALUES
('DOC-001', 'INITIAL_REVIEW', 'PENDING', 'analyst-1', NOW()),
('DOC-002', 'INITIAL_REVIEW', 'COMPLETED', 'analyst-1', NOW() - INTERVAL '1 day'),
('DOC-002', 'COMPLIANCE_CHECK', 'IN_PROGRESS', 'analyst-2', NOW() - INTERVAL '12 hours'),
('DOC-003', 'INITIAL_REVIEW', 'COMPLETED', 'analyst-1', NOW() - INTERVAL '2 days'),
('DOC-003', 'COMPLIANCE_CHECK', 'COMPLETED', 'analyst-2', NOW() - INTERVAL '1 day'),
('DOC-003', 'FINAL_APPROVAL', 'COMPLETED', 'manager-1', NOW() - INTERVAL '6 hours');
```

---

## 6. RUNNING THE TESTS

```bash
# Run all unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run specific test file
npm run test -- tests/unit/compliance/sod-validation.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

---

## 7. CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Test Decisions Tab Feature

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
      
      - name: Install dependencies
        run: npm install
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run e2e tests
        run: npm run test:e2e
      
      - name: Upload coverage
        run: npm run test:coverage && codecov
```

---

## 8. Success Criteria

- ✅ All unit tests passing (>80% coverage)
- ✅ All integration tests passing
- ✅ All e2e tests passing
- ✅ Manual testing checklist completed
- ✅ No critical/high bugs identified
- ✅ Performance targets met (< 2s page load)
- ✅ SoD rules enforced correctly in all scenarios
- ✅ Audit trail captures all changes
