import type { IProviderSummaryBuilder } from '../../interfaces/summaryBuilder';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { PEPNormalizedData, PEPProviderRawResponse } from './pepTypes';

export class PEPSummaryBuilder
  implements IProviderSummaryBuilder<PEPNormalizedData, PEPProviderRawResponse>
{
  buildSummary(result: NormalizedProviderResult<PEPNormalizedData, PEPProviderRawResponse>): string {
    if (!result.ok || !result.data) {
      return 'PEP screening failed.';
    }

    if (result.data.screeningStatus === 'clear') {
      return `PEP screening clear for reference ${result.data.referenceId}.`;
    }

    if (result.data.screeningStatus === 'confirmed_pep') {
      return `⚠️ PEP CONFIRMED for reference ${result.data.referenceId}. Risk level: ${result.data.riskLevel}. ${result.data.matchCount} match(es) found.`;
    }

    return `⚠️ PEP screening requires review for reference ${result.data.referenceId}. Risk level: ${result.data.riskLevel}. ${result.data.matchCount} possible match(es).`;
  }
}
