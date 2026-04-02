import type { ScheduledJob } from '../models/scheduledJob';
import type { DocumentExpiryCheckJobResult } from '../models/documentExpiryCheckJobResult';
import {
  emitDocumentExpiryCheckJobCompletedAuditEvent,
  emitDocumentExpiryCheckJobFailedAuditEvent,
  emitDocumentExpiryCheckJobNoopAuditEvent,
  emitDocumentExpiryCheckJobStartedAuditEvent,
  type DocumentExpiryCheckJobAuditEvent,
  type IDocumentExpiryCheckJobAuditWriter,
} from './documentExpiryCheckJobAuditHooks';

export interface RunDocumentExpiryCheckInput {
  tenant_id: string;
  scheduled_at: string;
}

export interface DocumentExpiryCheckSummary {
  due_document_count: number;
  evaluated_document_count: number;
  expired_document_count: number;
  metadata?: Record<string, unknown>;
}

export interface IDocumentExpiryService {
  evaluateDueDocumentExpiry(input: RunDocumentExpiryCheckInput): Promise<DocumentExpiryCheckSummary>;
}

export interface RunDocumentExpiryCheckJobInput {
  job: ScheduledJob & { job_type: 'document_expiry_check' };
  triggered_at?: string;
}

export interface DocumentExpiryCheckJobDependencies {
  document_expiry_service: IDocumentExpiryService;
  on_audit_event?: (event: DocumentExpiryCheckJobAuditEvent) => Promise<void>;
  audit_writer?: IDocumentExpiryCheckJobAuditWriter;
  now?: () => string;
}

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Document expiry scheduled job is server-side only.');
  }
}

const defaultNow = (): string => {
  return new Date().toISOString();
};

function safeCount(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

export class DocumentExpiryCheckJobHandler {
  private readonly documentExpiryService: IDocumentExpiryService;
  private readonly auditWriter?: IDocumentExpiryCheckJobAuditWriter;
  private readonly now: () => string;

  constructor(dependencies: DocumentExpiryCheckJobDependencies) {
    assertServerRuntime();

    this.documentExpiryService = dependencies.document_expiry_service;
    this.auditWriter = dependencies.audit_writer ?? (dependencies.on_audit_event
      ? {
          writeDocumentExpiryCheckJobAuditEvent: dependencies.on_audit_event,
        }
      : undefined);
    this.now = dependencies.now ?? defaultNow;
  }

  async run(input: RunDocumentExpiryCheckJobInput): Promise<DocumentExpiryCheckJobResult> {
    const started_at = input.triggered_at ?? this.now();

    await emitDocumentExpiryCheckJobStartedAuditEvent(this.auditWriter, {
      job_id: input.job.job_id,
      tenant_id: input.job.tenant_id,
      occurred_at: started_at,
    });

    try {
      const summary = await this.documentExpiryService.evaluateDueDocumentExpiry({
        tenant_id: input.job.tenant_id,
        scheduled_at: started_at,
      });

      const due_document_count = safeCount(summary.due_document_count);
      const evaluated_document_count = safeCount(summary.evaluated_document_count);
      const expired_document_count = safeCount(summary.expired_document_count);
      const completed_at = this.now();

      if (due_document_count === 0) {
        await emitDocumentExpiryCheckJobNoopAuditEvent(this.auditWriter, {
          job_id: input.job.job_id,
          tenant_id: input.job.tenant_id,
          occurred_at: completed_at,
          due_document_count,
          evaluated_document_count,
          expired_document_count,
          metadata: summary.metadata,
        });

        return {
          job_id: input.job.job_id,
          tenant_id: input.job.tenant_id,
          job_type: 'document_expiry_check',
          status: 'no_op',
          started_at,
          completed_at,
          due_document_count,
          evaluated_document_count,
          expired_document_count,
          metadata: summary.metadata,
        };
      }

      await emitDocumentExpiryCheckJobCompletedAuditEvent(this.auditWriter, {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        occurred_at: completed_at,
        due_document_count,
        evaluated_document_count,
        expired_document_count,
        metadata: summary.metadata,
      });

      return {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        job_type: 'document_expiry_check',
        status: 'processed',
        started_at,
        completed_at,
        due_document_count,
        evaluated_document_count,
        expired_document_count,
        metadata: summary.metadata,
      };
    } catch (error) {
      const completed_at = this.now();
      const message = error instanceof Error ? error.message : 'Unknown document expiry error';

      await emitDocumentExpiryCheckJobFailedAuditEvent(this.auditWriter, {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        occurred_at: completed_at,
        reason_code: 'document_expiry_check_failed',
        metadata: {
          message,
        },
      });

      return {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        job_type: 'document_expiry_check',
        status: 'failed',
        started_at,
        completed_at,
        due_document_count: 0,
        evaluated_document_count: 0,
        expired_document_count: 0,
        metadata: {
          message,
        },
      };
    }
  }
}

export async function runDocumentExpiryCheckScheduledJob(
  dependencies: DocumentExpiryCheckJobDependencies,
  input: RunDocumentExpiryCheckJobInput
): Promise<DocumentExpiryCheckJobResult> {
  return new DocumentExpiryCheckJobHandler(dependencies).run(input);
}
