"""
Pytest configuration and fixtures for KYC tests.
Provides database session, test client, and test data setup.
"""

import sys

# Passlib / bcrypt 4.x compatibility hack (DO NOT modify business logic)
import bcrypt

if not hasattr(bcrypt, "__about__"):

    class AboutMock:
        __version__ = getattr(bcrypt, "__version__", "4.0.0")

    bcrypt.__about__ = AboutMock()
    sys.modules["bcrypt.__about__"] = bcrypt.__about__

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from core.enums import UserRole
from core.security import hash_password
from database import get_db
from main import app
from models import Base, User

# Use in-memory SQLite for testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="function")
def test_db():
    """
    Create a test database for each test function.
    Uses in-memory SQLite for speed.
    """
    engine = create_engine(
        SQLALCHEMY_TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # Create all tables
    Base.metadata.create_all(bind=engine)

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    yield engine

    # Cleanup
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def db_session(test_db):
    """Get a database session for a test."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_db)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client(test_db):
    """Create a test client with overridden database."""
    return TestClient(app)


@pytest.fixture
def admin_user(db_session):
    """Create a test admin user."""
    user = User(
        name="Admin User",
        email="admin@test.com",
        password=hash_password("admin123456"),
        role=UserRole.ADMIN,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def agent_user(db_session):
    """Create a test agent user."""
    user = User(
        name="Agent User",
        email="agent@test.com",
        password=hash_password("agent123456"),
        role=UserRole.AGENT,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def regular_user(db_session):
    """Create a test regular user."""
    user = User(
        name="Regular User",
        email="user@test.com",
        password=hash_password("user123456"),
        role=UserRole.USER,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def admin_token(client, admin_user):
    """Get JWT token for admin user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.com", "password": "admin123456"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def agent_token(client, agent_user):
    """Get JWT token for agent user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "agent@test.com", "password": "agent123456"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def user_token(client, regular_user):
    """Get JWT token for regular user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "user@test.com", "password": "user123456"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]
