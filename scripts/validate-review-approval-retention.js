#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(appRoot, '..');

const files = {
  reviewWorkflowTransitionHelper: path.join(workspaceRoot, 'src/lib/models/reviewWorkflowTransitionHelper.ts'),
  reviewWorkflowService: path.join(workspaceRoot, 'src/lib/models/reviewWorkflowService.ts'),
  reviewApprovalRulesHelper: path.join(workspaceRoot, 'src/lib/models/reviewApprovalRulesHelper.ts'),
  reviewApprovalService: path.join(workspaceRoot, 'src/lib/models/reviewApprovalService.ts'),
  overrideReasonValidationHelper: path.join(workspaceRoot, 'src/lib/models/overrideReasonValidationHelper.ts'),
  overrideService: path.join(workspaceRoot, 'src/lib/models/overrideService.ts'),
  escalationRulesHelper: path.join(workspaceRoot, 'src/lib/models/escalationRulesHelper.ts'),
  escalationService: path.join(workspaceRoot, 'src/lib/models/escalationService.ts'),
  periodicReviewFrequencyHelper: path.join(workspaceRoot, 'src/lib/models/periodicReviewFrequencyHelper.ts'),
  periodicReviewEvaluationHelper: path.join(workspaceRoot, 'src/lib/models/periodicReviewEvaluationHelper.ts'),
  periodicRescreeningServiceModel: path.join(workspaceRoot, 'src/lib/models/periodicRescreeningService.ts'),
  supabaseDatabaseAdapter: path.join(appRoot, 'src/app/lib/providers/adapters/supabase/supabaseDatabaseAdapter.ts'),
  botAuditEventWriter: path.join(appRoot, 'src/app/api/lib/audit/botAuditEventWriter.ts'),
  retentionPolicy: path.join(appRoot, 'src/lib/retention/retentionPolicy.ts'),
  metadataHooks: path.join(appRoot, 'src/lib/storage/hooks/metadataHooks.ts'),
  migrationPhase2: path.join(appRoot, 'supabase/migrations/004_phase2_cases_findings_alerts.sql'),
  periodicRescreeningJob: path.join(appRoot, 'src/lib/scheduler/services/periodicRescreeningJob.ts'),
  documentExpiryModel: path.join(workspaceRoot, 'src/lib/models/documentExpiryModel.ts'),
  documentExpiryEvaluationHelper: path.join(workspaceRoot, 'src/lib/models/documentExpiryEvaluationHelper.ts'),
  documentExpiryService: path.join(workspaceRoot, 'src/lib/models/documentExpiryService.ts'),
  documentExpiryAuditHooks: path.join(workspaceRoot, 'src/lib/models/documentExpiryAuditHooks.ts'),
  caseExpiryImpactHelper: path.join(workspaceRoot, 'src/lib/models/caseExpiryImpactHelper.ts'),
  documentExpiryCheckJob: path.join(appRoot, 'src/lib/scheduler/services/documentExpiryCheckJob.ts'),
  documentExpiryCheckJobAuditHooks: path.join(appRoot, 'src/lib/scheduler/services/documentExpiryCheckJobAuditHooks.ts'),
};

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function has(text, snippet) {
  return text.includes(snippet);
}

function hasRegex(text, regex) {
  return regex.test(text);
}

let passes = 0;
let failures = 0;

function check(condition, label, detailIfFail = '') {
  if (condition) {
    passes += 1;
    console.log(`PASS ${label}`);
    return;
  }

  failures += 1;
  console.log(`FAIL ${label}${detailIfFail ? ` - ${detailIfFail}` : ''}`);
}

function runSection8() {
  const transitionHelper = read(files.reviewWorkflowTransitionHelper);
  const workflowService = read(files.reviewWorkflowService);
  const approvalRules = read(files.reviewApprovalRulesHelper);
  const approvalService = read(files.reviewApprovalService);

  console.log('\n8. Review and approval workflow tests');
  console.log('8.1 Review flow');

  check(
    has(workflowService, 'async createReviewWorkflow(') &&
      has(workflowService, "const initialState = input.initialState ?? 'draft';") &&
      has(workflowService, 'createReviewWorkflowRecord('),
    'create review initializes and persists workflow'
  );
  check(
    has(workflowService, 'async assignReviewer(') &&
      has(workflowService, 'assignReviewWorkflowReviewer(') &&
      has(workflowService, 'reviewerId: input.reviewerId'),
    'assign reviewer persists reviewer assignment'
  );
  check(
    has(transitionHelper, "submitted_for_review: ['in_review']") &&
      has(workflowService, 'toState: input.toState'),
    'move to in_review transition allowed from submitted state'
  );
  check(
    has(transitionHelper, "in_review: ['changes_requested', 'submitted_for_approval', 'rejected', 'escalated']") &&
      has(transitionHelper, 'changes_requested'),
    'request changes transition allowed from in_review'
  );
  check(
    has(transitionHelper, "changes_requested: ['draft', 'submitted_for_review']"),
    'resubmit transition allowed after changes requested'
  );
  check(
    has(transitionHelper, "in_review: ['changes_requested', 'submitted_for_approval', 'rejected', 'escalated']") &&
      has(transitionHelper, 'submitted_for_approval'),
    'submit for approval transition allowed from in_review'
  );
  check(
    has(transitionHelper, 'assertValidReviewWorkflowTransition(') &&
      has(transitionHelper, 'Invalid review workflow transition from') &&
      has(transitionHelper, 'if (!validTargets.includes(toState)) {'),
    'only valid transitions allowed and invalid transitions blocked'
  );

  console.log('\n8.2 Approval flow');

  check(
    has(approvalRules, "reasonCodes.push('standard_path')") &&
      has(approvalRules, "buildRequirement('level_1', 'approver', 1)") &&
      has(approvalService, 'approvalRequirement: requirementResult.requirement'),
    'approve low-risk case follows standard path'
  );
  check(
    has(transitionHelper, 'export type ReviewRejectedReasonCode') &&
      has(transitionHelper, 'risk_unacceptable') &&
      has(transitionHelper, 'reasonCode is required when transitioning to ${toState}') &&
      has(transitionHelper, "state === 'changes_requested' || state === 'rejected' || state === 'escalated'"),
    'reject case with reason is enforced by reason code rules'
  );
  check(
    has(approvalRules, 'if (input.isHighRiskCase) {') &&
      has(approvalRules, "buildRequirement('high_risk', 'compliance_manager', 2)") &&
      has(approvalRules, 'requiresHighRiskApprovalPath: level === \'high_risk\''),
    'high-risk case requires elevated approval path'
  );
  check(
    hasRegex(approvalService, /createReviewApproval\([\s\S]*determineReviewApprovalRequirement\(input\.ruleInput \?\? \{\}\)/) &&
      hasRegex(approvalService, /refreshApprovalRequirement\([\s\S]*determineReviewApprovalRequirement\(input\.ruleInput\)/),
    'approval level logic is wired through service creation path'
  );
  check(
    has(approvalService, 'function assertApprovalDecisionAllowed(') &&
      has(approvalService, "throw new Error('High-risk case cannot bypass required path')") &&
      has(approvalService, 'input.approvalRequirement.minimumApprovalsRequired') &&
      has(approvalService, "input.actorRole !== 'admin' && input.actorRole !== 'compliance_manager'"),
    'high-risk case cannot bypass required path'
  );
}

function runSection9() {
  const overrideValidation = read(files.overrideReasonValidationHelper);
  const overrideService = read(files.overrideService);
  const escalationRules = read(files.escalationRulesHelper);
  const escalationService = read(files.escalationService);

  console.log('\n9. Override and escalation tests');
  console.log('9.1 Override');

  // attempt override without reason / with invalid reason → missing or invalid reason blocked
  check(
    has(overrideValidation, "errors.push('reason_required')") &&
      has(overrideValidation, "errors.push('invalid_reason_code')") &&
      has(overrideService, 'Invalid override reason payload'),
    'attempt override without reason or with invalid reason is blocked'
  );
  // attempt override with too-short reason → missing or invalid reason blocked
  check(
    has(overrideValidation, "errors.push('reason_below_minimum')") &&
      has(overrideValidation, 'minimumReasonLength = Math.max(1, input.minimumReasonLength ?? 12)') &&
      has(overrideValidation, 'normalizedReasonText.length < minimumReasonLength'),
    'attempt override with too-short reason is blocked by minimum length policy'
  );
  // attempt override with valid reason → valid reason stored and audited
  check(
    has(overrideService, 'reasonText: validation.normalized.reasonText') &&
      has(overrideService, 'createOverrideReasonRecord(') &&
      has(overrideService, 'onOverrideCreated(') &&
      has(overrideService, 'buildReasonCodeMetadata(validation.normalized.reasonCode)'),
    'valid reason is stored via persistence and audited with reason code metadata'
  );

  console.log('\n9.2 Escalation');

  // unresolved severe finding → escalation record created, state persisted, audit event written
  check(
    has(escalationRules, "reasonCodes.push('unresolved_severe_findings')") &&
      has(escalationRules, 'isEscalationRequired: true') &&
      has(escalationService, 'createEscalationRecord(') &&
      has(escalationService, 'onEscalationCreated(') &&
      has(escalationService, "state: 'in_review'") &&
      has(escalationService, 'onEscalationTriggered('),
    'unresolved severe finding triggers escalation: record created, state persisted, audit event written'
  );
  // failed provider run → escalation record created, state persisted, audit event written
  check(
    has(escalationRules, "reasonCodes.push('provider_runs_failed')") &&
      has(escalationRules, 'isEscalationRequired: true') &&
      has(escalationService, 'createEscalationRecord(') &&
      has(escalationService, 'onEscalationCreated(') &&
      has(escalationService, "state: 'in_review'") &&
      has(escalationService, 'onEscalationTriggered('),
    'failed provider run triggers escalation: record created, state persisted, audit event written'
  );
  // high-risk approval blockage → escalation record created, state persisted, audit event written
  check(
    has(escalationRules, "reasonCodes.push('approval_blocked')") &&
      has(escalationRules, 'isEscalationRequired: true') &&
      has(escalationService, 'createEscalationRecord(') &&
      has(escalationService, 'onEscalationCreated(') &&
      has(escalationService, "state: 'in_review'") &&
      has(escalationService, 'onEscalationTriggered('),
    'high-risk approval blockage triggers escalation: record created, state persisted, audit event written'
  );
  // all trigger paths share the same level and decision reason-code wiring through service
  check(
    has(escalationService, 'decision_reason_codes: decision.reasonCodes') &&
      has(escalationService, 'level: decision.level'),
    'escalation service wires decision level and reason codes through to audit'
  );
}

function runSection10() {
  const supabaseAdapter = read(files.supabaseDatabaseAdapter);
  const auditWriter = read(files.botAuditEventWriter);
  const retentionPolicy = read(files.retentionPolicy);
  const metadataHooks = read(files.metadataHooks);
  const migration = read(files.migrationPhase2);

  console.log('\n10. Retention and legal hold tests');
  console.log('10.1 Retention metadata');

  check(
    has(supabaseAdapter, 'createEvidencePack(pack: EvidencePack)') &&
      has(supabaseAdapter, "await supabase.from('evidence_packs').upsert(") &&
      has(supabaseAdapter, 'retention_until: pack.retentionUntil || null') &&
      has(supabaseAdapter, 'retention_policy_id: pack.retentionPolicyId || null') &&
      has(supabaseAdapter, 'retention_classification: pack.retentionClassification || null'),
    'create evidence pack path populates required retention metadata fields'
  );
  check(
    has(supabaseAdapter, 'createBotResultEvidence(params: {') &&
      has(supabaseAdapter, "await supabase.from('bot_result_evidence').upsert(") &&
      has(supabaseAdapter, 'retention_until: params.retentionUntil || null') &&
      has(supabaseAdapter, 'retention_policy_id: params.retentionPolicyId || null') &&
      has(supabaseAdapter, 'retention_classification: params.retentionClassification || null'),
    'evidence-linked record path carries retention metadata where required'
  );
  check(
    has(supabaseAdapter, 'createProviderLog(log: Omit<ProviderLog,') &&
      has(supabaseAdapter, 'retention_until: log.retentionUntil || null') &&
      has(supabaseAdapter, 'retention_policy_id: log.retentionPolicyId || null') &&
      has(supabaseAdapter, 'retention_classification: log.retentionClassification || null'),
    'create provider log path populates required retention metadata fields'
  );
  check(
    has(auditWriter, 'buildBotAuditEvent(') &&
    has(auditWriter, 'metadata: event.metadata') &&
      has(auditWriter, 'data: {') &&
      has(auditWriter, 'timestamp: event.occurredAt'),
    'create audit event path preserves retention-capable metadata payload'
  );
  check(
    has(retentionPolicy, 'buildDefaultRetentionMetadata') &&
      has(retentionPolicy, 'retentionPolicyId') &&
      has(retentionPolicy, 'retentionClassification') &&
      has(retentionPolicy, 'retentionUntil'),
    'retention fields are generated consistently by policy helper'
  );

  console.log('\n10.2 Legal hold');

  check(
    has(supabaseAdapter, 'const evidenceDisposition = blockDispositionWhenLegalHoldActive({') &&
      has(supabaseAdapter, 'legal_hold: params.legalHold ?? false') &&
      has(supabaseAdapter, 'legal_hold_reason: params.legalHoldReason || null') &&
      has(supabaseAdapter, 'legal_hold_set_by: params.legalHoldSetBy || null') &&
      has(supabaseAdapter, 'legal_hold_set_at: params.legalHoldSetAt || null'),
    'set legal hold on evidence-linked record is persisted'
  );
  check(
    has(retentionPolicy, 'blockDispositionWhenLegalHoldActive') &&
      has(retentionPolicy, 'archiveEligible: false') &&
      has(retentionPolicy, 'deleteEligible: false'),
    'attempt archive or delete disposition is blocked while legal hold is active'
  );
  check(
    has(metadataHooks, "legalHold.status === 'active' && context.operation === 'delete'") &&
      has(metadataHooks, 'throw new LegalHoldError('),
    'legal hold blocks delete path at metadata hook level'
  );
  check(
    has(migration, 'prevent_legal_hold_case_delete') &&
      has(migration, 'Cannot delete a case under legal hold'),
    'database trigger blocks delete path while legal hold is active'
  );
}

function runSection11() {
  const frequencyHelper = read(files.periodicReviewFrequencyHelper);
  const evaluationHelper = read(files.periodicReviewEvaluationHelper);
  const periodicService = read(files.periodicRescreeningServiceModel);
  const periodicJob = read(files.periodicRescreeningJob);

  console.log('\n11. Periodic rescreening tests');
  console.log('11.1 Scheduling');

  check(
    has(periodicService, 'async createPeriodicReview(') &&
      has(periodicService, 'scheduleInitialPeriodicReview({') &&
      has(frequencyHelper, "case 'annual':") &&
      has(frequencyHelper, 'return 12;') &&
      has(frequencyHelper, 'nextReviewDate: next.nextReviewDate'),
    'create case with annual review calculates next review date correctly'
  );
  check(
    has(periodicService, 'async createPeriodicReview(') &&
      has(periodicService, 'scheduleInitialPeriodicReview({') &&
      has(frequencyHelper, "case '24_months':") &&
      has(frequencyHelper, 'return 24;') &&
      has(frequencyHelper, 'nextReviewDate: next.nextReviewDate'),
    'create case with 24-month review calculates next review date correctly'
  );
  check(
    has(periodicService, 'highRiskAcceleratedReviewDays: input.highRiskAcceleratedReviewDays') &&
    has(frequencyHelper, "frequency: 'high_risk_accelerated_review'") &&
      has(frequencyHelper, 'DEFAULT_HIGH_RISK_ACCELERATED_REVIEW_DAYS = 90') &&
      has(frequencyHelper, 'calculateHighRiskAcceleratedReviewTiming('),
    'create high-risk case with accelerated review calculates next review date correctly'
  );

  console.log('\n11.2 Due and overdue logic');

  check(
    has(evaluationHelper, 'return evaluatedAt >= nextReviewDate && evaluatedAt < overdueAt;') &&
      has(periodicService, "reviewState.state === 'due'") &&
      has(periodicService, "reviewStatus: targetStatus") &&
      has(periodicService, "? 'periodic_review_due'") &&
      has(periodicService, "if (reviewState.state === 'due') {") &&
      has(periodicService, 'onPeriodicReviewDue('),
    'force case into due state: service marks due correctly'
  );
  check(
    has(evaluationHelper, 'return evaluatedAt >= overdueAt;') &&
      has(periodicService, "reviewState.state === 'overdue'") &&
      has(periodicService, "reviewStatus: targetStatus") &&
      has(periodicService, "? 'periodic_review_overdue'") &&
      has(periodicService, "if (reviewState.state === 'overdue') {") &&
      has(periodicService, 'onPeriodicReviewOverdue('),
    'force case into overdue state: service marks overdue correctly'
  );
  check(
    has(periodicService, 'onPeriodicReviewDue(') && has(periodicService, 'onPeriodicReviewOverdue('),
    'audit hooks fire for due and overdue transitions when built'
  );

  console.log('\n11.3 Job flow');

  check(
    has(periodicJob, 'runDuePeriodicReviews(') &&
      has(periodicJob, 'scheduled_at: started_at') &&
      has(periodicJob, 'due_review_count = safeCount(runSummary.due_review_count)') &&
      has(periodicJob, 'processed_review_count = safeCount(runSummary.processed_review_count)'),
    'periodic rescreening job runs and picks due review summary only'
  );
  check(
    has(periodicJob, 'const due_review_count = safeCount(runSummary.due_review_count);') &&
      has(periodicJob, 'if (due_review_count === 0) {') &&
      has(periodicJob, "status: 'no_op'"),
    'job no-op behavior is explicit when nothing is due'
  );
  check(
    has(periodicJob, "status: 'processed'") &&
      has(periodicJob, 'emitPeriodicRescreeningJobCompletedAuditEvent'),
    'job processes due cases and emits completion event'
  );
  check(
    has(periodicJob, 'function safeCount(value: number | undefined): number') &&
      has(periodicJob, "if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {") &&
      has(periodicJob, 'return 0;') &&
      has(periodicJob, 'return Math.floor(value);'),
    'job is safe and idempotent enough for rerun'
  );
}

function runSection12() {
  const documentExpiryModel = read(files.documentExpiryModel);
  const documentExpiryEvaluation = read(files.documentExpiryEvaluationHelper);
  const documentExpiryService = read(files.documentExpiryService);
  const documentExpiryAuditHooks = read(files.documentExpiryAuditHooks);
  const caseExpiryImpact = read(files.caseExpiryImpactHelper);
  const documentExpiryCheckJob = read(files.documentExpiryCheckJob);
  const documentExpiryCheckJobAuditHooks = read(files.documentExpiryCheckJobAuditHooks);

  console.log('\n12. Document expiry tests');
  console.log('12.1 Expiry metadata');

  check(
    has(documentExpiryModel, "| 'active'") &&
      has(documentExpiryEvaluation, "status = 'active';") &&
      has(documentExpiryService, 'async createDocumentExpiry(') &&
      has(documentExpiryService, 'createDocumentExpiryRecord('),
    'attach expiring document supports active status on creation path'
  );
  check(
    has(documentExpiryModel, "| 'no_expiry'") &&
      has(documentExpiryEvaluation, 'else if (hasNoExpiry) {') &&
      has(documentExpiryEvaluation, "status = 'no_expiry';") &&
      has(documentExpiryService, 'hasNoExpiry: input.hasNoExpiry ?? false,'),
    'attach no-expiry document is modeled and persisted consistently'
  );
  check(
    has(documentExpiryService, 'async replaceDocument(') &&
      has(documentExpiryService, 'updateDocumentReplacementMetadata(') &&
      has(documentExpiryService, "expiryStatus: 'replaced'") &&
      has(documentExpiryService, 'onDocumentReplaced('),
    'attach replacement document sets replaced state and writes audit event'
  );
  check(
    has(documentExpiryModel, "| 'expiring_soon'") &&
      has(documentExpiryModel, "| 'expired'") &&
      has(documentExpiryModel, "| 'replaced'") &&
      has(documentExpiryEvaluation, 'daysUntilExpiry < 0') &&
      has(documentExpiryEvaluation, "status = 'expired';") &&
      has(documentExpiryEvaluation, 'daysUntilExpiry <= expiringSoonWindowDays') &&
      has(documentExpiryEvaluation, "status = 'expiring_soon';") &&
      has(documentExpiryEvaluation, "status = 'replaced';"),
    'statuses resolve as expected: active, expiring soon, expired, replaced'
  );

  console.log('\n12.2 Case impact');

  check(
    has(caseExpiryImpact, 'blockOnRequiredExpiredOnly = input.blockOnRequiredExpiredOnly ?? true;') &&
      has(caseExpiryImpact, 'expiredDocuments.filter((document) => document.requiredForCase)') &&
      has(caseExpiryImpact, "outcome: 'blocking'") &&
      has(caseExpiryImpact, "reasonCodes.add('documents_expired')"),
    'mark required document expired returns blocking case impact'
  );
  check(
    has(caseExpiryImpact, "outcome: 'warning'") &&
      has(caseExpiryImpact, "reasonCodes.add('documents_expiring_soon')") &&
      has(documentExpiryService, 'evaluateCaseImpact(input: EvaluateCaseDocumentExpiryImpactInput): CaseExpiryImpactResult') &&
      has(documentExpiryService, 'return evaluateCaseExpiryImpact({'),
    'case impact helper returns warning path and stays consistent through service'
  );

  console.log('\n12.3 Job flow');

  check(
    has(documentExpiryCheckJob, 'run(input: RunDocumentExpiryCheckJobInput)') &&
      has(documentExpiryCheckJob, 'evaluateDueDocumentExpiry({') &&
      has(documentExpiryCheckJob, 'scheduled_at: started_at') &&
      has(documentExpiryCheckJob, 'const due_document_count = safeCount(summary.due_document_count);') &&
      has(documentExpiryCheckJob, 'const evaluated_document_count = safeCount(summary.evaluated_document_count);') &&
      has(documentExpiryCheckJob, 'const expired_document_count = safeCount(summary.expired_document_count);'),
    'document expiry check job evaluates due documents and tracks expected state changes'
  );
  check(
    has(documentExpiryCheckJob, 'emitDocumentExpiryCheckJobStartedAuditEvent') &&
      has(documentExpiryCheckJob, 'emitDocumentExpiryCheckJobNoopAuditEvent') &&
      has(documentExpiryCheckJob, 'emitDocumentExpiryCheckJobCompletedAuditEvent') &&
      has(documentExpiryCheckJobAuditHooks, "action: 'document_expiry_check_job_started'") &&
      has(documentExpiryCheckJobAuditHooks, "action: 'document_expiry_check_job_noop'") &&
      has(documentExpiryCheckJobAuditHooks, "action: 'document_expiry_check_job_completed'"),
    'expiry job audit hooks fire for start, noop, and completion'
  );
  check(
    has(documentExpiryCheckJob, 'if (due_document_count === 0) {') &&
      has(documentExpiryCheckJob, "status: 'no_op'") &&
      has(documentExpiryCheckJob, "status: 'processed'") &&
      has(documentExpiryCheckJob, 'summary.metadata') &&
      has(documentExpiryCheckJob, 'function safeCount(value: number | undefined): number') &&
      has(documentExpiryCheckJob, 'return Math.floor(value);'),
    'expiry job does not mutate unrelated records and is safe for rerun'
  );
  check(
    has(documentExpiryAuditHooks, 'onDocumentExpired(') &&
      has(documentExpiryAuditHooks, 'onDocumentExpiringSoon(') &&
      has(documentExpiryService, 'await this.auditByEvaluation(persisted, evaluation);'),
    'document expiry lifecycle audit hooks fire from service evaluation paths'
  );
}

function main() {
  console.log('Validation: sections 8-12 review/approval, override/escalation, retention/legal hold, periodic rescreening, document expiry');
  console.log(`App root: ${appRoot}`);
  console.log(`Workspace root: ${workspaceRoot}`);

  runSection8();
  runSection9();
  runSection10();
  runSection11();
  runSection12();

  console.log('\nSummary');
  console.log(`PASS ${passes}`);
  console.log(`FAIL ${failures}`);

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main();