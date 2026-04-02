export interface ProviderResponse<TRaw = unknown> {
  requestId: string;
  operation: string;
  receivedAt: string;
  durationMs: number;
  statusCode?: number;
  raw: TRaw;
}
