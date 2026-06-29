"""
Tests for the RBAC permission matrix (core/permissions.py) and the
GET /auth/permissions endpoint. These lock the client-provided matrix in place.
"""

from core.enums import UserRole
from core.permissions import (ASSIGNABLE_ROLES, has_permission, label_for,
                              permissions_for)


class TestPermissionMatrix:
    def test_client_is_own_only(self):
        r = UserRole.USER  # Client
        assert has_permission(r, "onboarding:start:own")
        assert has_permission(r, "documents:view:own")
        assert not has_permission(r, "case:create")
        assert not has_permission(r, "approve:low")

    def test_aml_analyst(self):
        r = UserRole.ANALYST
        assert has_permission(r, "case:create")
        assert has_permission(r, "investigation:create")
        assert has_permission(r, "risk:view:assigned")
        assert not has_permission(r, "case:assign")
        assert not has_permission(r, "approve:low")

    def test_compliance_officer_approves_low_medium_only(self):
        r = UserRole.COMPLIANCE_OFFICER
        assert has_permission(r, "case:assign")
        assert has_permission(r, "approve:low")
        assert has_permission(r, "approve:medium")
        assert has_permission(r, "policy:draft")
        assert not has_permission(r, "approve:high")
        assert not has_permission(r, "approve:critical")
        assert not has_permission(r, "risk:edit")

    def test_senior_compliance_officer_approves_high(self):
        r = UserRole.SENIOR_COMPLIANCE_OFFICER
        assert has_permission(r, "approve:high")
        assert has_permission(r, "investigation:close")
        assert has_permission(r, "edd:recommend")
        assert has_permission(r, "policy:review")
        assert not has_permission(r, "approve:critical")
        assert not has_permission(r, "smr:submit")
        assert not has_permission(r, "edd:approve")

    def test_head_of_compliance_is_top_authority(self):
        r = UserRole.HEAD_OF_COMPLIANCE
        for p in [
            "approve:low", "approve:medium", "approve:high", "approve:critical",
            "risk:edit", "edd:approve", "smr:submit", "smr:view:full",
            "audit:view:full", "policy:approve",
        ]:
            assert has_permission(r, p), f"Head of Compliance should have {p}"
        # MLRO is a legacy alias for Head of Compliance.
        assert has_permission(UserRole.MLRO, "smr:submit")

    def test_managing_partner_is_oversight_only(self):
        r = UserRole.PARTNER
        assert has_permission(r, "risk:view:summary")
        assert has_permission(r, "smr:view:summary")
        assert has_permission(r, "audit:view:readonly")
        assert has_permission(r, "policy:view")
        # No operational/approval powers.
        assert not has_permission(r, "approve:low")
        assert not has_permission(r, "case:create")
        assert not has_permission(r, "risk:edit")

    def test_admin_manages_users(self):
        assert has_permission(UserRole.ADMIN, "users:manage")

    def test_accepts_enum_or_string(self):
        assert has_permission("Head_of_Compliance", "smr:submit")
        assert has_permission(UserRole.HEAD_OF_COMPLIANCE, "smr:submit")

    def test_labels_and_assignable_roles(self):
        assert label_for(UserRole.USER) == "Client"
        assert label_for(UserRole.PARTNER) == "Managing Partner"
        assert UserRole.ADMIN.value in ASSIGNABLE_ROLES
        assert UserRole.SENIOR_COMPLIANCE_OFFICER.value in ASSIGNABLE_ROLES
        assert len(ASSIGNABLE_ROLES) == 7


class TestPermissionsEndpoint:
    def test_permissions_endpoint(self, client, user_token):
        resp = client.get(
            "/api/v1/auth/permissions",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "role" in data and "permissions" in data and "role_label" in data
        assert isinstance(data["permissions"], list)

    def test_permissions_requires_auth(self, client):
        assert client.get("/api/v1/auth/permissions").status_code == 401


class TestAdminUserManagement:
    def test_list_assignable_roles(self, client, admin_token):
        resp = client.get(
            "/api/v1/admin/roles",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert resp.status_code == 200
        roles = resp.json()
        assert len(roles) == 7
        assert {"value": "Head_of_Compliance", "label": "Head of Compliance"} in roles

    def test_admin_creates_user_with_role(self, client, admin_token):
        resp = client.post(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "name": "New Officer",
                "email": "officer@example.com",
                "password": "SecurePass@123",
                "role": "Compliance_Officer",
            },
        )
        assert resp.status_code == 201, resp.text
        data = resp.json()
        assert data["role"] == "Compliance_Officer"
        assert data["role_label"] == "Compliance Officer"
        assert data["is_active"] is True

    def test_create_user_rejects_invalid_role(self, client, admin_token):
        resp = client.post(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "name": "Bad Role",
                "email": "bad@example.com",
                "password": "SecurePass@123",
                "role": "Wizard",
            },
        )
        assert resp.status_code == 400

    def test_non_admin_cannot_create_user(self, client, user_token):
        resp = client.post(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {user_token}"},
            json={
                "name": "X",
                "email": "x@example.com",
                "password": "SecurePass@123",
                "role": "Client",
            },
        )
        assert resp.status_code == 403
