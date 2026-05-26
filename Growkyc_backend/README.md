# KYC System Backend API

Production-ready backend for a Know Your Customer (KYC) system built with FastAPI, SQLAlchemy Core, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing (bcrypt)
- **Role-Based Access Control**: Three roles - Admin, User, Agent
- **KYC Management**: Submit, upload documents, and track KYC status
- **Admin Dashboard**: Approve/reject KYC, view pending submissions, audit logs
- **SQL-First Architecture**: Raw SQL queries using SQLAlchemy Core (no ORM)
- **Production-Ready**: Proper error handling, logging, modular structure
- **PostgreSQL + SQLite**: PostgreSQL for production, SQLite fallback for development

## Project Structure

```
kyc_backend/
├── main.py                 # FastAPI application entry point
├── database.py             # Database connection and initialization
├── schemas.py              # Pydantic models for validation
├── crud.py                 # CRUD operations using raw SQL
├── dependencies.py         # Dependency injection functions
├── schema.sql              # SQL schema file
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
├── auth/
│   ├── __init__.py
│   ├── hashing.py          # Password hashing with bcrypt
│   └── jwt_handler.py      # JWT token creation and verification
└── routers/
    ├── __init__.py
    ├── auth.py             # Registration and login endpoints
    ├── kyc.py              # KYC submission and status endpoints
    └── admin.py            # KYC approval/rejection endpoints
```

## Setup Instructions

### Prerequisites

- Python 3.9 or higher
- PostgreSQL 12+ (optional, SQLite used as fallback)
- pip or pip3

### Installation

1. **Clone the repository and navigate to the project directory**

```bash
cd kyc_backend
```

2. **Create and activate a Python virtual environment**

```bash
# On Linux/macOS
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

**Important**: Change the `SECRET_KEY` in `.env`

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

5. **Set up the database (PostgreSQL)**

```bash
# Create a PostgreSQL database
createdb kyc_db

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/kyc_db
```

Or use SQLite (default, no setup needed):

```bash
DATABASE_URL=sqlite:///./kyc.db
```

6. **Run the application**

```bash
python main.py
```

The API will be available at: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

#### Register a new user

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### KYC Management

#### Submit KYC Information

```http
POST /kyc/submit
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "aadhaar": "123456789012",
  "pan": "ABCDE1234F"
}
```

#### Upload Document

```http
POST /kyc/upload-document
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "file_path": "/uploads/aadhaar_123456.pdf",
  "document_type": "Aadhaar"
}
```

#### Get KYC Status

```http
GET /kyc/status/{user_id}
Authorization: Bearer <access_token>
```

### Admin Operations

#### Get Pending KYC Records

```http
GET /admin/kyc/pending?limit=50
Authorization: Bearer <admin_token>
```

#### Approve KYC

```http
PUT /admin/kyc/{kyc_id}/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "approval_reason": "All documents verified"
}
```

#### Reject KYC

```http
PUT /admin/kyc/{kyc_id}/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rejection_reason": "Document quality is insufficient for verification"
}
```

#### Get Audit Log

```http
GET /admin/kyc/{kyc_id}/audit-log
Authorization: Bearer <admin_token>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'User',  -- Admin, User, Agent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### KYC Table
```sql
CREATE TABLE kyc (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    aadhaar VARCHAR(12),
    pan VARCHAR(10),
    status kyc_status DEFAULT 'Pending',  -- Pending, Approved, Rejected
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Documents Table
```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    kyc_id INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    type document_type NOT NULL,  -- Aadhaar, PAN, Passport, etc.
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kyc_id) REFERENCES kyc(id) ON DELETE CASCADE
);
```

### Audit Log Table
```sql
CREATE TABLE kyc_audit_log (
    id SERIAL PRIMARY KEY,
    kyc_id INTEGER NOT NULL,
    changed_by INTEGER NOT NULL,
    old_status kyc_status,
    new_status kyc_status,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kyc_id) REFERENCES kyc(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);
```

## Authentication & Authorization

### JWT Token Structure

```json
{
  "sub": "1",                 // User ID
  "email": "john@example.com",
  "role": "User",             // Admin, User, Agent
  "exp": 1705395000          // Expiration timestamp
}
```

### Role-Based Access Control

| Endpoint | Admin | User | Agent |
|----------|-------|------|-------|
| /auth/register | ✓ | ✓ | ✓ |
| /auth/login | ✓ | ✓ | ✓ |
| /kyc/submit | ✓ | ✓ | ✓ |
| /kyc/upload-document | ✓ | ✓ | ✓ |
| /kyc/status/{user_id} | ✓ (all) | ✓ (own) | ✓ (all) |
| /admin/kyc/pending | ✓ | ✗ | ✓ |
| /admin/kyc/{id}/approve | ✓ | ✗ | ✓ |
| /admin/kyc/{id}/reject | ✓ | ✗ | ✓ |
| /admin/kyc/{id}/audit-log | ✓ | ✗ | ✓ |

## Sample Data

Default users are created on first run (password: `admin123`):

- **Admin User**: admin@kyc.com (Admin role)
- **John Doe**: john@example.com (User role)
- **Agent Smith**: agent@kyc.com (Agent role)

Use these credentials to test the API.

## Production Deployment

### Using Gunicorn

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Environment Setup for Production

```bash
# .env (Production)
ENV=production
DATABASE_URL=postgresql://user:password@prod-db-host:5432/kyc_db
SECRET_KEY=<generate-secure-key>
LOG_LEVEL=info
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
```

## Error Handling

All errors follow a consistent format:

```json
{
  "detail": "Error message",
  "error_code": 400,
  "path": "/api/endpoint"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Logging

Application logs are configured to show:
- Request/Response information
- Database operations
- Authentication events
- Error traces

Check the console output or configure file logging:

```python
# In database.py or main.py
logging.basicConfig(
    filename='kyc_backend.log',
    level=logging.INFO
)
```

## Testing

Run the application and visit the interactive API documentation:

```bash
# Start the server
python main.py

# Test with the Swagger UI
open http://localhost:8000/docs
```

## Dependencies

- **FastAPI** (0.104.1): Modern web framework
- **SQLAlchemy** (2.0.23): Database ORM/Core
- **python-jose** (3.3.0): JWT implementation
- **passlib** (1.7.4): Password hashing
- **psycopg2** (2.9.9): PostgreSQL adapter
- **pydantic** (2.5.0): Data validation

## License

This project is provided as-is for educational and development purposes.

## Support

For issues, questions, or improvements, please refer to the API documentation at `/docs`.

---

**Last Updated**: 2024-04-08
**Version**: 1.0.0
