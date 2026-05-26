import { ScreeningProviderAdapter } from '../interfaces';
import {
  AdverseMediaRequest,
  IdVerificationRequest,
  PepScreeningRequest,
  ProviderScreeningRawResult,
  RegistryCheckRequest,
  SanctionsScreeningRequest,
  ScreeningCheckType,
  ProviderStatus,
} from '../types';
import { ProviderAdapterError } from '../errors';

export class EquifaxScreeningAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'equifax';
  readonly supportedChecks: ScreeningCheckType[] = [
    'id_verification',
    'sanctions_screening',
    'pep_screening',
    'adverse_media',
  ];
  private readonly timeoutMs = 30000;
  private readonly retryAttempts = 2;

  private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      return await fetch(url, {
        ...init,
        signal: init.signal ?? controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  private async fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt += 1) {
      try {
        const response = await this.fetchWithTimeout(url, init);
        if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === this.retryAttempts) {
          return response;
        }
        lastError = new Error(`Equifax transient HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
        if (attempt === this.retryAttempts) {
          break;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }

    throw lastError instanceof Error ? lastError : new Error('Equifax request failed');
  }

  private async getAuthToken(): Promise<string> {
    const apiKey = process.env.EQUIFAX_API_KEY;
    const secret = process.env.EQUIFAX_SECRET;
    const baseUrl = process.env.EQUIFAX_BASE_URL;

    if (!apiKey || !secret || !baseUrl) {
      throw new ProviderAdapterError(
        'Equifax credentials not configured',
        'provider_not_configured',
        this.providerName,
        false,
        503
      );
    }

    try {
      const credentials = Buffer.from(`${apiKey}:${secret}`).toString('base64');
      const response = await this.fetchWithRetry(`${baseUrl}/v2/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.access_token) {
        throw new Error('Auth response did not include an access token');
      }
      return data.access_token;
    } catch (error) {
      throw new ProviderAdapterError(
        'Failed to authenticate with Equifax',
        'provider_auth_error',
        this.providerName,
        true,
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  private async makeApiRequest(endpoint: string, payload: unknown, checkType: ScreeningCheckType): Promise<ProviderScreeningRawResult> {
    const token = await this.getAuthToken();
    const baseUrl = process.env.EQUIFAX_BASE_URL;

    const requestTime = new Date().toISOString();
    let responseTime = requestTime;
    let status: ProviderStatus = 'failed';
    let data: any = null;
    let latencyMs = 0;

    const startTime = Date.now();
    try {
      const response = await this.fetchWithRetry(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      responseTime = new Date().toISOString();
      latencyMs = Date.now() - startTime;

      if (!response.ok) {
        if (response.status === 429) {
          throw new ProviderAdapterError('Rate limited by Equifax', 'provider_rate_limited', this.providerName, true, 429);
        }
        throw new ProviderAdapterError(`API Error: ${response.statusText}`, 'provider_bad_request', this.providerName, response.status >= 500, response.status);
      }

      data = await response.json();
      status = data.matches && data.matches.length > 0 ? 'partial_match' : 'no_match';
      
      // If no matches property but request succeeded (e.g. ID verification pass)
      if (checkType === 'id_verification' && data.verified === true) {
        status = 'completed';
      }

      return {
        checkType,
        status,
        summary: data.summary || `Equifax ${checkType} completed`,
        matches: data.matches || [],
        riskScore: data.riskScore,
        metadata: {
          providerName: this.providerName,
          requestTimestamp: requestTime,
          responseTimestamp: responseTime,
          latencyMs,
          providerRequestId: data.transactionId,
        },
        rawPayload: data,
      };
    } catch (error) {
      if (error instanceof ProviderAdapterError) {
        throw error;
      }
      
      throw new ProviderAdapterError(
        `Failed to execute ${checkType} via Equifax`,
        'provider_internal_error',
        this.providerName,
        true,
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async screenSanctions(request: SanctionsScreeningRequest): Promise<ProviderScreeningRawResult> {
    return this.makeApiRequest('/v1/screening/sanctions', request, 'sanctions_screening');
  }

  async screenPep(request: PepScreeningRequest): Promise<ProviderScreeningRawResult> {
    return this.makeApiRequest('/v1/screening/pep', request, 'pep_screening');
  }

  async screenAdverseMedia(request: AdverseMediaRequest): Promise<ProviderScreeningRawResult> {
    return this.makeApiRequest('/v1/screening/adverse-media', request, 'adverse_media');
  }

  async verifyIdentity(request: IdVerificationRequest): Promise<ProviderScreeningRawResult> {
    return this.makeApiRequest('/v1/identity/verify', request, 'id_verification');
  }

  async checkRegistry(request: RegistryCheckRequest): Promise<ProviderScreeningRawResult> {
    throw new ProviderAdapterError(
      `${this.providerName} is not configured for registry_check`,
      'provider_not_configured',
      this.providerName,
      false,
      503,
      { checkType: 'registry_check' }
    );
  }
}
