import type { IProviderSummaryBuilder } from '../../interfaces/summaryBuilder';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { RegistryNormalizedData, RegistryProviderRawResponse } from './registryTypes';

export class RegistrySummaryBuilder
  implements IProviderSummaryBuilder<RegistryNormalizedData, RegistryProviderRawResponse>
{
  buildSummary(result: NormalizedProviderResult<RegistryNormalizedData, RegistryProviderRawResponse>): string {
    if (!result.ok || !result.data) {
      return 'Registry screening failed.';
    }

    if (result.data.screeningStatus === 'not_found') {
      return `Entity not found in registry for reference ${result.data.referenceId}.`;
    }

    if (result.data.screeningStatus === 'found') {
      if (result.data.isActive) {
        return `✓ Entity FOUND and ACTIVE in registry for reference ${result.data.referenceId}. ${result.data.matchCount} match(es).`;
      } else {
        return `⚠️ Entity FOUND but INACTIVE in registry for reference ${result.data.referenceId}. ${result.data.matchCount} match(es).`;
      }
    }

    if (result.data.screeningStatus === 'inactive') {
      return `⚠️ Entity registered but INACTIVE for reference ${result.data.referenceId}.`;
    }

    return `Registry screening error for reference ${result.data.referenceId}.`;
  }
}
