import type { IProviderSummaryBuilder } from '../../interfaces/summaryBuilder';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { AdverseMediaNormalizedData, AdverseMediaProviderRawResponse } from './adverseMediaTypes';

export class AdverseMediaSummaryBuilder
  implements IProviderSummaryBuilder<AdverseMediaNormalizedData, AdverseMediaProviderRawResponse>
{
  buildSummary(result: NormalizedProviderResult<AdverseMediaNormalizedData, AdverseMediaProviderRawResponse>): string {
    if (!result.ok || !result.data) {
      return 'Adverse media screening failed.';
    }

    if (result.data.screeningStatus === 'clear') {
      return `Adverse media screening clear for reference ${result.data.referenceId}.`;
    }

    if (result.data.screeningStatus === 'found') {
      return `⚠️ ADVERSE MEDIA FOUND for reference ${result.data.referenceId}. ${result.data.articlesFound} article(s) found. Risk: ${result.data.riskAssessment}.`;
    }

    if (result.data.screeningStatus === 'requires_review') {
      return `⚠️ Adverse media screening requires review for reference ${result.data.referenceId}. ${result.data.articlesFound} article(s) found. Risk: ${result.data.riskAssessment}.`;
    }

    return `Adverse media screening error for reference ${result.data.referenceId}.`;
  }
}
