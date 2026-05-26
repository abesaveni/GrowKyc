import { TenantContext } from '../../middleware/auth';
import { requirePermission } from '../../middleware/rbac';
import { botOrchestrator } from '../../../services/BotOrchestrator';
import { botPersistenceRepository } from '../../../services/BotPersistence';
import { BotRunContext, BotRunStatus } from '../../../services/BotTypes';
import {
  botAuditEventWriter,
  buildBotAuditEvent,
} from '../../lib/audit/botAuditEventWriter';
import {
  WorkflowStatus,
  toCaseStatusHistoryPatch,
} from '../../lib/workflow/statusTransitionFlow';
import { resolveTenantPrincipal } from '../../lib/auth/tenantIsolation';
import { tenantSafeDatabaseService } from '../../lib/database/tenantSafeServices';

type RunOneBotTrigger = BotRunContext['trigger'];

export interface RunOneBotRequest {
  botId: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  trigger?: RunOneBotTrigger;
}

export interface RunOneBotResponse {
  success: boolean;
  runId: string;
  botId: string;
  clientId: string;
  caseId?: string;
  status: BotRunStatus;
  score?: number;
  findingsCount: number;
  evidenceCount: number;
  durationMs: number;
  error?: string;
}

class RunOneBotValidationError extends Error {
  readonly statusCode = 400;
}

function assertRunOneBotRequest(req: RunOneBotRequest): void {
  if (!req.botId?.trim()) {
    throw new RunOneBotValidationError('botId is required');
  }

  if (!req.clientId?.trim()) {
    throw new RunOneBotValidationError('clientId is required');
  }

  if (!req.clientName?.trim()) {
    throw new RunOneBotValidationError('clientName is required');
  }
}

function buildRunContext(req: RunOneBotRequest, ctx: TenantContext): BotRunContext {
  return {
    clientId: req.clientId,
    clientName: req.clientName,
    caseId: req.caseId,
    organizationId: ctx.organizationId,
    actorUserId: ctx.userId,
    trigger: req.trigger ?? 'manual',
  };
}

export async function runOneBotHandler(
  req: RunOneBotRequest,
  ctx: TenantContext
): Promise<RunOneBotResponse> {
  requirePermission(ctx, 'bots:run');
  if (req.caseId) {
    requirePermission(ctx, 'cases:status_update');
  }
  assertRunOneBotRequest(req);
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
          scope: 'run_one',
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
          objectType: 'bot',
          objectId: req.botId,
        },
        metadata: {
          client_id: req.clientId,
          client_name: req.clientName,
          case_id: req.caseId,
          trigger: req.trigger ?? 'manual',
        },
      })
    );

    const runResult = await botOrchestrator.runOne(req.botId, buildRunContext(req, ctx));
    const terminalStatus: WorkflowStatus =
      runResult.error || runResult.run.status === 'error' || runResult.run.status === 'failed'
        ? req.caseId
          ? 'escalated'
          : 'failed'
        : 'completed';

    if (req.caseId) {
      await tenantSafeDatabaseService.appendCaseStatusHistoryForTenant(
        tenant.tenantId,
        toCaseStatusHistoryPatch({
          caseId: req.caseId,
          organizationId: tenant.tenantId,
          changedByUserId: ctx.userId,
          scope: 'run_one',
          transition: {
            from: 'running',
            to: terminalStatus,
          },
        })
      );
    }

    if (runResult.error || runResult.run.status === 'error') {
      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'bot_run_failed',
          ctx,
          target: {
            objectType: 'bot_run',
            objectId: runResult.run.id,
          },
          metadata: {
            bot_id: req.botId,
            client_id: req.clientId,
            case_id: req.caseId,
            status: runResult.run.status,
            error: runResult.error ?? runResult.run.errorMessage,
            duration_ms: runResult.run.durationMs,
          },
        })
      );
    } else {
      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'bot_run_completed',
          ctx,
          target: {
            objectType: 'bot_run',
            objectId: runResult.run.id,
          },
          metadata: {
            bot_id: req.botId,
            client_id: req.clientId,
            case_id: req.caseId,
            status: runResult.run.status,
            score: runResult.result?.score,
            findings_count: runResult.result?.rawResult.findings.length ?? 0,
            evidence_count: runResult.result?.rawResult.evidence.length ?? 0,
            duration_ms: runResult.run.durationMs,
          },
        })
      );
    }

    return {
      success: !runResult.error,
      runId: runResult.run.id,
      botId: req.botId,
      clientId: req.clientId,
      caseId: req.caseId,
      status: runResult.run.status,
      score: runResult.result?.score,
      findingsCount: runResult.result?.rawResult.findings.length ?? 0,
      evidenceCount: runResult.result?.rawResult.evidence.length ?? 0,
      durationMs: runResult.run.durationMs ?? 0,
      error: runResult.error,
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
            bot_id: req.botId,
            scope: 'run_one',
          },
        })
      );
    }

    const message = error instanceof Error ? error.message : 'Unexpected runOne bot handler error';
    throw Object.assign(new Error(message), {
      statusCode,
    });
  }
}
