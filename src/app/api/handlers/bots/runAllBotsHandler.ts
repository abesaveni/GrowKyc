import { TenantContext } from '../../middleware/auth';
import { requirePermission } from '../../middleware/rbac';
import { botOrchestrator } from '../../../services/BotOrchestrator';
import { botPersistenceRepository } from '../../../services/BotPersistence';
import { BotRunContext, BotRunStatus, FindingDecision } from '../../../services/BotTypes';
import {
  botAuditEventWriter,
  buildBotAuditEvent,
} from '../../lib/audit/botAuditEventWriter';
import {
  WorkflowStatus,
  mapWorkflowStatusToCaseStatus,
  toCaseStatusHistoryPatch,
} from '../../lib/workflow/statusTransitionFlow';
import { resolveTenantPrincipal } from '../../lib/auth/tenantIsolation';
import { tenantSafeDatabaseService } from '../../lib/database/tenantSafeServices';

type RunAllBotsTrigger = BotRunContext['trigger'];

export interface RunAllBotsRequest {
  clientId: string;
  clientName: string;
  caseId?: string;
  trigger?: RunAllBotsTrigger;
}

export interface RunAllBotsRunSummary {
  runId: string;
  botId: string;
  status: BotRunStatus;
  score?: number;
  error?: string;
}

export interface RunAllBotsResponse {
  success: boolean;
  clientId: string;
  caseId?: string;
  totalBots: number;
  passed: number;
  failed: number;
  alerts: number;
  errors: number;
  runs: RunAllBotsRunSummary[];
}

class RunAllBotsValidationError extends Error {
  readonly statusCode = 400;
}

function assertRunAllBotsRequest(req: RunAllBotsRequest): void {
  if (!req.clientId?.trim()) {
    throw new RunAllBotsValidationError('clientId is required');
  }

  if (!req.clientName?.trim()) {
    throw new RunAllBotsValidationError('clientName is required');
  }
}

function buildRunContext(req: RunAllBotsRequest, ctx: TenantContext): BotRunContext {
  return {
    clientId: req.clientId,
    clientName: req.clientName,
    caseId: req.caseId,
    organizationId: ctx.organizationId,
    actorUserId: ctx.userId,
    trigger: req.trigger ?? 'manual',
  };
}

function deriveOverallDecision(counters: {
  passed: number;
  failed: number;
  alerts: number;
  errors: number;
}): FindingDecision {
  if (counters.failed > 0) {
    return 'fail';
  }

  if (counters.alerts > 0 || counters.errors > 0) {
    return 'manual_review';
  }

  return 'pass';
}

function deriveTerminalWorkflowStatus(counters: {
  passed: number;
  failed: number;
  alerts: number;
  errors: number;
}): WorkflowStatus {
  if (counters.errors > 0 || counters.failed > 0) {
    return 'escalated';
  }

  if (counters.alerts > 0) {
    return 'failed';
  }

  return 'completed';
}

export async function runAllBotsHandler(
  req: RunAllBotsRequest,
  ctx: TenantContext
): Promise<RunAllBotsResponse> {
  requirePermission(ctx, 'bots:run_all');
  requirePermission(ctx, 'evidence_packs:read');
  if (req.caseId) {
    requirePermission(ctx, 'cases:status_update');
  }
  assertRunAllBotsRequest(req);
  const tenant = resolveTenantPrincipal(ctx);
  tenantSafeDatabaseService.assertExecutionScopeGuards(tenant.tenantId, tenant.tenantId);

  if (req.caseId) {
    await tenantSafeDatabaseService.assertCaseOwnership(tenant.tenantId, req.caseId);
  }

  try {
    if (req.caseId) {
      await tenantSafeDatabaseService.appendCaseStatusHistoryForTenant(
        tenant.tenantId,
        toCaseStatusHistoryPatch({
          caseId: req.caseId,
          organizationId: tenant.tenantId,
          changedByUserId: ctx.userId,
          scope: 'run_all',
          transition: {
            from: 'pending',
            to: 'running',
          },
        })
      );
    }

    await botAuditEventWriter.write(
      buildBotAuditEvent({
        eventType: 'bot_run_started',
        ctx,
        target: {
          objectType: 'bot_orchestration',
          objectId: req.caseId ?? req.clientId,
        },
        metadata: {
          client_id: req.clientId,
          client_name: req.clientName,
          case_id: req.caseId,
          trigger: req.trigger ?? 'manual',
          mode: 'run_all',
        },
      })
    );

    const results = await botOrchestrator.runAll(buildRunContext(req, ctx));

    const runs: RunAllBotsRunSummary[] = results.map((result) => ({
      runId: result.run.id,
      botId: result.run.botId,
      status: result.run.status,
      score: result.result?.score,
      error: result.error,
    }));

    const counters = runs.reduce(
      (acc, run) => {
        if (run.error || run.status === 'error') {
          acc.errors += 1;
          return acc;
        }

        if (run.status === 'passed') {
          acc.passed += 1;
          return acc;
        }

        if (run.status === 'failed') {
          acc.failed += 1;
          return acc;
        }

        if (run.status === 'alert') {
          acc.alerts += 1;
          return acc;
        }

        acc.errors += 1;
        return acc;
      },
      { passed: 0, failed: 0, alerts: 0, errors: 0 }
    );
    const terminalWorkflowStatus = deriveTerminalWorkflowStatus(counters);

    if (req.caseId) {
      await tenantSafeDatabaseService.appendCaseStatusHistoryForTenant(
        tenant.tenantId,
        toCaseStatusHistoryPatch({
          caseId: req.caseId,
          organizationId: tenant.tenantId,
          changedByUserId: ctx.userId,
          scope: 'run_all',
          transition: {
            from: 'running',
            to: terminalWorkflowStatus,
          },
        })
      );
    }

    for (const run of runs) {
      if (run.error || run.status === 'error') {
        await botAuditEventWriter.write(
          buildBotAuditEvent({
            eventType: 'bot_run_failed',
            ctx,
            target: {
              objectType: 'bot_run',
              objectId: run.runId,
            },
            metadata: {
              client_id: req.clientId,
              case_id: req.caseId,
              bot_id: run.botId,
              status: run.status,
              error: run.error,
            },
          })
        );

        continue;
      }

      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'bot_run_completed',
          ctx,
          target: {
            objectType: 'bot_run',
            objectId: run.runId,
          },
          metadata: {
            client_id: req.clientId,
            case_id: req.caseId,
            bot_id: run.botId,
            status: run.status,
            score: run.score,
          },
        })
      );
    }

    const evidenceItemsCount = results.reduce(
      (sum, result) => sum + (result.result?.rawResult.evidence.length ?? 0),
      0
    );

    if (evidenceItemsCount > 0) {
      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'evidence_pack_created',
          ctx,
          target: {
            objectType: 'evidence_pack',
            objectId: req.caseId ?? req.clientId,
          },
          metadata: {
            client_id: req.clientId,
            case_id: req.caseId,
            run_ids: runs.map((run) => run.runId),
            item_count: evidenceItemsCount,
          },
        })
      );
    }

    if (req.caseId) {
      const overallDecision = deriveOverallDecision(counters);
      const toStatus = mapWorkflowStatusToCaseStatus(terminalWorkflowStatus);
      const scoredRuns = runs.filter((run) => typeof run.score === 'number');
      const riskScore =
        scoredRuns.length > 0
          ? Number(
              (
                scoredRuns.reduce((sum, run) => sum + (run.score ?? 0), 0) /
                scoredRuns.length
              ).toFixed(2)
            )
          : undefined;

      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'case_status_changed',
          ctx,
          target: {
            objectType: 'case',
            objectId: req.caseId,
          },
          metadata: {
            client_id: req.clientId,
            from_status: 'in_review',
            to_status: toStatus,
            reason: `Full assessment complete: ${overallDecision}`,
            overall_decision: overallDecision,
          },
        })
      );

      await botPersistenceRepository.updateCaseAfterAssessment(req.caseId, ctx.organizationId, {
        riskScore,
        overallDecision,
      });
    }

    return {
      success: counters.errors === 0,
      clientId: req.clientId,
      caseId: req.caseId,
      totalBots: runs.length,
      passed: counters.passed,
      failed: counters.failed,
      alerts: counters.alerts,
      errors: counters.errors,
      runs,
    };
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;

    if (statusCode === 403) {
      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'bot_run_failed',
          ctx,
          target: {
            objectType: 'tenant_isolation',
            objectId: req.caseId ?? req.clientId,
          },
          metadata: {
            denial_reason: error instanceof Error ? error.message : 'Cross-tenant write denied',
            attempted_case_id: req.caseId,
            attempted_client_id: req.clientId,
            scope: 'run_all',
          },
        })
      );
    }

    const message = error instanceof Error ? error.message : 'Unexpected runAll bots handler error';
    throw Object.assign(new Error(message), {
      statusCode,
    });
  }
}
