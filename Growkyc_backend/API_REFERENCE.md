# API Reference - KYC Backend

Quick reference guide for all API endpoints with detailed examples.

## Table of Contents
- [Authentication](#authentication)
- [KYC Management](#kyc-management)
- [Admin Operations](#admin-operations)
- [Utility](#utility)
- [Error Codes](#error-codes)

---

## Authentication

### Register User

Register a new user account.

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "is_active": true,
  "created_at": "2024-04-08T10:30:00Z"
}
```

**Error Responses:**
- `409 Conflict` - Email already registered
- `422 Unprocessable Entity` - Invalid input data
- `500 Internal Server Error` - Database error

**Field Requirements:**
- `name`: 2-255 characters
- `email`: Valid email format
- `password`: Minimum 8 characters

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
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
    "created_at": "2024-04-08T10:30:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - User account inactive

**Notes:**
- `expires_in` is in seconds (default: 1800 = 30 minutes)
- Token must be included in `Authorization: Bearer <token>` header

---

## KYC Management

### Submit KYC

Submit KYC information (Aadhaar and/or PAN).

**Endpoint:** `POST /kyc/submit`

**Authentication:** Required (Bearer token)

**Request:**
```json
{
  "aadhaar": "123456789012",
  "pan": "ABCDE1234F"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "aadhaar": "123456789012",
  "pan": "ABCDE1234F",
  "status": "Pending",
  "rejection_reason": null,
  "submitted_at": "2024-04-08T10:35:00Z",
  "approved_at": null,
  "rejected_at": null,
  "documents": []
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `409 Conflict` - KYC already submitted for this user
- `422 Unprocessable Entity` - At least one ID required

**Field Requirements:**
- At least one of: `aadhaar` or `pan` required
- `aadhaar`: Exactly 12 digits
- `pan`: Exactly 10 characters

**Notes:**
- One user can have only one KYC record
- Status starts as "Pending"

---

### Upload Document

Upload verification document for KYC.

**Endpoint:** `POST /kyc/upload-document`

**Authentication:** Required (Bearer token)

**Request:**
```json
{
  "file_path": "/uploads/aadhaar_user123.pdf",
  "document_type": "Aadhaar"
}
```

**Response (200):**
```json
{
  "id": 1,
  "kyc_id": 1,
  "file_path": "/uploads/aadhaar_user123.pdf",
  "type": "Aadhaar",
  "uploaded_at": "2024-04-08T10:40:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `404 Not Found` - No KYC record found
- `400 Bad Request` - KYC not in Pending status

**Document Types:**
- `Aadhaar`
- `PAN`
- `Passport`
- `DrivingLicense`
- `Utility`
- `Other`

**Notes:**
- File path should be URL-safe and relative to uploads directory
- KYC must be in "Pending" status to upload documents
- Multiple documents can be uploaded for one KYC

---

### Get KYC Status

Retrieve KYC status and associated documents.

**Endpoint:** `GET /kyc/status/{user_id}`

**Authentication:** Required (Bearer token)

**Parameters:**
- `user_id` (path, integer) - User ID to check

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "aadhaar": "123456789012",
  "pan": "ABCDE1234F",
  "status": "Pending",
  "rejection_reason": null,
  "submitted_at": "2024-04-08T10:35:00Z",
  "approved_at": null,
  "rejected_at": null,
  "documents": [
    {
      "id": 1,
      "kyc_id": 1,
      "file_path": "/uploads/aadhaar_user123.pdf",
      "type": "Aadhaar",
      "uploaded_at": "2024-04-08T10:40:00Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `403 Forbidden` - User can only view own KYC (non-admin)
- `404 Not Found` - No KYC record found

**Authorization:**
- Users can only view their own KYC (`user_id` must match)
- Admin and Agent roles can view any user's KYC

---

## Admin Operations

### Get Pending KYC

List all pending KYC submissions awaiting review.

**Endpoint:** `GET /admin/kyc/pending`

**Authentication:** Required (Admin or Agent role)

**Query Parameters:**
- `limit` (integer, optional, default: 50) - Maximum records to return

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "aadhaar": "999999999999",
    "pan": "ZZZZZZ9999Z",
    "status": "Pending",
    "rejection_reason": null,
    "submitted_at": "2024-04-08T10:35:00Z",
    "approved_at": null,
    "rejected_at": null,
    "documents": [
      {
        "id": 2,
        "kyc_id": 1,
        "file_path": "/uploads/aadhaar_user999.pdf",
        "type": "Aadhaar",
        "uploaded_at": "2024-04-08T10:40:00Z"
      }
    ]
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User role not permitted

**Authorization:**
- Admin role required
- Agent role can also access

---

### Approve KYC

Approve a pending KYC submission.

**Endpoint:** `PUT /admin/kyc/{kyc_id}/approve`

**Authentication:** Required (Admin or Agent role)

**Parameters:**
- `kyc_id` (path, integer) - KYC record ID

**Request:**
```json
{
  "approval_reason": "All documents verified and validated successfully"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 2,
  "aadhaar": "999999999999",
  "pan": "ZZZZZZ9999Z",
  "status": "Approved",
  "rejection_reason": null,
  "submitted_at": "2024-04-08T10:35:00Z",
  "approved_at": "2024-04-08T11:00:00Z",
  "rejected_at": null,
  "documents": []
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `403 Forbidden` - Admin/Agent role required
- `404 Not Found` - KYC record not found
- `400 Bad Request` - KYC not in Pending status

**Notes:**
- `approval_reason` is optional
- Approval is logged in the audit trail
- User receives approval notification (implement separately)

---

### Reject KYC

Reject a pending KYC submission.

**Endpoint:** `PUT /admin/kyc/{kyc_id}/reject`

**Authentication:** Required (Admin or Agent role)

**Parameters:**
- `kyc_id` (path, integer) - KYC record ID

**Request:**
```json
{
  "rejection_reason": "Document quality is insufficient and does not meet verification standards"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 2,
  "aadhaar": "999999999999",
  "pan": "ZZZZZZ9999Z",
  "status": "Rejected",
  "rejection_reason": "Document quality is insufficient and does not meet verification standards",
  "submitted_at": "2024-04-08T10:35:00Z",
  "approved_at": null,
  "rejected_at": "2024-04-08T11:05:00Z",
  "documents": []
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `403 Forbidden` - Admin/Agent role required
- `404 Not Found` - KYC record not found
- `400 Bad Request` - KYC not in Pending status
- `422 Unprocessable Entity` - Reason too short (<10 characters)

**Field Requirements:**
- `rejection_reason`: Minimum 10 characters (required)

**Notes:**
- Rejection is logged in the audit trail
- Rejection reason is stored for user reference
- User should be notified of rejection (implement separately)

---

### Get Audit Log

View complete change history for a KYC record.

**Endpoint:** `GET /admin/kyc/{kyc_id}/audit-log`

**Authentication:** Required (Admin or Agent role)

**Parameters:**
- `kyc_id` (path, integer) - KYC record ID

**Response (200):**
```json
[
  {
    "id": 1,
    "kyc_id": 1,
    "changed_by": 1,
    "old_status": "Pending",
    "new_status": "Approved",
    "change_reason": "All documents verified",
    "changed_at": "2024-04-08T11:00:00Z"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `403 Forbidden` - Admin/Agent role required
- `404 Not Found` - KYC record not found

**Notes:**
- Returns entries in reverse chronological order (newest first)
- `changed_by` is the user ID of the person who made the change
- Empty array if no status changes have occurred

---

## Utility

### Health Check

Check if API is running and healthy.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response (200):**
```json
{
  "status": "healthy",
  "service": "KYC Backend",
  "version": "1.0.0"
}
```

**Uses:**
- Kubernetes/Docker health checks
- Monitoring and alerting systems
- Load balancer probe endpoint

---

## Error Codes

### HTTP Status Codes

| Code | Name | Meaning |
|------|------|---------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Invalid data format |
| 500 | Server Error | Unexpected server error |

### Error Response Format

All errors follow this format:

```json
{
  "detail": "Error description",
  "error_code": 400,
  "path": "/api/endpoint"
}
```

### Common Errors

**Invalid Token**
```json
{
  "detail": "Invalid or expired token",
  "error_code": 401
}
```

**Insufficient Permissions**
```json
{
  "detail": "Admin privileges required",
  "error_code": 403
}
```

**Duplicate Email**
```json
{
  "detail": "Email already registered",
  "error_code": 409
}
```

**Invalid Input**
```json
{
  "detail": "At least one identifier (Aadhaar or PAN) is required",
  "error_code": 422
}
```

---

## Authentication

### Using Tokens

All protected endpoints require JWT token in Authorization header:

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/kyc/status/1
```

### Token Format

Bearer token (JWT):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6IlVzZXIiLCJleHAiOjE3MTIzMjQwMDB9.xyz
```

### Token Claims

```json
{
  "sub": "1",                    // User ID
  "email": "john@example.com",
  "role": "User",                // Admin, User, or Agent
  "exp": 1712324000              // Expiration timestamp
}
```

### Refreshing Tokens

Current implementation:
- Tokens expire after 30 minutes (configurable)
- User must login again to get new token
- Can implement refresh token mechanism if needed

---

## Rate Limiting

Not currently implemented, but can be added using:
- FastAPI middleware
- Third-party libraries (slowapi, flask-limiter)
- Reverse proxy (Nginx, HAProxy)

---

## Pagination

Currently supported:
- `limit` parameter on `/admin/kyc/pending` (default: 50)

For full pagination, implement:
- `offset` parameter for starting position
- `sort` parameter for ordering
- Consistent pagination across endpoints

---

## Date/Time Format

All timestamps use ISO 8601 format with UTC timezone:

```
2024-04-08T10:30:00Z
```

---

## CORS

Allowed origins configured in `.env` (ALLOWED_ORIGINS)

Default development origins:
- http://localhost:3000
- http://localhost:8000
- http://127.0.0.1:3000
- http://127.0.0.1:8000

---

## Content Types

All endpoints accept and return JSON:

```
Content-Type: application/json
Accept: application/json
```

---

## Sample Credentials

For testing (default password: `admin123`):

| Email | Password | Role |
|-------|----------|------|
| admin@kyc.com | admin123 | Admin |
| john@example.com | admin123 | User |
| agent@kyc.com | admin123 | Agent |

---

**Last Updated:** 2024-04-08
**Version:** 1.0.0
**API Version:** v1
