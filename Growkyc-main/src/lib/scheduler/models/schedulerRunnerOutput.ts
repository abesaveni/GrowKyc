import type { JobType } from './jobType';
import type { DocumentExpiryCheckJobResult } from './documentExpiryCheckJobResult';
import type { PeriodicRescreeningJobResult } from './periodicRescreeningJobResult';

export type SchedulerRunnerKnownResult = PeriodicRescreeningJobResult | DocumentExpiryCheckJobResult;

export interface SchedulerRunnerUnsupportedResult {
  job_id: string;
  tenant_id: string;
  job_type: JobType;
  status: 'unsupported';
  started_at: string;
  completed_at: string;
  metadata?: Record<string, unknown>;
}

export type SchedulerRunnerOutput = SchedulerRunnerKnownResult | SchedulerRunnerUnsupportedResult;
