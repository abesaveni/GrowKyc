"""
Test suite for authentication endpoints.
Tests registration, login, JWT tokens, password changes, and profile access.
"""

from fastapi import status


class TestAuthRegistration:
    """Tests for user registration endpoint."""

    def test_register_success(self, client):
        """Test successful user registration."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "John Doe",
                "email": "john@example.com",
                "password": "SecurePass@123",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        # Register returns a TokenResponse (auto-login): token + nested user.
        assert "access_token" in data
        user = data["user"]
        assert user["email"] == "john@example.com"
        assert user["name"] == "John Doe"
        assert "id" in user
        assert user["is_active"] is True

    def test_register_duplicate_email(self, client, regular_user):
        """Test registration with duplicate email."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "Another User",
                "email": "user@test.com",  # Already exists
                "password": "SecurePass@123",
            },
        )
        assert response.status_code == status.HTTP_409_CONFLICT
        assert "already exists" in response.json()["detail"].lower()

    def test_register_short_password(self, client):
        """Test registration with password too short."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "John Doe",
                "email": "john@example.com",
                "password": "short",
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_invalid_email(self, client):
        """Test registration with invalid email format."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "John Doe",
                "email": "invalid-email",
                "password": "SecurePass@123",
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestAuthLogin:
    """Tests for user login endpoint."""

    def test_login_success(self, client, regular_user):
        """Test successful login returns JWT token."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "user@test.com", "password": "user123456"},
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["expires_in"] > 0
        assert data["user"]["email"] == "user@test.com"

    def test_login_wrong_password(self, client, regular_user):
        """Test login with wrong password."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "user@test.com", "password": "wrongpassword"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "invalid" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "nonexistent@example.com", "password": "password"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_inactive_user(self, client, db_session):
        """Test login with inactive user."""
        from core.enums import UserRole
        from core.security import hash_password
        from models import User

        user = User(
            name="Inactive User",
            email="inactive@test.com",
            password=hash_password("password123"),
            role=UserRole.USER,
            is_active=False,
        )
        db_session.add(user)
        db_session.commit()

        response = client.post(
            "/api/v1/auth/login",
            json={"email": "inactive@test.com", "password": "password123"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthJWT:
    """Tests for JWT token handling."""

    def test_jwt_contains_user_id(self, client, regular_user):
        """Test that JWT token contains user ID."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "user@test.com", "password": "user123456"},
        )
        assert response.status_code == status.HTTP_200_OK
        token = response.json()["access_token"]

        # Verify token is valid and can be used
        headers = {"Authorization": f"Bearer {token}"}
        profile_response = client.get("/api/v1/auth/profile", headers=headers)
        assert profile_response.status_code == status.HTTP_200_OK
        assert profile_response.json()["id"] == regular_user.id

    def test_jwt_invalid_token(self, client):
        """Test access with invalid JWT token."""
        headers = {"Authorization": "Bearer invalid.token.here"}
        response = client.get("/api/v1/auth/profile", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_jwt_missing_token(self, client):
        """Test endpoint without token."""
        response = client.get("/api/v1/auth/profile")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_jwt_expired_token_format(self, client, regular_user):
        """Test with malformed token."""
        headers = {"Authorization": "Bearer malformed.jwt"}
        response = client.get("/api/v1/auth/profile", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthProfile:
    """Tests for user profile endpoints."""

    def test_get_profile_success(self, client, user_token, regular_user):
        """Test getting current user profile."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get("/api/v1/auth/profile", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == "user@test.com"
        assert data["id"] == regular_user.id

    def test_get_profile_without_auth(self, client):
        """Test getting profile without authentication."""
        response = client.get("/api/v1/auth/profile")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthPasswordChange:
    """Tests for password change endpoint."""

    def test_change_password_success(self, client, user_token, regular_user):
        """Test successful password change."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            "/api/v1/auth/change-password",
            headers=headers,
            json={
                "current_password": "user123456",
                "new_password": "NewPassword123!",
                "confirm_password": "NewPassword123!",
            },
        )
        assert response.status_code == status.HTTP_200_OK
        assert "successfully" in response.json()["message"].lower()

    def test_change_password_wrong_current(self, client, user_token):
        """Test password change with wrong current password."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post(
            "/api/v1/auth/change-password",
            headers=headers,
            json={
                "current_password": "wrongpassword",
                "new_password": "NewPassword123!",
                "confirm_password": "NewPassword123!",
            },
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_change_password_without_auth(self, client):
        """Test password change without authentication."""
        response = client.post(
            "/api/v1/auth/change-password",
            json={
                "current_password": "password",
                "new_password": "NewPassword123!",
                "confirm_password": "NewPassword123!",
            },
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAuthRefreshToken:
    """Tests for token refresh endpoint."""

    def test_refresh_token_success(self, client, user_token, regular_user):
        """Test successful token refresh."""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post("/api/v1/auth/refresh-token", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_refresh_token_without_auth(self, client):
        """Test refresh without authentication."""
        response = client.post("/api/v1/auth/refresh-token")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
