import type { ProviderRequest } from '../../contracts/providerRequest';
import type { SanctionsProviderRequest, SanctionsScreeningRequestPayload } from './sanctionsTypes';

export function mapSanctionsRequest(
  request: ProviderRequest<SanctionsScreeningRequestPayload>
): SanctionsProviderRequest {
  return {
    referenceId: request.requestId,
    name: request.payload.fullName,
    entityType: request.payload.entityType,
    aliases: request.payload.aliases ?? [],
    dateOfBirth: request.payload.dateOfBirth,
    countryCode: request.payload.countryCode,
    registrationNumber: request.payload.registrationNumber,
    traceId: request.traceId,
  };
}
