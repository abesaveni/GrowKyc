interface AwsApiClientConfig {
  baseUrl: string;
  authTokenProvider?: () => Promise<string | null>;
}

export class AwsApiClient {
  constructor(private readonly config: AwsApiClientConfig) {}

  async post<T>(path: string, body: unknown): Promise<T> {
    const token = this.config.authTokenProvider ? await this.config.authTokenProvider() : null;

    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AWS API request failed (${response.status}): ${text}`);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string): Promise<T> {
    const token = this.config.authTokenProvider ? await this.config.authTokenProvider() : null;

    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AWS API request failed (${response.status}): ${text}`);
    }

    return response.json() as Promise<T>;
  }
}
