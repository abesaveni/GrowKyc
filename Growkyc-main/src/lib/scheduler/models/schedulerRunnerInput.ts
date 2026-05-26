import type { ScheduledJob } from './scheduledJob';

export interface SchedulerRunnerInput {
  job: ScheduledJob;
  triggered_at?: string;
}
