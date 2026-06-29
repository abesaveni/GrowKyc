"""
Test suite for US-026 — Document Expiry Scheduler Job.
Tests expiry detection, alert creation, duplicate prevention, and scheduler safety.
Uses in-memory SQLite via conftest fixtures to avoid touching production data.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from core.enums import (CaseStatus, DocumentType, KYCStatus, NotificationType,
                        RiskLevel, UserRole)
from core.security import hash_password
from models import KYC, Base, Case, Client, Document, User
from services.expiry_scheduler import (_alert_sent_today,
                                       create_periodic_review_cases,
                                       get_scheduler, scan_expiring_documents,
                                       start_expiry_scheduler,
                                       stop_expiry_scheduler)

# ---- In-memory DB fixture specific to this test module ----


@pytest.fixture(scope="function")
def mem_db():
    """Isolated in-memory SQLite session for expiry scheduler tests."""
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


def _make_user(db, email="test@scheduler.com"):
    user = User(
        name="Scheduler Test User",
        email=email,
        password=hash_password("Test1234!"),
        role=UserRole.USER,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


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


def _make_document(db, kyc, expiry_offset_days, doc_type=DocumentType.PASSPORT):
    """Create a document expiring in `expiry_offset_days` from now."""
    doc = Document(
        kyc_id=kyc.id,
        file_name="test_passport.pdf",
        file_path="/uploads/test_passport.pdf",
        type=doc_type,
        expiry_date=datetime.now(timezone.utc) + timedelta(days=expiry_offset_days),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def _make_client(db, user, review_offset_days=-1, risk_level=RiskLevel.LOW):
    client = Client(
        user_id=user.id,
        name="Periodic Review Client",
        risk_level=risk_level,
        review_date=datetime.now(timezone.utc) + timedelta(days=review_offset_days),
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


# ---- Tests ----


class TestExpiryDetection:
    """Tests for expiry window detection logic."""

    def test_document_expiring_within_30_days_is_detected(self, mem_db):
        """Document expiring in 15 days should appear in the 30-day window query."""
        user = _make_user(mem_db)
        kyc = _make_kyc(mem_db, user)
        doc = _make_document(mem_db, kyc, expiry_offset_days=15)

        now = datetime.now(timezone.utc)
        window_30 = now + timedelta(days=30)

        from models import Document

        results = (
            mem_db.query(Document)
            .filter(
                Document.expiry_date.isnot(None),
                Document.expiry_date >= now,
                Document.expiry_date <= window_30,
            )
            .all()
        )

        assert len(results) == 1
        assert results[0].id == doc.id

    def test_document_expiring_within_60_days_is_detected(self, mem_db):
        """Document expiring in 45 days should appear in the 31-60 day window query."""
        user = _make_user(mem_db, email="user60@test.com")
        kyc = _make_kyc(mem_db, user)
        doc = _make_document(mem_db, kyc, expiry_offset_days=45)

        now = datetime.now(timezone.utc)
        window_30 = now + timedelta(days=30)
        window_60 = now + timedelta(days=60)

        from models import Document

        results = (
            mem_db.query(Document)
            .filter(
                Document.expiry_date.isnot(None),
                Document.expiry_date > window_30,
                Document.expiry_date <= window_60,
            )
            .all()
        )

        assert len(results) == 1
        assert results[0].id == doc.id

    def test_document_without_expiry_date_ignored(self, mem_db):
        """Document with no expiry_date must not appear in either query."""
        user = _make_user(mem_db, email="noexp@test.com")
        kyc = _make_kyc(mem_db, user)
        doc = Document(
            kyc_id=kyc.id,
            file_name="no_expiry.pdf",
            file_path="/uploads/no_expiry.pdf",
            type=DocumentType.OTHER,
            expiry_date=None,
        )
        mem_db.add(doc)
        mem_db.commit()

        datetime.now(timezone.utc)
        from models import Document as Doc

        results = mem_db.query(Doc).filter(Doc.expiry_date.isnot(None)).all()
        assert len(results) == 0

    def test_far_future_document_ignored(self, mem_db):
        """Document expiring in 90 days must not appear in alert windows."""
        user = _make_user(mem_db, email="future@test.com")
        kyc = _make_kyc(mem_db, user)
        _make_document(mem_db, kyc, expiry_offset_days=90)

        now = datetime.now(timezone.utc)
        window_60 = now + timedelta(days=60)

        from models import Document

        results = (
            mem_db.query(Document)
            .filter(
                Document.expiry_date.isnot(None),
                Document.expiry_date <= window_60,
            )
            .all()
        )

        assert len(results) == 0


class TestAlertCreation:
    """Tests for notification generation via NotificationService."""

    def test_alert_created_for_expiring_document(self, mem_db):
        """Calling scan with a mocked SessionLocal should create a notification."""
        user = _make_user(mem_db, email="alert@test.com")
        kyc = _make_kyc(mem_db, user)
        _make_document(mem_db, kyc, expiry_offset_days=10)

        # Patch SessionLocal to return our test session
        with patch("services.expiry_scheduler.SessionLocal", return_value=mem_db):
            result = scan_expiring_documents()

        assert result["alerts_30_day"] >= 1

    def test_no_alert_for_far_future_document(self, mem_db):
        """Scan should produce zero alerts when no documents expire within 60 days."""
        user = _make_user(mem_db, email="nofuturealert@test.com")
        kyc = _make_kyc(mem_db, user)
        _make_document(mem_db, kyc, expiry_offset_days=90)

        with patch("services.expiry_scheduler.SessionLocal", return_value=mem_db):
            result = scan_expiring_documents()

        assert result["alerts_30_day"] == 0
        assert result["alerts_60_day"] == 0


class TestDuplicatePrevention:
    """Tests for duplicate alert suppression logic."""

    def test_duplicate_alert_not_sent_same_day(self, mem_db):
        """_alert_sent_today should return True when an alert already exists today."""
        from models import Notification

        user = _make_user(mem_db, email="dup@test.com")

        today = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        notif = Notification(
            user_id=user.id,
            title="Document Expiring Soon (30 Days)",
            message="Test alert",
            type=NotificationType.SYSTEM_ALERT,
            created_at=datetime.now(timezone.utc),
        )
        mem_db.add(notif)
        mem_db.commit()

        result = _alert_sent_today(mem_db, user.id, doc_id=1, today_start=today)
        assert result is True

    def test_no_duplicate_when_no_prior_alert(self, mem_db):
        """_alert_sent_today should return False when no prior alert exists."""
        user = _make_user(mem_db, email="nodup@test.com")
        today = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        )

        result = _alert_sent_today(mem_db, user.id, doc_id=99, today_start=today)
        assert result is False


class TestPeriodicReviewCases:
    """Tests for automatic periodic review case creation."""

    def test_periodic_review_case_created_for_due_client(self, mem_db):
        user = _make_user(mem_db, email="review-due@test.com")
        client = _make_client(mem_db, user, review_offset_days=-1)
        client_id = client.id

        with patch("services.expiry_scheduler.SessionLocal", return_value=mem_db):
            result = create_periodic_review_cases()

        cases = mem_db.query(Case).filter(Case.client_id == client_id).all()
        assert result["created"] == 1
        assert len(cases) == 1
        assert cases[0].status == CaseStatus.OPEN
        assert cases[0].title == f"Periodic Review - Client {client_id}"

    def test_periodic_review_duplicate_case_is_prevented(self, mem_db):
        user = _make_user(mem_db, email="review-dup@test.com")
        client = _make_client(mem_db, user, review_offset_days=-1)
        client_id = client.id
        existing = Case(
            client_id=client_id,
            title=f"Periodic Review - Client {client_id}",
            description="Existing periodic review",
            status=CaseStatus.OPEN,
        )
        mem_db.add(existing)
        mem_db.commit()

        with patch("services.expiry_scheduler.SessionLocal", return_value=mem_db):
            result = create_periodic_review_cases()

        cases = mem_db.query(Case).filter(Case.client_id == client_id).all()
        assert result["created"] == 0
        assert result["duplicates_skipped"] == 1
        assert len(cases) == 1


class TestSchedulerLifecycle:
    """Tests for APScheduler startup and shutdown safety."""

    def test_scheduler_starts_and_is_running(self):
        """start_expiry_scheduler should create a running scheduler."""
        start_expiry_scheduler()
        sched = get_scheduler()
        assert sched is not None
        assert sched.running is True
        assert sched.get_job("document_expiry_scan") is not None
        assert sched.get_job("daily_monitoring_checks") is not None
        assert sched.get_job("periodic_review_cases") is not None
        stop_expiry_scheduler()

    def test_scheduler_stops_gracefully(self):
        """stop_expiry_scheduler should stop the scheduler without error."""
        start_expiry_scheduler()
        stop_expiry_scheduler()
        sched = get_scheduler()
        # After stop, scheduler should not be running
        assert sched is None or not sched.running

    def test_stop_without_start_is_safe(self):
        """Calling stop before start should not raise an exception."""
        try:
            stop_expiry_scheduler()
        except Exception as e:
            pytest.fail(f"stop_expiry_scheduler raised unexpectedly: {e}")
