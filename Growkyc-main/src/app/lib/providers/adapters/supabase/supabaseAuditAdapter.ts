import { supabase } from '../../../../../lib/auth';
import { IAuditProvider } from '../../interfaces';
import { AuditEvent, AuditEventInput, AuditQueryFilter, AuditQueryResult } from '../../types';
import {
  blockDispositionWhenLegalHoldActive,
  buildDefaultRetentionMetadata,
  evaluateRetentionStatus,
} from '../../../../../lib/retention/retentionPolicy';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export class SupabaseAuditAdapter implements IAuditProvider {
  async createAuditEvent(input: AuditEventInput): Promise<AuditEvent> {
    const occurredAt = new Date().toISOString();
    const retentionMetadata = buildDefaultRetentionMetadata({
      entityType: 'audit_event',
      occurredAt,
      retentionUntil: input.retentionUntil,
      retentionPolicyId: input.retentionPolicyId,
      retentionClassification: input.retentionClassification,
    });
    const retentionStatus = evaluateRetentionStatus({
      retentionUntil: retentionMetadata.retentionUntil,
      legalHold: input.legalHold,
    });
    const dispositionGuard = blockDispositionWhenLegalHoldActive({
      legalHold: input.legalHold,
      archiveEligible: input.archiveEligible ?? retentionStatus.archiveEligible,
      deleteEligible: input.deleteEligible ?? retentionStatus.deleteEligible,
    });

    await supabase.from('audit_logs').insert({
      organization_id: input.organizationId || null,
      user_id: input.actorUserId || null,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId || null,
      module: input.module || 'grow_kyc',
      severity: input.severity,
      ip_address: input.ipAddress || null,
      user_agent: input.userAgent || null,
      request_url: input.requestUrl || null,
      metadata: {
        eventType: input.eventType,
        ...(input.data || {}),
      },
      retention_until: retentionMetadata.retentionUntil,
      retention_policy_id: retentionMetadata.retentionPolicyId,
      retention_classification: retentionMetadata.retentionClassification,
      archive_eligible: dispositionGuard.archiveEligible,
      delete_eligible: dispositionGuard.deleteEligible,
      legal_hold: input.legalHold ?? false,
      legal_hold_reason: input.legalHoldReason || null,
      legal_hold_set_by: input.legalHoldSetBy || null,
      legal_hold_set_at: input.legalHoldSetAt || null,
      created_at: occurredAt,
    });

    return {
      id: createId('audit'),
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      eventType: input.eventType,
      severity: input.severity,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      module: input.module,
      data: input.data,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      requestUrl: input.requestUrl,
      occurredAt,
      retentionUntil: retentionMetadata.retentionUntil,
      retentionPolicyId: retentionMetadata.retentionPolicyId,
      retentionClassification: retentionMetadata.retentionClassification,
      archiveEligible: dispositionGuard.archiveEligible,
      deleteEligible: dispositionGuard.deleteEligible,
      legalHold: Boolean(input.legalHold),
      legalHoldReason: input.legalHoldReason,
      legalHoldSetBy: input.legalHoldSetBy,
      legalHoldSetAt: input.legalHoldSetAt,
    };
  }

  async queryAuditEvents(filter: AuditQueryFilter): Promise<AuditQueryResult> {
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(filter.limit || 100);

    if (filter.organizationId) query = query.eq('organization_id', filter.organizationId);
    if (filter.actorUserId) query = query.eq('user_id', filter.actorUserId);
    if (filter.action) query = query.eq('action', filter.action);
    if (filter.resourceType) query = query.eq('resource_type', filter.resourceType);
    if (filter.resourceId) query = query.eq('resource_id', filter.resourceId);
    if (filter.severity) query = query.eq('severity', filter.severity);
    if (filter.fromDate) query = query.gte('created_at', filter.fromDate.toISOString());
    if (filter.toDate) query = query.lte('created_at', filter.toDate.toISOString());

    const { data, count } = await query;
    const rows = data || [];

    return {
      total: count || 0,
      events: rows.map((row) => ({
        id: row.id,
        organizationId: row.organization_id || undefined,
        actorUserId: row.user_id || undefined,
        eventType: row.metadata?.eventType || row.action,
        severity: row.severity,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id || undefined,
        module: row.module || undefined,
        data: row.metadata || {},
        ipAddress: row.ip_address || undefined,
        userAgent: row.user_agent || undefined,
        requestUrl: row.request_url || undefined,
        occurredAt: row.created_at,
        retentionUntil: row.retention_until || undefined,
        retentionPolicyId: row.retention_policy_id || undefined,
        retentionClassification: row.retention_classification || undefined,
        archiveEligible: Boolean(row.archive_eligible),
        deleteEligible: Boolean(row.delete_eligible),
        legalHold: Boolean(row.legal_hold),
        legalHoldReason: row.legal_hold_reason || undefined,
        legalHoldSetBy: row.legal_hold_set_by || undefined,
        legalHoldSetAt: row.legal_hold_set_at || undefined,
      })),
    };
  }
}
