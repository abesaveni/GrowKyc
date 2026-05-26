import type { ProviderRequest } from '../../contracts/providerRequest';
import type { IProviderAdapter } from '../../interfaces/providerAdapter';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type { ProviderStatus } from '../../models/providerStatus';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderError } from '../../models/providerError';
import { mapIDVRequest } from './idvRequestMapping';
import { mapIDVResponse } from './idvResponseMapping';
import { IDVSummaryBuilder } from './idvSummaryBuilder';
import type {
  IDVNormalizedData,
  IDVProviderRawResponse,
  IDVScreeningRequestPayload,
} from './idvTypes';
import {
  NotConfiguredIDVExecutionPort,
  type IIDVExecutionPort,
} from '../../integrations/idv/idvExecutionPort';

const IDV_PROVIDER_ID = 'idv-screening';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('IDV adapter is server-side only.');
  }
}

export interface IDVScreeningAdapterOptions {
  executionPort?: IIDVExecutionPort;
  metadata?: ProviderMetadata;
}

export class IDVScreeningAdapter
  implements
    IProviderAdapter<IDVScreeningRequestPayload, IDVNormalizedData, IDVProviderRawResponse>
{
  readonly metadata: ProviderMetadata;

  private readonly executionPort: IIDVExecutionPort;
  private readonly summaryBuilder = new IDVSummaryBuilder();

  constructor(options: IDVScreeningAdapterOptions = {}) {
    this.executionPort = options.executionPort ?? new NotConfiguredIDVExecutionPort();
    this.metadata =
      options.metadata ??
      {
        id: IDV_PROVIDER_ID,
        name: 'ID Verification Adapter',
        version: '0.1.0',
        capabilities: ['idv_screening'],
        status: 'unknown',
      };
  }

  async getStatus(): Promise<ProviderStatus> {
    assertServerRuntime();
    return this.executionPort.getStatus();
  }

  async execute(
    request: ProviderRequest<IDVScreeningRequestPayload>
  ): Promise<NormalizedProviderResult<IDVNormalizedData, IDVProviderRawResponse>> {
    assertServerRuntime();

    const startedAtMs = Date.now();

    try {
      const providerRequest = mapIDVRequest(request);
      const rawResponse = await this.executionPort.executeScreening(providerRequest);
      const normalized = mapIDVResponse({
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
        message: error instanceof Error ? error.message : 'ID verification screening failed.',
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
