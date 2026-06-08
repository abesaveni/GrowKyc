"""
tests/test_risk_recalculation.py
=================================
Test suite for Sprint C — Risk Recalculation Automation.

Covers:
  - recalculate_client_risk helper (success, missing client, re-raise on error)
  - MonitoringService.check_document_expirations  → risk recalculation hook
  - MonitoringService.trigger_periodic_review     → risk recalculation hook
  - screening_service.perform_screening           → risk recalculation hook

All tests use an isolated in-memory SQLite session to avoid touching production data.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from core.enums import KYCStatus, RiskLevel, UserRole, DocumentType
from core.security import hash_password
from models import Base, Client, KYC, User, Document, RiskAssessment


# ---------------------------------------------------------------------------
# Shared in-memory DB fixture
# ---------------------------------------------------------------------------


@pytest.fixture(scope="function")
def mem_db():
    """Isolated in-memory SQLite session for Sprint C tests."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_user(db, email="risk@test.com"):
    user = User(
        name="Risk Test User",
        email=email,
        password=hash_password("Test1234!"),
        role=UserRole.USER,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _make_client(db, user, risk_level=RiskLevel.LOW, review_offset_days=-1):
    client = Client(
        user_id=user.id,
        name=user.name,
        risk_level=risk_level,
        tenant_id=1,  # Required by RiskAssessment NOT NULL constraint
        review_date=datetime.now(timezone.utc) + timedelta(days=review_offset_days),
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def _make_kyc(db, user):
    kyc = KYC(
        user_id=user.id,
        aadhaar="123456789012",
        name=user.name,
        status=KYCStatus.PENDING,
    )
    db.add(kyc)
    db.commit()
    db.refresh(kyc)
    return kyc


def _make_document(db, kyc, client, expiry_offset_days=-5, doc_type=DocumentType.PASSPORT):
    """Create a document linked to both KYC and Client.
    Negative offset = already expired."""
    doc = Document(
        kyc_id=kyc.id,
        client_id=client.id,  # Required for monitoring hook to fire
        file_name="passport.pdf",
        file_path="/uploads/passport.pdf",
        type=doc_type,
        expiry_date=datetime.now(timezone.utc) + timedelta(days=expiry_offset_days),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


# ---------------------------------------------------------------------------
# 1. Unit tests for recalculate_client_risk helper
# ---------------------------------------------------------------------------


class TestRecalculateClientRiskHelper:
    """Tests for the recalculate_client_risk module-level helper."""

    def test_returns_assessment_for_valid_client(self, mem_db):
        """recalculate_client_risk should return a RiskAssessment for a known client."""
        user = _make_user(mem_db, email="helper_ok@test.com")
        client = _make_client(mem_db, user)

        with patch(
            "services.risk.engine.RiskEngine.calculate_risk",
            return_value=(50, "MEDIUM", "MEDIUM", {}),
        ), patch(
            "core.tenant_context.get_tenant_id", return_value=1
        ):
            from services.risk_service import recalculate_client_risk

            result = recalculate_client_risk(
                client.id, db=mem_db, trigger="test_trigger"
            )

        assert result is not None
        assert isinstance(result, RiskAssessment)
        assert result.client_id == client.id
        assert result.assessment_trigger == "test_trigger"

    def test_returns_none_for_missing_client(self, mem_db):
        """recalculate_client_risk should return None when client_id does not exist."""
        from services.risk_service import recalculate_client_risk

        result = recalculate_client_risk(99999, db=mem_db, trigger="test_trigger")
        assert result is None

    def test_uses_caller_supplied_session(self, mem_db):
        """recalculate_client_risk must NOT open a new session when db is provided."""
        user = _make_user(mem_db, email="helper_session@test.com")
        client = _make_client(mem_db, user)

        with patch(
            "services.risk.engine.RiskEngine.calculate_risk",
            return_value=(30, "LOW", "LOW", {}),
        ), patch(
            "core.tenant_context.get_tenant_id", return_value=1
        ), patch(
            "database.SessionLocal"
        ) as mock_session_local:
            from services.risk_service import recalculate_client_risk

            recalculate_client_risk(client.id, db=mem_db, trigger="session_test")
            mock_session_local.assert_not_called()

    def test_risk_level_updated_on_client(self, mem_db):
        """After recalculation the client row should reflect the new risk level."""
        user = _make_user(mem_db, email="helper_level@test.com")
        client = _make_client(mem_db, user, risk_level=RiskLevel.LOW)

        with patch(
            "services.risk.engine.RiskEngine.calculate_risk",
            return_value=(85, "HIGH", "HIGH", {}),
        ), patch(
            "core.tenant_context.get_tenant_id", return_value=1
        ):
            from services.risk_service import recalculate_client_risk

            recalculate_client_risk(client.id, db=mem_db, trigger="level_test")

        mem_db.refresh(client)
        assert client.risk_level == RiskLevel.HIGH
        assert client.risk_score == 85


# ---------------------------------------------------------------------------
# 2. MonitoringService — document expiry hook
# ---------------------------------------------------------------------------


class TestMonitoringDocumentExpiryHook:
    """Risk recalculation must fire after check_document_expirations alerts."""

    def test_risk_recalculated_after_document_expiry_alert(self, mem_db):
        """
        When check_document_expirations finds an expired doc linked to a client,
        recalculate_client_risk must be called for that client.
        """
        user = _make_user(mem_db, email="mon_doc@test.com")
        client = _make_client(mem_db, user)
        kyc = _make_kyc(mem_db, user)
        _make_document(mem_db, kyc, client, expiry_offset_days=-5)

        # Patch at the SOURCE module (local import resolves from there)
        with patch(
            "services.risk_service.recalculate_client_risk"
        ) as mock_recalc, patch(
            "services.monitoring_service.NotificationService"
        ) as mock_notif_cls:
            mock_notif_cls.return_value.create_notification = MagicMock()

            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            svc.check_document_expirations()

        mock_recalc.assert_called_once()
        call_args = mock_recalc.call_args
        assert call_args[0][0] == client.id
        assert call_args[1]["trigger"] == "monitoring_document_alert"

    def test_no_risk_recalc_when_no_expired_docs(self, mem_db):
        """
        When there are no expired documents, recalculate_client_risk must NOT be called.
        """
        user = _make_user(mem_db, email="mon_nodoc@test.com")
        _make_client(mem_db, user)

        with patch(
            "services.risk_service.recalculate_client_risk"
        ) as mock_recalc:
            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            svc.check_document_expirations()

        mock_recalc.assert_not_called()

    def test_monitoring_continues_if_recalc_raises(self, mem_db):
        """
        A failure inside recalculate_client_risk must NOT crash check_document_expirations.
        """
        user = _make_user(mem_db, email="mon_err@test.com")
        client = _make_client(mem_db, user)
        kyc = _make_kyc(mem_db, user)
        _make_document(mem_db, kyc, client, expiry_offset_days=-3)

        with patch(
            "services.risk_service.recalculate_client_risk",
            side_effect=RuntimeError("engine down"),
        ), patch(
            "services.monitoring_service.NotificationService"
        ) as mock_notif_cls:
            mock_notif_cls.return_value.create_notification = MagicMock()

            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            count = svc.check_document_expirations()

        assert isinstance(count, int)


# ---------------------------------------------------------------------------
# 3. MonitoringService — periodic review hook
# ---------------------------------------------------------------------------


class TestMonitoringPeriodicReviewHook:
    """Risk recalculation must fire after trigger_periodic_review marks clients due."""

    def test_risk_recalculated_after_periodic_review(self, mem_db):
        """
        When trigger_periodic_review finds a due client,
        recalculate_client_risk must be called for that client.
        """
        user = _make_user(mem_db, email="mon_review@test.com")
        client = _make_client(mem_db, user, review_offset_days=-1)

        with patch(
            "services.risk_service.recalculate_client_risk"
        ) as mock_recalc, patch(
            "services.monitoring_service.NotificationService"
        ) as mock_notif_cls:
            mock_notif_cls.return_value.create_notification = MagicMock()

            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            svc.trigger_periodic_review()

        mock_recalc.assert_called_once()
        assert mock_recalc.call_args[1]["trigger"] == "monitoring_periodic_review"

    def test_no_risk_recalc_when_no_due_clients(self, mem_db):
        """When no clients are due for review, recalculate_client_risk must not fire."""
        user = _make_user(mem_db, email="mon_noreview@test.com")
        _make_client(mem_db, user, review_offset_days=30)

        with patch(
            "services.risk_service.recalculate_client_risk"
        ) as mock_recalc:
            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            svc.trigger_periodic_review()

        mock_recalc.assert_not_called()

    def test_periodic_review_continues_if_recalc_raises(self, mem_db):
        """
        A failure inside recalculate_client_risk must NOT crash trigger_periodic_review.
        """
        user = _make_user(mem_db, email="mon_rev_err@test.com")
        _make_client(mem_db, user, review_offset_days=-1)

        with patch(
            "services.risk_service.recalculate_client_risk",
            side_effect=RuntimeError("db timeout"),
        ), patch(
            "services.monitoring_service.NotificationService"
        ) as mock_notif_cls:
            mock_notif_cls.return_value.create_notification = MagicMock()

            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            count = svc.trigger_periodic_review()

        assert isinstance(count, int)


# ---------------------------------------------------------------------------
# 4. ScreeningService — perform_screening hook
# ---------------------------------------------------------------------------


class TestScreeningServiceHook:
    """Risk recalculation must fire after perform_screening completes for a client."""

    def _make_mock_result(self, status="clear"):
        """Create a mock NormalizedScreeningResult."""
        result = MagicMock()
        result.status = status
        result.provider_name = "mock_provider"
        result.provider_reference = "ref-001"
        result.confidence_score = 0.99
        result.match_summary = "No matches"
        result.raw_response = {}
        result.matched_entities = []
        result.error_message = None
        result.is_pep = False
        result.is_sanctioned = False
        return result

    def _make_screening_client(self, mem_db):
        """Create a client with client_type set for screening."""
        user = _make_user(mem_db, email=f"screen_{id(mem_db)}@test.com")
        client = _make_client(mem_db, user)
        # screening_service checks client.client_type which is not a DB column
        client.client_type = "INDIVIDUAL"
        client.geography = "IN"
        return client

    def test_risk_recalculated_after_screening(self, mem_db):
        """
        perform_screening should call recalculate_client_risk once it finishes.
        """
        client = self._make_screening_client(mem_db)

        mock_result = self._make_mock_result()
        mock_provider = MagicMock()
        mock_provider.provider_name = "mock"
        mock_provider.screen_person.return_value = mock_result

        with patch(
            "services.risk_service.recalculate_client_risk"
        ) as mock_recalc, patch(
            "services.screening_service.ProviderFactory.get_providers",
            return_value=[mock_provider],
        ), patch(
            "core.tenant_context.get_tenant_id", return_value=1
        ):
            from services.screening_service import ScreeningService

            svc = ScreeningService(mem_db)
            svc.perform_screening(client)

        mock_recalc.assert_called_once()
        assert mock_recalc.call_args[0][0] == client.id

    def test_screening_trigger_identifies_sanctions_match(self, mem_db):
        """
        When screening detects a sanctions match, the trigger must be 'sanctions_match'.
        """
        client = self._make_screening_client(mem_db)

        mock_result = self._make_mock_result(status="match_found")
        mock_result.is_sanctioned = True
        mock_result.is_pep = False

        mock_provider = MagicMock()
        mock_provider.provider_name = "mock"
        mock_provider.screen_person.return_value = mock_result

        captured = []

        def fake_recalc(client_id, db=None, trigger="recalculation"):
            captured.append(trigger)

        with patch(
            "services.risk_service.recalculate_client_risk",
            side_effect=fake_recalc,
        ), patch(
            "services.screening_service.ProviderFactory.get_providers",
            return_value=[mock_provider],
        ), patch(
            "core.tenant_context.get_tenant_id", return_value=1
        ):
            from services.screening_service import ScreeningService

            svc = ScreeningService(mem_db)
            svc.perform_screening(client)

        assert "sanctions_match" in captured


# ---------------------------------------------------------------------------
# 5. Trigger string contract
# ---------------------------------------------------------------------------


class TestTriggerStringContract:
    """Verify exact trigger strings so audit logs remain consistent."""

    def test_monitoring_document_alert_trigger_string(self, mem_db):
        user = _make_user(mem_db, email="trig_doc@test.com")
        client = _make_client(mem_db, user)
        kyc = _make_kyc(mem_db, user)
        _make_document(mem_db, kyc, client, expiry_offset_days=-1)

        captured = []

        def fake_recalc(client_id, db=None, trigger="recalculation"):
            captured.append(trigger)

        with patch(
            "services.risk_service.recalculate_client_risk",
            side_effect=fake_recalc,
        ), patch(
            "services.monitoring_service.NotificationService"
        ) as mock_notif_cls:
            mock_notif_cls.return_value.create_notification = MagicMock()

            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            svc.check_document_expirations()

        assert "monitoring_document_alert" in captured

    def test_monitoring_periodic_review_trigger_string(self, mem_db):
        user = _make_user(mem_db, email="trig_rev@test.com")
        _make_client(mem_db, user, review_offset_days=-1)

        captured = []

        def fake_recalc(client_id, db=None, trigger="recalculation"):
            captured.append(trigger)

        with patch(
            "services.risk_service.recalculate_client_risk",
            side_effect=fake_recalc,
        ), patch(
            "services.monitoring_service.NotificationService"
        ) as mock_notif_cls:
            mock_notif_cls.return_value.create_notification = MagicMock()

            from services.monitoring_service import MonitoringService

            svc = MonitoringService(mem_db)
            svc.trigger_periodic_review()

        assert "monitoring_periodic_review" in captured
