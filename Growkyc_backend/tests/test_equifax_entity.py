from services.providers.equifax_entity_validation import \
    EquifaxEntityValidationProvider


class FakeResponse:
    def __init__(self, status_code=200, json_data=None, text=""):
        self.status_code = status_code
        self._json = json_data or {}
        self.text = text

    def json(self):
        return self._json


def fake_post_success(url, json=None, headers=None, timeout=None):
    return FakeResponse(200, {"verified": True, "transactionId": "ent-1"})


def test_entity_verify_company(monkeypatch):
    monkeypatch.setenv("EQUIFAX_BASE_URL", "https://fake.api")
    monkeypatch.setattr("httpx.post", fake_post_success)
    # patch oauth client used by the entity module (both entity module and equifax module)
    import services.providers.equifax as equifax_mod
    import services.providers.equifax_entity_validation as entity_mod

    fake_oauth = lambda: type(
        "O",
        (),
        {
            "get_access_token": lambda self: "t",
            "refresh_access_token": lambda self: "t",
        },
    )()
    monkeypatch.setattr(entity_mod, "get_equifax_oauth_client", fake_oauth)
    monkeypatch.setattr(equifax_mod, "get_equifax_oauth_client", fake_oauth)

    p = EquifaxEntityValidationProvider()
    res = p.verify_company("ACME Pty Ltd", registration_number="123")
    assert res["status"] == "verified"
    assert res["provider_reference"] == "ent-1"
