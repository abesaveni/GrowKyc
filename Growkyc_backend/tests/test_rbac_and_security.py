import io

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)
BASE = "/api/v1"


def test_admin_endpoint_requires_auth():
    # Access admin pending without token should be 403 or 401
    resp = client.get(f"{BASE}/admin/kyc/pending")
    assert resp.status_code in (401, 403)


def test_upload_invalid_extension_rejected():
    # Register and login
    email = "rbac_test@example.com"
    client.post(
        f"{BASE}/auth/register",
        json={"name": "RBAC Test", "email": email, "password": "TestPass123!"},
    )
    resp = client.post(
        f"{BASE}/auth/login", json={"email": email, "password": "TestPass123!"}
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Submit KYC
    resp = client.post(
        f"{BASE}/kyc/submit", json={"aadhaar": "222222222222"}, headers=headers
    )
    assert resp.status_code == 200
    kyc_id = resp.json()["id"]

    # Try upload with unsupported extension
    files = {
        "kyc_id": (None, str(kyc_id)),
        "document_type": (None, "Aadhaar"),
        "file": ("evil.exe", io.BytesIO(b"MZ..."), "application/octet-stream"),
    }
    resp = client.post(f"{BASE}/documents/upload", files=files, headers=headers)
    assert resp.status_code in (400, 422)
