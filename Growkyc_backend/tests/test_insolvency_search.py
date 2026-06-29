"""
Test suite for US-025 — AFSA Insolvency Search Mock API.
Tests success response, validation failures, unauthorized access,
and deterministic mock behavior.
Reuses existing conftest fixtures (client, admin_token, agent_token, user_token).
"""

from fastapi import status

INSOLVENCY_SEARCH_URL = "/api/v1/kyc/insolvency-search"

VALID_PAYLOAD = {
    "full_name": "John Doe",
    "entity_name": "Doe Enterprises Pty Ltd",
    "country": "AU",
    "registration_number": "REG123456",
}


class TestAFSAInsolvencySearch:
    """Tests for POST /api/v1/kyc/insolvency-search (US-025)."""

    # ---- Success ----

    def test_insolvency_search_success_as_admin(self, client, admin_token):
        """Admin should receive a valid insolvency search response."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post(
            INSOLVENCY_SEARCH_URL, headers=headers, json=VALID_PAYLOAD
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Standard envelope
        assert data["success"] is True
        assert data["message"] == "Insolvency search completed"
        assert data["error"] is None
        assert "timestamp" in data

        # Data payload
        result = data["data"]
        assert result["provider"] == "afsa"
        assert isinstance(result["insolvency_found"], bool)
        assert result["status"] in ("CLEAR", "UNDER_REVIEW", "INSOLVENT")
        assert result["risk_level"] in ("LOW", "MEDIUM", "HIGH")
        assert len(result["entity_name"]) > 0

    def test_insolvency_search_success_as_agent(self, client, agent_token):
        """Agent role should also be permitted to call insolvency-search."""
        headers = {"Authorization": f"Bearer {agent_token}"}
        response = client.post(
            INSOLVENCY_SEARCH_URL, headers=headers, json=VALID_PAYLOAD
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["success"] is True

    def test_insolvency_search_uses_entity_name(self, client, admin_token):
        """Provided entity_name should appear in response entity_name field."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post(
            INSOLVENCY_SEARCH_URL, headers=headers, json=VALID_PAYLOAD
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["data"]["entity_name"] == VALID_PAYLOAD["entity_name"]

    def test_insolvency_search_falls_back_to_full_name(self, client, admin_token):
        """When entity_name is omitted, full_name should be used as entity_name."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "full_name": "Jane Smith",
            "country": "AU",
            "registration_number": "REG999000",
        }
        response = client.post(INSOLVENCY_SEARCH_URL, headers=headers, json=payload)

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["data"]["entity_name"] == "Jane Smith"

    def test_insolvency_search_deterministic(self, client, admin_token):
        """Same registration_number should always return the same result."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        r1 = client.post(INSOLVENCY_SEARCH_URL, headers=headers, json=VALID_PAYLOAD)
        r2 = client.post(INSOLVENCY_SEARCH_URL, headers=headers, json=VALID_PAYLOAD)

        assert r1.status_code == status.HTTP_200_OK
        assert r2.status_code == status.HTTP_200_OK
        assert r1.json()["data"]["status"] == r2.json()["data"]["status"]
        assert (
            r1.json()["data"]["insolvency_found"]
            == r2.json()["data"]["insolvency_found"]
        )

    # ---- Validation Failure ----

    def test_insolvency_search_missing_registration_number(self, client, admin_token):
        """Request missing registration_number should return 422."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "full_name": "John Doe",
            "country": "AU",
            # registration_number intentionally omitted
        }
        response = client.post(INSOLVENCY_SEARCH_URL, headers=headers, json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_insolvency_search_missing_full_name(self, client, admin_token):
        """Request missing full_name should return 422."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"country": "AU", "registration_number": "REG123456"}
        response = client.post(INSOLVENCY_SEARCH_URL, headers=headers, json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_insolvency_search_registration_number_too_short(self, client, admin_token):
        """registration_number shorter than min_length=3 should return 422."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {**VALID_PAYLOAD, "registration_number": "AB"}
        response = client.post(INSOLVENCY_SEARCH_URL, headers=headers, json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # ---- Unauthorized Access ----

    def test_insolvency_search_no_token(self, client):
        """Request without Authorization header should return 401."""
        # NOTE: missing auth correctly returns 401 Unauthorized.
        response = client.post(INSOLVENCY_SEARCH_URL, json=VALID_PAYLOAD)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_insolvency_search_regular_user_forbidden(self, client, user_token):
        """Regular USER role is not permitted — should return 403."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            INSOLVENCY_SEARCH_URL, headers=headers, json=VALID_PAYLOAD
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
