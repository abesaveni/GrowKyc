import type { ProviderStatus } from './providerStatus';

export interface ProviderMetadata {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
  status: ProviderStatus;
  region?: string;
  tags?: Record<string, string>;
}
