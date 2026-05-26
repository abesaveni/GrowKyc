import type { JobStatus } from '../models/jobStatus';
import type { ScheduledJob } from '../models/scheduledJob';
import type { SchedulerRunnerInput } from '../models/schedulerRunnerInput';
import type { SchedulerRunnerKnownResult, SchedulerRunnerOutput, SchedulerRunnerUnsupportedResult } from '../models/schedulerRunnerOutput';
import {
  runDocumentExpiryCheckScheduledJob,
  type DocumentExpiryCheckJobDependencies,
} from './documentExpiryCheckJob';
import {
  runPeriodicRescreeningScheduledJob,
  type PeriodicRescreeningJobDependencies,
} from './periodicRescreeningJob';

export interface SchedulerJobStatusUpdateInput {
  job: ScheduledJob;
  status: JobStatus;
  occurred_at: string;
  metadata?: Record<string, unknown>;
}

export type SchedulerJobStatusUpdateHook = (
  input: SchedulerJobStatusUpdateInput
) => Promise<void> | void;

export interface SchedulerRunnerDependencies {
  periodic_rescreening_job?: PeriodicRescreeningJobDependencies;
  document_expiry_check_job?: DocumentExpiryCheckJobDependencies;
  on_job_status_update?: SchedulerJobStatusUpdateHook;
  now?: () => string;
}

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Scheduler runner is server-side only.');
  }
}

const defaultNow = (): string => {
  return new Date().toISOString();
};

function isPeriodicRescreeningJob(job: ScheduledJob): job is ScheduledJob & { job_type: 'periodic_rescreening' } {
  return job.job_type === 'periodic_rescreening';
}

function isDocumentExpiryCheckJob(job: ScheduledJob): job is ScheduledJob & { job_type: 'document_expiry_check' } {
  return job.job_type === 'document_expiry_check';
}

function mapResultToJobStatus(result: SchedulerRunnerOutput): JobStatus {
  if (result.status === 'failed') {
    return 'failed';
  }

  if (result.status === 'unsupported') {
    return 'failed';
  }

  return 'completed';
}

export class SchedulerRunner {
  private readonly periodicRescreeningJobDependencies?: PeriodicRescreeningJobDependencies;
  private readonly documentExpiryCheckJobDependencies?: DocumentExpiryCheckJobDependencies;
  private readonly onJobStatusUpdate?: SchedulerJobStatusUpdateHook;
  private readonly now: () => string;

  constructor(dependencies: SchedulerRunnerDependencies = {}) {
    assertServerRuntime();

    this.periodicRescreeningJobDependencies = dependencies.periodic_rescreening_job;
    this.documentExpiryCheckJobDependencies = dependencies.document_expiry_check_job;
    this.onJobStatusUpdate = dependencies.on_job_status_update;
    this.now = dependencies.now ?? defaultNow;
  }

  private async emitJobStatusUpdate(input: SchedulerJobStatusUpdateInput): Promise<void> {
    if (!this.onJobStatusUpdate) {
      return;
    }

    await this.onJobStatusUpdate(input);
  }

  private buildUnsupportedResult(input: SchedulerRunnerInput, started_at: string): SchedulerRunnerUnsupportedResult {
    return {
      job_id: input.job.job_id,
      tenant_id: input.job.tenant_id,
      job_type: input.job.job_type,
      status: 'unsupported',
      started_at,
      completed_at: this.now(),
      metadata: {
        reason_code: 'unknown_or_unconfigured_job_type',
      },
    };
  }

  async run(input: SchedulerRunnerInput): Promise<SchedulerRunnerOutput> {
    const started_at = input.triggered_at ?? this.now();

    await this.emitJobStatusUpdate({
      job: input.job,
      status: 'running',
      occurred_at: started_at,
    });

    let output: SchedulerRunnerOutput;

    if (isPeriodicRescreeningJob(input.job) && this.periodicRescreeningJobDependencies) {
      output = await runPeriodicRescreeningScheduledJob(
        {
          ...this.periodicRescreeningJobDependencies,
          now: this.now,
        },
        {
          job: input.job,
          triggered_at: started_at,
        }
      );
    } else if (isDocumentExpiryCheckJob(input.job) && this.documentExpiryCheckJobDependencies) {
      output = await runDocumentExpiryCheckScheduledJob(
        {
          ...this.documentExpiryCheckJobDependencies,
          now: this.now,
        },
        {
          job: input.job,
          triggered_at: started_at,
        }
      );
    } else {
      output = this.buildUnsupportedResult(input, started_at);
    }

    await this.emitJobStatusUpdate({
      job: input.job,
      status: mapResultToJobStatus(output),
      occurred_at: this.now(),
      metadata: {
        result_status: output.status,
      },
    });

    return output;
  }
}

export async function runScheduledJob(
  input: SchedulerRunnerInput,
  dependencies: SchedulerRunnerDependencies = {}
): Promise<SchedulerRunnerOutput> {
  return new SchedulerRunner(dependencies).run(input);
}

export function isKnownSchedulerRunnerResult(result: SchedulerRunnerOutput): result is SchedulerRunnerKnownResult {
  return result.status !== 'unsupported';
}
