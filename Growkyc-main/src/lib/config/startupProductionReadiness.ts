import { assertProductionReadiness } from './productionReadinessValidator';

type EnvMap = Record<string, string | undefined>;

function getProcessEnv(): EnvMap {
  return ((globalThis as any).process?.env ?? {}) as EnvMap;
}

export function runStartupProductionReadinessValidation(): void {
  const env = getProcessEnv();

  if (env.APP_ENV !== 'production') {
    return;
  }

  try {
    assertProductionReadiness({ env });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({
      event: 'production_readiness_failed',
      message,
      checkedAt: new Date().toISOString(),
    }));
    throw error;
  }
}
