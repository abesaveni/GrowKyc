import importlib

import services.providers.equifax as equifax_mod
from services.providers import equifax_identity as identity_mod
from services.providers.equifax_identity import EquifaxIdentityProvider


class FakeResponse:
    def __init__(self, status_code=200, json_data=None, text=""):
        self.status_code = status_code
        self._json = json_data or {}
        self.text = text

    def json(self):
        return self._json


class FakeClient:
    def __init__(self, responses):
        # keep shared list so separate Client instances consume the same sequence
        self._responses = responses

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def post(self, url, json=None, headers=None, timeout=None):
        if not self._responses:
            raise RuntimeError("No more fake responses")
        resp = self._responses.pop(0)
        if isinstance(resp, Exception):
            raise resp
        return resp


class FakeOAuthClient:
    def __init__(self):
        self.refresh_called = False

    def get_access_token(self):
        return "fake-token"

    def refresh_access_token(self):
        self.refresh_called = True
        return "refreshed"


def test_identity_401_refresh_and_success(monkeypatch):
    # Ensure Equifax OAuth client is replaced with fake
    fake_oauth = FakeOAuthClient()
    # patch the name used by the identity module
    monkeypatch.setattr(identity_mod, "get_equifax_oauth_client", lambda: fake_oauth)
    monkeypatch.setenv("EQUIFAX_BASE_URL", "https://fake.api")

    # identity endpoint: first 401, then 200 with verified
    r401 = FakeResponse(401, {"error": "unauth"})
    r200 = FakeResponse(200, {"verified": True, "transactionId": "tx1"})
    responses = [r401, r200]
    monkeypatch.setattr("httpx.Client", lambda *args, **kwargs: FakeClient(responses))

    p = EquifaxIdentityProvider()
    res = p.verify_passport({"passport_number": "P123"})
    assert res["status"] == "verified"
    assert res["provider_reference"] == "tx1"
    assert fake_oauth.refresh_called


def test_identity_normalization_requires_review(monkeypatch):
    # return requires_review status
    fake_oauth = FakeOAuthClient()
    monkeypatch.setattr(identity_mod, "get_equifax_oauth_client", lambda: fake_oauth)
    monkeypatch.setenv("EQUIFAX_BASE_URL", "https://fake.api")
    r200 = FakeResponse(200, {"status": "requires_review", "confidence": 0.75})
    monkeypatch.setattr("httpx.Client", lambda *args, **kwargs: FakeClient([r200]))

    p = EquifaxIdentityProvider()
    res = p.verify_identity({"document_type": "passport"}, "AU")
    assert res["status"] == "requires_review"
    assert res["normalized_confidence"] >= 75.0 - 0.1
