import os
import json
import logging
from decimal import Decimal
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient

from core.enums import PaymentStatus
from models import Payment, AuditLog


class TestSquarePayments:

    @pytest.fixture(autouse=True)
    def setup_env(self):
        """Configure mock environment variables for Square tests."""
        self.orig_token = os.environ.get("SQUARE_ACCESS_TOKEN")
        self.orig_app_id = os.environ.get("SQUARE_APPLICATION_ID")
        self.orig_secret = os.environ.get("SQUARE_APPLICATION_SECRET")

        os.environ["SQUARE_ACCESS_TOKEN"] = "sandbox-access-token"
        os.environ["SQUARE_APPLICATION_ID"] = "sandbox-application-id"
        os.environ["SQUARE_APPLICATION_SECRET"] = "sandbox-application-secret"

        yield

        # Restore original env
        if self.orig_token is not None:
            os.environ["SQUARE_ACCESS_TOKEN"] = self.orig_token
        else:
            os.environ.pop("SQUARE_ACCESS_TOKEN", None)

        if self.orig_app_id is not None:
            os.environ["SQUARE_APPLICATION_ID"] = self.orig_app_id
        else:
            os.environ.pop("SQUARE_APPLICATION_ID", None)

        if self.orig_secret is not None:
            os.environ["SQUARE_APPLICATION_SECRET"] = self.orig_secret
        else:
            os.environ.pop("SQUARE_APPLICATION_SECRET", None)

    @pytest.fixture
    def mock_square_client(self):
        """Mock the Square SDK v44 client (Square class) API responses."""
        with patch("services.square_service.Square") as mock_class:
            mock_instance = MagicMock()
            mock_class.return_value = mock_instance

            # ---- Mock locations.list() ----
            # v44: returns ListLocationsResponse (Pydantic), access via .locations list
            mock_location = MagicMock()
            mock_location.id = "L_MOCK_123"
            mock_location.status = "ACTIVE"
            loc_res = MagicMock()
            loc_res.locations = [mock_location]
            mock_instance.locations.list.return_value = loc_res

            # ---- Mock checkout.payment_links.create() ----
            # v44: returns CreatePaymentLinkResponse (Pydantic), access via .payment_link
            mock_link = MagicMock()
            mock_link.url = "https://square.link/mock/sq_pay_123"
            mock_link.id = "sq_pay_123"
            mock_link.order_id = "sq_ord_123"
            checkout_res = MagicMock()
            checkout_res.payment_link = mock_link
            mock_instance.checkout.payment_links.create.return_value = checkout_res

            # ---- Mock payments.get() ----
            # v44: returns GetPaymentResponse (Pydantic), access via .payment
            mock_payment_obj = MagicMock()
            mock_payment_obj.id = "sq_pay_123"
            mock_payment_obj.status = "COMPLETED"
            mock_payment_obj.order_id = "sq_ord_123"
            mock_payment_obj.amount_money = MagicMock(amount=10000, currency="AUD")
            pay_res = MagicMock()
            pay_res.payment = mock_payment_obj
            mock_instance.payments.get.return_value = pay_res

            # ---- Mock orders.get() ----
            # v44: returns GetOrderResponse, access via .order (which has tenders with payment_id)
            mock_tender = MagicMock()
            mock_tender.payment_id = "sq_pay_123"
            mock_order = MagicMock()
            mock_order.tenders = [mock_tender]
            order_res = MagicMock()
            order_res.order = mock_order
            mock_instance.orders.get.return_value = order_res

            yield mock_instance

    def test_create_checkout_missing_credentials(self, client, user_token):
        """Assert that API endpoints return HTTP 500 if Square credentials are not set."""
        with patch.dict(os.environ, {"SQUARE_ACCESS_TOKEN": "", "SQUARE_APPLICATION_ID": ""}):
            response = client.post(
                "/api/v1/payments/create-checkout",
                json={"onboardingType": "INDIVIDUAL", "amount": 100.00},
                headers={"Authorization": f"Bearer {user_token}"},
            )
            assert response.status_code == 500
            assert "Square API credentials are missing." in response.json()["detail"]

    def test_create_checkout_success(self, client, user_token, db_session, mock_square_client):
        """Verify checkout creation, Decimal precision, DB record creation, and correlation logs."""
        response = client.post(
            "/api/v1/payments/create-checkout",
            json={"onboardingType": "INDIVIDUAL", "amount": 125.50},
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["checkoutUrl"] == "https://square.link/mock/sq_pay_123"
        assert data["paymentId"] is not None

        # Verify DB record exists and uses Decimal type
        db_payment = db_session.query(Payment).filter(Payment.id == int(data["paymentId"])).first()
        assert db_payment is not None
        assert db_payment.amount == Decimal("125.50")
        assert db_payment.status == PaymentStatus.PENDING
        assert db_payment.square_payment_id == "sq_pay_123"
        assert db_payment.square_order_id == "sq_ord_123"

        # Verify Audit Log
        audit = db_session.query(AuditLog).filter(
            AuditLog.entity_type == "payment", AuditLog.entity_id == db_payment.id
        ).first()
        assert audit is not None
        assert audit.action == "PAYMENT_CREATED"

    def test_get_payment_status(self, client, user_token, db_session, regular_user):
        """Verify reading payment status from DB."""
        payment = Payment(
            user_id=regular_user.id,
            onboarding_type="INDIVIDUAL",
            amount=Decimal("200.00"),
            status=PaymentStatus.PAID,
            square_payment_id="sq_pay_get_status",
        )
        db_session.add(payment)
        db_session.commit()

        response = client.get(
            f"/api/v1/payments/{payment.id}",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert response.status_code == 200
        assert response.json()["status"] == "PAID"

    def test_verify_payment_success(self, client, user_token, db_session, regular_user, mock_square_client):
        """Verify forcing Square status check and updating database accordingly."""
        payment = Payment(
            user_id=regular_user.id,
            onboarding_type="INDIVIDUAL",
            amount=Decimal("150.00"),
            status=PaymentStatus.PENDING,
            square_payment_id="sq_pay_123",
            square_order_id="sq_ord_123",
        )
        db_session.add(payment)
        db_session.commit()

        # The mock return value for payments.get_payment reports 'COMPLETED' (mapped to PAID)
        response = client.post(
            f"/api/v1/payments/verify/{payment.id}",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert response.status_code == 200
        assert response.json()["verified"] is True

        db_session.refresh(payment)
        assert payment.status == PaymentStatus.PAID

        # Verify Audit Log exists for COMPLETED
        audit = db_session.query(AuditLog).filter(
            AuditLog.entity_type == "payment",
            AuditLog.entity_id == payment.id,
            AuditLog.action == "PAYMENT_COMPLETED"
        ).first()
        assert audit is not None

    def test_verify_payment_resolves_link_id(self, client, user_token, db_session, regular_user, mock_square_client):
        """Verify that when square_payment_id is a link ID, it is resolved to real transaction payment ID and persisted."""
        payment = Payment(
            user_id=regular_user.id,
            onboarding_type="INDIVIDUAL",
            amount=Decimal("150.00"),
            status=PaymentStatus.PENDING,
            square_payment_id="sq_link_id_999",  # Different from the real payment ID returned by orders.get mock ("sq_pay_123")
            square_order_id="sq_ord_123",
        )
        db_session.add(payment)
        db_session.commit()

        # The mock return value for orders.get reports tender.payment_id = 'sq_pay_123'
        response = client.post(
            f"/api/v1/payments/verify/{payment.id}",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert response.status_code == 200
        assert response.json()["verified"] is True

        db_session.refresh(payment)
        # Check that it updated the square_payment_id in the DB
        assert payment.square_payment_id == "sq_pay_123"
        assert payment.status == PaymentStatus.PAID

    def test_webhook_completed_idempotency(self, client, db_session, regular_user):
        """Verify webhook status updates are correctly processed and idempotent."""
        payment = Payment(
            user_id=regular_user.id,
            onboarding_type="INDIVIDUAL",
            amount=Decimal("50.00"),
            status=PaymentStatus.PENDING,
            square_payment_id="sq_pay_webhook_test",
            square_order_id="sq_ord_webhook_test",
        )
        db_session.add(payment)
        db_session.commit()

        webhook_payload = {
            "type": "payment.created",
            "data": {
                "object": {
                    "payment": {
                        "id": "sq_pay_webhook_test",
                        "order_id": "sq_ord_webhook_test",
                        "status": "COMPLETED",
                        "amount_money": {"amount": 5000, "currency": "AUD"},
                    }
                }
            },
        }

        # 1st execution
        response = client.post(
            "/api/v1/payments/webhook",
            json=webhook_payload,
        )
        assert response.status_code == 200
        assert response.json()["newStatus"] == "PAID"

        db_session.refresh(payment)
        assert payment.status == PaymentStatus.PAID

        # Assert Audit log exists
        audit_count_before = db_session.query(AuditLog).filter(
            AuditLog.entity_type == "payment",
            AuditLog.entity_id == payment.id,
            AuditLog.action == "PAYMENT_COMPLETED"
        ).count()
        assert audit_count_before == 1

        # 2nd execution (Idempotent call - status should remain PAID, no new audit logs)
        response_dup = client.post(
            "/api/v1/payments/webhook",
            json=webhook_payload,
        )
        assert response_dup.status_code == 200
        
        audit_count_after = db_session.query(AuditLog).filter(
            AuditLog.entity_type == "payment",
            AuditLog.entity_id == payment.id,
            AuditLog.action == "PAYMENT_COMPLETED"
        ).count()
        assert audit_count_after == 1  # No duplicate audit log generated
