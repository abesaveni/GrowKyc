# Quick Start Guide

Get the KYC Backend running in 5 minutes.

## 1. Install and Run

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (optional, uses defaults if .env not present)
cp .env.example .env

# Run the server
python main.py
```

Server starts at: `http://localhost:8000`

## 2. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 3. Quick Test with Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. Register a user
register_data = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123"
}
register_response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
print("Register:", register_response.json())

# 2. Login
login_data = {
    "email": "test@example.com",
    "password": "SecurePass123"
}
login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
token = login_response.json()["access_token"]
print("Token received:", token[:50] + "...")

headers = {"Authorization": f"Bearer {token}"}

# 3. Submit KYC
kyc_data = {
    "aadhaar": "123456789012",
    "pan": "ABCDE1234F"
}
kyc_response = requests.post(f"{BASE_URL}/kyc/submit", json=kyc_data, headers=headers)
kyc_id = kyc_response.json()["id"]
print("KYC submitted, ID:", kyc_id)

# 4. Upload document
doc_data = {
    "file_path": "/uploads/aadhaar_123.pdf",
    "document_type": "Aadhaar"
}
doc_response = requests.post(f"{BASE_URL}/kyc/upload-document", json=doc_data, headers=headers)
print("Document uploaded:", doc_response.json())

# 5. Get KYC status
status_response = requests.get(f"{BASE_URL}/kyc/status/1", headers=headers)
print("KYC Status:", status_response.json()["status"])

# ========== ADMIN OPERATIONS ==========

# Login as admin
admin_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "admin@kyc.com",
    "password": "admin123"
})
admin_token = admin_login.json()["access_token"]
admin_headers = {"Authorization": f"Bearer {admin_token}"}

# 6. Get pending KYC
pending_response = requests.get(f"{BASE_URL}/admin/kyc/pending", headers=admin_headers)
print("\nPending KYC count:", len(pending_response.json()))

# 7. Approve KYC
approve_response = requests.put(
    f"{BASE_URL}/admin/kyc/1/approve",
    json={"approval_reason": "All documents verified"},
    headers=admin_headers
)
print("Approval status:", approve_response.json()["status"])

# 8. View audit log
audit_response = requests.get(f"{BASE_URL}/admin/kyc/1/audit-log", headers=admin_headers)
print("Audit log entries:", len(audit_response.json()))
```

## 4. Default Test Credentials

The database is initialized with sample data:

```
Admin User
  Email: admin@kyc.com
  Password: admin123
  Role: Admin

John Doe
  Email: john@example.com
  Password: admin123
  Role: User

Agent Smith
  Email: agent@kyc.com
  Password: admin123
  Role: Agent
```

## 5. Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new user |
| POST | `/auth/login` | Login and get token |
| POST | `/kyc/submit` | Submit KYC info |
| POST | `/kyc/upload-document` | Upload verification doc |
| GET | `/kyc/status/{user_id}` | Check KYC status |
| GET | `/admin/kyc/pending` | List pending KYC (admin) |
| PUT | `/admin/kyc/{id}/approve` | Approve KYC (admin) |
| PUT | `/admin/kyc/{id}/reject` | Reject KYC (admin) |
| GET | `/admin/kyc/{id}/audit-log` | View changes (admin) |

## 6. Environment Setup

Create `.env` file with PostgreSQL:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/kyc_db
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENV=development
```

Or use SQLite (default - no configuration needed):

```bash
DATABASE_URL=sqlite:///./kyc.db
```

## 7. Using cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'

# Submit KYC (with token)
curl -X POST http://localhost:8000/kyc/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"aadhaar":"123456789012","pan":"ABCDE1234F"}'

# Get KYC Status
curl -X GET http://localhost:8000/kyc/status/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 8. Troubleshooting

**"Module not found" errors**
```bash
# Verify you're in the kyc_backend directory
cd kyc_backend

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Database errors**
```bash
# Check DATABASE_URL in .env
# Default: DATABASE_URL=sqlite:///./kyc.db

# For PostgreSQL, ensure database exists
createdb kyc_db
```

**Import errors**
```bash
# Python path issue - run from project root
python main.py
```

## 9. Next Steps

1. Review the [README.md](README.md) for full documentation
2. Check the API docs: http://localhost:8000/docs
3. Explore the code structure in relevant modules
4. Customize the schema in `schema.sql` as needed
5. Deploy to production following deployment section in README

---

**Ready to go!** You now have a fully functional KYC backend. 🚀
