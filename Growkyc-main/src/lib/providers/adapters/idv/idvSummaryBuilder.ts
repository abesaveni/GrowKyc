import type { IProviderSummaryBuilder } from '../../interfaces/summaryBuilder';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { IDVNormalizedData, IDVProviderRawResponse } from './idvTypes';

export class IDVSummaryBuilder
  implements IProviderSummaryBuilder<IDVNormalizedData, IDVProviderRawResponse>
{
  buildSummary(result: NormalizedProviderResult<IDVNormalizedData, IDVProviderRawResponse>): string {
    if (!result.ok || !result.data) {
      return 'ID verification screening failed.';
    }

    if (result.data.screeningStatus === 'verified' && result.data.isVerified) {
      const confidence = Math.round(result.data.confidence * 100);
      return `✓ ID VERIFIED for reference ${result.data.referenceId}. Confidence: ${confidence}%. Document valid: ${result.data.documentValid ? 'yes' : 'no'}.`;
    }

    if (result.data.screeningStatus === 'failed') {
      return `✗ ID VERIFICATION FAILED for reference ${result.data.referenceId}. Reason: ${result.data.failureReason ?? 'document mismatch'}. Matched fields: ${result.data.matchedFieldCount}.`;
    }

    if (result.data.screeningStatus === 'manual_review') {
      const confidence = Math.round(result.data.confidence * 100);
      return `⚠️ ID verification requires manual review for reference ${result.data.referenceId}. Confidence: ${confidence}%. Matched fields: ${result.data.matchedFieldCount}.`;
    }

    return `ID verification error for reference ${result.data.referenceId}.`;
  }
}
