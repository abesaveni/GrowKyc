import { sharedBotRegistry } from './BotRegistry';
import { botPersistenceRepository } from './BotPersistence';
import { botAuditService } from './BotAuditService';
import { evidencePackBuilder } from './EvidencePackBuilder';
import {
  BotRunContext,
  BotRunRecord,
  ComplianceBot,
  PersistedBotResult,
} from './BotTypes';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface OrchestratedRunResult {
  run: BotRunRecord;
  result?: PersistedBotResult;
  error?: string;
}

export class BotOrchestrator {
  async runOne(botId: string, context: BotRunContext): Promise<OrchestratedRunResult> {
    const bot = sharedBotRegistry.get(botId);
    if (!bot || !bot.enabled) {
      return {
        run: this.buildErroredRun(botId, context, 'Bot not found or disabled'),
        error: 'Bot not found or disabled',
      };
    }

    return this.executeBot(bot, context);
  }

  async runMany(botIds: string[], context: BotRunContext): Promise<OrchestratedRunResult[]> {
    const output: OrchestratedRunResult[] = [];

    for (const botId of botIds) {
      output.push(await this.runOne(botId, { ...context, trigger: context.trigger || 'orchestration' }));
    }

    await this.buildEvidencePackIfPossible(context, output);
    return output;
  }

  async runAll(context: BotRunContext): Promise<OrchestratedRunResult[]> {
    const enabledBotIds = sharedBotRegistry.listEnabled().map((bot) => bot.id);
    return this.runMany(enabledBotIds, { ...context, trigger: context.trigger || 'manual' });
  }

  private buildErroredRun(botId: string, context: BotRunContext, message: string): BotRunRecord {
    const now = new Date().toISOString();
    return {
      id: createId('bot-run'),
      clientId: context.clientId,
      clientName: context.clientName,
      organizationId: context.organizationId,
      botId,
      botVersion: 'unknown',
      provider: 'unknown',
      status: 'error',
      trigger: context.trigger || 'manual',
      startedAt: now,
      completedAt: now,
      durationMs: 0,
      errorMessage: message,
    };
  }

  private async executeBot(bot: ComplianceBot, context: BotRunContext): Promise<OrchestratedRunResult> {
    const startedAt = Date.now();
    const run: BotRunRecord = {
      id: createId('bot-run'),
      clientId: context.clientId,
      clientName: context.clientName,
      caseId: context.caseId,
      organizationId: context.organizationId,
      botId: bot.id,
      botVersion: bot.version,
      provider: bot.provider,
      status: 'running',
      trigger: context.trigger || 'manual',
      startedAt: new Date(startedAt).toISOString(),
    };

    await botPersistenceRepository.createRun(run);
    await botAuditService.logEvent({
      organizationId: context.organizationId,
      actorUserId: context.actorUserId,
      eventType: 'BOT_RUN_STARTED',
      targetType: 'bot_run',
      targetId: run.id,
      data: {
        botId: bot.id,
        clientId: context.clientId,
        clientName: context.clientName,
      },
    });

    try {
      const executionResult = await bot.run(context);
      const completedAt = Date.now();
      const durationMs = completedAt - startedAt;

      const runStatus = executionResult.status;
      const completedRun = await botPersistenceRepository.completeRun(run.id, {
        status: runStatus,
        completedAt: new Date(completedAt).toISOString(),
        durationMs,
      });

      const persistedResult = await botPersistenceRepository.persistResult(run.id, bot.id, executionResult, {
        organizationId: context.organizationId,
        caseId: context.caseId,
      });

      await botAuditService.logEvent({
        organizationId: context.organizationId,
        actorUserId: context.actorUserId,
        eventType: 'BOT_RUN_COMPLETED',
        targetType: 'bot_run',
        targetId: run.id,
        severity: runStatus === 'failed' ? 'warning' : 'info',
        data: {
          botId: bot.id,
          status: runStatus,
          score: executionResult.score,
          evidenceCount: executionResult.evidence.length,
          durationMs,
        },
      });

      return {
        run: completedRun || {
          ...run,
          status: runStatus,
          completedAt: new Date(completedAt).toISOString(),
          durationMs,
        },
        result: persistedResult,
      };
    } catch (error) {
      const completedAt = Date.now();
      const durationMs = completedAt - startedAt;
      const errorMessage = error instanceof Error ? error.message : 'Unexpected bot error';

      const erroredRun = await botPersistenceRepository.completeRun(run.id, {
        status: 'error',
        completedAt: new Date(completedAt).toISOString(),
        durationMs,
        errorMessage,
      });

      await botAuditService.logEvent({
        organizationId: context.organizationId,
        actorUserId: context.actorUserId,
        eventType: 'BOT_RUN_FAILED',
        targetType: 'bot_run',
        targetId: run.id,
        severity: 'error',
        data: {
          botId: bot.id,
          errorMessage,
          durationMs,
        },
      });

      return {
        run: erroredRun || {
          ...run,
          status: 'error',
          completedAt: new Date(completedAt).toISOString(),
          durationMs,
          errorMessage,
        },
        error: errorMessage,
      };
    }
  }

  private async buildEvidencePackIfPossible(
    context: BotRunContext,
    runs: OrchestratedRunResult[]
  ): Promise<void> {
    const runResults = runs.filter((r): r is { run: BotRunRecord; result: PersistedBotResult } => {
      return Boolean(r.result);
    });

    if (runResults.length === 0) {
      return;
    }

    const pack = await evidencePackBuilder.buildAndPersist({
      organizationId: context.organizationId,
      clientId: context.clientId,
      clientName: context.clientName,
      caseId: context.caseId,
      runResults,
    });

    await botAuditService.logEvent({
      organizationId: context.organizationId,
      actorUserId: context.actorUserId,
      eventType: 'EVIDENCE_PACK_BUILT',
      targetType: 'evidence_pack',
      targetId: pack.id,
      data: {
        runCount: runResults.length,
        itemCount: pack.items.length,
        summary: pack.summary,
      },
    });
  }
}

export const botOrchestrator = new BotOrchestrator();
