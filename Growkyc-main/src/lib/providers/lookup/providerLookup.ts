import type { IProviderAdapter } from '../interfaces/providerAdapter';
import type { ProviderRegistry } from '../registry/providerRegistry';
import { UnsupportedProviderError } from '../errors/unsupportedProviderError';

export interface LookupResult<T extends IProviderAdapter = IProviderAdapter> {
  ok: boolean;
  adapter?: T;
  error?: Error;
}

export class ProviderLookup {
  constructor(private readonly registry: ProviderRegistry) {}

  /**
   * Safe lookup by provider ID.
   * Returns a result object instead of throwing.
   */
  byProviderId(providerId: string): LookupResult {
    const adapter = this.registry.get(providerId);
    if (!adapter) {
      return {
        ok: false,
        error: new UnsupportedProviderError(providerId, this.registry.listCapabilities()),
      };
    }
    return { ok: true, adapter };
  }

  /**
   * Safe lookup by capability/operation type.
   * Returns a result object instead of throwing.
   */
  byCapability(capability: string): LookupResult {
    const adapter = this.registry.getByCapability(capability);
    if (!adapter) {
      return {
        ok: false,
        error: new UnsupportedProviderError(capability, this.registry.listCapabilities()),
      };
    }
    return { ok: true, adapter };
  }

  /**
   * Throws on lookup failure. Use for strict code paths.
   */
  requireByCapability(capability: string): IProviderAdapter {
    const result = this.byCapability(capability);
    if (!result.ok || !result.adapter) {
      throw result.error;
    }
    return result.adapter;
  }

  /**
   * Throws on lookup failure. Use for strict code paths.
   */
  requireByProviderId(providerId: string): IProviderAdapter {
    const result = this.byProviderId(providerId);
    if (!result.ok || !result.adapter) {
      throw result.error;
    }
    return result.adapter;
  }

  /**
   * List all registered capabilities.
   */
  capabilities(): string[] {
    return this.registry.listCapabilities();
  }

  /**
   * Check if capability is available.
   */
  hasCapability(capability: string): boolean {
    return this.registry.getByCapability(capability) !== undefined;
  }
}
