import type { ProviderRequest } from '../../contracts/providerRequest';
import type { RegistryProviderRequest, RegistryScreeningRequestPayload } from './registryTypes';

export function mapRegistryRequest(
  request: ProviderRequest<RegistryScreeningRequestPayload>
): RegistryProviderRequest {
  return {
    referenceId: request.requestId,
    entityType: request.payload.entityType,
    entityName: request.payload.entityName,
    registrationNumber: request.payload.registrationNumber,
    countryCode: request.payload.countryCode,
    registryType: request.payload.registryType,
    traceId: request.traceId,
  };
}
