import type { ProviderRequest } from '../../contracts/providerRequest';
import type { IProviderAdapter } from '../../interfaces/providerAdapter';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type { ProviderStatus } from '../../models/providerStatus';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderError } from '../../models/providerError';
import { mapAdverseMediaRequest } from './adverseMediaRequestMapping';
import { mapAdverseMediaResponse } from './adverseMediaResponseMapping';
import { AdverseMediaSummaryBuilder } from './adverseMediaSummaryBuilder';
import type {
  AdverseMediaNormalizedData,
  AdverseMediaProviderRawResponse,
  AdverseMediaScreeningRequestPayload,
} from './adverseMediaTypes';
import {
  NotConfiguredAdverseMediaExecutionPort,
  type IAdverseMediaExecutionPort,
} from '../../integrations/adverseMedia/adverseMediaExecutionPort';

const ADVERSE_MEDIA_PROVIDER_ID = 'adverse-media-screening';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Adverse media adapter is server-side only.');
  }
}

export interface AdverseMediaScreeningAdapterOptions {
  executionPort?: IAdverseMediaExecutionPort;
  metadata?: ProviderMetadata;
}

export class AdverseMediaScreeningAdapter
  implements
    IProviderAdapter<AdverseMediaScreeningRequestPayload, AdverseMediaNormalizedData, AdverseMediaProviderRawResponse>
{
  readonly metadata: ProviderMetadata;

  private readonly executionPort: IAdverseMediaExecutionPort;
  private readonly summaryBuilder = new AdverseMediaSummaryBuilder();

  constructor(options: AdverseMediaScreeningAdapterOptions = {}) {
    this.executionPort =
      options.executionPort ?? new NotConfiguredAdverseMediaExecutionPort();
    this.metadata =
      options.metadata ??
      {
        id: ADVERSE_MEDIA_PROVIDER_ID,
        name: 'Adverse Media Screening Adapter',
        version: '0.1.0',
        capabilities: ['adverse_media_screening'],
        status: 'unknown',
      };
  }

  async getStatus(): Promise<ProviderStatus> {
    assertServerRuntime();
    return this.executionPort.getStatus();
  }

  async execute(
    request: ProviderRequest<AdverseMediaScreeningRequestPayload>
  ): Promise<NormalizedProviderResult<AdverseMediaNormalizedData, AdverseMediaProviderRawResponse>> {
    assertServerRuntime();

    const startedAtMs = Date.now();

    try {
      const providerRequest = mapAdverseMediaRequest(request);
      const rawResponse = await this.executionPort.executeScreening(providerRequest);
      const normalized = mapAdverseMediaResponse({
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
        message: error instanceof Error ? error.message : 'Adverse media screening failed.',
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
