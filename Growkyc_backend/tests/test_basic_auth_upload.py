import io
import os
import uuid

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

BASE = "/api/v1"


def test_register_login_submit_upload_flow():
    # Register user
    # NOTE: use a unique email to avoid 409 duplicate-email collisions
    # across test runs / other tests.
    email = f"test_integration_{uuid.uuid4().hex[:8]}@example.com"
    resp = client.post(
        f"{BASE}/auth/register",
        json={
            "name": "Test Integration",
            "email": email,
            "password": "TestPass123!",
        },
    )
    assert resp.status_code in (200, 201)
    resp.json()

    # Login
    resp = client.post(
        f"{BASE}/auth/login", json={"email": email, "password": "TestPass123!"}
    )
    assert resp.status_code == 200
    data = resp.json()
    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Submit KYC
    resp = client.post(
        f"{BASE}/kyc/submit",
        json={"aadhaar": "111111111111", "pan": "AAAAA1111A"},
        headers=headers,
    )
    # NOTE: submit returns 201 Created.
    assert resp.status_code == 201
    kyc = resp.json()
    kyc_id = kyc["id"]

    # Upload a small test file via multipart
    # NOTE: DocumentType enum is Australian; "Passport" is a valid value.
    file_content = b"%PDF-1.4\n%Mock PDF content\n"
    files = {
        "kyc_id": (None, str(kyc_id)),
        "document_type": (None, "Passport"),
        "file": ("test.pdf", io.BytesIO(file_content), "application/pdf"),
    }
    resp = client.post(f"{BASE}/kyc/upload-file", files=files, headers=headers)
    assert resp.status_code == 201
    doc = resp.json()
    assert "file_path" in doc or "file_path" in doc

    # Cleanup: remove uploaded file if present
    uploaded_path = doc.get("file_path")
    if uploaded_path and os.path.exists(uploaded_path):
        try:
            os.remove(uploaded_path)
        except Exception:
            pass
