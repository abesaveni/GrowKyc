import type { ProviderRequest } from '../../contracts/providerRequest';
import type { AdverseMediaProviderRequest, AdverseMediaScreeningRequestPayload } from './adverseMediaTypes';

export function mapAdverseMediaRequest(
  request: ProviderRequest<AdverseMediaScreeningRequestPayload>
): AdverseMediaProviderRequest {
  return {
    referenceId: request.requestId,
    name: request.payload.fullName,
    aliases: request.payload.aliases ?? [],
    companyName: request.payload.companyName,
    countryCode: request.payload.countryCode,
    traceId: request.traceId,
  };
}
