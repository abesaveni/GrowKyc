# KYC Backend - Testing Guide

## Overview

This guide covers the comprehensive test suite for the KYC Backend API. The test suite validates authentication, KYC operations, document uploads, and admin functions.

## Test Structure

```
tests/
├── __init__.py           # Tests package
├── conftest.py           # Pytest fixtures and configuration
├── test_auth.py          # Authentication tests
├── test_kyc.py           # KYC submission and management tests
└── test_admin.py         # Admin operations tests
```

## Prerequisites

1. Install test dependencies:
```bash
pip install pytest pytest-cov httpx
```

2. Ensure `.env` file is configured with test database URL

## Running Tests

### Run All Tests
```bash
python run_tests.py
# OR
pytest tests/ -v
```

### Run Specific Test Suite
```bash
# Auth tests only
python run_tests.py auth

# KYC tests only
python run_tests.py kyc

# Admin tests only
python run_tests.py admin
```

### Run with Coverage Report
```bash
python run_tests.py coverage
# OR
pytest tests/ --cov=. --cov-report=html
```

### Run Single Test
```bash
pytest tests/test_auth.py::TestAuthLogin::test_login_success -v
```

## Test Coverage

### Authentication Tests (test_auth.py)
- ✅ **Registration**: Successful registration, duplicate email, invalid password, invalid email
- ✅ **Login**: Successful login, wrong password, non-existent user, inactive user
- ✅ **JWT Tokens**: Token validation, invalid tokens, expired tokens, missing tokens
- ✅ **Profile**: Get profile, unauthorized access
- ✅ **Password Change**: Successful change, wrong current password
- ✅ **Token Refresh**: Refresh token, unauthorized refresh

### KYC Tests (test_kyc.py)
- ✅ **Submission**: Successful submission, Aadhaar only, PAN only, no identifiers, duplicate submission
- ✅ **Status**: Get status, no KYC found, unauthorized access
- ✅ **Document Upload**: Successful upload, invalid KYC, unauthorized upload
- ✅ **Approval/Rejection**: Approve KYC, reject KYC, invalid state, unauthorized actions
- ✅ **Listing**: List KYC records, unauthorized access

### Admin Tests (test_admin.py)
- ✅ **Dashboard**: Get statistics, unauthorized access
- ✅ **KYC Operations**: Pending KYC, bulk approve, audit logs
- ✅ **User Management**: List users, role filtering, pagination
- ✅ **User Toggle**: Toggle active status, prevent self-deactivation
- ✅ **Statistics**: KYC by status, empty statistics
- ✅ **Health**: Health check, root endpoint

## Test Database

Tests use in-memory SQLite database for speed and isolation:
- Each test gets a fresh database instance
- No persistence between tests
- Fast execution (~2-3 seconds for full suite)

## Fixtures

Available pytest fixtures (in `conftest.py`):

```python
def test_example(client, admin_user, admin_token, user_token):
    # client: FastAPI TestClient
    # admin_user: Pre-created admin User instance
    # admin_token: JWT token for admin
    # user_token: JWT token for regular user
    pass
```

**Available Fixtures:**
- `test_db`: In-memory test database
- `client`: FastAPI TestClient
- `admin_user`: Pre-created admin user
- `agent_user`: Pre-created agent user
- `regular_user`: Pre-created regular user
- `admin_token`: JWT token for admin
- `agent_token`: JWT token for agent
- `user_token`: JWT token for regular user
- `db_session`: Database session for test

## Test Example

```python
def test_login_success(self, client, regular_user):
    """Test successful login returns JWT token."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "user@test.com",
            "password": "user123456"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
```

## Expected Test Results

### Success Criteria
- All 50+ tests pass ✓
- Login works correctly
- JWT tokens are validated properly
- KYC submission and approval flow works
- Database operations save correctly
- Admin operations function with proper authorization

### Sample Output
```
tests/test_auth.py::TestAuthRegistration::test_register_success PASSED      [ 2%]
tests/test_auth.py::TestAuthRegistration::test_register_duplicate_email PASSED [ 4%]
tests/test_auth.py::TestAuthLogin::test_login_success PASSED                [ 6%]
...
tests/test_admin.py::TestAdminStatistics::test_kyc_stats_by_status PASSED    [98%]
tests/test_admin.py::TestHealthEndpoint::test_root_endpoint PASSED           [100%]

======= 54 passed in 2.45s =======
```

## Debugging Failed Tests

### Verbose Output
```bash
pytest tests/ -vv --tb=long
```

### Stop on First Failure
```bash
pytest tests/ -x
```

### Show Print Statements
```bash
pytest tests/ -s
```

### Run with Markers
```bash
pytest tests/ -m auth  # Run only auth tests
```

## Performance

- **Total Runtime**: ~2-3 seconds for full suite
- **Setup Time**: ~0.5 seconds (database initialization)
- **Per-Test Average**: ~50ms

## Continuous Integration

For CI/CD pipelines, run:
```bash
pytest tests/ --cov=. --cov-report=xml --cov-fail-under=80 -v
```

This will:
- Generate coverage report in XML format
- Fail if coverage drops below 80%
- Show verbose output for debugging

## Common Issues

### Test Database Lock
**Problem**: "Database is locked" error
**Solution**: Ensure only one test process is running

### Import Errors
**Problem**: `ModuleNotFoundError: No module named 'main'`
**Solution**: Run from `kyc_backend` directory

### Token Validation Fails
**Problem**: JWT validation fails in tests
**Solution**: Ensure SECRET_KEY is set in .env for test environment

## Adding New Tests

1. Create test in appropriate test file (or new file)
2. Inherit from existing test class or create new one
3. Use fixtures for setup
4. Use descriptive test names
5. Add docstrings explaining what's tested

Example:
```python
def test_new_feature(self, client, admin_token):
    """Test description of what's being verified."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/endpoint", headers=headers)
    assert response.status_code == 200
    assert "expected_field" in response.json()
```

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/advanced/testing-dependencies/)
- [SQLAlchemy Testing](https://docs.sqlalchemy.org/en/20/faq/index.html#testing-strategies)
