"""
Focused Sprint 3 governance workflow persistence tests.
"""

import pytest

from core.enums import RiskLevel, UserRole
from core.exceptions import AuthorizationError
from core.security import hash_password
from models import AuditLog, Case, Client, User
from services.approval_service import ApprovalService


def _create_user(db_session, email, role):
    user = User(
        name=email.split("@")[0],
        email=email,
        password=hash_password("password123"),
        role=role,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _create_case(db_session, owner):
    client = Client(
        user_id=owner.id,
        name="Governance Test Client",
        risk_level=RiskLevel.HIGH,
    )
    db_session.add(client)
    db_session.commit()
    db_session.refresh(client)

    case = Case(client_id=client.id, title="Governance Test Case")
    db_session.add(case)
    db_session.commit()
    db_session.refresh(case)
    return case


def test_review_approval_creation(db_session):
    owner = _create_user(db_session, "owner@test.com", UserRole.USER)
    analyst = _create_user(db_session, "analyst@test.com", UserRole.ANALYST)
    case = _create_case(db_session, owner)

    approval = ApprovalService(db_session).create_review_approval(
        case_id=case.id,
        reviewer=analyst,
        reviewer_role=UserRole.ANALYST.value,
        decision="Approved",
        comments="Initial analyst approval",
    )

    assert approval.id is not None
    assert approval.case_id == case.id
    assert approval.reviewer_id == analyst.id
    assert approval.reviewer_role == UserRole.ANALYST.value
    assert approval.decision == "Approved"


def test_override_creation_and_audit_generation(db_session):
    owner = _create_user(db_session, "owner2@test.com", UserRole.USER)
    mlro = _create_user(db_session, "mlro@test.com", UserRole.MLRO)
    case = _create_case(db_session, owner)

    override_reason = ApprovalService(db_session).create_override_reason(
        case_id=case.id,
        reviewer=mlro,
        original_decision="Rejected",
        override_decision="Approved",
        reason_code="MANUAL_REVIEW",
        comments="Senior review cleared the issue",
    )

    audit_log = (
        db_session.query(AuditLog)
        .filter(
            AuditLog.entity_type == "override_reason",
            AuditLog.entity_id == override_reason.id,
            AuditLog.action == "OVERRIDE",
        )
        .first()
    )

    assert override_reason.id is not None
    assert override_reason.case_id == case.id
    assert override_reason.reviewer_id == mlro.id
    assert audit_log is not None
    assert audit_log.actor_id == mlro.id


def test_sod_violation_prevention(db_session):
    owner = _create_user(db_session, "owner3@test.com", UserRole.ANALYST)
    case = _create_case(db_session, owner)

    with pytest.raises(AuthorizationError):
        ApprovalService(db_session).create_review_approval(
            case_id=case.id,
            reviewer=owner,
            reviewer_role=UserRole.ANALYST.value,
            decision="Approved",
        )
