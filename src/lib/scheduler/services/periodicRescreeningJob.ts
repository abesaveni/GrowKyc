import type { ScheduledJob } from '../models/scheduledJob';
import type { PeriodicRescreeningJobResult } from '../models/periodicRescreeningJobResult';
import {
  emitPeriodicRescreeningJobCompletedAuditEvent,
  emitPeriodicRescreeningJobFailedAuditEvent,
  emitPeriodicRescreeningJobNoopAuditEvent,
  emitPeriodicRescreeningJobStartedAuditEvent,
  type IPeriodicRescreeningJobAuditWriter,
  type PeriodicRescreeningJobAuditEvent,
} from './periodicRescreeningJobAuditHooks';

export interface RunPeriodicRescreeningInput {
  tenant_id: string;
  scheduled_at: string;
}

export interface PeriodicRescreeningRunSummary {
  due_review_count: number;
  processed_review_count: number;
  metadata?: Record<string, unknown>;
}

export interface IPeriodicRescreeningService {
  runDuePeriodicReviews(input: RunPeriodicRescreeningInput): Promise<PeriodicRescreeningRunSummary>;
}

export interface RunPeriodicRescreeningJobInput {
  job: ScheduledJob & { job_type: 'periodic_rescreening' };
  triggered_at?: string;
}

export interface PeriodicRescreeningJobDependencies {
  periodic_rescreening_service: IPeriodicRescreeningService;
  on_audit_event?: (event: PeriodicRescreeningJobAuditEvent) => Promise<void>;
  audit_writer?: IPeriodicRescreeningJobAuditWriter;
  now?: () => string;
}

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Periodic rescreening scheduled job is server-side only.');
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

export class PeriodicRescreeningJobHandler {
  private readonly periodicRescreeningService: IPeriodicRescreeningService;
  private readonly auditWriter?: IPeriodicRescreeningJobAuditWriter;
  private readonly now: () => string;

  constructor(dependencies: PeriodicRescreeningJobDependencies) {
    assertServerRuntime();

    this.periodicRescreeningService = dependencies.periodic_rescreening_service;
    this.auditWriter = dependencies.audit_writer ?? (dependencies.on_audit_event
      ? {
          writePeriodicRescreeningJobAuditEvent: dependencies.on_audit_event,
        }
      : undefined);
    this.now = dependencies.now ?? defaultNow;
  }

  async run(input: RunPeriodicRescreeningJobInput): Promise<PeriodicRescreeningJobResult> {
    const started_at = input.triggered_at ?? this.now();

    await emitPeriodicRescreeningJobStartedAuditEvent(this.auditWriter, {
      job_id: input.job.job_id,
      tenant_id: input.job.tenant_id,
      occurred_at: started_at,
    });

    try {
      const runSummary = await this.periodicRescreeningService.runDuePeriodicReviews({
        tenant_id: input.job.tenant_id,
        scheduled_at: started_at,
      });

      const due_review_count = safeCount(runSummary.due_review_count);
      const processed_review_count = safeCount(runSummary.processed_review_count);
      const completed_at = this.now();

      if (due_review_count === 0) {
        await emitPeriodicRescreeningJobNoopAuditEvent(this.auditWriter, {
          job_id: input.job.job_id,
          tenant_id: input.job.tenant_id,
          occurred_at: completed_at,
          due_review_count,
          processed_review_count,
          metadata: runSummary.metadata,
        });

        return {
          job_id: input.job.job_id,
          tenant_id: input.job.tenant_id,
          job_type: 'periodic_rescreening',
          status: 'no_op',
          started_at,
          completed_at,
          due_review_count,
          processed_review_count,
          metadata: runSummary.metadata,
        };
      }

      await emitPeriodicRescreeningJobCompletedAuditEvent(this.auditWriter, {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        occurred_at: completed_at,
        due_review_count,
        processed_review_count,
        metadata: runSummary.metadata,
      });

      return {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        job_type: 'periodic_rescreening',
        status: 'processed',
        started_at,
        completed_at,
        due_review_count,
        processed_review_count,
        metadata: runSummary.metadata,
      };
    } catch (error) {
      const completed_at = this.now();
      const message = error instanceof Error ? error.message : 'Unknown periodic rescreening error';

      await emitPeriodicRescreeningJobFailedAuditEvent(this.auditWriter, {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        occurred_at: completed_at,
        reason_code: 'periodic_rescreening_failed',
        metadata: {
          message,
        },
      });

      return {
        job_id: input.job.job_id,
        tenant_id: input.job.tenant_id,
        job_type: 'periodic_rescreening',
        status: 'failed',
        started_at,
        completed_at,
        due_review_count: 0,
        processed_review_count: 0,
        metadata: {
          message,
        },
      };
    }
  }
}

export async function runPeriodicRescreeningScheduledJob(
  dependencies: PeriodicRescreeningJobDependencies,
  input: RunPeriodicRescreeningJobInput
): Promise<PeriodicRescreeningJobResult> {
  return new PeriodicRescreeningJobHandler(dependencies).run(input);
}
