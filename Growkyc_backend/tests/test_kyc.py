"""
Test suite for KYC endpoints.
Tests KYC submission, document upload, status checking, and approvals.
"""

from fastapi import status


class TestKYCSubmission:
    """Tests for KYC submission endpoint."""

    def test_submit_kyc_success(self, client, user_token):
        """Test successful KYC submission."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            "/api/v1/kyc/submit",
            headers=headers,
            json={
                "aadhaar": "123456789012",
                "pan": "ABCDE1234F",
                "name": "John Doe",
                "dob": "1990-01-15",
                "gender": "Male",
                "address": "123 Main St, City",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["status"] == "Pending"
        assert data["aadhaar"] == "123456789012"
        assert data["user_id"] > 0

    def test_submit_kyc_with_aadhaar_only(self, client, user_token):
        """Test KYC submission with only Aadhaar."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            "/api/v1/kyc/submit",
            headers=headers,
            json={"aadhaar": "123456789012", "name": "Jane Doe"},
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["status"] == "Pending"

    def test_submit_kyc_with_pan_only(self, client, user_token):
        """Test KYC submission with only PAN."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            "/api/v1/kyc/submit",
            headers=headers,
            json={"pan": "ABCDE1234F", "name": "Jane Doe"},
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["status"] == "Pending"

    def test_submit_kyc_no_identifiers(self, client, user_token):
        """Test KYC submission without identifiers."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            "/api/v1/kyc/submit", headers=headers, json={"name": "John Doe"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_submit_kyc_duplicate(self, client, user_token, db_session):
        """Test duplicate KYC submission (should fail)."""

        # First submission
        headers = {"Authorization": f"Bearer {user_token}"}
        response1 = client.post(
            "/api/v1/kyc/submit",
            headers=headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        assert response1.status_code == status.HTTP_201_CREATED

        # Second submission (should fail)
        response2 = client.post(
            "/api/v1/kyc/submit",
            headers=headers,
            json={"pan": "ABCDE1234F", "name": "John Doe"},
        )
        assert response2.status_code == status.HTTP_409_CONFLICT

    def test_submit_kyc_without_auth(self, client):
        """Test KYC submission without authentication."""
        response = client.post(
            "/api/v1/kyc/submit",
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestKYCStatus:
    """Tests for KYC status endpoint."""

    def test_get_kyc_status_success(self, client, user_token, db_session):
        """Test getting KYC status."""
        headers = {"Authorization": f"Bearer {user_token}"}

        # Submit KYC first
        submit_response = client.post(
            "/api/v1/kyc/submit",
            headers=headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        assert submit_response.status_code == status.HTTP_201_CREATED

        # Get status
        status_response = client.get("/api/v1/kyc/status", headers=headers)
        assert status_response.status_code == status.HTTP_200_OK
        data = status_response.json()
        assert data["status"] == "Pending"
        assert data["aadhaar"] == "123456789012"

    def test_get_kyc_status_not_found(self, client, user_token):
        """Test getting KYC status when no KYC exists."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get("/api/v1/kyc/status", headers=headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_kyc_status_without_auth(self, client):
        """Test getting status without authentication."""
        response = client.get("/api/v1/kyc/status")
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestDocumentUpload:
    """Tests for document upload endpoint."""

    def test_upload_document_success(self, client, user_token, db_session):
        """Test successful document upload."""

        headers = {"Authorization": f"Bearer {user_token}"}

        # Submit KYC first
        kyc_response = client.post(
            "/api/v1/kyc/submit",
            headers=headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        kyc_id = kyc_response.json()["id"]

        # Upload document
        doc_response = client.post(
            "/api/v1/kyc/upload-document",
            headers=headers,
            json={
                "kyc_id": kyc_id,
                "document_type": "AadhaarCard",
                "file_name": "aadhaar_front.pdf",
            },
        )
        assert doc_response.status_code == status.HTTP_201_CREATED
        data = doc_response.json()
        assert data["type"] == "AadhaarCard"
        assert "uploads" in data["file_path"]

    def test_upload_document_invalid_kyc(self, client, user_token):
        """Test uploading document for invalid KYC."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            "/api/v1/kyc/upload-document",
            headers=headers,
            json={
                "kyc_id": 9999,
                "document_type": "AadhaarCard",
                "file_name": "file.pdf",
            },
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_upload_document_without_auth(self, client):
        """Test document upload without authentication."""
        response = client.post(
            "/api/v1/kyc/upload-document",
            json={
                "kyc_id": 1,
                "document_type": "AadhaarCard",
                "file_name": "file.pdf",
            },
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestKYCApproval:
    """Tests for KYC approval endpoints (Admin/Agent)."""

    def test_approve_kyc_success(self, client, agent_token, user_token, db_session):
        """Test successful KYC approval."""
        # Submit KYC as user
        user_headers = {"Authorization": f"Bearer {user_token}"}
        kyc_response = client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        kyc_id = kyc_response.json()["id"]

        # Approve as agent
        agent_headers = {"Authorization": f"Bearer {agent_token}"}
        approve_response = client.post(
            f"/api/v1/kyc/approve/{kyc_id}",
            headers=agent_headers,
            json={"approval_reason": "Document verified"},
        )
        assert approve_response.status_code == status.HTTP_200_OK
        data = approve_response.json()
        assert data["status"] == "Approved"

    def test_reject_kyc_success(self, client, agent_token, user_token, db_session):
        """Test successful KYC rejection."""
        # Submit KYC as user
        user_headers = {"Authorization": f"Bearer {user_token}"}
        kyc_response = client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        kyc_id = kyc_response.json()["id"]

        # Reject as agent
        agent_headers = {"Authorization": f"Bearer {agent_token}"}
        reject_response = client.post(
            f"/api/v1/kyc/reject/{kyc_id}",
            headers=agent_headers,
            json={"rejection_reason": "Invalid documents"},
        )
        assert reject_response.status_code == status.HTTP_200_OK
        data = reject_response.json()
        assert data["status"] == "Rejected"

    def test_approve_kyc_not_pending(self, client, agent_token, user_token):
        """Test approving KYC that's already processed."""
        # Submit and approve KYC
        user_headers = {"Authorization": f"Bearer {user_token}"}
        kyc_response = client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        kyc_id = kyc_response.json()["id"]

        agent_headers = {"Authorization": f"Bearer {agent_token}"}
        # First approval
        client.post(
            f"/api/v1/kyc/approve/{kyc_id}",
            headers=agent_headers,
            json={"approval_reason": "Verified"},
        )

        # Second approval (should fail)
        response = client.post(
            f"/api/v1/kyc/approve/{kyc_id}",
            headers=agent_headers,
            json={"approval_reason": "Verified"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_approve_kyc_unauthorized(self, client, user_token):
        """Test approving KYC as regular user (unauthorized)."""
        # Submit KYC
        user_headers = {"Authorization": f"Bearer {user_token}"}
        kyc_response = client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        kyc_id = kyc_response.json()["id"]

        # Try to approve as regular user
        response = client.post(
            f"/api/v1/kyc/approve/{kyc_id}",
            headers=user_headers,
            json={"approval_reason": "Verified"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestKYCList:
    """Tests for KYC listing endpoints."""

    def test_list_kyc_records(self, client, agent_token, user_token):
        """Test listing all KYC records."""
        # Submit KYC as user
        user_headers = {"Authorization": f"Bearer {user_token}"}
        client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )

        # List records as agent
        agent_headers = {"Authorization": f"Bearer {agent_token}"}
        response = client.get("/api/v1/kyc/list", headers=agent_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data
        assert "total" in data

    def test_list_kyc_unauthorized(self, client, user_token):
        """Test listing KYC as regular user (unauthorized)."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get("/api/v1/kyc/list", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN
