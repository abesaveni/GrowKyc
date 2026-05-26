import type { ProviderRequest } from '../../contracts/providerRequest';
import type { PEPProviderRequest, PEPScreeningRequestPayload } from './pepTypes';

export function mapPEPRequest(
  request: ProviderRequest<PEPScreeningRequestPayload>
): PEPProviderRequest {
  return {
    referenceId: request.requestId,
    name: request.payload.fullName,
    aliases: request.payload.aliases ?? [],
    dateOfBirth: request.payload.dateOfBirth,
    nationality: request.payload.nationality,
    countryOfResidence: request.payload.countryOfResidence,
    traceId: request.traceId,
  };
}
