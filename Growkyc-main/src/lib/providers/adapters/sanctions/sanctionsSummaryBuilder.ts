import type { IProviderSummaryBuilder } from '../../interfaces/summaryBuilder';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { SanctionsNormalizedData, SanctionsProviderRawResponse } from './sanctionsTypes';

export class SanctionsSummaryBuilder
  implements IProviderSummaryBuilder<SanctionsNormalizedData, SanctionsProviderRawResponse>
{
  buildSummary(result: NormalizedProviderResult<SanctionsNormalizedData, SanctionsProviderRawResponse>): string {
    if (!result.ok || !result.data) {
      return 'Sanctions screening failed.';
    }

    if (result.data.screeningStatus === 'clear') {
      return `Sanctions screening clear for reference ${result.data.referenceId}.`;
    }

    return `Sanctions screening requires review for reference ${result.data.referenceId} with ${result.data.matchCount} potential match(es).`;
  }
}
