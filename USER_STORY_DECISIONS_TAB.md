# User Story: Decisions Tab – Approval Workflow Status with Separation of Duties

## Story ID
US-DECISIONS-SOD-001

## Title
Approval Workflow Status Dashboard with Separation of Duties Enforcement

## User Story Description
**As a** Compliance Officer / KYC Manager  
**I want** to view a comprehensive Decisions Tab that displays the current approval workflow status with clear indicators of workflow stages, current approvers, and remaining approval steps  
**So that** I can track approval progress, understand where decisions are in the pipeline, and ensure separation of duties is properly enforced across the approval chain

## Priority
High

## Story Points
13

---

## Acceptance Criteria

### Key Requirements
1. **Workflow Stage Visibility**
   - [ ] Display current workflow stage (e.g., Initial Review, Compliance Check, Risk Assessment, Final Approval)
   - [ ] Show workflow stage history with timestamps
   - [ ] Color-code workflow stages by status (Pending, In Progress, Completed, Blocked)

2. **Current Approver Information**
   - [ ] Display name of the current approver(s) responsible for the decision
   - [ ] Show approver's role/department for clarity
   - [ ] Display timestamp when the decision was assigned to current approver
   - [ ] Show escalation status if approval is overdue

3. **Steps Remaining**
   - [ ] Show total number of approval steps in the workflow
   - [ ] Display completed steps vs. remaining steps (e.g., "3 of 5")
   - [ ] Display progress bar visualization of workflow completion
   - [ ] List remaining approvers/stages that are yet to review

4. **Separation of Duties (SoD) Enforcement**
   - [ ] Prevent the same person from performing conflicting roles in the approval chain
   - [ ] Highlight when SoD rules are at risk or violated
   - [ ] Show SoD conflict warnings (e.g., "Analyst cannot also be Final Approver")
   - [ ] Display SoD validation status (✓ Compliant / ⚠️ At Risk / ✗ Non-Compliant)
   - [ ] Show which specific SoD rules are being enforced

### Additional Criteria
5. **User Interface Requirements**
   - [ ] Decisions Tab is easily accessible from the main navigation
   - [ ] Display decisions in a filterable/searchable list with key decision records
   - [ ] Show decision ID, subject, applicant name, and current status at a glance
   - [ ] Provide drill-down view to see full approval workflow timeline for each decision

6. **Actions & Interactivity**
   - [ ] Provide quick action buttons for approvers (Approve, Reject, Request Info)
   - [ ] Allow users to add comments/notes to decisions during review
   - [ ] Show notification badge for pending decisions requiring action
   - [ ] Enable filtering by workflow status, assigned approver, and SoD status

7. **Audit & Compliance**
   - [ ] Display complete audit trail for each decision (who approved, when, with what comments)
   - [ ] Track SoD compliance for reporting purposes
   - [ ] Maintain immutable record of all approval decisions
   - [ ] Export decision workflow reports for compliance documentation

8. **Performance & Accessibility**
   - [ ] Page loads within 2 seconds even with 100+ active decisions
   - [ ] Responsive design for desktop and tablet views
   - [ ] Accessible to users with different roles (Analyst, Reviewer, Approver, Auditor)
   - [ ] WCAG 2.1 AA compliance for accessibility

---

## Definition of Done

- [ ] All acceptance criteria are met and tested
- [ ] Unit tests written and passing (minimum 80% code coverage)
- [ ] Integration tests for workflow state transitions completed
- [ ] UI/UX review completed and approved
- [ ] Security review for approval workflow completed
- [ ] Performance testing completed (< 2s load time)
- [ ] Documentation updated (User Guide, API docs if applicable)
- [ ] Code reviewed and merged by 2+ reviewers
- [ ] Product Owner sign-off obtained
- [ ] Deployed to staging environment and verified
- [ ] No critical or high-severity bugs identified

---

## Technical Notes

### Database Schema Considerations
- Track workflow state in decisions table
- Audit trail table for all workflow transitions
- SoD rule matrix for validation

### API Endpoints Needed
- `GET /api/decisions` - List all decisions with workflow status
- `GET /api/decisions/{id}/workflow` - Get workflow timeline for a decision
- `GET /api/decisions/{id}/sod-status` - Get SoD compliance status
- `POST /api/decisions/{id}/approve` - Approve a decision
- `POST /api/decisions/{id}/reject` - Reject a decision
- `POST /api/decisions/{id}/comments` - Add comment to decision

### Frontend Components
- `DecisionsTab` - Main container component
- `WorkflowTimeline` - Visual workflow stage display
- `ApproverInfo` - Current approver details card
- `SoDStatusIndicator` - SoD compliance status badge
- `DecisionActionButtons` - Approve/Reject/Comment actions

---

## Testing Scenarios

1. **Happy Path:** New decision flows through complete workflow with all SoD rules compliant
2. **SoD Conflict:** System blocks approver from proceeding when SoD rule is violated
3. **Escalation:** System flags overdue approvals and escalates to manager
4. **Audit Trail:** Complete history is recorded and accessible for compliance review
5. **Filtering:** Users can filter decisions by status, approver, and SoD compliance status

---

## Dependencies / Related Stories
- US-COMPLIANCE-WORKFLOW-001: Core approval workflow engine
- US-AUTH-ROLES-001: Role-based access control
- US-SOD-RULES-001: SoD rule configuration and validation

---

## Notes
- Ensure all decisions maintain audit trail for compliance (SOX, AML, KYC regulations)
- SoD enforcement is critical for regulatory compliance
- Consider integration with email notifications for approvers
- May require migration of existing decisions to new workflow state model
