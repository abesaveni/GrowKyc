import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export type DocumentExpiryAuditAction =
  | 'document_expiry_set'
  | 'document_expiry_updated'
  | 'document_expired'
  | 'document_expiring_soon'
  | 'document_replaced';

export interface DocumentExpiryAuditEvent {
  action: DocumentExpiryAuditAction;
  occurredAt: string;
  tenant_id: string;
  case_id?: string;
  document_id: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentExpiryAuditContext {
  tenantId: string;
  caseId?: string;
  documentId: string;
  occurredAt?: string | Date;
}

/**
 * Centralized audit hooks for document expiry lifecycle actions.
 */
export class DocumentExpiryAuditHooks {
  constructor(private readonly auditWriter: PeriodicReviewAuditWriter) {}

  async onDocumentExpirySet(
    context: DocumentExpiryAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('document_expiry_set', context, metadata);
  }

  async onDocumentExpiryUpdated(
    context: DocumentExpiryAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('document_expiry_updated', context, metadata);
  }

  async onDocumentExpired(
    context: DocumentExpiryAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('document_expired', context, metadata);
  }

  async onDocumentExpiringSoon(
    context: DocumentExpiryAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('document_expiring_soon', context, metadata);
  }

  async onDocumentReplaced(
    context: DocumentExpiryAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('document_replaced', context, metadata);
  }

  private async writeAuditEvent(
    action: DocumentExpiryAuditAction,
    context: DocumentExpiryAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: DocumentExpiryAuditEvent = {
      action,
      occurredAt: normalizeDate(context.occurredAt ?? new Date(), 'occurredAt').toISOString(),
      tenant_id: context.tenantId,
      case_id: context.caseId,
      document_id: context.documentId,
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
