export interface ProviderRequest<TPayload = unknown> {
  requestId: string;
  operation: string;
  tenantId?: string;
  traceId?: string;
  timeoutMs?: number;
  issuedAt: string;
  payload: TPayload;
}
