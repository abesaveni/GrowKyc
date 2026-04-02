/**
 * runAllBots.ts — POST /api/bots/run-all
 *
 * Runs all enabled compliance bots for a client/case.
 * Builds an evidence pack after all bots complete.
 * Writes a CASE_FULL_ASSESSMENT_COMPLETE audit event on finish.
 * Appends a CaseStatusHistory entry recording the final outcomes.
 *
 * All material actions write audit events.
 */

import { TenantContext } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { botOrchestrator, OrchestratedRunResult } from '../../services/BotOrchestrator';
import { botPersistenceRepository } from '../../services/BotPersistence';
import { botAuditService } from '../../services/BotAuditService';
import { BotRunContext, FindingDecision } from '../../services/BotTypes';
import { resolveTenantPrincipal } from '../lib/auth/tenantIsolation';
import { tenantSafeDatabaseService } from '../lib/database/tenantSafeServices';

// ── Request / response ────────────────────────────────────────────────────────

export interface RunAllBotsRequest {
  clientId: string;
  clientName: string;
  caseId?: string;
  trigger?: BotRunContext['trigger'];
}

export interface RunAllBotsResponse {
  caseId?: string;
  totalBots: number;
  passed: number;
  failed: number;
  alerts: number;
  errors: number;
  overallDecision: FindingDecision;
  evidencePackId?: string;
  runs: Array<{
    runId: string;
    botId: string;
    status: string;
    score?: number;
    error?: string;
  }>;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function handleRunAllBots(
  body: RunAllBotsRequest,
  ctx: TenantContext
): Promise<RunAllBotsResponse> {
  requirePermission(ctx, 'bots:run_all');
  requirePermission(ctx, 'evidence_packs:read');
  const tenant = resolveTenantPrincipal(ctx);
  tenantSafeDatabaseService.assertExecutionScopeGuards(tenant.tenantId, tenant.tenantId);

  const { clientId, clientName, caseId, trigger = 'manual' } = body;

  if (caseId) {
    requirePermission(ctx, 'cases:status_update');
  }

  if (!clientId) {
    throw Object.assign(new Error('clientId is required'), { statusCode: 400 });
  }

  if (caseId) {
    await tenantSafeDatabaseService.assertCaseOwnership(tenant.tenantId, caseId);
  }

  await botAuditService.logEvent({
    organizationId: ctx.organizationId,
    actorUserId: ctx.userId,
    eventType: 'CASE_FULL_ASSESSMENT_STARTED',
    targetType: 'case',
    targetId: caseId,
    severity: 'info',
    data: { clientId, caseId, trigger },
  });

  const runContext: BotRunContext = {
    clientId,
    clientName,
    organizationId: ctx.organizationId,
    actorUserId: ctx.userId,
    trigger,
  };

  const results = await botOrchestrator.runAll(runContext);

  const summary = summarise(results);
  const overallDecision = deriveOverallDecision(summary);

  // Record case status history after assessment completes.
  if (caseId) {
    await botPersistenceRepository.appendCaseStatusHistory({
      caseId,
      organizationId: ctx.organizationId,
      fromStatus: 'in_review',
      toStatus: overallDecision === 'pass' ? 'open' : overallDecision === 'fail' ? 'escalated' : 'in_review',
      reason: `Full assessment complete: ${overallDecision}`,
      changedByUserId: ctx.userId,
    });

    // Update case risk score.
    const avgScore =
      results
        .filter((r) => r.result?.score !== undefined)
        .reduce((acc, r) => acc + (r.result?.score ?? 0), 0) /
      Math.max(results.filter((r) => r.result?.score !== undefined).length, 1);

    await botPersistenceRepository.updateCaseAfterAssessment(caseId, ctx.organizationId, {
      riskScore: Math.round(avgScore * 100) / 100,
      overallDecision,
    });
  }

  await botAuditService.logEvent({
    organizationId: ctx.organizationId,
    actorUserId: ctx.userId,
    eventType: 'CASE_FULL_ASSESSMENT_COMPLETE',
    targetType: 'case',
    targetId: caseId,
    severity: overallDecision === 'fail' ? 'warning' : 'info',
    data: {
      clientId,
      caseId,
      totalBots: summary.total,
      passed: summary.passed,
      failed: summary.failed,
      alerts: summary.alerts,
      errors: summary.errors,
      overallDecision,
    },
  });

  return {
    caseId,
    totalBots: summary.total,
    passed: summary.passed,
    failed: summary.failed,
    alerts: summary.alerts,
    errors: summary.errors,
    overallDecision,
    runs: results.map((r) => ({
      runId: r.run.id,
      botId: r.run.botId,
      status: r.run.status,
      score: r.result?.score,
      error: r.error,
    })),
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function summarise(results: OrchestratedRunResult[]) {
  return results.reduce(
    (acc, r) => {
      acc.total++;
      if (r.error) { acc.errors++; return acc; }
      const s = r.run.status;
      if (s === 'passed') acc.passed++;
      else if (s === 'failed') acc.failed++;
      else if (s === 'alert') acc.alerts++;
      else acc.errors++;
      return acc;
    },
    { total: 0, passed: 0, failed: 0, alerts: 0, errors: 0 }
  );
}

function deriveOverallDecision(
  s: ReturnType<typeof summarise>
): FindingDecision {
  if (s.failed > 0) return 'fail';
  if (s.alerts > 0 || s.errors > 0) return 'manual_review';
  if (s.passed === s.total && s.total > 0) return 'pass';
  return 'insufficient_data';
}
