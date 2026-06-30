import pytest
from decimal import Decimal
from fastapi import status
from core.enums import PaymentStatus
from models import Payment, User, Tenant
from core.security import hash_password
from services.auth_service import AuthService

class TestOnboardingGating:

    @pytest.fixture(autouse=True)
    def enable_payment_gating(self, monkeypatch):
        """Enable the payment-gating feature flag for this test class.

        NOTE: the onboarding payment gate is controlled by the PAYMENT_REQUIRED
        env var (defaults to "false"). These tests exercise the gating behaviour,
        so the flag must be turned on for them.
        """
        monkeypatch.setenv("PAYMENT_REQUIRED", "true")

    @pytest.fixture
    def test_tenant(self, db_session):
        """Create a test tenant."""
        tenant = Tenant(company_name="Test Tenant", slug="test-tenant", status="active")
        db_session.add(tenant)
        db_session.commit()
        db_session.refresh(tenant)
        return tenant

    @pytest.fixture
    def gated_user(self, db_session, test_tenant):
        """Create a test user belonging to the test tenant."""
        user = User(
            name="Gated User",
            email="gated@test.com",
            password=hash_password("gated123456"),
            role="USER",
            tenant_id=test_tenant.id,
            is_active=True,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @pytest.fixture
    def gated_user_token(self, gated_user, db_session):
        """Generate JWT access token for gated_user with tenant_id."""
        auth_service = AuthService(db_session)
        token = auth_service.create_access_token(
            user_id=gated_user.id,
            tenant_id=gated_user.tenant_id,
            role=gated_user.role,
        )
        return token

    @pytest.fixture
    def other_user(self, db_session, test_tenant):
        """Create a separate test user in the same tenant."""
        user = User(
            name="Other User",
            email="other@test.com",
            password=hash_password("other123456"),
            role="USER",
            tenant_id=test_tenant.id,
            is_active=True,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    def test_individual_onboarding_gated_no_payment(self, client, gated_user_token):
        """Verify that individual client creation is blocked when there is no payment record."""
        headers = {"Authorization": f"Bearer {gated_user_token}"}
        response = client.post(
            "/api/v1/clients/individual",
            headers=headers,
            json={"first_name": "John", "last_name": "Doe"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.json()["detail"] == "Payment required before verification"

    def test_individual_onboarding_gated_other_user_payment(self, client, gated_user_token, db_session, other_user):
        """Verify that individual client creation is blocked when a PAID payment exists but belongs to a different user."""
        # Add a PAID payment for other_user
        payment = Payment(
            user_id=other_user.id,
            onboarding_type="INDIVIDUAL",
            amount=Decimal("100.00"),
            status=PaymentStatus.PAID,
            square_payment_id="sq_pay_other",
        )
        db_session.add(payment)
        db_session.commit()

        headers = {"Authorization": f"Bearer {gated_user_token}"}
        response = client.post(
            "/api/v1/clients/individual",
            headers=headers,
            json={"first_name": "John", "last_name": "Doe"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.json()["detail"] == "Payment required before verification"

    def test_individual_onboarding_allowed_with_payment(self, client, gated_user_token, db_session, gated_user):
        """Verify that individual client creation is allowed when the user has a PAID payment."""
        # Add a PAID payment for gated_user
        payment = Payment(
            user_id=gated_user.id,
            onboarding_type="INDIVIDUAL",
            amount=Decimal("100.00"),
            status=PaymentStatus.PAID,
            square_payment_id="sq_pay_user",
        )
        db_session.add(payment)
        db_session.commit()

        headers = {"Authorization": f"Bearer {gated_user_token}"}
        response = client.post(
            "/api/v1/clients/individual",
            headers=headers,
            json={"first_name": "John", "last_name": "Doe"},
        )
        # Should bypass gating and return 201 (since it starts the normal onboarding flow)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["name"] == "John Doe"

    def test_entity_onboarding_gated_no_payment(self, client, gated_user_token):
        """Verify that entity client creation is blocked when there is no payment record."""
        headers = {"Authorization": f"Bearer {gated_user_token}"}
        response = client.post(
            "/api/v1/clients/entity",
            headers=headers,
            json={"legal_name": "GrowKYC Pty Ltd"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.json()["detail"] == "Payment required before verification"

    def test_entity_onboarding_gated_other_user_payment(self, client, gated_user_token, db_session, other_user):
        """Verify that entity client creation is blocked when a PAID payment exists but belongs to a different user."""
        # Add a PAID payment for other_user
        payment = Payment(
            user_id=other_user.id,
            onboarding_type="ENTITY",
            amount=Decimal("100.00"),
            status=PaymentStatus.PAID,
            square_payment_id="sq_pay_other_entity",
        )
        db_session.add(payment)
        db_session.commit()

        headers = {"Authorization": f"Bearer {gated_user_token}"}
        response = client.post(
            "/api/v1/clients/entity",
            headers=headers,
            json={"legal_name": "GrowKYC Pty Ltd"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.json()["detail"] == "Payment required before verification"

    def test_entity_onboarding_allowed_with_payment(self, client, gated_user_token, db_session, gated_user):
        """Verify that entity client creation is allowed when the user has a PAID payment."""
        # Add a PAID payment for gated_user
        payment = Payment(
            user_id=gated_user.id,
            onboarding_type="ENTITY",
            amount=Decimal("100.00"),
            status=PaymentStatus.PAID,
            square_payment_id="sq_pay_user_entity",
        )
        db_session.add(payment)
        db_session.commit()

        headers = {"Authorization": f"Bearer {gated_user_token}"}
        response = client.post(
            "/api/v1/clients/entity",
            headers=headers,
            json={"legal_name": "GrowKYC Pty Ltd"},
        )
        # Should bypass gating and return 201 (since it starts the normal onboarding flow)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["name"] == "GrowKYC Pty Ltd"
