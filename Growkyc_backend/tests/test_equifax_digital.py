import services.providers.equifax as equifax_mod
from services.providers.equifax_digital_identity import \
    EquifaxDigitalIdentityProvider


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
        return self._responses.pop(0)


def test_digital_validate_contact_combined(monkeypatch):
    # Fake oauth (patch in digital identity module namespace)
    import services.providers.equifax_digital_identity as digital_mod

    monkeypatch.setattr(
        digital_mod,
        "get_equifax_oauth_client",
        lambda: type("O", (), {"get_access_token": lambda self: "t"})(),
    )
    monkeypatch.setenv("EQUIFAX_BASE_URL", "https://fake.api")
    # Combined endpoint returns partial verification
    data = {"email_verified": True, "phone_verified": False, "address_verified": True}
    r = FakeResponse(200, data)
    monkeypatch.setattr("httpx.Client", lambda *args, **kwargs: FakeClient([r]))

    p = EquifaxDigitalIdentityProvider()
    res = p.validate_contact(
        {"email": "a@b.c", "phone": "041111", "address": "1 Main St"}
    )
    assert res["status"] in ("review_required", "verified")
    assert res["email_verified"] is True
    assert res["phone_verified"] is False
