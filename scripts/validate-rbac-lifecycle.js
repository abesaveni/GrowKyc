#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const files = {
  permissionMap: path.join(repoRoot, 'src/app/api/lib/security/permissionMap.ts'),
  runOneBotHandler: path.join(repoRoot, 'src/app/api/handlers/bots/runOneBotHandler.ts'),
  runAllBotsHandler: path.join(repoRoot, 'src/app/api/handlers/bots/runAllBotsHandler.ts'),
  workflowFlow: path.join(repoRoot, 'src/app/api/lib/workflow/statusTransitionFlow.ts'),
  supabaseAdapter: path.join(repoRoot, 'src/app/lib/providers/adapters/supabase/supabaseDatabaseAdapter.ts'),
  s3Adapter: path.join(repoRoot, 'src/app/lib/providers/adapters/aws/s3EvidenceAdapter.ts'),
  botPersistence: path.join(repoRoot, 'src/app/services/BotPersistence.ts'),
  botOrchestrator: path.join(repoRoot, 'src/app/services/BotOrchestrator.ts'),
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

function roleBlock(permissionMapText, role) {
  const escapedRole = role.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = permissionMapText.match(new RegExp(`${escapedRole}:\\s*\\[([\\s\\S]*?)\\],`, 'm'));
  return match ? match[1] : '';
}

let failures = 0;
let passes = 0;

function check(condition, label) {
  if (condition) {
    passes += 1;
    console.log(`PASS ${label}`);
    return;
  }

  failures += 1;
  console.log(`FAIL ${label}`);
}

function runRbacChecks() {
  const permissionMap = read(files.permissionMap);
  const runOneBotHandler = read(files.runOneBotHandler);
  const runAllBotsHandler = read(files.runAllBotsHandler);
  const preparerBlock = roleBlock(permissionMap, 'preparer');
  const reviewerBlock = roleBlock(permissionMap, 'reviewer');
  const approverBlock = roleBlock(permissionMap, 'approver');
  const auditorBlock = roleBlock(permissionMap, 'read_only_auditor');

  console.log('\nRBAC checks');

  check(has(preparerBlock, "'bots:run'"), 'Preparer can run one bot');
  check(!has(preparerBlock, "'bots:run_all'"), 'Preparer cannot run all bots');
  check(!has(preparerBlock, "'cases:status_update'"), 'Preparer cannot update case status');

  check(has(reviewerBlock, "'bots:run_all'"), 'Reviewer can run all bots');
  check(!has(reviewerBlock, "'cases:status_update'"), 'Reviewer cannot update case status');

  check(has(approverBlock, "'cases:status_update'"), 'Approver can update case status');
  check(!has(approverBlock, "'bots:run_all'"), 'Approver cannot run all bots');

  check(
    has(auditorBlock, "'cases:read'") &&
      has(auditorBlock, "'findings:read'") &&
      has(auditorBlock, "'alerts:read'") &&
      has(auditorBlock, "'audit:read'") &&
      has(auditorBlock, "'evidence_packs:read'"),
    'Read-only auditor has read-only surface'
  );
  check(!has(auditorBlock, "'cases:write'"), 'Read-only auditor cannot write cases');
  check(!has(auditorBlock, "'bots:run'"), 'Read-only auditor cannot run bots');

  check(has(runOneBotHandler, "requirePermission(ctx, 'bots:run');"), 'runOne handler enforces bots:run');
  check(
    has(runOneBotHandler, 'if (req.caseId) {') && has(runOneBotHandler, "requirePermission(ctx, 'cases:status_update');"),
    'runOne handler requires cases:status_update when caseId is supplied'
  );

  check(has(runAllBotsHandler, "requirePermission(ctx, 'bots:run_all');"), 'runAll handler enforces bots:run_all');
  check(has(runAllBotsHandler, "requirePermission(ctx, 'evidence_packs:read');"), 'runAll handler enforces evidence_packs:read');
  check(
    has(runAllBotsHandler, 'if (req.caseId) {') && has(runAllBotsHandler, "requirePermission(ctx, 'cases:status_update');"),
    'runAll handler requires cases:status_update when caseId is supplied'
  );
}

function runLifecycleChecks() {
  const workflowFlow = read(files.workflowFlow);
  const runOneBotHandler = read(files.runOneBotHandler);
  const runAllBotsHandler = read(files.runAllBotsHandler);
  const supabaseAdapter = read(files.supabaseAdapter);
  const s3Adapter = read(files.s3Adapter);
  const botPersistence = read(files.botPersistence);
  const botOrchestrator = read(files.botOrchestrator);

  console.log('\nCase lifecycle checks');

  check(has(supabaseAdapter, 'async createCase('), 'Case creation method exists');
  check(has(supabaseAdapter, ".from('cases')") && has(supabaseAdapter, 'organization_id: caseRecord.organizationId'), 'Case creation persists tenant ownership');
  check(has(supabaseAdapter, 'status: caseRecord.status'), 'Case creation persists initial status');

  check(has(s3Adapter, "'/api/evidence/upload-target'"), 'Evidence upload-target endpoint is used');
  check(has(s3Adapter, 'key: result.key') && has(s3Adapter, 'bucket: result.bucket'), 'Evidence upload returns S3 key and bucket');
  check(has(s3Adapter, 'etag: result.etag') && has(s3Adapter, 'versionId: result.versionId'), 'Evidence upload returns S3 version and ETag metadata');

  check(has(supabaseAdapter, 's3_bucket: item.s3Bucket || null'), 'Bot evidence persistence stores s3_bucket');
  check(has(supabaseAdapter, 's3_key: item.s3Key || null'), 'Bot evidence persistence stores s3_key');
  check(has(supabaseAdapter, 's3_version_id: item.s3VersionId || null'), 'Bot evidence persistence stores s3_version_id');
  check(has(supabaseAdapter, 's3_etag: item.s3Etag || null'), 'Bot evidence persistence stores s3_etag');

  check(has(workflowFlow, "pending: ['running', 'failed']"), 'Workflow allows pending -> running');
  check(has(workflowFlow, "running: ['completed', 'failed', 'escalated']"), 'Workflow allows running terminal transitions');
  check(
    hasRegex(runOneBotHandler, /transition:\s*\{\s*from:\s*'pending',\s*to:\s*'running'/m),
    'runOne records pending -> running transition'
  );
  check(
    hasRegex(runAllBotsHandler, /transition:\s*\{\s*from:\s*'pending',\s*to:\s*'running'/m),
    'runAll records pending -> running transition'
  );

  check(has(botOrchestrator, "status: 'running'"), 'Bot orchestrator creates runs in running state');
  check(has(botOrchestrator, 'await botPersistenceRepository.persistResult('), 'Bot orchestrator persists bot results');
  check(has(botOrchestrator, 'await this.buildEvidencePackIfPossible(context, output);'), 'Bot orchestrator attempts evidence pack build after runMany');

  check(has(botPersistence, 'caseStatusWriteGuards') && has(botPersistence, 'idempotencyKey'), 'Case status writes are idempotency-guarded');
  check(has(botPersistence, 'await this.appendCaseStatusHistory({') && has(botPersistence, "toStatus: 'escalated'"), 'Escalation path appends escalated case history');
  check(has(runAllBotsHandler, 'const overallDecision = deriveOverallDecision(counters);'), 'runAll derives overall decision from run results');
  check(has(runAllBotsHandler, 'await botPersistenceRepository.updateCaseAfterAssessment('), 'runAll updates case after full assessment');
}

function main() {
  console.log('RBAC and case lifecycle validation');
  console.log(`Repository: ${repoRoot}`);

  runRbacChecks();
  runLifecycleChecks();

  console.log('\nSummary');
  console.log(`PASS ${passes}`);
  console.log(`FAIL ${failures}`);

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main();
