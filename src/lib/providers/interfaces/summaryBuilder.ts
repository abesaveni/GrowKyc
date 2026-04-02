import type { NormalizedProviderResult } from '../models/normalizedProviderResult';

export interface IProviderSummaryBuilder<TData = unknown, TRaw = unknown> {
  buildSummary(result: NormalizedProviderResult<TData, TRaw>): string;
}
