import { ScreeningProviderAdapter } from './interfaces';
import { ScreeningCheckType } from './types';
import { PlaceholderScreeningAdapter } from './adapters/placeholderScreeningAdapter';
import { RealSanctionsAdapter } from './adapters/realSanctionsAdapter';
import { RealPepAdapter } from './adapters/realPepAdapter';
import { RealAdverseMediaAdapter } from './adapters/realAdverseMediaAdapter';
import { RealIdvAdapter } from './adapters/realIdvAdapter';
import { RealRegistryAdapter } from './adapters/realRegistryAdapter';

export interface ScreeningProviderRegistry {
  getAdapter(providerName: string): ScreeningProviderAdapter | undefined;
  getAdaptersForCheck(checkType: ScreeningCheckType): ScreeningProviderAdapter[];
  listProviderNames(): string[];
}

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

function buildRealAdapters(): ScreeningProviderAdapter[] {
  return [
    new RealSanctionsAdapter(),
    new RealPepAdapter(),
    new RealAdverseMediaAdapter(),
    new RealIdvAdapter(),
    new RealRegistryAdapter(),
  ];
}

function buildFallbackPlaceholderAdapters(): ScreeningProviderAdapter[] {
  if (!shouldEnablePlaceholderAdapters()) {
    return [];
  }

  const placeholderProviders: Array<{ name: string; checks: ScreeningCheckType[] }> = [
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

  return placeholderProviders.map(
    (entry) => new PlaceholderScreeningAdapter(entry.name, entry.checks)
  );
}

function buildDefaultAdapters(): ScreeningProviderAdapter[] {
  const realAdapters = buildRealAdapters();

  // Include placeholder adapters only in non-production environments as fallbacks,
  // but real adapters take precedence. Placeholders are registered under different
  // provider names so they coexist without overwriting the real adapters.
  const placeholderAdapters = buildFallbackPlaceholderAdapters();

  return [...realAdapters, ...placeholderAdapters];
}

export function buildScreeningProviderRegistry(): ScreeningProviderRegistry {
  return new InMemoryScreeningProviderRegistry(buildDefaultAdapters());
}

export const screeningProviderRegistry = buildScreeningProviderRegistry();
