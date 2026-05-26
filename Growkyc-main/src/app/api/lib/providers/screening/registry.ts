import { ScreeningProviderAdapter } from './interfaces';
import { ScreeningCheckType } from './types';
import { PlaceholderScreeningAdapter } from './adapters/placeholderScreeningAdapter';
import { EquifaxScreeningAdapter } from './adapters/equifaxScreeningAdapter';
import { IllionScreeningAdapter } from './adapters/illionScreeningAdapter';
import { SanctionsScreeningAdapter } from './adapters/sanctionsScreeningAdapter';

export interface ScreeningProviderRegistry {
  getAdapter(providerName: string): ScreeningProviderAdapter | undefined;
  getAdaptersForCheck(checkType: ScreeningCheckType): ScreeningProviderAdapter[];
  listProviderNames(): string[];
}

const DEFAULT_PROVIDERS: Array<{ name: string; checks: ScreeningCheckType[] }> = [
  {
    name: 'compliance_stub',
    checks: [
      'sanctions_screening',
      'pep_screening',
      'adverse_media',
      'id_verification',
      'registry_check',
    ],
  },
  {
    name: 'registry_stub',
    checks: ['registry_check'],
  },
];

function getRuntimeEnvVar(key: string): string | undefined {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  const value = processEnv[key] ?? viteEnv[key];

  if (typeof value !== 'string') {
    return undefined;
  }

  return value;
}

function shouldEnablePlaceholderAdapters(): boolean {
  const runtimeMode = (getRuntimeEnvVar('APP_ENV') ?? getRuntimeEnvVar('NODE_ENV') ?? 'development')
    .trim()
    .toLowerCase();
  const explicitAllow = (getRuntimeEnvVar('ALLOW_PLACEHOLDER_SCREENING_ADAPTERS') ?? 'false')
    .trim()
    .toLowerCase();

  if (runtimeMode === 'production') {
    return explicitAllow === 'true';
  }

  return true;
}

class InMemoryScreeningProviderRegistry implements ScreeningProviderRegistry {
  private readonly adapters = new Map<string, ScreeningProviderAdapter>();

  constructor(adapters: ScreeningProviderAdapter[]) {
    for (const adapter of adapters) {
      this.adapters.set(adapter.providerName.toLowerCase(), adapter);
    }
  }

  getAdapter(providerName: string): ScreeningProviderAdapter | undefined {
    return this.adapters.get(providerName.toLowerCase());
  }

  getAdaptersForCheck(checkType: ScreeningCheckType): ScreeningProviderAdapter[] {
    return Array.from(this.adapters.values()).filter((adapter) =>
      adapter.supportedChecks.includes(checkType)
    );
  }

  listProviderNames(): string[] {
    return Array.from(this.adapters.values()).map((adapter) => adapter.providerName);
  }
}

function buildDefaultAdapters(): ScreeningProviderAdapter[] {
  const adapters: ScreeningProviderAdapter[] = [
    new EquifaxScreeningAdapter(),
    new IllionScreeningAdapter(),
    new SanctionsScreeningAdapter(),
  ];

  if (shouldEnablePlaceholderAdapters()) {
    const placeholders = DEFAULT_PROVIDERS.map(
      (entry) => new PlaceholderScreeningAdapter(entry.name, entry.checks)
    );
    adapters.push(...placeholders);
  }

  return adapters;
}

export function buildScreeningProviderRegistry(): ScreeningProviderRegistry {
  return new InMemoryScreeningProviderRegistry(buildDefaultAdapters());
}

export const screeningProviderRegistry = buildScreeningProviderRegistry();
