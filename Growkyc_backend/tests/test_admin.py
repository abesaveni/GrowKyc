"""
Test suite for admin endpoints.
Tests user management, bulk operations, and dashboard statistics.
"""

from fastapi import status


class TestAdminDashboard:
    """Tests for admin dashboard statistics."""

    def test_dashboard_stats_success(self, client, admin_token):
        """Test getting dashboard statistics."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/api/v1/admin/dashboard/stats", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "kyc" in data
        assert "users" in data
        assert "documents" in data
        assert "total" in data["kyc"]
        assert "pending" in data["kyc"]

    def test_dashboard_stats_unauthorized(self, client, user_token):
        """Test dashboard stats as regular user (unauthorized)."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get("/api/v1/admin/dashboard/stats", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestAdminKYCOperations:
    """Tests for admin KYC operations."""

    def test_get_pending_kyc(self, client, admin_token, user_token):
        """Test getting pending KYC records."""
        # Submit KYC as user
        user_headers = {"Authorization": f"Bearer {user_token}"}
        client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )

        # Get pending as admin
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/api/v1/admin/kyc/pending", headers=admin_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert data["total"] >= 1

    def test_bulk_approve_kyc(self, client, admin_token, user_token, db_session):
        """Test bulk approval of KYC records."""
        # Submit multiple KYC records
        user_headers = {"Authorization": f"Bearer {user_token}"}
        kyc_ids = []

        for i in range(3):
            response = client.post(
                "/api/v1/kyc/submit",
                headers=user_headers,
                json={"aadhaar": f"12345678901{i}", "name": f"User {i}"},
            )
            if response.status_code == status.HTTP_201_CREATED:
                kyc_ids.append(response.json()["id"])

        # Bulk approve
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post(
            "/api/v1/admin/kyc/bulk-approve",
            headers=admin_headers,
            json={"kyc_ids": kyc_ids, "approval_reason": "Bulk approval"},
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["success_count"] >= 1

    def test_get_kyc_audit_log(self, client, admin_token, agent_token, user_token):
        """Test getting KYC audit log."""
        # Submit KYC
        user_headers = {"Authorization": f"Bearer {user_token}"}
        kyc_response = client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )
        kyc_id = kyc_response.json()["id"]

        # Approve it
        agent_headers = {"Authorization": f"Bearer {agent_token}"}
        client.post(
            f"/api/v1/kyc/approve/{kyc_id}",
            headers=agent_headers,
            json={"approval_reason": "Verified"},
        )

        # Get audit log
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get(
            f"/api/v1/admin/kyc/{kyc_id}/audit-log", headers=admin_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert any(log["new_status"] == "Approved" for log in data)

    def test_get_kyc_audit_log_nonexistent(self, client, admin_token):
        """Test getting audit log for non-existent KYC."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/api/v1/admin/kyc/9999/audit-log", headers=headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestAdminUserManagement:
    """Tests for admin user management."""

    def test_list_users_success(self, client, admin_token):
        """Test listing all users."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/api/v1/admin/users", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data
        assert "total" in data

    def test_list_users_with_role_filter(self, client, admin_token):
        """Test listing users with role filter."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/api/v1/admin/users?role=Admin", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data

    def test_list_users_pagination(self, client, admin_token):
        """Test user listing pagination."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/api/v1/admin/users?skip=0&limit=10", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["skip"] == 0
        assert data["limit"] == 10

    def test_list_users_unauthorized(self, client, agent_token):
        """Test listing users as agent (unauthorized)."""
        headers = {"Authorization": f"Bearer {agent_token}"}
        response = client.get("/api/v1/admin/users", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestAdminToggleUser:
    """Tests for toggling user active status."""

    def test_toggle_user_active_success(self, client, admin_token, regular_user):
        """Test toggling user active status."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post(
            f"/api/v1/admin/users/{regular_user.id}/toggle-active",
            headers=headers,
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "is_active" in data
        assert data["is_active"] is False  # Was True, now False

    def test_toggle_own_account_failure(self, client, admin_user, admin_token):
        """Test toggling own admin account (should fail)."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post(
            f"/api/v1/admin/users/{admin_user.id}/toggle-active",
            headers=headers,
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_toggle_nonexistent_user(self, client, admin_token):
        """Test toggling non-existent user."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post(
            "/api/v1/admin/users/9999/toggle-active", headers=headers
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_toggle_user_unauthorized(self, client, agent_token, regular_user):
        """Test toggling user as agent (unauthorized)."""
        headers = {"Authorization": f"Bearer {agent_token}"}
        response = client.post(
            f"/api/v1/admin/users/{regular_user.id}/toggle-active",
            headers=headers,
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestAdminStatistics:
    """Tests for admin statistics endpoints."""

    def test_kyc_stats_by_status(self, client, admin_token, user_token):
        """Test getting KYC statistics by status."""
        # Submit a KYC
        user_headers = {"Authorization": f"Bearer {user_token}"}
        client.post(
            "/api/v1/kyc/submit",
            headers=user_headers,
            json={"aadhaar": "123456789012", "name": "John Doe"},
        )

        # Get stats
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get(
            "/api/v1/admin/kyc/stats/by-status", headers=admin_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total" in data
        assert "by_status" in data
        assert "pending_percentage" in data

    def test_kyc_stats_empty(self, client, admin_token):
        """Test getting KYC stats when no KYC records exist."""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/api/v1/admin/kyc/stats/by-status", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total"] == 0


class TestHealthEndpoint:
    """Tests for system health endpoint."""

    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data

    def test_root_endpoint(self, client):
        """Test root API endpoint."""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "documentation" in data
