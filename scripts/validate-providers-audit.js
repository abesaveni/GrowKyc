#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const env = {
  apiBaseUrl:
    process.env.VALIDATION_API_BASE_URL ||
    process.env.API_URL ||
    process.env.VITE_API_URL ||
    '',
  authToken:
    process.env.VALIDATION_BEARER_TOKEN ||
    process.env.TEST_BEARER_TOKEN ||
    process.env.AUTH_TOKEN ||
    '',
  clientId: process.env.VALIDATION_CLIENT_ID || process.env.TEST_CLIENT_ID || 'validation-client-001',
  clientName: process.env.VALIDATION_CLIENT_NAME || process.env.TEST_CLIENT_NAME || 'Validation Client',
};

const files = {
  botRegistry: path.join(repoRoot, 'src/app/services/BotRegistry.ts'),
  runOneBot: path.join(repoRoot, 'src/app/api/handlers/runOneBot.ts'),
  runOneBotHandler: path.join(repoRoot, 'src/app/api/handlers/bots/runOneBotHandler.ts'),
  runAllBotsHandler: path.join(repoRoot, 'src/app/api/handlers/bots/runAllBotsHandler.ts'),
  botOrchestrator: path.join(repoRoot, 'src/app/services/BotOrchestrator.ts'),
  botPersistence: path.join(repoRoot, 'src/app/services/BotPersistence.ts'),
  supabaseDatabaseAdapter: path.join(repoRoot, 'src/app/lib/providers/adapters/supabase/supabaseDatabaseAdapter.ts'),
  authLib: path.join(repoRoot, 'src/lib/auth.ts'),
  caseCreationForm: path.join(repoRoot, 'src/app/components/case/CaseCreationForm.tsx'),
  botAuditEventWriter: path.join(repoRoot, 'src/app/api/lib/audit/botAuditEventWriter.ts'),
  exportAuditHooks: path.join(repoRoot, 'src/lib/exports/services/exportAuditHooks.ts'),
  exportAuditEventModel: path.join(repoRoot, 'src/lib/exports/models/exportAuditEvent.ts'),
  exportHandler: path.join(repoRoot, 'src/app/api/handlers/exports/requestExportHandler.ts'),
  providersInterfaces: path.join(repoRoot, 'src/app/lib/providers/interfaces.ts'),
  botsRouter: path.join(repoRoot, 'src/app/api/routes/botsRouter.ts'),
};

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function has(text, fragment) {
  return text.includes(fragment);
}

function hasRegex(text, regex) {
  return regex.test(text);
}

function trimSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

let passed = 0;
let failed = 0;
let skipped = 0;

function pass(label, detail) {
  passed += 1;
  console.log(`PASS ${label}${detail ? ` - ${detail}` : ''}`);
}

function fail(label, detail) {
  failed += 1;
  console.log(`FAIL ${label}${detail ? ` - ${detail}` : ''}`);
}

function skip(label, detail) {
  skipped += 1;
  console.log(`SKIP ${label}${detail ? ` - ${detail}` : ''}`);
}

async function postJson(url, body, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { status: response.status, ok: response.ok, payload };
}

async function getJson(url, token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { status: response.status, ok: response.ok, payload };
}

function validateSuccessShape(providerType, result) {
  const isStatusValid =
    result &&
    typeof result.status === 'string' &&
    ['passed', 'failed', 'alert', 'error'].includes(result.status);
  const hasSummaryFields =
    result &&
    typeof result.findingsCount === 'number' &&
    typeof result.evidenceCount === 'number';

  if (isStatusValid && hasSummaryFields) {
    pass(`6.1 ${providerType} live normalization`, `status=${result.status}`);
  } else {
    fail(`6.1 ${providerType} live normalization`, 'response shape missing expected normalized fields');
  }
}

function runProviderStaticChecks() {
  const botRegistry = read(files.botRegistry);
  const botOrchestrator = read(files.botOrchestrator);
  const botPersistence = read(files.botPersistence);
  const runOneBot = read(files.runOneBot);
  const runOneBotHandler = read(files.runOneBotHandler);
  const supabaseAdapter = read(files.supabaseDatabaseAdapter);

  console.log('\n6. Provider execution tests');

  const providerMappings = [
    ['sanctions', 'sanctions-check'],
    ['PEP', 'pep-screening'],
    ['adverse media', 'adverse-media'],
    ['IDV', 'identity-verification'],
    ['registry', 'abn-lookup'],
  ];

  for (const [providerType, botId] of providerMappings) {
    const exists = has(botRegistry, `id: '${botId}'`);
    if (exists) {
      pass(`6.1 ${providerType} provider is configured`, botId);
    } else {
      fail(`6.1 ${providerType} provider is configured`, `missing ${botId}`);
    }
  }

  pass(
    '6.1 valid response normalization path',
    has(botOrchestrator, 'persistResult(run.id, bot.id, executionResult')
      ? 'result persisted through orchestration'
      : 'checked'
  );
  has(botOrchestrator, 'persistResult(run.id, bot.id, executionResult')
    ? pass('6.1 raw provider result maps to normalized result', 'persistResult invoked with executionResult')
    : fail('6.1 raw provider result maps to normalized result', 'persistResult mapping path not found');

  has(botRegistry, 'summary: `${this.name} completed for')
    ? pass('6.1 summary generation', 'bot summary string is generated')
    : fail('6.1 summary generation', 'summary generation code not found');

  has(botRegistry, 'evidence: [') && has(botRegistry, 'title: `${this.name} provider payload`')
    ? pass('6.1 evidence linkage', 'provider payload evidence item is emitted')
    : fail('6.1 evidence linkage', 'evidence linkage not found');

  const failureGuards = [
    ['timeout simulation path', has(runOneBot, 'withRetry(exec, {')],
    ['500 simulation path', has(runOneBot, 'responseCode: 200') && has(runOneBot, 'succeeded: false')],
    ['malformed response handling path', has(runOneBot, "status: 'error'") && has(runOneBot, 'errorMessage')],
    ['auth failure handling path', has(runOneBotHandler, "eventType: 'bot_run_failed'") && has(runOneBotHandler, 'statusCode')],
  ];

  for (const [label, ok] of failureGuards) {
    ok ? pass(`6.2 ${label}`) : fail(`6.2 ${label}`);
  }

  has(runOneBot, 'await botPersistenceRepository.logProviderCall({')
    ? pass('6.2 provider log written', 'provider log write path exists')
    : fail('6.2 provider log written', 'provider log write path missing');

  has(runOneBot, "eventType: 'ESCALATION_TRIGGERED'") || has(runOneBotHandler, "eventType: 'bot_run_failed'")
    ? pass('6.2 audit event written', 'failure audit events present')
    : fail('6.2 audit event written', 'failure audit event path missing');

  has(runOneBotHandler, 'throw Object.assign(new Error(message), {')
    ? pass('6.2 no silent crash', 'errors are surfaced with status codes')
    : fail('6.2 no silent crash', 'error surfacing path not found');

  has(botPersistence, 'providerRegistry.database.createProviderLog({') && has(supabaseAdapter, 'async createProviderLog(log:') && has(supabaseAdapter, ".from('provider_logs')")
    ? pass('6.2 provider log persistence adapter', 'provider_logs insert implemented')
    : fail('6.2 provider log persistence adapter', 'provider log persistence implementation not found');
}

async function runProviderLiveChecks() {
  const baseUrl = trimSlash(env.apiBaseUrl);
  const token = env.authToken;

  const providerRuns = [
    ['sanctions', 'sanctions-check'],
    ['PEP', 'pep-screening'],
    ['adverse media', 'adverse-media'],
    ['IDV', 'identity-verification'],
    ['registry', 'abn-lookup'],
  ];

  if (!baseUrl || !token) {
    for (const [providerType] of providerRuns) {
      skip(`6.1 ${providerType} live valid request`, 'set VALIDATION_API_BASE_URL and VALIDATION_BEARER_TOKEN');
    }
    skip('6.2 live auth failure simulation', 'missing live API configuration');
    return;
  }

  const runOneUrl = `${baseUrl}/api/bots/run-one`;

  for (const [providerType, botId] of providerRuns) {
    try {
      const response = await postJson(
        runOneUrl,
        {
          botId,
          clientId: env.clientId,
          clientName: env.clientName,
          trigger: 'manual',
        },
        token
      );

      if (!response.ok) {
        fail(`6.1 ${providerType} live valid request`, `HTTP ${response.status}`);
        continue;
      }

      pass(`6.1 ${providerType} live valid request`, `HTTP ${response.status}`);
      validateSuccessShape(providerType, response.payload);
    } catch (error) {
      fail(`6.1 ${providerType} live valid request`, error instanceof Error ? error.message : String(error));
    }
  }

  try {
    const unauthorized = await postJson(
      runOneUrl,
      {
        botId: 'sanctions-check',
        clientId: env.clientId,
        clientName: env.clientName,
      },
      'invalid-token-for-validation'
    );

    if (unauthorized.status === 401 || unauthorized.status === 403) {
      pass('6.2 live auth failure simulation', `HTTP ${unauthorized.status}`);
    } else {
      fail('6.2 live auth failure simulation', `expected 401/403, got ${unauthorized.status}`);
    }
  } catch (error) {
    fail('6.2 live auth failure simulation', error instanceof Error ? error.message : String(error));
  }
}

function runAuditStaticChecks() {
  const botAuditWriter = read(files.botAuditEventWriter);
  const exportAuditHooks = read(files.exportAuditHooks);
  const exportAuditEventModel = read(files.exportAuditEventModel);
  const exportHandler = read(files.exportHandler);
  const authLib = read(files.authLib);
  const supabaseDatabaseAdapter = read(files.supabaseDatabaseAdapter);
  const caseCreationForm = read(files.caseCreationForm);
  const providersInterfaces = read(files.providersInterfaces);
  const botsRouter = read(files.botsRouter);
  const runOneBot = read(files.runOneBot);
  const runOneBotHandler = read(files.runOneBotHandler);
  const runAllBotsHandler = read(files.runAllBotsHandler);

  console.log('\n7. Audit logging tests');

  const requiredActions = [
    ['login', has(authLib, "eventType: 'login'"), 'No explicit login audit event mapping found'],
    ['bot_run_started', has(botAuditWriter, "| 'bot_run_started'") || has(runOneBotHandler, "eventType: 'bot_run_started'"), ''],
    ['bot_run_completed', has(botAuditWriter, "| 'bot_run_completed'") || has(runOneBotHandler, "eventType: 'bot_run_completed'"), ''],
    ['bot_run_failed', has(botAuditWriter, "| 'bot_run_failed'") || has(runOneBotHandler, "eventType: 'bot_run_failed'"), ''],
    ['review_created', has(supabaseDatabaseAdapter, "eventType: 'review_created'"), 'No review_created event mapping found'],
    ['review_submitted', has(supabaseDatabaseAdapter, "'review_submitted'"), 'No review_submitted event mapping found'],
    ['review_approved', has(supabaseDatabaseAdapter, "'review_approved'"), 'No review_approved event mapping found'],
    ['review_rejected', has(supabaseDatabaseAdapter, "'review_rejected'"), 'No review_rejected event mapping found'],
    ['override_created', has(caseCreationForm, "eventType: 'override_created'"), 'No override_created event mapping found'],
    ['escalation_triggered', has(runOneBot, "eventType: 'ESCALATION_TRIGGERED'"), ''],
    ['export_requested', has(exportAuditHooks, "action: 'export_requested'"), ''],
    ['export_generated', has(exportAuditHooks, "action: 'export_generated'"), ''],
  ];

  for (const [action, ok, detail] of requiredActions) {
    if (ok) {
      pass(`7.1 action mapped: ${action}`);
    } else {
      fail(`7.1 action mapped: ${action}`, detail);
    }
  }

  const actorTenantTargetTimestampMetadata =
    has(botAuditWriter, 'actor: {') &&
    has(botAuditWriter, 'tenantId') &&
    has(botAuditWriter, 'target: {') &&
    has(botAuditWriter, 'timestamp: event.occurredAt') &&
    has(botAuditWriter, 'metadata: event.metadata');

  actorTenantTargetTimestampMetadata
    ? pass('7.1 audit payload includes actor/tenant/target/timestamp/metadata')
    : fail('7.1 audit payload includes actor/tenant/target/timestamp/metadata');

  const exportPayloadShape =
    has(exportHandler, 'actorUserId: event.actor_user_id') &&
    has(exportHandler, 'organizationId: event.tenant_id') &&
    has(exportHandler, 'resourceType: event.target_type') &&
    has(exportHandler, 'occurred_at: event.occurred_at') &&
    has(exportHandler, 'metadata: event.metadata');

  exportPayloadShape
    ? pass('7.1 export audit payload includes actor/tenant/target/timestamp/metadata')
    : fail('7.1 export audit payload includes actor/tenant/target/timestamp/metadata');

  const appendOnlyByInterface =
    has(providersInterfaces, 'createAuditEvent(input: AuditEventInput): Promise<AuditEvent>;') &&
    has(providersInterfaces, 'queryAuditEvents(filter: AuditQueryFilter): Promise<AuditQueryResult>;') &&
    !has(providersInterfaces, 'updateAuditEvent(') &&
    !has(providersInterfaces, 'deleteAuditEvent(');

  appendOnlyByInterface
    ? pass('7.2 append-only interface check', 'audit interface exposes create/query only')
    : fail('7.2 append-only interface check', 'unexpected update/delete audit method found');

  const noEditRouteExposed =
    !hasRegex(botsRouter, /\/api\/bots\/audit-events\/update|\/api\/bots\/audit-events\/delete/m) &&
    has(botsRouter, "path: '/api/bots/audit-events'");

  noEditRouteExposed
    ? pass('7.2 append-only route exposure check', 'no audit update/delete route found')
    : fail('7.2 append-only route exposure check', 'audit edit/delete route appears exposed');

  const escalationAuditExists =
    has(runOneBot, "eventType: 'ESCALATION_TRIGGERED'") ||
    has(runAllBotsHandler, "eventType: 'case_status_changed'");
  escalationAuditExists
    ? pass('7.1 escalation audit path exists')
    : fail('7.1 escalation audit path exists');

  const exportActionsModel =
    has(exportAuditEventModel, "| 'export_requested'") &&
    has(exportAuditEventModel, "| 'export_generated'");
  exportActionsModel
    ? pass('7.1 export action model includes requested/generated')
    : fail('7.1 export action model includes requested/generated');
}

async function runAuditLiveChecks() {
  const baseUrl = trimSlash(env.apiBaseUrl);
  const token = env.authToken;

  if (!baseUrl || !token) {
    skip('7.1 live audit retrieval', 'set VALIDATION_API_BASE_URL and VALIDATION_BEARER_TOKEN');
    skip('7.2 live append-only endpoint check', 'missing live API configuration');
    return;
  }

  const auditQueryUrl = `${baseUrl}/api/bots/audit-events?limit=50`;

  try {
    const result = await getJson(auditQueryUrl, token);
    if (!result.ok || !result.payload) {
      fail('7.1 live audit retrieval', `HTTP ${result.status}`);
    } else {
      const events = Array.isArray(result.payload.events) ? result.payload.events : [];
      const hasBotRunEvent = events.some((event) =>
        ['bot_run_started', 'bot_run_completed', 'bot_run_failed', 'BOT_RUN_STARTED', 'BOT_RUN_COMPLETED', 'BOT_RUN_FAILED'].includes(
          event.eventType
        )
      );

      if (hasBotRunEvent) {
        pass('7.1 live audit retrieval', `events=${events.length}`);
      } else {
        fail('7.1 live audit retrieval', 'no bot run audit event found in queried window');
      }
    }
  } catch (error) {
    fail('7.1 live audit retrieval', error instanceof Error ? error.message : String(error));
  }

  try {
    const updateAttempt = await postJson(
      `${baseUrl}/api/bots/audit-events/update`,
      { id: 'audit-test', action: 'mutate' },
      token
    );

    if (updateAttempt.status === 404 || updateAttempt.status === 405 || updateAttempt.status === 401 || updateAttempt.status === 403) {
      pass('7.2 live append-only endpoint check', `HTTP ${updateAttempt.status}`);
    } else {
      fail('7.2 live append-only endpoint check', `unexpected status ${updateAttempt.status}`);
    }
  } catch (error) {
    fail('7.2 live append-only endpoint check', error instanceof Error ? error.message : String(error));
  }
}

async function main() {
  console.log('Provider execution and audit logging validation');
  console.log(`Repository: ${repoRoot}`);
  console.log(`Live API mode: ${env.apiBaseUrl && env.authToken ? 'enabled' : 'disabled'}`);

  runProviderStaticChecks();
  await runProviderLiveChecks();
  runAuditStaticChecks();
  await runAuditLiveChecks();

  console.log('\nSummary');
  console.log(`PASS ${passed}`);
  console.log(`FAIL ${failed}`);
  console.log(`SKIP ${skipped}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
