import { ScreeningCheckType } from './types';
import { screeningProviderRegistry } from './registry';
import { ProviderAdapterError } from './errors';
import { ScreeningProviderAdapter } from './interfaces';

interface SelectionEnv {
  DEFAULT_SCREENING_PROVIDER?: string;
  SCREENING_PROVIDER_SANCTIONS?: string;
  SCREENING_PROVIDER_PEP?: string;
  SCREENING_PROVIDER_ADVERSE_MEDIA?: string;
  SCREENING_PROVIDER_IDV?: string;
  SCREENING_PROVIDER_REGISTRY?: string;
  SCREENING_TENANT_PROVIDER_OVERRIDES?: string;
}

export interface ScreeningProviderSelectionInput {
  checkType: ScreeningCheckType;
  tenantId?: string;
  environment?: string;
}

export interface ScreeningProviderSelection {
  providerName: string;
  adapter: ScreeningProviderAdapter;
  source: 'tenant_override' | 'check_env' | 'default_env' | 'registry_fallback';
}

function getRuntimeEnv(): SelectionEnv {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

function getCheckScopedProviderName(checkType: ScreeningCheckType, env: SelectionEnv): string | undefined {
  switch (checkType) {
    case 'sanctions_screening':
      return env.SCREENING_PROVIDER_SANCTIONS;
    case 'pep_screening':
      return env.SCREENING_PROVIDER_PEP;
    case 'adverse_media':
      return env.SCREENING_PROVIDER_ADVERSE_MEDIA;
    case 'id_verification':
      return env.SCREENING_PROVIDER_IDV;
    case 'registry_check':
      return env.SCREENING_PROVIDER_REGISTRY;
    default:
      return undefined;
  }
}

function parseTenantOverrides(raw?: string): Record<string, Partial<Record<ScreeningCheckType, string>>> {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, Partial<Record<ScreeningCheckType, string>>>;
    return parsed || {};
  } catch {
    return {};
  }
}

export function selectScreeningProvider(
  input: ScreeningProviderSelectionInput
): ScreeningProviderSelection {
  const env = getRuntimeEnv();
  const tenantOverrides = parseTenantOverrides(env.SCREENING_TENANT_PROVIDER_OVERRIDES);

  if (input.tenantId) {
    const providerFromTenant = tenantOverrides[input.tenantId]?.[input.checkType];
    if (providerFromTenant) {
      const adapter = screeningProviderRegistry.getAdapter(providerFromTenant);
      if (!adapter) {
        throw new ProviderAdapterError(
          `Provider ${providerFromTenant} not registered for tenant ${input.tenantId}`,
          'provider_not_configured',
          providerFromTenant,
          false,
          500,
          { tenantId: input.tenantId, checkType: input.checkType }
        );
      }

      return {
        providerName: adapter.providerName,
        adapter,
        source: 'tenant_override',
      };
    }
  }

  const checkScopedProvider = getCheckScopedProviderName(input.checkType, env);
  if (checkScopedProvider) {
    const adapter = screeningProviderRegistry.getAdapter(checkScopedProvider);
    if (!adapter) {
      throw new ProviderAdapterError(
        `Provider ${checkScopedProvider} not registered for ${input.checkType}`,
        'provider_not_configured',
        checkScopedProvider,
        false,
        500,
        { checkType: input.checkType }
      );
    }

    return {
      providerName: adapter.providerName,
      adapter,
      source: 'check_env',
    };
  }

  if (env.DEFAULT_SCREENING_PROVIDER) {
    const adapter = screeningProviderRegistry.getAdapter(env.DEFAULT_SCREENING_PROVIDER);
    if (!adapter) {
      throw new ProviderAdapterError(
        `Default screening provider ${env.DEFAULT_SCREENING_PROVIDER} not registered`,
        'provider_not_configured',
        env.DEFAULT_SCREENING_PROVIDER,
        false,
        500
      );
    }

    return {
      providerName: adapter.providerName,
      adapter,
      source: 'default_env',
    };
  }

  const fallback = screeningProviderRegistry.getAdaptersForCheck(input.checkType)[0];
  if (!fallback) {
    throw new ProviderAdapterError(
      `No provider registered for ${input.checkType}`,
      'provider_not_configured',
      'none',
      false,
      500,
      { checkType: input.checkType }
    );
  }

  return {
    providerName: fallback.providerName,
    adapter: fallback,
    source: 'registry_fallback',
  };
}
