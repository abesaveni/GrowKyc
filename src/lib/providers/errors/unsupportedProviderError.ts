export class UnsupportedProviderError extends Error {
  readonly capability: string;
  readonly availableCapabilities: string[];

  constructor(capability: string, availableCapabilities: string[] = []) {
    super(
      `Provider capability "${capability}" is not supported.${
        availableCapabilities.length > 0
          ? ` Available: ${availableCapabilities.join(', ')}.`
          : ''
      }`
    );
    this.name = 'UnsupportedProviderError';
    this.capability = capability;
    this.availableCapabilities = availableCapabilities;
  }
}
