"""
services/providers/equifax.py
=================================
Equifax OAuth client support (Sprint 1)

Additive module providing an OAuth2 client_credentials token fetch
with in-memory token caching, expiration handling, optional refresh,
and simple retry/backoff logic. Designed to be used by provider
adapters or execution ports that need an access token for Equifax.

This file intentionally does NOT implement identity verification or
screening API calls — those remain out of scope for Sprint 1.
"""

import base64
import logging
import os
import threading
import time
from typing import Any, Dict, Optional

import httpx

logger = logging.getLogger(__name__)


class EquifaxOAuthError(Exception):
    pass


class EquifaxOAuthClient:
    """OAuth2 client for Equifax using client_credentials grant.

    Usage:
        client = EquifaxOAuthClient()
        token = client.get_access_token()
    """

    _instance_lock = threading.Lock()
    _singleton: "EquifaxOAuthClient" = None

    def __new__(cls, *args, **kwargs):
        # singleton to keep token cache process-wide
        if not cls._singleton:
            with cls._instance_lock:
                if not cls._singleton:
                    cls._singleton = super().__new__(cls)
        return cls._singleton

    def __init__(self) -> None:
        # safe-init (may be called multiple times due to singleton)
        if getattr(self, "_initialized", False):
            return

        self.client_id = os.getenv("EQUIFAX_CLIENT_ID")
        self.client_secret = os.getenv("EQUIFAX_CLIENT_SECRET")
        self.base_url = os.getenv("EQUIFAX_BASE_URL")
        self.token_url = os.getenv("EQUIFAX_TOKEN_URL") or (
            self.base_url and f"{self.base_url.rstrip('/')}/v2/oauth/token"
        )

        self._token_lock = threading.Lock()
        self._access_token: Optional[str] = None
        self._refresh_token: Optional[str] = None
        self._expires_at: float = 0.0

        # retry/backoff settings (kept simple to match project style)
        self._max_retries = 3
        self._backoff_base = 0.25

        self._initialized = True

    def _validate_config(self) -> None:
        if not (self.client_id and self.client_secret and self.token_url):
            logger.debug(
                "Equifax OAuth configuration missing: client_id=%s base_url=%s token_url=%s",
                bool(self.client_id),
                bool(self.base_url),
                bool(self.token_url),
            )
            raise EquifaxOAuthError(
                "Equifax OAuth configuration not set. Set EQUIFAX_CLIENT_ID, EQUIFAX_CLIENT_SECRET and EQUIFAX_TOKEN_URL/EQUIFAX_BASE_URL."
            )

    def _request_token(self) -> Dict[str, Any]:
        """POST to token endpoint with client credentials and return parsed JSON."""
        self._validate_config()

        auth_value = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {auth_value}",
        }
        data = {"grant_type": "client_credentials"}

        last_exc: Optional[Exception] = None
        url = self.token_url

        for attempt in range(1, self._max_retries + 1):
            try:
                logger.debug("Equifax token request attempt %d to %s", attempt, url)
                with httpx.Client(timeout=10.0) as client:
                    resp = client.post(url, data=data, headers=headers)

                if (
                    resp.status_code in (429, 500, 502, 503, 504)
                    and attempt < self._max_retries
                ):
                    logger.warning(
                        "Transient Equifax token response %s; retrying (attempt %d)",
                        resp.status_code,
                        attempt,
                    )
                    time.sleep(self._backoff_base * attempt)
                    continue

                if resp.status_code != 200:
                    raise EquifaxOAuthError(
                        f"Token endpoint returned {resp.status_code}: {resp.text}"
                    )

                try:
                    return resp.json()
                except Exception as e:
                    raise EquifaxOAuthError(
                        f"Failed to parse token response: {e}"
                    ) from e

            except Exception as e:
                last_exc = e
                logger.exception(
                    "Equifax token request failed on attempt %d: %s", attempt, str(e)
                )
                if attempt < self._max_retries:
                    time.sleep(self._backoff_base * attempt)
                    continue

        raise EquifaxOAuthError(
            f"Failed to fetch token from Equifax after {self._max_retries} attempts"
        ) from last_exc

    def _set_token_from_response(self, data: Dict[str, Any]) -> None:
        access = data.get("access_token")
        if not access:
            raise EquifaxOAuthError("Token response missing access_token")

        expires_in = int(data.get("expires_in") or 0)
        refresh = data.get("refresh_token")

        with self._token_lock:
            self._access_token = access
            self._refresh_token = refresh
            # subtract small buffer to avoid edge expiry races
            self._expires_at = time.time() + max(0, expires_in - 10)
            logger.info(
                "Equifax access token cached (expires_in=%s seconds)", expires_in
            )

    def get_access_token(self) -> str:
        """Return a valid access token, refreshing if needed."""
        # Fast path without lock
        if self._access_token and time.time() < self._expires_at:
            return self._access_token

        with self._token_lock:
            if self._access_token and time.time() < self._expires_at:
                return self._access_token

            # No valid token; request one
            data = self._request_token()
            self._set_token_from_response(data)
            return self._access_token

    def refresh_access_token(self) -> str:
        """Attempt refresh using `refresh_token` if available; otherwise re-request token."""
        with self._token_lock:
            if self._refresh_token:
                # Attempt refresh flow
                try:
                    self._validate_config()
                    auth_value = base64.b64encode(
                        f"{self.client_id}:{self.client_secret}".encode()
                    ).decode()
                    headers = {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": f"Basic {auth_value}",
                    }
                    data = {
                        "grant_type": "refresh_token",
                        "refresh_token": self._refresh_token,
                    }
                    with httpx.Client(timeout=10.0) as client:
                        resp = client.post(self.token_url, data=data, headers=headers)

                    if resp.status_code != 200:
                        logger.warning(
                            "Equifax refresh failed (%s). Falling back to client_credentials request.",
                            resp.status_code,
                        )
                    else:
                        parsed = resp.json()
                        self._set_token_from_response(parsed)
                        return self._access_token
                except Exception:
                    logger.exception(
                        "Equifax refresh token exchange failed; falling back to full token request"
                    )

            # Fallback to client_credentials
            data = self._request_token()
            self._set_token_from_response(data)
            return self._access_token


# Convenience singleton getter
_GLOBAL_EQUIFAX_CLIENT: Optional[EquifaxOAuthClient] = None


def get_equifax_oauth_client() -> EquifaxOAuthClient:
    global _GLOBAL_EQUIFAX_CLIENT
    if _GLOBAL_EQUIFAX_CLIENT is None:
        _GLOBAL_EQUIFAX_CLIENT = EquifaxOAuthClient()
    return _GLOBAL_EQUIFAX_CLIENT


# Minimal provider class to plug into existing provider factories if desired.
from services.providers.base_verification_provider import \
    BaseVerificationProvider


class EquifaxProvider(BaseVerificationProvider):
    """Lightweight provider shell that exposes OAuth token helpers.

    Does not implement `verify_identity` in this sprint — identity APIs
    are out of scope. This class provides `get_access_token` and
    `refresh_access_token` to other services.
    """

    @property
    def provider_name(self) -> str:
        return "Equifax"

    @property
    def provider_version(self) -> str:
        return "oauth-0.1"

    def verify_identity(
        self, identity_data: Dict[str, Any], country_code: str
    ) -> Dict[str, Any]:
        raise NotImplementedError(
            "Equifax identity verification not implemented in Sprint 1."
        )

    def get_access_token(self) -> str:
        return get_equifax_oauth_client().get_access_token()

    def refresh_access_token(self) -> str:
        return get_equifax_oauth_client().refresh_access_token()
