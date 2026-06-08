import importlib

import services.providers.equifax as equifax_mod


class FakeResponse:
    def __init__(self, status_code=200, json_data=None, text=""):
        self.status_code = status_code
        self._json = json_data or {}
        self.text = text

    def json(self):
        return self._json


class FakeClient:
    def __init__(self, responses):
        self._responses = list(responses)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def post(self, url, data=None, headers=None, timeout=None):
        if not self._responses:
            raise RuntimeError("No more fake responses")
        return self._responses.pop(0)


def test_oauth_get_token_success(monkeypatch):
    # Reset module to clear singleton
    importlib.reload(equifax_mod)

    monkeypatch.setenv("EQUIFAX_CLIENT_ID", "cid")
    monkeypatch.setenv("EQUIFAX_CLIENT_SECRET", "secret")
    monkeypatch.setenv("EQUIFAX_TOKEN_URL", "https://fake/token")

    # first call returns token
    fake = FakeResponse(200, {"access_token": "tok123", "expires_in": 3600})
    monkeypatch.setattr("httpx.Client", lambda *args, **kwargs: FakeClient([fake]))

    client = equifax_mod.EquifaxOAuthClient()
    token = client.get_access_token()
    assert token == "tok123"


def test_oauth_retry_then_success(monkeypatch):
    importlib.reload(equifax_mod)
    monkeypatch.setenv("EQUIFAX_CLIENT_ID", "cid")
    monkeypatch.setenv("EQUIFAX_CLIENT_SECRET", "secret")
    monkeypatch.setenv("EQUIFAX_TOKEN_URL", "https://fake/token")

    # simulate transient 500 then success
    r1 = FakeResponse(500, {"error": "server"})
    r2 = FakeResponse(200, {"access_token": "tok-retry", "expires_in": 3600})
    monkeypatch.setattr("httpx.Client", lambda *args, **kwargs: FakeClient([r1, r2]))

    client = equifax_mod.EquifaxOAuthClient()
    token = client.get_access_token()
    assert token == "tok-retry"
