import { supabase } from '../../../../../lib/auth';
import { IDatabaseProvider } from '../../interfaces';
import { BotResult, EvidencePack, PersistedBotResult, BotRunRecord } from '../../types';
import {
  AlertRecord,
  BotFinding,
  CaseRecord,
  CaseStatusHistoryEntry,
  PeriodicReview,
  ProviderLog,
} from '../../../../services/BotTypes';
import { blockDispositionWhenLegalHoldActive } from '../../../../../lib/retention/retentionPolicy';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export class SupabaseDatabaseAdapter implements IDatabaseProvider {
  async createBotRun(run: BotRunRecord): Promise<void> {
    await supabase.from('bot_runs').upsert(
      {
        id: run.id,
        organization_id: run.organizationId || null,
        client_id: run.clientId,
        client_name: run.clientName,
        case_id: run.caseId || null,
        bot_id: run.botId,
        bot_version: run.botVersion,
        provider: run.provider,
        status: run.status,
        triggered_by: run.trigger,
        started_at: run.startedAt,
      },
      { onConflict: 'id' }
    );
  }

  async updateBotRun(runId: string, patch: Partial<BotRunRecord>): Promise<void> {
    await supabase
      .from('bot_runs')
      .update({
        status: patch.status,
        completed_at: patch.completedAt || null,
        duration_ms: patch.durationMs ?? null,
        error_message: patch.errorMessage || null,
      })
      .eq('id', runId);
  }

  async createBotResult(result: PersistedBotResult): Promise<void> {
    await supabase.from('bot_results').upsert(
      {
        id: result.id,
        run_id: result.runId,
        bot_id: result.botId,
        status: result.status,
        score: result.score,
        summary: result.summary,
        findings: result.findings,
        raw_result: result.rawResult,
        persisted_at: result.persistedAt,
      },
      { onConflict: 'id' }
    );
  }

  async createBotResultEvidence(params: {
    runId: string;
    botId: string;
    result: BotResult;
    organizationId?: string;
    retentionUntil?: string;
    retentionPolicyId?: string;
    retentionClassification?: 'compliance_record' | 'audit_record' | 'provider_record' | 'document_record';
    archiveEligible?: boolean;
    deleteEligible?: boolean;
    legalHold?: boolean;
    legalHoldReason?: string;
    legalHoldSetBy?: string;
    legalHoldSetAt?: string;
  }): Promise<void> {
    if (params.result.evidence.length === 0) {
      return;
    }

    const evidenceDisposition = blockDispositionWhenLegalHoldActive({
      legalHold: params.legalHold,
      archiveEligible: params.archiveEligible,
      deleteEligible: params.deleteEligible,
    });

    await supabase.from('bot_result_evidence').upsert(
      params.result.evidence.map((item) => ({
        id: item.id,
        organization_id: params.organizationId || null,
        run_id: params.runId,
        bot_id: params.botId,
        title: item.title,
        source: item.source,
        evidence_type: item.evidenceType,
        confidence: item.confidence,
        captured_at: item.capturedAt,
        s3_bucket: item.s3Bucket || null,
        s3_key: item.s3Key || null,
        s3_version_id: item.s3VersionId || null,
        s3_etag: item.s3Etag || null,
        retention_until: params.retentionUntil || null,
        retention_policy_id: params.retentionPolicyId || null,
        retention_classification: params.retentionClassification || null,
        archive_eligible: evidenceDisposition.archiveEligible,
        delete_eligible: evidenceDisposition.deleteEligible,
        legal_hold: params.legalHold ?? false,
        legal_hold_reason: params.legalHoldReason || null,
        legal_hold_set_by: params.legalHoldSetBy || null,
        legal_hold_set_at: params.legalHoldSetAt || null,
        metadata: item.metadata || {},
      })),
      { onConflict: 'id' }
    );
  }

  async createEvidencePack(pack: EvidencePack): Promise<void> {
    const packAny = pack as EvidencePack & {
      legalHoldReason?: string;
      legalHoldSetBy?: string;
      legalHoldSetAt?: string;
    };
    const packDisposition = blockDispositionWhenLegalHoldActive({
      legalHold: pack.legalHold,
      archiveEligible: pack.archiveEligible,
      deleteEligible: pack.deleteEligible,
    });

    await supabase.from('evidence_packs').upsert(
      {
        id: pack.id,
        organization_id: pack.organizationId || null,
        client_id: pack.clientId,
        client_name: pack.clientName,
        case_id: pack.caseId || null,
        run_ids: pack.runIds,
        summary: pack.summary,
        retention_until: pack.retentionUntil || null,
        retention_policy_id: pack.retentionPolicyId || null,
        retention_classification: pack.retentionClassification || null,
        archive_eligible: packDisposition.archiveEligible,
        delete_eligible: packDisposition.deleteEligible,
        legal_hold: pack.legalHold ?? false,
        legal_hold_reason: packAny.legalHoldReason || null,
        legal_hold_set_by: packAny.legalHoldSetBy || null,
        legal_hold_set_at: packAny.legalHoldSetAt || null,
        generated_at: pack.generatedAt,
      },
      { onConflict: 'id' }
    );

    if (pack.items.length > 0) {
      await supabase.from('evidence_pack_items').upsert(
        pack.items.map((item) => {
          const itemAny = item as typeof item & {
            legalHold?: boolean;
            legalHoldReason?: string;
            legalHoldSetBy?: string;
            legalHoldSetAt?: string;
          };
          const itemDisposition = blockDispositionWhenLegalHoldActive({
            legalHold: itemAny.legalHold ?? pack.legalHold,
            archiveEligible: item.archiveEligible ?? pack.archiveEligible,
            deleteEligible: item.deleteEligible ?? pack.deleteEligible,
          });

          return {
            id: item.id,
            evidence_pack_id: pack.id,
            run_id: item.runId,
            bot_id: item.botId,
            title: item.title,
            source: item.source,
            evidence_type: item.evidenceType,
            confidence: item.confidence,
            captured_at: item.capturedAt,
            s3_bucket: item.s3Bucket || null,
            s3_key: item.s3Key || null,
            s3_version_id: item.s3VersionId || null,
            s3_etag: item.s3Etag || null,
            retention_until: item.retentionUntil || pack.retentionUntil || null,
            retention_policy_id: item.retentionPolicyId || pack.retentionPolicyId || null,
            retention_classification: item.retentionClassification || pack.retentionClassification || null,
            archive_eligible: itemDisposition.archiveEligible,
            delete_eligible: itemDisposition.deleteEligible,
            legal_hold: itemAny.legalHold ?? pack.legalHold ?? false,
            legal_hold_reason: itemAny.legalHoldReason || packAny.legalHoldReason || null,
            legal_hold_set_by: itemAny.legalHoldSetBy || packAny.legalHoldSetBy || null,
            legal_hold_set_at: itemAny.legalHoldSetAt || packAny.legalHoldSetAt || null,
            metadata: item.metadata || {},
          };
        }),
        { onConflict: 'id' }
      );
    }
  }

  async createCase(caseRecord: Omit<CaseRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<CaseRecord> {
    const now = new Date().toISOString();
    const id = createId('case');

    const { data } = await supabase
      .from('cases')
      .insert({
        id,
        organization_id: caseRecord.organizationId,
        client_id: caseRecord.clientId,
        assigned_to_user_id: caseRecord.assignedToUserId || null,
        status: caseRecord.status,
        risk_score: caseRecord.riskScore ?? null,
        overall_decision: caseRecord.overallDecision || null,
        legal_hold: caseRecord.legalHold,
        legal_hold_reason: caseRecord.legalHoldReason || null,
        legal_hold_until: caseRecord.legalHoldUntil || null,
        legal_hold_set_by: caseRecord.legalHoldSetBy || null,
        legal_hold_set_at: caseRecord.legalHoldSetAt || null,
        retention_until: caseRecord.retentionUntil || null,
        retention_policy_id: caseRecord.retentionPolicyId || null,
        metadata: caseRecord.metadata || {},
        closed_at: caseRecord.closedAt || null,
      })
      .select('*')
      .single();

    return this.toCaseRecord(data || { id, ...caseRecord, created_at: now, updated_at: now });
  }

  async updateCase(
    caseId: string,
    organizationId: string,
    patch: Partial<Pick<CaseRecord, 'status' | 'riskScore' | 'overallDecision' | 'closedAt' | 'metadata'>>
  ): Promise<void> {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (patch.status !== undefined) updatePayload.status = patch.status;
    if (patch.riskScore !== undefined) updatePayload.risk_score = patch.riskScore;
    if (patch.overallDecision !== undefined) updatePayload.overall_decision = patch.overallDecision;
    if (patch.closedAt !== undefined) updatePayload.closed_at = patch.closedAt;
    if (patch.metadata !== undefined) updatePayload.metadata = patch.metadata;

    await supabase
      .from('cases')
      .update(updatePayload)
      .eq('id', caseId)
      .eq('organization_id', organizationId);
  }

  async getCaseById(caseId: string, organizationId: string): Promise<CaseRecord | null> {
    const { data } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .eq('organization_id', organizationId)
      .maybeSingle();

    return data ? this.toCaseRecord(data) : null;
  }

  async setLegalHold(
    caseId: string,
    organizationId: string,
    hold: boolean,
    params: { reason?: string; holdUntil?: string; setByUserId: string }
  ): Promise<void> {
    await supabase
      .from('cases')
      .update({
        legal_hold: hold,
        legal_hold_reason: params.reason || null,
        legal_hold_until: params.holdUntil || null,
        legal_hold_set_by: params.setByUserId,
        legal_hold_set_at: new Date().toISOString(),
      })
      .eq('id', caseId)
      .eq('organization_id', organizationId);
  }

  async createCaseStatusHistory(
    entry: Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'>
  ): Promise<CaseStatusHistoryEntry> {
    const id = (entry as { id?: string }).id || createId('case-status');

    const { data } = await supabase
      .from('case_status_history')
      .upsert(
        {
          id,
          case_id: entry.caseId,
          organization_id: entry.organizationId,
          from_status: entry.fromStatus || null,
          to_status: entry.toStatus,
          reason: entry.reason || null,
          changed_by_user_id: entry.changedByUserId || null,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    return {
      id: data?.id || id,
      caseId: data?.case_id || entry.caseId,
      organizationId: data?.organization_id || entry.organizationId,
      fromStatus: data?.from_status || undefined,
      toStatus: data?.to_status || entry.toStatus,
      reason: data?.reason || undefined,
      changedByUserId: data?.changed_by_user_id || undefined,
      changedAt: data?.changed_at || new Date().toISOString(),
      sequenceNumber: data?.sequence_number || undefined,
    };
  }

  async createFinding(finding: Omit<BotFinding, 'id' | 'createdAt'>): Promise<BotFinding> {
    const id = (finding as { id?: string }).id || createId('finding');

    const { data } = await supabase
      .from('bot_findings')
      .upsert(
        {
          id,
          organization_id: finding.organizationId,
          case_id: finding.caseId,
          run_id: finding.runId || null,
          bot_id: finding.botId,
          finding_type: finding.findingType,
          severity: finding.severity,
          decision: finding.decision,
          confidence: finding.confidence ?? null,
          score: finding.score ?? null,
          description: finding.description || null,
          details: finding.details || {},
          evidence_refs: finding.evidenceRefs || [],
          retention_until: finding.retentionUntil || null,
          legal_hold: finding.legalHold,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    return this.toFinding(data || { id, ...finding, created_at: new Date().toISOString() });
  }

  async getFindingsByCaseId(caseId: string, organizationId: string): Promise<BotFinding[]> {
    const { data } = await supabase
      .from('bot_findings')
      .select('*')
      .eq('case_id', caseId)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    return (data || []).map((row) => this.toFinding(row));
  }

  async createAlert(alert: Omit<AlertRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertRecord> {
    const id = createId('alert');
    const now = new Date().toISOString();

    const { data } = await supabase
      .from('alerts')
      .insert({
        id,
        organization_id: alert.organizationId,
        case_id: alert.caseId || null,
        run_id: alert.runId || null,
        alert_type: alert.alertType,
        escalation_level: alert.escalationLevel || null,
        title: alert.title,
        description: alert.description || null,
        metadata: alert.metadata || {},
        is_resolved: alert.isResolved,
        resolved_by_user_id: alert.resolvedByUserId || null,
        resolved_at: alert.resolvedAt || null,
        resolution_note: alert.resolutionNote || null,
      })
      .select('*')
      .single();

    return {
      id: data?.id || id,
      organizationId: data?.organization_id || alert.organizationId,
      caseId: data?.case_id || alert.caseId,
      runId: data?.run_id || alert.runId,
      alertType: data?.alert_type || alert.alertType,
      escalationLevel: data?.escalation_level || alert.escalationLevel,
      title: data?.title || alert.title,
      description: data?.description || alert.description,
      metadata: data?.metadata || alert.metadata,
      isResolved: data?.is_resolved ?? alert.isResolved,
      resolvedByUserId: data?.resolved_by_user_id || alert.resolvedByUserId,
      resolvedAt: data?.resolved_at || alert.resolvedAt,
      resolutionNote: data?.resolution_note || alert.resolutionNote,
      createdAt: data?.created_at || now,
      updatedAt: data?.updated_at || now,
    };
  }

  async resolveAlert(
    alertId: string,
    organizationId: string,
    params: { resolvedByUserId: string; resolutionNote?: string }
  ): Promise<void> {
    await supabase
      .from('alerts')
      .update({
        is_resolved: true,
        resolved_by_user_id: params.resolvedByUserId,
        resolved_at: new Date().toISOString(),
        resolution_note: params.resolutionNote || null,
      })
      .eq('id', alertId)
      .eq('organization_id', organizationId);
  }

  async createPeriodicReview(
    review: Omit<PeriodicReview, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PeriodicReview> {
    const id = createId('periodic-review');
    const now = new Date().toISOString();

    const { data } = await supabase
      .from('periodic_reviews')
      .insert({
        id,
        organization_id: review.organizationId,
        case_id: review.caseId,
        due_at: review.dueAt,
        completed_at: review.completedAt || null,
        assigned_to_user_id: review.assignedToUserId || null,
        outcome: review.outcome || null,
        notes: review.notes || null,
        metadata: review.metadata || {},
      })
      .select('*')
      .single();

    await this.writeAuditLog({
      organizationId: review.organizationId,
      actorUserId: review.assignedToUserId,
      eventType: 'review_created',
      action: 'review_created',
      resourceType: 'periodic_review',
      resourceId: data?.id || id,
      severity: 'info',
      metadata: {
        case_id: review.caseId,
        due_at: review.dueAt,
        outcome: review.outcome,
      },
    });

    return {
      id: data?.id || id,
      organizationId: data?.organization_id || review.organizationId,
      caseId: data?.case_id || review.caseId,
      dueAt: data?.due_at || review.dueAt,
      completedAt: data?.completed_at || review.completedAt,
      assignedToUserId: data?.assigned_to_user_id || review.assignedToUserId,
      outcome: data?.outcome || review.outcome,
      notes: data?.notes || review.notes,
      metadata: data?.metadata || review.metadata,
      createdAt: data?.created_at || now,
      updatedAt: data?.updated_at || now,
    };
  }

  async updatePeriodicReview(
    reviewId: string,
    organizationId: string,
    patch: Partial<Pick<PeriodicReview, 'completedAt' | 'outcome' | 'notes'>>
  ): Promise<void> {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (patch.completedAt !== undefined) updatePayload.completed_at = patch.completedAt;
    if (patch.outcome !== undefined) updatePayload.outcome = patch.outcome;
    if (patch.notes !== undefined) updatePayload.notes = patch.notes;

    await supabase
      .from('periodic_reviews')
      .update(updatePayload)
      .eq('id', reviewId)
      .eq('organization_id', organizationId);

    const reviewEventType =
      patch.outcome === 'pass'
        ? 'review_approved'
        : patch.outcome === 'fail'
        ? 'review_rejected'
        : 'review_submitted';

    await this.writeAuditLog({
      organizationId,
      eventType: reviewEventType,
      action: reviewEventType,
      resourceType: 'periodic_review',
      resourceId: reviewId,
      severity: reviewEventType === 'review_rejected' ? 'warning' : 'info',
      metadata: {
        completed_at: patch.completedAt,
        outcome: patch.outcome,
        notes_present: typeof patch.notes === 'string' && patch.notes.length > 0,
      },
    });
  }

  async createProviderLog(log: Omit<ProviderLog, 'id' | 'calledAt'>): Promise<ProviderLog> {
    const id = createId('provider-log');
    const calledAt = new Date().toISOString();
    const logAny = log as ProviderLog & {
      legalHold?: boolean;
      legalHoldReason?: string;
      legalHoldSetBy?: string;
      legalHoldSetAt?: string;
    };
    const providerDisposition = blockDispositionWhenLegalHoldActive({
      legalHold: logAny.legalHold,
      archiveEligible: log.archiveEligible,
      deleteEligible: log.deleteEligible,
    });

    const { data } = await supabase
      .from('provider_logs')
      .insert({
        id,
        organization_id: log.organizationId,
        run_id: log.runId || null,
        case_id: log.caseId || null,
        bot_id: log.botId,
        provider_name: log.providerName,
        request_hash: log.requestHash || null,
        response_code: log.responseCode || null,
        duration_ms: log.durationMs || null,
        retry_count: log.retryCount,
        error_code: log.errorCode || null,
        error_message: log.errorMessage || null,
        succeeded: log.succeeded,
        retention_until: log.retentionUntil || null,
        retention_policy_id: log.retentionPolicyId || null,
        retention_classification: log.retentionClassification || null,
        archive_eligible: providerDisposition.archiveEligible,
        delete_eligible: providerDisposition.deleteEligible,
        legal_hold: logAny.legalHold ?? false,
        legal_hold_reason: logAny.legalHoldReason || null,
        legal_hold_set_by: logAny.legalHoldSetBy || null,
        legal_hold_set_at: logAny.legalHoldSetAt || null,
        called_at: calledAt,
      })
      .select('*')
      .single();

    return {
      id: data?.id || id,
      organizationId: data?.organization_id || log.organizationId,
      runId: data?.run_id || log.runId,
      caseId: data?.case_id || log.caseId,
      botId: data?.bot_id || log.botId,
      providerName: data?.provider_name || log.providerName,
      requestHash: data?.request_hash || log.requestHash,
      responseCode: data?.response_code ?? log.responseCode,
      durationMs: data?.duration_ms ?? log.durationMs,
      retryCount: data?.retry_count ?? log.retryCount,
      errorCode: data?.error_code || log.errorCode,
      errorMessage: data?.error_message || log.errorMessage,
      succeeded: data?.succeeded ?? log.succeeded,
      calledAt: data?.called_at || calledAt,
      retentionUntil: data?.retention_until || log.retentionUntil,
      retentionPolicyId: data?.retention_policy_id || log.retentionPolicyId,
      retentionClassification: data?.retention_classification || log.retentionClassification,
      archiveEligible: data?.archive_eligible ?? log.archiveEligible,
      deleteEligible: data?.delete_eligible ?? log.deleteEligible,
    };
  }

  private async writeAuditLog(input: {
    organizationId: string;
    eventType: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    actorUserId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        organization_id: input.organizationId,
        user_id: input.actorUserId || null,
        action: input.action,
        resource_type: input.resourceType,
        resource_id: input.resourceId || null,
        module: 'reviews',
        severity: input.severity,
        metadata: {
          eventType: input.eventType,
          ...(input.metadata || {}),
        },
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('[SupabaseDatabaseAdapter] review audit write failed', error);
    }
  }

  private toCaseRecord(row: any): CaseRecord {
    return {
      id: row.id,
      organizationId: row.organization_id,
      clientId: row.client_id,
      assignedToUserId: row.assigned_to_user_id || undefined,
      status: row.status,
      riskScore: row.risk_score ?? undefined,
      overallDecision: row.overall_decision || undefined,
      legalHold: Boolean(row.legal_hold),
      legalHoldReason: row.legal_hold_reason || undefined,
      legalHoldUntil: row.legal_hold_until || undefined,
      legalHoldSetBy: row.legal_hold_set_by || undefined,
      legalHoldSetAt: row.legal_hold_set_at || undefined,
      retentionUntil: row.retention_until || undefined,
      retentionPolicyId: row.retention_policy_id || undefined,
      metadata: row.metadata || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      closedAt: row.closed_at || undefined,
    };
  }

  private toFinding(row: any): BotFinding {
    return {
      id: row.id,
      organizationId: row.organization_id,
      caseId: row.case_id,
      runId: row.run_id || undefined,
      botId: row.bot_id,
      findingType: row.finding_type,
      severity: row.severity,
      decision: row.decision,
      confidence: row.confidence ?? undefined,
      score: row.score ?? undefined,
      description: row.description || undefined,
      details: row.details || {},
      evidenceRefs: row.evidence_refs || [],
      retentionUntil: row.retention_until || undefined,
      legalHold: Boolean(row.legal_hold),
      createdAt: row.created_at,
    };
  }
}
