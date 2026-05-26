import type { JobStatus } from './jobStatus';
import type { JobType } from './jobType';

export interface ScheduledJob {
  job_id: string;
  tenant_id: string;
  job_type: JobType;
  status: JobStatus;
  scheduled_at: string;
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}
