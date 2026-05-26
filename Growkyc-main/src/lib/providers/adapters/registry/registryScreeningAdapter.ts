import type { ProviderRequest } from '../../contracts/providerRequest';
import type { IProviderAdapter } from '../../interfaces/providerAdapter';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type { ProviderStatus } from '../../models/providerStatus';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderError } from '../../models/providerError';
import { mapRegistryRequest } from './registryRequestMapping';
import { mapRegistryResponse } from './registryResponseMapping';
import { RegistrySummaryBuilder } from './registrySummaryBuilder';
import type {
  RegistryNormalizedData,
  RegistryProviderRawResponse,
  RegistryScreeningRequestPayload,
} from './registryTypes';
import {
  NotConfiguredRegistryExecutionPort,
  type IRegistryExecutionPort,
} from '../../integrations/registry/registryExecutionPort';

const REGISTRY_PROVIDER_ID = 'registry-checks';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Registry adapter is server-side only.');
  }
}

export interface RegistryScreeningAdapterOptions {
  executionPort?: IRegistryExecutionPort;
  metadata?: ProviderMetadata;
}

export class RegistryScreeningAdapter
  implements
    IProviderAdapter<RegistryScreeningRequestPayload, RegistryNormalizedData, RegistryProviderRawResponse>
{
  readonly metadata: ProviderMetadata;

  private readonly executionPort: IRegistryExecutionPort;
  private readonly summaryBuilder = new RegistrySummaryBuilder();

  constructor(options: RegistryScreeningAdapterOptions = {}) {
    this.executionPort =
      options.executionPort ?? new NotConfiguredRegistryExecutionPort();
    this.metadata =
      options.metadata ??
      {
        id: REGISTRY_PROVIDER_ID,
        name: 'Registry Checks Adapter',
        version: '0.1.0',
        capabilities: ['registry_checks'],
        status: 'unknown',
      };
  }

  async getStatus(): Promise<ProviderStatus> {
    assertServerRuntime();
    return this.executionPort.getStatus();
  }

  async execute(
    request: ProviderRequest<RegistryScreeningRequestPayload>
  ): Promise<NormalizedProviderResult<RegistryNormalizedData, RegistryProviderRawResponse>> {
    assertServerRuntime();

    const startedAtMs = Date.now();

    try {
      const providerRequest = mapRegistryRequest(request);
      const rawResponse = await this.executionPort.executeScreening(providerRequest);
      const normalized = mapRegistryResponse({
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
        message: error instanceof Error ? error.message : 'Registry screening failed.',
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
