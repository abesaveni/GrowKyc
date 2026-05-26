import { ProviderRegistry } from '../registry/providerRegistry';
import { SanctionsScreeningAdapter } from '../adapters/sanctions/sanctionsScreeningAdapter';
import { PEPScreeningAdapter } from '../adapters/pep/pepScreeningAdapter';
import { AdverseMediaScreeningAdapter } from '../adapters/adverseMedia/adverseMediaScreeningAdapter';
import { IDVScreeningAdapter } from '../adapters/idv/idvScreeningAdapter';
import { RegistryScreeningAdapter } from '../adapters/registry/registryScreeningAdapter';

export function buildInitializedProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();

  registry.register(new SanctionsScreeningAdapter());
  registry.register(new PEPScreeningAdapter());
  registry.register(new AdverseMediaScreeningAdapter());
  registry.register(new IDVScreeningAdapter());
  registry.register(new RegistryScreeningAdapter());

  return registry;
}
