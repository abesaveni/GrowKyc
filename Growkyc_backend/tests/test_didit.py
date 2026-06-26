"""
Tests for the Didit provider adapter.

These cover the security-critical webhook signature verification and the config
helpers — all without network access (the HTTP calls are exercised separately
once sandbox credentials are available).
"""

import hashlib
import hmac
import time

import pytest

from services.providers.didit import (
    DiditNotConfiguredError,
    DiditService,
)


SECRET = "test_shared_secret_123"


def _sign(body: bytes, secret: str = SECRET) -> str:
    return hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()


class TestDiditConfig:
    def test_not_configured_raises(self, monkeypatch):
        monkeypatch.delenv("DIDIT_API_KEY", raising=False)
        assert DiditService.is_configured() is False
        with pytest.raises(DiditNotConfiguredError):
            DiditService()

    def test_configured(self, monkeypatch):
        monkeypatch.setenv("DIDIT_API_KEY", "sk_test_abc")
        assert DiditService.is_configured() is True
        svc = DiditService()
        assert svc.api_key == "sk_test_abc"
        assert svc.base_url == "https://verification.didit.me"

    def test_workflow_resolution(self, monkeypatch):
        monkeypatch.setenv("DIDIT_WORKFLOW_INDIVIDUAL", "wf-indiv")
        monkeypatch.setenv("DIDIT_WORKFLOW_KYB", "wf-kyb")
        assert DiditService.workflow_for("individual") == "wf-indiv"
        assert DiditService.workflow_for("business") == "wf-kyb"
        assert DiditService.workflow_for("unknown") is None


class TestDiditWebhookSignature:
    def test_valid_signature(self):
        body = b'{"session_id":"s1","status":"Approved"}'
        ts = str(int(time.time()))
        assert DiditService.verify_webhook_signature(body, _sign(body), ts, SECRET) is True

    def test_tampered_body_fails(self):
        body = b'{"session_id":"s1","status":"Approved"}'
        ts = str(int(time.time()))
        sig = _sign(body)
        tampered = b'{"session_id":"s1","status":"Declined"}'
        assert DiditService.verify_webhook_signature(tampered, sig, ts, SECRET) is False

    def test_wrong_secret_fails(self):
        body = b'{"x":1}'
        ts = str(int(time.time()))
        assert (
            DiditService.verify_webhook_signature(body, _sign(body, "other"), ts, SECRET)
            is False
        )

    def test_stale_timestamp_rejected(self):
        body = b'{"x":1}'
        old_ts = str(int(time.time()) - 600)  # 10 minutes old
        assert DiditService.verify_webhook_signature(body, _sign(body), old_ts, SECRET) is False

    def test_missing_secret_rejected(self):
        body = b'{"x":1}'
        ts = str(int(time.time()))
        assert DiditService.verify_webhook_signature(body, _sign(body), ts, None) is False

    def test_missing_signature_rejected(self):
        body = b'{"x":1}'
        ts = str(int(time.time()))
        assert DiditService.verify_webhook_signature(body, None, ts, SECRET) is False
