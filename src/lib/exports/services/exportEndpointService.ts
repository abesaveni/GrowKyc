import type {
  ExportAuthorizationActor,
  ExportAuthorizationInput,
  ExportAuthorizationResult,
} from '../models/exportAuthorizationResult';
import type { ExportAuditEvent } from '../models/exportAuditEvent';
import type { ExportFormat } from '../models/exportFormat';
import type { ExportRequest } from '../models/exportRequest';
import type { ExportResponse } from '../models/exportResponse';
import { validateExportPermissions } from './exportAuthorizationHelper';
import {
  emitExportDownloadedAuditEvent,
  emitExportFailedAuditEvent,
  emitExportGeneratedAuditEvent,
  emitExportRequestedAuditEvent,
  type IExportAuditWriter,
} from './exportAuditHooks';

export interface ExportFormatterHookInput {
  export_id: string;
  request: ExportRequest;
}

export type ExportFormatterHook = (input: ExportFormatterHookInput) => Promise<void>;

export interface ExportEndpointServiceDependencies {
  authorize?: (input: ExportAuthorizationInput) => ExportAuthorizationResult;
  on_audit_event?: (event: ExportAuditEvent) => Promise<void>;
  audit_writer?: IExportAuditWriter;
  formatter_hooks?: Partial<Record<ExportFormat, ExportFormatterHook>>;
  now?: () => string;
  generate_export_id?: () => string;
}

export interface RequestExportInput {
  request: ExportRequest;
  actor?: ExportAuthorizationActor;
}

export class ExportAuthorizationError extends Error {
  readonly statusCode = 403;

  constructor(public readonly authorization: ExportAuthorizationResult) {
    super(authorization.reason_detail);
    this.name = 'ExportAuthorizationError';
  }
}

const noopFormatterHook: ExportFormatterHook = async () => {
  return;
};

const defaultNow = (): string => {
  return new Date().toISOString();
};

const defaultExportId = (): string => {
  return `exp_${Date.now()}`;
};

export class ExportEndpointService {
  private readonly authorize: (input: ExportAuthorizationInput) => ExportAuthorizationResult;
  private readonly auditWriter?: IExportAuditWriter;
  private readonly formatterHooks: Partial<Record<ExportFormat, ExportFormatterHook>>;
  private readonly now: () => string;
  private readonly generateExportId: () => string;

  constructor(dependencies: ExportEndpointServiceDependencies = {}) {
    this.authorize = dependencies.authorize ?? validateExportPermissions;
    this.auditWriter = dependencies.audit_writer ?? (dependencies.on_audit_event
      ? {
          writeExportAuditEvent: dependencies.on_audit_event,
        }
      : undefined);
    this.formatterHooks = dependencies.formatter_hooks ?? {};
    this.now = dependencies.now ?? defaultNow;
    this.generateExportId = dependencies.generate_export_id ?? defaultExportId;
  }

  async requestExport(input: RequestExportInput): Promise<ExportResponse> {
    const authorization = this.authorize({
      request: input.request,
      actor: input.actor,
    });

    const occurred_at = this.now();

    if (!authorization.allowed) {
      await emitExportFailedAuditEvent(this.auditWriter, {
        occurred_at,
        request: input.request,
        actor_user_id: input.actor?.user_id,
        reason_code: authorization.reason_code,
      });

      throw new ExportAuthorizationError(authorization);
    }

    await emitExportRequestedAuditEvent(this.auditWriter, {
      occurred_at,
      request: input.request,
      actor_user_id: input.actor?.user_id,
    });

    const export_id = this.generateExportId();
    const requested_at = occurred_at;
    const formatterHook = this.formatterHooks[input.request.format] ?? noopFormatterHook;

    try {
      await formatterHook({
        export_id,
        request: input.request,
      });

      await emitExportGeneratedAuditEvent(this.auditWriter, {
        occurred_at: this.now(),
        request: input.request,
        actor_user_id: input.actor?.user_id,
        export_id,
      });
    } catch (error) {
      await emitExportFailedAuditEvent(this.auditWriter, {
        occurred_at: this.now(),
        request: input.request,
        actor_user_id: input.actor?.user_id,
        export_id,
        reason_code: 'formatter_failed',
        metadata: {
          message: error instanceof Error ? error.message : 'Unknown formatter hook error',
        },
      });

      throw error;
    }

    return {
      export_id,
      tenant_id: input.request.tenant_id,
      case_id: input.request.case_id,
      target_type: input.request.target_type,
      target_id: input.request.target_id,
      format: input.request.format,
      status: 'accepted',
      requested_at,
      requested_by: input.request.requested_by,
    };
  }

  async auditExportDownloaded(input: {
    request: ExportRequest;
    actor_user_id?: string;
    export_id?: string;
    occurred_at?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await emitExportDownloadedAuditEvent(this.auditWriter, {
      occurred_at: input.occurred_at ?? this.now(),
      request: input.request,
      actor_user_id: input.actor_user_id,
      export_id: input.export_id,
      metadata: input.metadata,
    });
  }
}
