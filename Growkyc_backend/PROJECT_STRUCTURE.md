# KYC Backend Project Structure and Architecture

## Overview

This is a complete, production-ready backend for a Know Your Customer (KYC) system built with:
- **Framework**: FastAPI
- **Database**: PostgreSQL (SQLite fallback)
- **ORM**: SQLAlchemy Core (raw SQL queries, no ORM models)
- **Authentication**: JWT tokens with python-jose
- **Password Hashing**: bcrypt via passlib
- **Architecture**: Modular, layered, role-based access control

## Directory Structure

```
kyc_backend/
├── main.py                    # FastAPI application entry point
├── database.py                # Database connection and initialization
├── schemas.py                 # Pydantic models for validation
├── crud.py                    # CRUD operations (raw SQL)
├── dependencies.py            # Dependency injection for FastAPI
├── config.py                  # Configuration management
├── schema.sql                 # SQL schema definition
├── requirements.txt           # Python dependencies
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Docker image definition
├── docker-compose.yml         # Docker Compose orchestration
├── README.md                  # Full documentation
├── QUICK_START.md             # Quick start guide
├── test_api.py                # API testing script
├── PROJECT_STRUCTURE.md       # This file
│
├── auth/                      # Authentication module
│   ├── __init__.py           # Package initialization
│   ├── hashing.py            # Password hashing functions
│   └── jwt_handler.py        # JWT token management
│
└── routers/                   # API route handlers
    ├── __init__.py           # Package initialization
    ├── auth.py               # Authentication routes
    ├── kyc.py                # KYC management routes
    └── admin.py              # Admin-only routes
```

## Core Modules

### 1. **main.py** - FastAPI Application
- FastAPI application factory
- Lifespan context manager for startup/shutdown
- CORS middleware configuration
- Exception handlers
- Route registration
- Health check endpoints

**Key Features**:
- Async application initialization
- Database lifecycle management
- Custom OpenAPI schema
- Error response standardization

### 2. **database.py** - Database Layer
- SQLAlchemy engine configuration
- Connection pooling (QueuePool)
- Database session dependency injection
- Schema initialization from SQL file
- Support for PostgreSQL and SQLite

**Key Functions**:
- `get_db()`: FastAPI dependency for database connections
- `init_db()`: Initialize schema on startup
- `get_engine()`: Access raw engine
- `close_db()`: Cleanup on shutdown

### 3. **schemas.py** - Data Validation
- Pydantic models for all endpoints
- Request/Response schemas
- Enum definitions (matching database enums)
- Field validation and constraints
- JSON schema examples

**Schema Groups**:
- User schemas (Register, Login, Response)
- KYC schemas (Submit, Response, Approval/Rejection)
- Document schemas
- Audit log schemas
- Error schemas

### 4. **crud.py** - Data Access Layer
Raw SQL queries using SQLAlchemy `text()` function - NOT using ORM models.

**Classes**:
- `UserCRUD`: User creation, lookup, existence checks
- `KYCCRUD`: KYC lifecycle management
- `DocumentCRUD`: Document upload and retrieval

**Pattern Example**:
```python
query = text("""
    SELECT * FROM users WHERE id = :user_id
""")
result = db.execute(query, {"user_id": user_id})
row = result.fetchone()
```

### 5. **auth/** - Authentication Module

#### **hashing.py**
- Password hashing with bcrypt (12 rounds)
- Password verification
- Type: `hash_password()`, `verify_password()`

#### **jwt_handler.py**
- JWT token creation with expiration
- Token verification and validation
- Token expiration checking
- Unsafe token decoding (for debugging)

**Key Functions**:
- `create_access_token()`: Create JWT with payload
- `verify_token()`: Validate and decode token
- `is_token_expired()`: Check expiration

### 6. **dependencies.py** - Dependency Injection
FastAPI dependencies for authentication and authorization.

**Functions**:
- `get_current_user()`: Extract and validate JWT token
- `get_admin_user()`: Role-based access (Admin only)
- `get_admin_or_agent_user()`: Multi-role access

**Usage**:
```python
@router.post("/protected")
async def protected_endpoint(
    current_user = Depends(get_current_user)
):
    pass
```

### 7. **routers/** - API Endpoints

#### **auth.py** Routes
```
POST   /auth/register          - Register new user
POST   /auth/login             - User login, get JWT token
```

#### **kyc.py** Routes
```
POST   /kyc/submit             - Submit KYC information
POST   /kyc/upload-document    - Upload verification document
GET    /kyc/status/{user_id}   - Get KYC status (user or admin)
```

#### **admin.py** Routes (Admin/Agent only)
```
GET    /admin/kyc/pending      - List pending KYC records
PUT    /admin/kyc/{id}/approve - Approve KYC
PUT    /admin/kyc/{id}/reject  - Reject KYC
GET    /admin/kyc/{id}/audit-log - View change history
```

### 8. **config.py** - Configuration Management
Centralized configuration from environment variables.

**Settings**:
- Database URL and pool settings
- JWT secret and algorithm
- Token expiration
- Server host/port
- CORS origins
- File upload settings
- Environment-specific settings

## Database Schema

### ENUM Types
- `kyc_status`: Pending, Approved, Rejected
- `user_role`: Admin, User, Agent
- `document_type`: Aadhaar, PAN, Passport, DrivingLicense, Utility, Other

### Tables

#### **users**
```sql
id (PK)          - User ID (auto-increment)
name             - User's full name
email            - Email (unique)
password         - Hashed password
role             - User role (enum)
created_at       - Creation timestamp
updated_at       - Last update timestamp
is_active        - Active/inactive status
```

#### **kyc**
```sql
id (PK)          - KYC record ID
user_id (FK)     - Reference to user (unique, one-to-one)
aadhaar          - 12-digit Aadhaar number
pan              - 10-character PAN number
status           - KYC status (enum)
rejection_reason - Reason if rejected
submitted_at     - Submission timestamp
approved_at      - Approval timestamp
rejected_at      - Rejection timestamp
created_at       - Creation timestamp
updated_at       - Last update timestamp
```

#### **documents**
```sql
id (PK)          - Document ID
kyc_id (FK)      - Reference to KYC record
file_path        - Path to uploaded file
type             - Document type (enum)
uploaded_at      - Upload timestamp
created_at       - Creation timestamp
```

#### **kyc_audit_log**
```sql
id (PK)          - Log entry ID
kyc_id (FK)      - Reference to KYC record
changed_by (FK)  - User who made change
old_status       - Previous status
new_status       - New status
change_reason    - Reason for change
changed_at       - Timestamp of change
```

## Authentication Flow

### 1. User Registration
```
POST /auth/register
├─ Validate input (name, email, password)
├─ Hash password with bcrypt
├─ Create user in database
└─ Return user object
```

### 2. User Login
```
POST /auth/login
├─ Find user by email
├─ Verify password
├─ Create JWT token with user data
└─ Return token + user info
```

### 3. Authenticated Request
```
GET /kyc/status/{user_id}
├─ Extract Bearer token from Authorization header
├─ Verify token signature and expiration
├─ Extract user ID and role from token
├─ Execute endpoint logic
└─ Return response
```

## Authorization by Role

### User Permissions
- Can register and login
- Can submit own KYC
- Can upload documents
- Can view own KYC status only

### Agent Permissions
- Can login
- Can view all pending KYC records
- Can approve/reject KYC
- Can view audit logs

### Admin Permissions
- Full access to all endpoints
- Can manage users indirectly
- All Agent permissions

## Data Flow Examples

### Example 1: KYC Submission
```
1. User authenticates → get JWT token
2. POST /kyc/submit with Aadhaar/PAN
3. API validates token (get_current_user)
4. KYCCRUD.create_kyc() creates record in DB
5. KYC status: "Pending"
6. Return KYC record
```

### Example 2: Document Upload
```
1. User provides JWT token
2. POST /kyc/upload-document with file path
3. Verify user has active KYC in "Pending" status
4. DocumentCRUD.upload_document() stores record
5. Return document object
```

### Example 3: KYC Approval
```
1. Admin authenticates (get_admin_user)
2. PUT /admin/kyc/{id}/approve
3. Verify KYC exists and is "Pending"
4. KYCCRUD.approve_kyc() updates status
5. Record change in kyc_audit_log
6. Return updated KYC
```

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad request (invalid data)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **409**: Conflict (duplicate email, existing KYC)
- **500**: Server error

### Error Response Format
```json
{
  "detail": "Error message",
  "error_code": 400,
  "path": "/api/endpoint"
}
```

## Security Features

1. **Password Hashing**: bcrypt with 12 rounds
2. **JWT Authentication**: HS256 algorithm, configurable expiration
3. **Role-Based Access Control**: Three roles with different permissions
4. **SQL Injection Prevention**: Parameterized queries with `text()` binding
5. **CORS Protection**: Configurable allowed origins
6. **Password Validation**: 8 character minimum, complexity rules implicit
7. **Database Transactions**: Proper commit/rollback for data consistency
8. **Connection Pooling**: Prevents connection leaks
9. **SQL Echo**: Logging for SQL queries (development only)

## Database Connection Details

### PostgreSQL Connection
```python
# With environment variable
DATABASE_URL = "postgresql://user:password@localhost:5432/kyc_db"

# Engine configuration
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True  # Test connections before use
)
```

### SQLite Connection
```python
DATABASE_URL = "sqlite:///./kyc.db"

# Engine configuration
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
```

## Development vs Production

### Development
```
ENV=development
DATABASE_URL=sqlite:///./kyc.db
DEBUG=True
LOG_LEVEL=debug
SECRET_KEY=development-key
```

### Production
```
ENV=production
DATABASE_URL=postgresql://user:password@host:5432/db
DEBUG=False
LOG_LEVEL=info
SECRET_KEY=<secure-random-key>
```

## Running the Application

### Local Development
```bash
python main.py
# Runs on http://localhost:8000
```

### Docker Compose
```bash
docker-compose up
# Starts PostgreSQL + API
# API on http://localhost:8000
# Database on localhost:5432
```

### Production with Gunicorn
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## Testing

### Using test_api.py
```bash
python test_api.py
# Runs comprehensive test suite
# Tests all endpoints and workflows
```

### Manual Testing
Visit http://localhost:8000/docs for interactive Swagger UI documentation.

## Logging

Application logs include:
- Database operations
- Authentication events
- Error traces with stack traces
- Request/response information
- Configuration details on startup

Configure in `.env`:
```env
LOG_LEVEL=debug  # or info, warning, error, critical
```

## Performance Considerations

1. **Connection Pooling**: 10 connections by default, 20 max overflow
2. **Database Indexing**: Indexes on frequently queried columns
3. **Query Optimization**: Raw SQL allows fine-grained control
4. **Async Framework**: FastAPI with uvicorn for concurrency
5. **Caching**: Can add Redis for session caching if needed

## Extension Points

### Adding New Endpoints
1. Create router in `routers/`
2. Define Pydantic schemas in `schemas.py`
3. Add CRUD methods in `crud.py`
4. Include router in `main.py`

### Adding New Tables
1. Add SQL schema to `schema.sql`
2. Create CRUD class in `crud.py`
3. Define Pydantic schemas in `schemas.py`
4. Create router for endpoints

### Custom Authentication
Modify `dependencies.py` and `auth/` module as needed.

---

**Last Updated**: 2024-04-08
**Version**: 1.0.0
