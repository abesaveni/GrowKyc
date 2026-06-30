"""
services/providers/didit.py
===========================
Didit identity & business verification (KYC / KYB / AML) provider adapter.

Didit's model is: you pre-build verification *workflows* in the Didit Console
(each gets a workflow_id), then for each user you create a *session* against a
workflow, send them the returned hosted URL, and receive the outcome via a
signed *webhook*.

Docs: https://docs.didit.me  (API base: https://verification.didit.me)

Config (all via environment, never hardcoded):
    DIDIT_API_KEY              required to enable the integration (x-api-key)
    DIDIT_BASE_URL             default https://verification.didit.me
    DIDIT_WEBHOOK_SECRET       shared secret for HMAC webhook verification
    DIDIT_WORKFLOW_INDIVIDUAL  workflow_id for individual KYC
    DIDIT_WORKFLOW_KYB         workflow_id for business KYB

If DIDIT_API_KEY is unset the adapter raises DiditNotConfiguredError, and the
router degrades to HTTP 503 — the same graceful-degradation pattern used for the
other optional integrations.
"""

import hashlib
import hmac
import logging
import os
import time
from typing import Any, Dict, Optional

import httpx

logger = logging.getLogger(__name__)

DEFAULT_BASE_URL = "https://verification.didit.me"
# Reject webhooks whose timestamp is older than this (replay protection).
WEBHOOK_MAX_AGE_SECONDS = 300


class DiditError(Exception):
    """Generic Didit API error."""


class DiditNotConfiguredError(DiditError):
    """Raised when DIDIT_API_KEY is not configured for this deployment."""


class DiditService:
    """Thin client for the Didit verification API."""

    def __init__(self) -> None:
        self.api_key = os.getenv("DIDIT_API_KEY")
        self.base_url = (os.getenv("DIDIT_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
        self.webhook_secret = os.getenv("DIDIT_WEBHOOK_SECRET")
        self._timeout = float(os.getenv("DIDIT_HTTP_TIMEOUT", "20"))

        if not self.api_key:
            raise DiditNotConfiguredError(
                "Didit is not enabled: set DIDIT_API_KEY to activate KYC/KYB."
            )

    # -- configuration helpers ------------------------------------------------

    @staticmethod
    def is_configured() -> bool:
        """True if the integration has an API key (no instance required)."""
        return bool(os.getenv("DIDIT_API_KEY"))

    @staticmethod
    def workflow_for(kind: str) -> Optional[str]:
        """Resolve a workflow_id for a logical verification kind.

        kind: 'individual' (KYC) or 'business' (KYB).
        """
        mapping = {
            "individual": os.getenv("DIDIT_WORKFLOW_INDIVIDUAL"),
            "business": os.getenv("DIDIT_WORKFLOW_KYB"),
        }
        return mapping.get(kind)

    def _headers(self) -> Dict[str, str]:
        return {
            "x-api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    # -- API calls ------------------------------------------------------------

    def create_session(
        self,
        workflow_id: str,
        vendor_data: str,
        callback_url: Optional[str] = None,
        contact_details: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a verification session.

        Args:
            workflow_id: the Didit workflow to run.
            vendor_data: our own reference (e.g. "kyc:123") echoed back in webhooks.
            callback_url: optional URL Didit redirects the user to when finished.
            contact_details: optional {"email": ..., "phone": ...} to prefill.

        Returns:
            dict with at least session_id and url (the hosted verification page).
        """
        if not workflow_id:
            raise DiditError("No workflow_id configured for this verification type.")

        payload: Dict[str, Any] = {
            "workflow_id": workflow_id,
            "vendor_data": vendor_data,
        }
        if callback_url:
            payload["callback"] = callback_url
        if contact_details:
            payload["contact_details"] = contact_details

        url = f"{self.base_url}/v2/session/"
        try:
            with httpx.Client(timeout=self._timeout) as client:
                resp = client.post(url, headers=self._headers(), json=payload)
        except httpx.HTTPError as exc:
            logger.error("Didit create_session transport error: %s", exc)
            raise DiditError(f"Could not reach Didit: {exc}") from exc

        if resp.status_code >= 400:
            logger.error(
                "Didit create_session failed: %s %s", resp.status_code, resp.text[:500]
            )
            raise DiditError(
                f"Didit session creation failed ({resp.status_code})"
            )

        data = resp.json()
        # Normalise the couple of field names Didit has used across versions.
        return {
            "session_id": data.get("session_id") or data.get("id"),
            "url": data.get("url") or data.get("session_url") or data.get("verification_url"),
            "status": data.get("status", "Not Started"),
            "raw": data,
        }

    def get_decision(self, session_id: str) -> Dict[str, Any]:
        """Fetch the full decision/result for a session."""
        url = f"{self.base_url}/v2/session/{session_id}/decision/"
        try:
            with httpx.Client(timeout=self._timeout) as client:
                resp = client.get(url, headers=self._headers())
        except httpx.HTTPError as exc:
            logger.error("Didit get_decision transport error: %s", exc)
            raise DiditError(f"Could not reach Didit: {exc}") from exc

        if resp.status_code >= 400:
            logger.error(
                "Didit get_decision failed: %s %s", resp.status_code, resp.text[:500]
            )
            raise DiditError(f"Didit decision fetch failed ({resp.status_code})")
        return resp.json()

    # -- webhook verification -------------------------------------------------

    def verify_webhook(
        self,
        raw_body: bytes,
        signature: Optional[str],
        timestamp: Optional[str],
    ) -> bool:
        """Verify a webhook's HMAC-SHA256 signature and timestamp freshness.

        Uses the X-Signature scheme (HMAC over the exact raw request bytes), which
        is the most robust to verify server-side. Constant-time comparison and a
        ±300s timestamp window (replay protection) are enforced.
        """
        return self.verify_webhook_signature(
            raw_body, signature, timestamp, self.webhook_secret
        )

    @staticmethod
    def verify_webhook_signature(
        raw_body: bytes,
        signature: Optional[str],
        timestamp: Optional[str],
        secret: Optional[str],
    ) -> bool:
        if not secret:
            logger.error("Didit webhook secret not configured; rejecting webhook.")
            return False
        if not signature or not timestamp:
            logger.warning("Didit webhook missing signature/timestamp headers.")
            return False

        # Replay protection: reject stale timestamps.
        try:
            ts = int(timestamp)
        except (TypeError, ValueError):
            logger.warning("Didit webhook has non-integer timestamp.")
            return False
        if abs(time.time() - ts) > WEBHOOK_MAX_AGE_SECONDS:
            logger.warning("Didit webhook timestamp outside the allowed window.")
            return False

        expected = hmac.new(
            secret.encode("utf-8"), raw_body, hashlib.sha256
        ).hexdigest()
        if hmac.compare_digest(expected, signature):
            return True
        logger.warning("Didit webhook signature mismatch.")
        return False
