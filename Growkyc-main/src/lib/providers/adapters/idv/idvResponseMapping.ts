import type { ProviderRequest } from '../../contracts/providerRequest';
import type { ProviderResponse } from '../../contracts/providerResponse';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type {
  IDVNormalizedData,
  IDVProviderRawResponse,
  IDVScreeningRequestPayload,
} from './idvTypes';

export interface MapIDVResponseInput {
  request: ProviderRequest<IDVScreeningRequestPayload>;
  rawResponse: IDVProviderRawResponse;
  providerMetadata: ProviderMetadata;
  startedAtMs: number;
}

export function mapIDVResponse(
  input: MapIDVResponseInput
): NormalizedProviderResult<IDVNormalizedData, IDVProviderRawResponse> {
  const durationMs = Math.max(Date.now() - input.startedAtMs, 0);

  const response: ProviderResponse<IDVProviderRawResponse> = {
    requestId: input.request.requestId,
    operation: input.request.operation,
    receivedAt: new Date().toISOString(),
    durationMs,
    raw: input.rawResponse,
  };

  const isVerified =
    input.rawResponse.screeningStatus === 'verified' && input.rawResponse.documentValid;

  const data: IDVNormalizedData = {
    referenceId: input.rawResponse.referenceId,
    screeningStatus: input.rawResponse.screeningStatus,
    isVerified,
    documentValid: input.rawResponse.documentValid,
    expiryValidated: input.rawResponse.expiryValidated,
    confidence: input.rawResponse.overallConfidence,
    matchedFieldCount: input.rawResponse.matchedFields.length,
    matches: input.rawResponse.matchedFields.map((match) => ({
      matchField: match.matchField,
      providedValue: match.providedValue,
      verifiedValue: match.verifiedValue,
      confidence: match.confidence,
    })),
    failureReason: input.rawResponse.failureReason,
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
