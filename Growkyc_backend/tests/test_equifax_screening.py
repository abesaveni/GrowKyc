import services.providers.equifax as equifax_mod
from services.providers.equifax_screening import EquifaxScreeningAdapter


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

    def post(self, url, json=None, headers=None, timeout=None):
        resp = self._responses.pop(0)
        if isinstance(resp, Exception):
            raise resp
        return resp


def test_screening_success(monkeypatch):
    # Mock oauth client in screening module's namespace
    import services.providers.equifax_screening as screening_mod

    monkeypatch.setattr(
        screening_mod,
        "get_equifax_oauth_client",
        lambda: type("O", (), {"get_access_token": lambda self: "t"})(),
    )
    monkeypatch.setenv("EQUIFAX_BASE_URL", "https://fake.api")
    # Return a match
    r = FakeResponse(200, {"matches": [{"id": "m1"}], "transactionId": "txm"})
    monkeypatch.setattr("httpx.Client", lambda *args, **kwargs: FakeClient([r]))

    s = EquifaxScreeningAdapter()
    res = s.screen_person("John Doe", None, "AU")
    assert res.status == "match_found"
    assert res.matched_entities and len(res.matched_entities) == 1


def test_screening_error_handling(monkeypatch):
    import services.providers.equifax_screening as screening_mod

    monkeypatch.setattr(
        screening_mod,
        "get_equifax_oauth_client",
        lambda: type("O", (), {"get_access_token": lambda self: "t"})(),
    )
    monkeypatch.setenv("EQUIFAX_BASE_URL", "https://fake.api")
    # Simulate client raising
    monkeypatch.setattr(
        "httpx.Client", lambda *args, **kwargs: FakeClient([RuntimeError("net")])
    )

    s = EquifaxScreeningAdapter()
    res = s.screen_person("fail case", None, "AU")
    assert res.status == "error"
