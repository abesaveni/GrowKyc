"""
Test suite for US-024 — Equifax Credit Score Mock API.
Tests success response, validation failure, and unauthorized access.
Reuses existing conftest fixtures (client, admin_token, agent_token, user_token).
"""

from fastapi import status

CREDIT_SCORE_URL = "/api/v1/kyc/credit-score"

VALID_PAYLOAD = {
    "full_name": "Jane Smith",
    "date_of_birth": "1985-06-15",
    "pan_number": "ABCDE1234F",
    "country": "AU",
}


class TestEquifaxCreditScore:
    """Tests for POST /api/v1/kyc/credit-score (US-024)."""

    # ---- Success ----

    def test_credit_score_success_as_admin(self, client, admin_token):
        """Admin should receive a valid credit score response."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post(CREDIT_SCORE_URL, headers=headers, json=VALID_PAYLOAD)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Standard envelope
        assert data["success"] is True
        assert data["message"] == "Credit score fetched successfully"
        assert data["error"] is None
        assert "timestamp" in data

        # Data payload
        score = data["data"]
        assert score["provider"] == "equifax"
        assert isinstance(score["credit_score"], int)
        assert 300 <= score["credit_score"] <= 900
        assert score["rating"] in ("EXCELLENT", "GOOD", "FAIR", "HIGH_RISK")
        assert score["risk_level"] in ("LOW", "MEDIUM", "HIGH")

    def test_credit_score_success_as_agent(self, client, agent_token):
        """Agent role should also be permitted to call credit-score."""
        headers = {"Authorization": f"Bearer {agent_token}"}
        response = client.post(CREDIT_SCORE_URL, headers=headers, json=VALID_PAYLOAD)

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["success"] is True

    def test_credit_score_deterministic(self, client, admin_token):
        """Same PAN should always return the same score (deterministic mock)."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        r1 = client.post(CREDIT_SCORE_URL, headers=headers, json=VALID_PAYLOAD)
        r2 = client.post(CREDIT_SCORE_URL, headers=headers, json=VALID_PAYLOAD)

        assert r1.status_code == status.HTTP_200_OK
        assert r2.status_code == status.HTTP_200_OK
        assert r1.json()["data"]["credit_score"] == r2.json()["data"]["credit_score"]

    # ---- Validation Failure ----

    def test_credit_score_missing_pan(self, client, admin_token):
        """Request missing pan_number should return 422 Unprocessable Entity."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "full_name": "Jane Smith",
            "date_of_birth": "1985-06-15",
            "country": "AU",
            # pan_number intentionally omitted
        }
        response = client.post(CREDIT_SCORE_URL, headers=headers, json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_credit_score_invalid_pan_length(self, client, admin_token):
        """PAN shorter than 10 chars should fail schema validation."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {**VALID_PAYLOAD, "pan_number": "SHORT"}
        response = client.post(CREDIT_SCORE_URL, headers=headers, json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_credit_score_missing_full_name(self, client, admin_token):
        """Request missing full_name should return 422."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "date_of_birth": "1985-06-15",
            "pan_number": "ABCDE1234F",
            "country": "AU",
        }
        response = client.post(CREDIT_SCORE_URL, headers=headers, json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # ---- Unauthorized Access ----

    def test_credit_score_no_token(self, client):
        """Request without Authorization header should return 403."""
        response = client.post(CREDIT_SCORE_URL, json=VALID_PAYLOAD)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_credit_score_regular_user_forbidden(self, client, user_token):
        """Regular USER role is not permitted — should return 403."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(CREDIT_SCORE_URL, headers=headers, json=VALID_PAYLOAD)
        assert response.status_code == status.HTTP_403_FORBIDDEN
