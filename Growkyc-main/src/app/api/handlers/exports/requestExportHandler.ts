import type { TenantContext } from '../../middleware/auth';
import type { ExportResponse } from '../../../../lib/exports/models/exportResponse';
import type { ExportAuditEvent } from '../../../../lib/exports/models/exportAuditEvent';
import { providerRegistry } from '../../../lib/providers/providerRegistry';
import {
  ExportService,
  type ExportServiceRequest,
  type ExportServiceRequestBody,
} from '../../../../lib/exports/services/exportService';

function toAuditSeverity(action: ExportAuditEvent['action']): 'info' | 'warning' | 'error' {
  if (action === 'export_failed') {
    return 'error';
  }

  if (action === 'export_downloaded') {
    return 'warning';
  }

  return 'info';
}

const exportService = new ExportService({
  formatter_hooks: {
    pdf: async () => {
      return;
    },
    csv: async () => {
      return;
    },
    json: async () => {
      return;
    },
  },
  on_audit_event: async (event) => {
    await providerRegistry.audit.createAuditEvent({
      organizationId: event.tenant_id,
      actorUserId: event.actor_user_id,
      eventType: `export_${event.action}`,
      severity: toAuditSeverity(event.action),
      action: event.action,
      resourceType: event.target_type,
      resourceId: event.target_id,
      module: 'exports',
      data: {
        export_id: event.export_id,
        case_id: event.case_id,
        format: event.format,
        reason_code: event.reason_code,
        metadata: event.metadata,
        occurred_at: event.occurred_at,
      },
    });
  },
});

const assertBody = (body: unknown): ExportServiceRequestBody => {
  return (body ?? {}) as ExportServiceRequestBody;
};

const toServiceRequest = (
  body: ExportServiceRequestBody,
  ctx: TenantContext,
): ExportServiceRequest => {
  return {
    body,
    context: {
      actor: {
        user_id: ctx.userId,
        tenant_id: ctx.organizationId,
        role: ctx.role,
        permissions: [...ctx.permissions],
      },
    },
  };
};

export async function requestReportExportHandler(
  body: unknown,
  ctx: TenantContext,
): Promise<ExportResponse> {
  return exportService.requestReportExport(toServiceRequest(assertBody(body), ctx));
}

export async function requestAuditPackExportHandler(
  body: unknown,
  ctx: TenantContext,
): Promise<ExportResponse> {
  return exportService.requestAuditPackExport(toServiceRequest(assertBody(body), ctx));
}

export async function requestEvidenceBundleExportHandler(
  body: unknown,
  ctx: TenantContext,
): Promise<ExportResponse> {
  return exportService.requestEvidenceBundleExport(toServiceRequest(assertBody(body), ctx));
}
