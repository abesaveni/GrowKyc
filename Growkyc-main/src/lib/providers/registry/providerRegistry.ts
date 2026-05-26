import type { IProviderAdapter } from '../interfaces/providerAdapter';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Provider registry is server-side only.');
  }
}

export class ProviderRegistry {
  private readonly adapters = new Map<string, IProviderAdapter>();

  constructor() {
    assertServerRuntime();
  }

  register(adapter: IProviderAdapter): void {
    this.adapters.set(adapter.metadata.id, adapter);
  }

  unregister(providerId: string): void {
    this.adapters.delete(providerId);
  }

  get(providerId: string): IProviderAdapter | undefined {
    return this.adapters.get(providerId);
  }

  has(providerId: string): boolean {
    return this.adapters.has(providerId);
  }

  list(): IProviderAdapter[] {
    return Array.from(this.adapters.values());
  }

  getByCapability(capability: string): IProviderAdapter | undefined {
    for (const adapter of this.adapters.values()) {
      if (adapter.metadata.capabilities.includes(capability)) {
        return adapter;
      }
    }
    return undefined;
  }

  listCapabilities(): string[] {
    const capabilities = new Set<string>();
    for (const adapter of this.adapters.values()) {
      adapter.metadata.capabilities.forEach((cap) => capabilities.add(cap));
    }
    return Array.from(capabilities);
  }
}

export function buildProviderRegistry(): ProviderRegistry {
  return new ProviderRegistry();
}
