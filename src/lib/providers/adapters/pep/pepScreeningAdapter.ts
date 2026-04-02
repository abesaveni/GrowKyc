import type { ProviderRequest } from '../../contracts/providerRequest';
import type { IProviderAdapter } from '../../interfaces/providerAdapter';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type { ProviderStatus } from '../../models/providerStatus';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderError } from '../../models/providerError';
import { mapPEPRequest } from './pepRequestMapping';
import { mapPEPResponse } from './pepResponseMapping';
import { PEPSummaryBuilder } from './pepSummaryBuilder';
import type {
  PEPNormalizedData,
  PEPProviderRawResponse,
  PEPScreeningRequestPayload,
} from './pepTypes';
import {
  NotConfiguredPEPExecutionPort,
  type IPEPExecutionPort,
} from '../../integrations/pep/pepExecutionPort';

const PEP_PROVIDER_ID = 'pep-screening';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('PEP adapter is server-side only.');
  }
}

export interface PEPScreeningAdapterOptions {
  executionPort?: IPEPExecutionPort;
  metadata?: ProviderMetadata;
}

export class PEPScreeningAdapter
  implements
    IProviderAdapter<PEPScreeningRequestPayload, PEPNormalizedData, PEPProviderRawResponse>
{
  readonly metadata: ProviderMetadata;

  private readonly executionPort: IPEPExecutionPort;
  private readonly summaryBuilder = new PEPSummaryBuilder();

  constructor(options: PEPScreeningAdapterOptions = {}) {
    this.executionPort = options.executionPort ?? new NotConfiguredPEPExecutionPort();
    this.metadata =
      options.metadata ??
      {
        id: PEP_PROVIDER_ID,
        name: 'PEP Screening Adapter',
        version: '0.1.0',
        capabilities: ['pep_screening'],
        status: 'unknown',
      };
  }

  async getStatus(): Promise<ProviderStatus> {
    assertServerRuntime();
    return this.executionPort.getStatus();
  }

  async execute(
    request: ProviderRequest<PEPScreeningRequestPayload>
  ): Promise<NormalizedProviderResult<PEPNormalizedData, PEPProviderRawResponse>> {
    assertServerRuntime();

    const startedAtMs = Date.now();

    try {
      const providerRequest = mapPEPRequest(request);
      const rawResponse = await this.executionPort.executeScreening(providerRequest);
      const normalized = mapPEPResponse({
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
        message: error instanceof Error ? error.message : 'PEP screening failed.',
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
