import type { ExportAuthorizationActor } from '../models/exportAuthorizationResult';
import type { ExportFormat } from '../models/exportFormat';
import type { ExportRequest } from '../models/exportRequest';
import type { ExportResponse } from '../models/exportResponse';
import type { ExportTargetType } from '../models/exportTargetType';
import {
  ExportEndpointService,
  type ExportEndpointServiceDependencies,
  type RequestExportInput,
} from './exportEndpointService';

export interface ExportServiceRequestBody {
  target_id?: string;
  format?: ExportFormat;
  case_id?: string;
  metadata?: Record<string, unknown>;
}

export interface ExportServiceRequestContext {
  actor: ExportAuthorizationActor;
}

export interface ExportServiceRequest {
  body: ExportServiceRequestBody;
  context: ExportServiceRequestContext;
}

export interface ExportServiceDependencies extends ExportEndpointServiceDependencies {}

export class ExportServiceValidationError extends Error {
  readonly statusCode = 400;
}

const ALLOWED_FORMATS: ExportFormat[] = ['pdf', 'csv', 'json'];

const buildExportRequestInput = (
  input: ExportServiceRequest,
  target_type: ExportTargetType,
): RequestExportInput => {
  if (!input.body.target_id || input.body.target_id.trim().length === 0) {
    throw new ExportServiceValidationError('target_id is required');
  }

  if (!input.body.format || !ALLOWED_FORMATS.includes(input.body.format)) {
    throw new ExportServiceValidationError("format must be one of 'pdf', 'csv', or 'json'");
  }

  const request: ExportRequest = {
    tenant_id: input.context.actor.tenant_id,
    case_id: input.body.case_id,
    target_type,
    target_id: input.body.target_id,
    format: input.body.format,
    requested_by: input.context.actor.user_id,
    metadata: input.body.metadata,
  };

  return {
    request,
    actor: input.context.actor,
  };
};

export class ExportService {
  private readonly endpointService: ExportEndpointService;

  constructor(dependencies: ExportServiceDependencies = {}) {
    this.endpointService = new ExportEndpointService(dependencies);
  }

  async requestReportExport(input: ExportServiceRequest): Promise<ExportResponse> {
    return this.endpointService.requestExport(buildExportRequestInput(input, 'report'));
  }

  async requestAuditPackExport(input: ExportServiceRequest): Promise<ExportResponse> {
    return this.endpointService.requestExport(buildExportRequestInput(input, 'audit_pack'));
  }

  async requestEvidenceBundleExport(input: ExportServiceRequest): Promise<ExportResponse> {
    return this.endpointService.requestExport(buildExportRequestInput(input, 'evidence_bundle'));
  }

  async auditExportDownloaded(input: {
    request: ExportRequest;
    actor_user_id?: string;
    export_id?: string;
    occurred_at?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.endpointService.auditExportDownloaded(input);
  }
}
