import type { ProviderRequest } from '../../contracts/providerRequest';
import type { ProviderResponse } from '../../contracts/providerResponse';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type {
  PEPNormalizedData,
  PEPProviderRawResponse,
  PEPScreeningRequestPayload,
} from './pepTypes';

export interface MapPEPResponseInput {
  request: ProviderRequest<PEPScreeningRequestPayload>;
  rawResponse: PEPProviderRawResponse;
  providerMetadata: ProviderMetadata;
  startedAtMs: number;
}

export function mapPEPResponse(
  input: MapPEPResponseInput
): NormalizedProviderResult<PEPNormalizedData, PEPProviderRawResponse> {
  const durationMs = Math.max(Date.now() - input.startedAtMs, 0);

  const response: ProviderResponse<PEPProviderRawResponse> = {
    requestId: input.request.requestId,
    operation: input.request.operation,
    receivedAt: new Date().toISOString(),
    durationMs,
    raw: input.rawResponse,
  };

  const isPEP =
    input.rawResponse.screeningStatus === 'confirmed_pep' ||
    input.rawResponse.screeningStatus === 'possible_pep';

  const data: PEPNormalizedData = {
    referenceId: input.rawResponse.referenceId,
    screeningStatus: input.rawResponse.screeningStatus,
    isPEP,
    riskLevel: input.rawResponse.riskLevel ?? 'unknown',
    matchCount: input.rawResponse.pepMatches.length,
    matches: input.rawResponse.pepMatches.map((match) => ({
      listName: match.pepListName,
      pepName: match.pepName,
      score: match.pepScore,
      position: match.position,
      countryCode: match.countryCode,
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
