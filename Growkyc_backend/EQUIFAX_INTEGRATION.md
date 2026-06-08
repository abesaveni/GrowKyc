# Equifax Integration — Setup & Notes

This document describes environment variables, sandbox setup, provider registration, troubleshooting, and deployment requirements for the Equifax integrations added to the backend.

1) Environment variables
- `EQUIFAX_CLIENT_ID` — OAuth client id (required)
- `EQUIFAX_CLIENT_SECRET` — OAuth client secret (required)
- `EQUIFAX_BASE_URL` — Base URL for Equifax API (required unless `EQUIFAX_TOKEN_URL` provided)
- `EQUIFAX_TOKEN_URL` — Token endpoint (optional; constructed from `EQUIFAX_BASE_URL` if absent)

Endpoint overrides (optional):
- `EQUIFAX_PASSPORT_PATH`, `EQUIFAX_DRIVER_PATH`, `EQUIFAX_MEDICARE_PATH`, `EQUIFAX_IDENTITY_PATH`
- `EQUIFAX_PEP_PATH`, `EQUIFAX_SANCTIONS_PATH`, `EQUIFAX_WATCHLIST_PATH`, `EQUIFAX_ADVERSE_MEDIA_PATH`
- `EQUIFAX_ENTITY_PATH`, `EQUIFAX_ABN_PATH`, `EQUIFAX_ACN_PATH`, `EQUIFAX_ASIC_PATH`, `EQUIFAX_DIRECTORS_PATH`, `EQUIFAX_OWNERSHIP_PATH`
- `EQUIFAX_DIGITAL_EMAIL_PATH`, `EQUIFAX_DIGITAL_PHONE_PATH`, `EQUIFAX_DIGITAL_ADDRESS_PATH`, `EQUIFAX_DIGITAL_FRAUD_PATH`, `EQUIFAX_DIGITAL_CONTACT_PATH`

Additional runtime tuning:
- `EQUIFAX_DIGITAL_MAX_RETRIES`, `EQUIFAX_DIGITAL_BACKOFF`, `EQUIFAX_USE_COMBINED_CONTACT`

2) Sandbox setup
- Request sandbox credentials from Equifax (client id/secret and sandbox base URL).
- Configure the above environment variables in your dev/CI environment (prefer secret manager).
- Run provider smoke tests using the provided test suite (see `Growkyc_backend/tests/`). All tests mock HTTP — integration tests should use a sandbox and not production credentials.

3) Provider registration
- Screening providers: configured by `SCREENING_PROVIDERS` env var (comma-separated). Default is `sumsub,complyadvantage`.
  - To include Equifax: `SCREENING_PROVIDERS="sumsub,complyadvantage,equifax"`
- Identity provider selection: `IDENTITY_PROVIDER` env var (e.g., `equifax`).
- Entity provider: `ENTITY_PROVIDER` (default `equifax`).
- Digital identity provider: `DIGITAL_IDENTITY_PROVIDER` (default `equifax`).

4) Troubleshooting
- `EquifaxOAuthError: Equifax OAuth configuration not set` — check `EQUIFAX_CLIENT_ID`, `EQUIFAX_CLIENT_SECRET`, and `EQUIFAX_BASE_URL`/`EQUIFAX_TOKEN_URL`.
- 401 responses — modules attempt a token refresh (`refresh_access_token`) once per request; inspect logs for `refresh token` messages.
- Rate limits (429) — the adapters implement limited retries with backoff. If you see repeated 429s, reduce call frequency or implement central rate limiting.
- Logging may include raw response bodies (beware PII). If logs show PII, reduce log level or redact sensitive fields.

5) Deployment requirements
- Inject secrets from a secrets manager (do not place credentials in plaintext env files in prod).
- Ensure outbound network access from app instances to Equifax endpoints.
- Add monitoring/alerts for token refresh failures, 5xx rates, and latency.
- Consider adding a circuit breaker or rate-limiter in front of Equifax calls to avoid cascading failures.

6) Tests
- Unit tests mocking Equifax calls exist under `Growkyc_backend/tests/` and do not call external APIs.
- Add integration tests (sandbox) to CI pipelines if you want live coverage; keep credentials out of public CI or use per-branch sandbox credentials.

If you need a `deploy` or `CI` snippet for injecting secrets or running sandbox tests, I can generate one.
