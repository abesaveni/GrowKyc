"""
services/providers/equifax_identity.py
=====================================
Equifax Identity Verification provider (Sprint 2)

Implements passport, driver licence, medicare and generic identity
verification helper methods. Uses the OAuth client from
`services.providers.equifax` (Sprint 1) for token management.

This module returns provider-neutral verification dictionaries to
match the `BaseVerificationProvider` expectations used elsewhere in
the codebase.
"""

import logging
import os
import time
from typing import Any, Dict, Optional

import httpx

from services.providers.base_verification_provider import \
    BaseVerificationProvider
from services.providers.equifax import (EquifaxOAuthError,
                                        get_equifax_oauth_client)

logger = logging.getLogger(__name__)


class EquifaxIdentityProvider(BaseVerificationProvider):
    """Provider implementation for Equifax Identity Verification.

    Methods provided:
        - verify_passport
        - verify_driver_licence
        - verify_medicare
        - verify_identity (generic wrapper)

    All methods return a dict with keys:
        - status: 'verified'|'failed'|'requires_review'
        - provider_reference: optional str
        - raw_response: dict
        - normalized_confidence: float (0-100)
    """

    def __init__(self) -> None:
        self._provider_name = "Equifax"
        self.base_url = os.getenv("EQUIFAX_BASE_URL")
        # Allow overriding specific identity endpoints via env if needed
        self.passport_path = os.getenv(
            "EQUIFAX_PASSPORT_PATH", "/v1/identity/verify/passport"
        )
        self.driver_path = os.getenv(
            "EQUIFAX_DRIVER_PATH", "/v1/identity/verify/driver_license"
        )
        self.medicare_path = os.getenv(
            "EQUIFAX_MEDICARE_PATH", "/v1/identity/verify/medicare"
        )
        self.generic_path = os.getenv("EQUIFAX_IDENTITY_PATH", "/v1/identity/verify")
        # retry policy
        self._max_retries = 2
        self._backoff = 0.25

    @property
    def provider_version(self) -> str:
        return "identity-oauth-0.1"

    @property
    def provider_name(self) -> str:
        return self._provider_name

    def verify_identity(
        self, identity_data: Dict[str, Any], country_code: str
    ) -> Dict[str, Any]:
        """Generic identity verification entrypoint (calls `verify_identity` endpoint).

        `identity_data` should contain the necessary document fields depending
        on the check type. This method is a thin wrapper around
        `verify_passport`/`verify_driver_licence` as appropriate when a
        `document_type` key is present.
        """
        doc_type = identity_data.get("document_type", "").lower()
        try:
            if doc_type in ("passport", "passbook"):
                return self.verify_passport(identity_data)
            if doc_type in ("driver_license", "driver_licence", "dl"):
                return self.verify_driver_licence(identity_data)
            if doc_type in ("medicare",):
                return self.verify_medicare(identity_data)

            # fallback: call generic identity endpoint
            return self._call_identity_endpoint(self.generic_path, identity_data)
        except Exception as e:
            logger.exception("Equifax verify_identity error: %s", str(e))
            return {
                "status": "failed",
                "provider_reference": None,
                "raw_response": {"error": str(e)},
                "normalized_confidence": 0.0,
            }

    def verify_passport(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._call_identity_endpoint(self.passport_path, data)

    def verify_driver_licence(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._call_identity_endpoint(self.driver_path, data)

    def verify_medicare(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._call_identity_endpoint(self.medicare_path, data)

    def _call_identity_endpoint(
        self, path: str, payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Call Equifax identity endpoint with OAuth token and return normalized result."""
        client = get_equifax_oauth_client()
        if not self.base_url:
            msg = "EQUIFAX_BASE_URL env not configured"
            logger.error(msg)
            raise EquifaxOAuthError(msg)

        url = self.base_url.rstrip("/") + path

        last_exc: Optional[Exception] = None
        for attempt in range(1, self._max_retries + 1):
            try:
                token = client.get_access_token()
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                }

                logger.info(
                    "Calling Equifax identity endpoint %s (attempt %d)", url, attempt
                )
                with httpx.Client(timeout=15.0) as http:
                    resp = http.post(url, json=payload, headers=headers)

                if (
                    resp.status_code in (429, 500, 502, 503, 504)
                    and attempt < self._max_retries
                ):
                    logger.warning(
                        "Transient Equifax identity response %s; retrying",
                        resp.status_code,
                    )
                    time.sleep(self._backoff * attempt)
                    continue

                if resp.status_code == 401:
                    # Try refresh once
                    logger.warning(
                        "Equifax identity 401 received; attempting token refresh"
                    )
                    client.refresh_access_token()
                    if attempt < self._max_retries:
                        time.sleep(self._backoff * attempt)
                        continue

                # parse response
                try:
                    data = resp.json()
                except Exception:
                    data = {"raw_text": resp.text}

                # Map to standardized response
                status = "failed"
                norm_conf = 0.0
                prov_ref = (
                    data.get("transactionId")
                    or data.get("provider_reference")
                    or data.get("id")
                )

                if isinstance(data, dict):
                    # Heuristics: Equifax may return verified:true or score/confidence
                    if data.get("verified") is True or data.get("status") in (
                        "verified",
                        "completed",
                    ):
                        status = "verified"
                    elif data.get("status") in ("requires_review", "review"):
                        status = "requires_review"

                    # confidence mappings
                    if "confidence" in data:
                        try:
                            norm_conf = float(data.get("confidence")) * 100.0
                        except Exception:
                            norm_conf = float(data.get("confidence") or 0.0)
                    elif "score" in data:
                        try:
                            norm_conf = float(data.get("score"))
                        except Exception:
                            norm_conf = 0.0

                # clamp
                try:
                    norm_conf = max(0.0, min(100.0, float(norm_conf)))
                except Exception:
                    norm_conf = 0.0

                return {
                    "status": status,
                    "provider_reference": prov_ref,
                    "raw_response": data,
                    "normalized_confidence": norm_conf,
                }

            except EquifaxOAuthError as e:
                last_exc = e
                logger.error(
                    "Equifax OAuth error when calling identity endpoint: %s", str(e)
                )
                # OAuth related; no point retrying more than once
                break
            except Exception as e:
                last_exc = e
                logger.exception(
                    "Equifax identity request failed on attempt %d: %s", attempt, str(e)
                )
                if attempt < self._max_retries:
                    time.sleep(self._backoff * attempt)
                    continue

        # If we reach here, we failed
        logger.error(
            "Equifax identity verification failed for path %s: %s", path, str(last_exc)
        )
        return {
            "status": "failed",
            "provider_reference": None,
            "raw_response": {"error": str(last_exc) if last_exc else "unknown"},
            "normalized_confidence": 0.0,
        }
