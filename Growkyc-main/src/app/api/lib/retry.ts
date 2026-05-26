/**
 * retry.ts — Retry-safe execution helper.
 *
 * Utilities for bot execution retries with:
 * - exponential backoff (+ optional jitter)
 * - max attempts configuration
 * - typed success/failure result
 * - structured error metadata
 */

export interface RetryExecutionConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  jitterMs?: number;
}

export interface RetryAttemptError {
  attempt: number;
  at: string;
  message: string;
  name: string;
  error: unknown;
}

export interface RetryExecutionError {
  kind: 'retry_exhausted';
  message: string;
  attempts: number;
  startedAt: string;
  endedAt: string;
  errors: RetryAttemptError[];
  lastError: unknown;
}

export type RetryExecutionResult<T> =
  | {
      ok: true;
      value: T;
      attempts: number;
      startedAt: string;
      endedAt: string;
      durationMs: number;
    }
  | {
      ok: false;
      error: RetryExecutionError;
    };

function isRetryFailure<T>(
  result: RetryExecutionResult<T>
): result is Extract<RetryExecutionResult<T>, { ok: false }> {
  return result.ok === false;
}

export interface RetryOptions<T> {
  maxRetries: number;
  baseBackoffMs: number;
  onRetry?: (attempt: number, error: unknown) => void;
  onExhausted?: (error: unknown) => Promise<void>;
}

const DEFAULT_BACKOFF_MULTIPLIER = 2;
const DEFAULT_JITTER_MS = 100;

/**
 * Execute an operation with exponential backoff and typed, structured output.
 * Does not throw on exhaustion; returns a structured failure result instead.
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  config: RetryExecutionConfig
): Promise<RetryExecutionResult<T>> {
  const normalized = normalizeConfig(config);
  const startedAtDate = new Date();
  const startedAt = startedAtDate.toISOString();
  const errors: RetryAttemptError[] = [];

  for (let attempt = 1; attempt <= normalized.maxAttempts; attempt++) {
    try {
      const value = await operation();
      const endedAtDate = new Date();

      return {
        ok: true,
        value,
        attempts: attempt,
        startedAt,
        endedAt: endedAtDate.toISOString(),
        durationMs: endedAtDate.getTime() - startedAtDate.getTime(),
      };
    } catch (error) {
      errors.push(toRetryAttemptError(attempt, error));

      if (attempt < normalized.maxAttempts) {
        const delayMs = computeBackoffDelayMs(attempt, normalized);
        await sleep(delayMs);
      }
    }
  }

  const endedAtDate = new Date();
  const lastError = errors[errors.length - 1]?.error;

  return {
    ok: false,
    error: {
      kind: 'retry_exhausted',
      message: `Operation failed after ${normalized.maxAttempts} attempts`,
      attempts: normalized.maxAttempts,
      startedAt,
      endedAt: endedAtDate.toISOString(),
      errors,
      lastError,
    },
  };
}

/**
 * Backward-compatible helper for existing callers that expect throw semantics.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions<T>
): Promise<T> {
  const { maxRetries, baseBackoffMs, onRetry, onExhausted } = options;

  const result = await executeWithRetry(fn, {
    maxAttempts: maxRetries + 1,
    baseDelayMs: baseBackoffMs,
    backoffMultiplier: DEFAULT_BACKOFF_MULTIPLIER,
    jitterMs: DEFAULT_JITTER_MS,
  });

  if (isRetryFailure(result)) {
    for (const attemptError of result.error.errors.slice(0, -1)) {
      onRetry?.(attemptError.attempt, attemptError.error);
    }

    const lastError = result.error.lastError;
    if (onExhausted) {
      await onExhausted(lastError);
    }

    throw lastError;
  }

  return result.value;
}

function normalizeConfig(config: RetryExecutionConfig): Required<RetryExecutionConfig> {
  if (!Number.isInteger(config.maxAttempts) || config.maxAttempts < 1) {
    throw new Error('maxAttempts must be an integer >= 1');
  }

  if (!Number.isFinite(config.baseDelayMs) || config.baseDelayMs < 0) {
    throw new Error('baseDelayMs must be a finite number >= 0');
  }

  const maxDelayMs = config.maxDelayMs ?? Number.POSITIVE_INFINITY;
  if (!Number.isFinite(maxDelayMs) && maxDelayMs !== Number.POSITIVE_INFINITY) {
    throw new Error('maxDelayMs must be finite or omitted');
  }

  if (Number.isFinite(maxDelayMs) && maxDelayMs < 0) {
    throw new Error('maxDelayMs must be >= 0');
  }

  const backoffMultiplier = config.backoffMultiplier ?? DEFAULT_BACKOFF_MULTIPLIER;
  if (!Number.isFinite(backoffMultiplier) || backoffMultiplier < 1) {
    throw new Error('backoffMultiplier must be a finite number >= 1');
  }

  const jitterMs = config.jitterMs ?? DEFAULT_JITTER_MS;
  if (!Number.isFinite(jitterMs) || jitterMs < 0) {
    throw new Error('jitterMs must be a finite number >= 0');
  }

  return {
    maxAttempts: config.maxAttempts,
    baseDelayMs: config.baseDelayMs,
    maxDelayMs,
    backoffMultiplier,
    jitterMs,
  };
}

function computeBackoffDelayMs(
  attempt: number,
  config: Required<RetryExecutionConfig>
): number {
  const exponentialDelay =
    config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
  const jitter = config.jitterMs > 0 ? Math.random() * config.jitterMs : 0;
  const totalDelay = exponentialDelay + jitter;
  return Math.min(totalDelay, config.maxDelayMs);
}

function toRetryAttemptError(attempt: number, error: unknown): RetryAttemptError {
  if (error instanceof Error) {
    return {
      attempt,
      at: new Date().toISOString(),
      message: error.message,
      name: error.name,
      error,
    };
  }

  return {
    attempt,
    at: new Date().toISOString(),
    message: String(error),
    name: 'NonErrorThrow',
    error,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
