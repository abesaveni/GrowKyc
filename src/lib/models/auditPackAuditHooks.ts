import type { AuditPackExportStatus } from './auditPackModel';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export type AuditPackAuditAction =
  | 'audit_pack_created'
  | 'audit_pack_assembled'
  | 'audit_pack_exported'
  | 'audit_pack_failed';

export interface AuditPackAuditEvent {
  action: AuditPackAuditAction;
  occurredAt: string;
  tenant_id: string;
  case_id: string;
  audit_pack_id: string;
  actor_id: string;
  export_status: AuditPackExportStatus;
  metadata?: Record<string, unknown>;
}

export interface AuditPackAuditContext {
  tenantId: string;
  caseId: string;
  auditPackId: string;
  actorId: string;
  exportStatus: AuditPackExportStatus;
  occurredAt?: string | Date;
}

/**
 * Centralized audit hooks for audit pack lifecycle actions.
 */
export class AuditPackAuditHooks {
  constructor(private readonly auditWriter: PeriodicReviewAuditWriter) {}

  async onAuditPackCreated(
    context: AuditPackAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('audit_pack_created', context, metadata);
  }

  async onAuditPackAssembled(
    context: AuditPackAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('audit_pack_assembled', context, metadata);
  }

  async onAuditPackExported(
    context: AuditPackAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('audit_pack_exported', context, metadata);
  }

  async onAuditPackFailed(
    context: AuditPackAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('audit_pack_failed', context, metadata);
  }

  private async writeAuditEvent(
    action: AuditPackAuditAction,
    context: AuditPackAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: AuditPackAuditEvent = {
      action,
      occurredAt: normalizeDate(context.occurredAt ?? new Date(), 'occurredAt').toISOString(),
      tenant_id: context.tenantId,
      case_id: context.caseId,
      audit_pack_id: context.auditPackId,
      actor_id: context.actorId,
      export_status: context.exportStatus,
      metadata,
    };

    await this.auditWriter.write(event as never);
  }
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}