import type { ProviderRequest } from '../../contracts/providerRequest';
import type { ProviderResponse } from '../../contracts/providerResponse';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type {
  RegistryNormalizedData,
  RegistryProviderRawResponse,
  RegistryScreeningRequestPayload,
} from './registryTypes';

export interface MapRegistryResponseInput {
  request: ProviderRequest<RegistryScreeningRequestPayload>;
  rawResponse: RegistryProviderRawResponse;
  providerMetadata: ProviderMetadata;
  startedAtMs: number;
}

export function mapRegistryResponse(
  input: MapRegistryResponseInput
): NormalizedProviderResult<RegistryNormalizedData, RegistryProviderRawResponse> {
  const durationMs = Math.max(Date.now() - input.startedAtMs, 0);

  const response: ProviderResponse<RegistryProviderRawResponse> = {
    requestId: input.request.requestId,
    operation: input.request.operation,
    receivedAt: new Date().toISOString(),
    durationMs,
    raw: input.rawResponse,
  };

  const isActive =
    input.rawResponse.screeningStatus === 'found' &&
    !input.rawResponse.matches.some((m) => m.status.toLowerCase() === 'inactive');

  const data: RegistryNormalizedData = {
    referenceId: input.rawResponse.referenceId,
    screeningStatus: input.rawResponse.screeningStatus,
    matchFound: input.rawResponse.matchFound,
    isActive,
    matchCount: input.rawResponse.matches.length,
    matches: input.rawResponse.matches.map((match) => ({
      registryName: match.registryName,
      matchedName: match.matchedName,
      registrationNumber: match.registrationNumber,
      status: match.status,
      registrationDate: match.registrationDate,
      jurisdiction: match.jurisdiction,
    })),
  };

  const hasErrorStatus = input.rawResponse.screeningStatus === 'error';

  return {
    ok: !hasErrorStatus,
    provider: input.providerMetadata,
    status: hasErrorStatus ? 'degraded' : input.providerMetadata.status,
    response,
    data,
  };
}
