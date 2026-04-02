export type PeriodicRescreeningJobStatus = 'processed' | 'no_op' | 'failed';

export interface PeriodicRescreeningJobResult {
  job_id: string;
  tenant_id: string;
  job_type: 'periodic_rescreening';
  status: PeriodicRescreeningJobStatus;
  started_at: string;
  completed_at: string;
  due_review_count: number;
  processed_review_count: number;
  metadata?: Record<string, unknown>;
}
