import type { ProviderRequest } from '../../contracts/providerRequest';
import type { IDVProviderRequest, IDVScreeningRequestPayload } from './idvTypes';

export function mapIDVRequest(
  request: ProviderRequest<IDVScreeningRequestPayload>
): IDVProviderRequest {
  return {
    referenceId: request.requestId,
    name: request.payload.fullName,
    dateOfBirth: request.payload.dateOfBirth,
    documentType: request.payload.documentType,
    documentNumber: request.payload.documentNumber,
    countryCode: request.payload.countryCode,
    expiryDate: request.payload.expiryDate,
    traceId: request.traceId,
  };
}
