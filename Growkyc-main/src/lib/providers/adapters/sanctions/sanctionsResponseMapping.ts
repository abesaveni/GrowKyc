import type { ProviderRequest } from '../../contracts/providerRequest';
import type { ProviderResponse } from '../../contracts/providerResponse';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type {
  SanctionsNormalizedData,
  SanctionsProviderRawResponse,
  SanctionsScreeningRequestPayload,
} from './sanctionsTypes';

export interface MapSanctionsResponseInput {
  request: ProviderRequest<SanctionsScreeningRequestPayload>;
  rawResponse: SanctionsProviderRawResponse;
  providerMetadata: ProviderMetadata;
  startedAtMs: number;
}

export function mapSanctionsResponse(
  input: MapSanctionsResponseInput
): NormalizedProviderResult<SanctionsNormalizedData, SanctionsProviderRawResponse> {
  const durationMs = Math.max(Date.now() - input.startedAtMs, 0);

  const response: ProviderResponse<SanctionsProviderRawResponse> = {
    requestId: input.request.requestId,
    operation: input.request.operation,
    receivedAt: new Date().toISOString(),
    durationMs,
    raw: input.rawResponse,
  };

  const data: SanctionsNormalizedData = {
    referenceId: input.rawResponse.referenceId,
    screeningStatus: input.rawResponse.screeningStatus,
    requiresReview:
      input.rawResponse.screeningStatus === 'possible_match' ||
      input.rawResponse.screeningStatus === 'match',
    matchCount: input.rawResponse.matches.length,
    matches: input.rawResponse.matches.map((match) => ({
      listName: match.listName,
      matchedName: match.matchedName,
      score: match.score,
      program: match.program,
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
