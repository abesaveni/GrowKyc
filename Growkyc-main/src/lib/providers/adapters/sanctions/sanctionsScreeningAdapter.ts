import type { ProviderRequest } from '../../contracts/providerRequest';
import type { IProviderAdapter } from '../../interfaces/providerAdapter';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type { ProviderStatus } from '../../models/providerStatus';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderError } from '../../models/providerError';
import { mapSanctionsRequest } from './sanctionsRequestMapping';
import { mapSanctionsResponse } from './sanctionsResponseMapping';
import { SanctionsSummaryBuilder } from './sanctionsSummaryBuilder';
import type {
  SanctionsNormalizedData,
  SanctionsProviderRawResponse,
  SanctionsScreeningRequestPayload,
} from './sanctionsTypes';
import {
  NotConfiguredSanctionsExecutionPort,
  type ISanctionsExecutionPort,
} from '../../integrations/sanctions/sanctionsExecutionPort';

const SANCTIONS_PROVIDER_ID = 'sanctions-screening';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Sanctions adapter is server-side only.');
  }
}

export interface SanctionsScreeningAdapterOptions {
  executionPort?: ISanctionsExecutionPort;
  metadata?: ProviderMetadata;
}

export class SanctionsScreeningAdapter
  implements
    IProviderAdapter<SanctionsScreeningRequestPayload, SanctionsNormalizedData, SanctionsProviderRawResponse>
{
  readonly metadata: ProviderMetadata;

  private readonly executionPort: ISanctionsExecutionPort;
  private readonly summaryBuilder = new SanctionsSummaryBuilder();

  constructor(options: SanctionsScreeningAdapterOptions = {}) {
    this.executionPort = options.executionPort ?? new NotConfiguredSanctionsExecutionPort();
    this.metadata =
      options.metadata ??
      {
        id: SANCTIONS_PROVIDER_ID,
        name: 'Sanctions Screening Adapter',
        version: '0.1.0',
        capabilities: ['sanctions_screening'],
        status: 'unknown',
      };
  }

  async getStatus(): Promise<ProviderStatus> {
    assertServerRuntime();
    return this.executionPort.getStatus();
  }

  async execute(
    request: ProviderRequest<SanctionsScreeningRequestPayload>
  ): Promise<NormalizedProviderResult<SanctionsNormalizedData, SanctionsProviderRawResponse>> {
    assertServerRuntime();

    const startedAtMs = Date.now();

    try {
      const providerRequest = mapSanctionsRequest(request);
      const rawResponse = await this.executionPort.executeScreening(providerRequest);
      const normalized = mapSanctionsResponse({
        request,
        rawResponse,
        providerMetadata: this.metadata,
        startedAtMs,
      });

      return {
        ...normalized,
        provider: {
          ...normalized.provider,
          tags: {
            ...(normalized.provider.tags ?? {}),
            summary: this.summaryBuilder.buildSummary(normalized),
          },
        },
      };
    } catch (error) {
      const mappedError: ProviderError = {
        code: 'PROVIDER_UNAVAILABLE',
        message: error instanceof Error ? error.message : 'Sanctions screening failed.',
        providerId: this.metadata.id,
        retryable: true,
        status: 'unavailable',
        cause: error,
      };

      return {
        ok: false,
        provider: this.metadata,
        status: 'unavailable',
        error: mappedError,
      };
    }
  }
}
