/**
 * runOneBot.ts — POST /api/bots/run
 *
 * Runs a single compliance bot for a given client/case.
 * Enforces tenant isolation from the JWT, retries on transient
 * provider failures, and escalates the case if all retries exhaust.
 *
 * All material actions write audit events.
 */

import { TenantContext } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { botPersistenceRepository } from '../../services/BotPersistence';
import { botAuditService } from '../../services/BotAuditService';
import { sharedBotRegistry } from '../../services/BotRegistry';
import { BotRunContext, BotRunRecord, PersistedBotResult } from '../../services/BotTypes';
import { withRetry } from '../lib/retry';
import { resolveTenantPrincipal } from '../lib/auth/tenantIsolation';
import { tenantSafeDatabaseService } from '../lib/database/tenantSafeServices';
import type { ComplianceBot } from '../../services/BotTypes';

// ── Request / response types ─────────────────────────────────────────────────

export interface RunOneBotRequest {
  botId: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  trigger?: BotRunContext['trigger'];
}

export interface RunOneBotResponse {
  runId: string;
  botId: string;
  status: BotRunRecord['status'];
  score?: number;
  decision?: string;
  findingsCount: number;
  evidenceCount: number;
  durationMs?: number;
  retryCount: number;
  error?: string;
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function handleRunOneBot(
  body: RunOneBotRequest,
  ctx: TenantContext
): Promise<RunOneBotResponse> {
  requirePermission(ctx, 'bots:run');
  const tenant = resolveTenantPrincipal(ctx);
  tenantSafeDatabaseService.assertExecutionScopeGuards(tenant.tenantId, tenant.tenantId);

  const { botId, clientId, clientName, caseId, trigger = 'manual' } = body;

  if (caseId) {
    requirePermission(ctx, 'cases:status_update');
  }

  if (!botId || !clientId) {
    throw Object.assign(new Error('botId and clientId are required'), { statusCode: 400 });
  }

  const bot = sharedBotRegistry.get(botId);
  if (!bot || !bot.enabled) {
    throw Object.assign(new Error(`Bot '${botId}' not found or disabled`), { statusCode: 404 });
  }

  if (caseId) {
    await tenantSafeDatabaseService.assertCaseOwnership(tenant.tenantId, caseId);
  }

  const runContext: BotRunContext = {
    clientId,
    clientName,
    organizationId: ctx.organizationId,
    actorUserId: ctx.userId,
    trigger,
  };

  await botAuditService.logEvent({
    organizationId: ctx.organizationId,
    actorUserId: ctx.userId,
    eventType: 'CASE_BOT_RUN_TRIGGERED',
    targetType: 'bot_run',
    severity: 'info',
    data: { botId, clientId, caseId, trigger },
  });

  const { result, retryCount } = await runBotWithRetry(bot, runContext, ctx, caseId);

  return {
    runId: result.runId,
    botId: result.botId,
    status: result.rawResult.status === 'passed'
      ? 'passed'
      : result.rawResult.status === 'failed'
      ? 'failed'
      : 'alert',
    score: result.score,
    decision: result.rawResult.status,
    findingsCount: result.rawResult.findings?.length ?? 0,
    evidenceCount: result.rawResult.evidence?.length ?? 0,
    retryCount,
  };
}

// ── Retry wrapper ────────────────────────────────────────────────────────────

async function runBotWithRetry(
  bot: ComplianceBot,
  runContext: BotRunContext,
  ctx: TenantContext,
  caseId?: string
): Promise<{ result: PersistedBotResult; retryCount: number }> {
  let retryCount = 0;
  const maxRetries = 3;
  const baseBackoffMs = 500;

  const exec = async (): Promise<PersistedBotResult> => {
    const startedAt = Date.now();
    const runId = `bot-run-${Math.random().toString(36).slice(2, 10)}`;

    const run: BotRunRecord = {
      id: runId,
      clientId: runContext.clientId,
      clientName: runContext.clientName,
      organizationId: runContext.organizationId,
      botId: bot.id,
      botVersion: bot.version,
      provider: bot.provider,
      status: 'running',
      trigger: runContext.trigger ?? 'manual',
      startedAt: new Date(startedAt).toISOString(),
      ...(caseId ? { caseId } : {}),
    } as BotRunRecord & { caseId?: string };

    await botPersistenceRepository.createRun(run);

    try {
      const providerCallStart = Date.now();
      const executionResult = await bot.run(runContext);
      const durationMs = Date.now() - providerCallStart;

      await botPersistenceRepository.logProviderCall({
        organizationId: ctx.organizationId,
        runId,
        caseId,
        botId: bot.id,
        providerName: bot.provider,
        durationMs,
        retryCount,
        responseCode: 200,
        succeeded: true,
      });

      const persisted = await botPersistenceRepository.persistResult(runId, bot.id, executionResult);

      await botPersistenceRepository.completeRun(runId, {
        status: executionResult.status,
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
      });

      return persisted;
    } catch (err) {
      const durationMs = Date.now() - startedAt;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      await botPersistenceRepository.logProviderCall({
        organizationId: ctx.organizationId,
        runId,
        caseId,
        botId: bot.id,
        providerName: bot.provider,
        durationMs,
        retryCount,
        succeeded: false,
        errorMessage,
      });

      await botPersistenceRepository.completeRun(runId, {
        status: 'error',
        completedAt: new Date().toISOString(),
        durationMs,
        errorMessage,
      });

      throw err;
    }
  };

  const result = await withRetry(exec, {
    maxRetries,
    baseBackoffMs,
    onRetry: (attempt, err) => {
      retryCount = attempt;
      void botAuditService.logEvent({
        organizationId: ctx.organizationId,
        actorUserId: ctx.userId,
        eventType: 'BOT_RUN_RETRY',
        targetType: 'bot_run',
        severity: 'warning',
        data: {
          botId: bot.id,
          caseId,
          attempt,
          error: err instanceof Error ? err.message : String(err),
        },
      });
    },
    onExhausted: async (err) => {
      await botAuditService.logEvent({
        organizationId: ctx.organizationId,
        actorUserId: ctx.userId,
        eventType: 'ESCALATION_TRIGGERED',
        targetType: 'case',
        targetId: caseId,
        severity: 'error',
        data: {
          botId: bot.id,
          caseId,
          maxRetries,
          finalError: err instanceof Error ? err.message : String(err),
        },
      });

      if (caseId) {
        await botPersistenceRepository.escalateCase(caseId, ctx.organizationId, {
          reason: `Bot '${bot.id}' failed after ${maxRetries} retries`,
          changedByUserId: ctx.userId,
        });
      }
    },
  });

  return { result, retryCount };
}
