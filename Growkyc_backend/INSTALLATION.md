# Installation and Setup Guide

Complete step-by-step guide to set up and run the KYC Backend system.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start (5 minutes)](#quick-start)
3. [Detailed Installation](#detailed-installation)
4. [Database Setup](#database-setup)
5. [Configuration](#configuration)
6. [Verification](#verification)
7. [Docker Setup](#docker-setup)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Python**: 3.9 or higher
- **RAM**: 512 MB
- **Disk**: 500 MB (excluding virtual environment)
- **OS**: Linux, macOS, or Windows

### Recommended for Production
- **Python**: 3.11+
- **Database**: PostgreSQL 12+
- **RAM**: 2 GB+
- **Disk**: 10 GB+
- **Container Runtime**: Docker 20.10+

### Software Prerequisites

Before starting, ensure you have:

```bash
# Check Python version
python --version  # Should be 3.9+

# Check pip is installed
pip --version

# Optional: PostgreSQL client (for production)
psql --version

# Optional: Docker (for containerized deployment)
docker --version
docker-compose --version
```

---

## Quick Start

Get the system running in under 5 minutes with SQLite backup:

### Step 1: Navigate to Project
```bash
cd kyc_backend
```

### Step 2: Create Virtual Environment
```bash
# Linux/macOS
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run Application
```bash
python main.py
```

### Step 5: Test the API
```bash
# Open browser
http://localhost:8000/docs

# Or test with curl
curl http://localhost:8000/health
```

**Done!** Server running on `http://localhost:8000`

---

## Detailed Installation

### 1. Prerequisites

#### Python Installation

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install python3.11 python3.11-venv python3-pip
python3.11 --version
```

**macOS**:
```bash
brew install python@3.11
python3 --version
```

**Windows**:
1. Download from [python.org](https://www.python.org/downloads/)
2. Run installer
3. ✓ Check "Add Python to PATH"
4. Verify: `python --version`

#### Download Project
```bash
# Clone from repository
git clone <repository-url> kyc_backend
cd kyc_backend

# Or extract from archive
unzip kyc_backend.zip
cd kyc_backend
```

### 2. Virtual Environment Setup

**macOS/Linux**:
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Verify activation (should show "venv" in prompt)
# which python  # Should show path to venv/bin/python
```

**Windows (PowerShell)**:
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get execution policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Windows (CMD)**:
```cmd
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate.bat
```

### 3. Install Python Dependencies

```bash
# Upgrade pip first
pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt

# Verify installation
pip list | grep fastapi  # Should show FastAPI version
```

### 4. Create Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
# On Linux/macOS
nano .env

# On Windows
notepad .env
```

**Minimal .env for development**:
```env
# Database (SQLite is default)
DATABASE_URL=sqlite:///./kyc.db

# Security (change this!)
SECRET_KEY=dev-key-change-in-production

# Server
ENV=development
LOG_LEVEL=info
```

### 5. Generate Secure Secret Key

```bash
# Generate a secure key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Copy output and set in .env
# SECRET_KEY=<paste-generated-key>
```

---

## Database Setup

### Option A: SQLite (Development - No Setup Needed)

SQLite is configured by default:

```env
DATABASE_URL=sqlite:///./kyc.db
```

Database file will be created automatically on first run.

**Advantages**:
- No separate database server needed
- Perfect for development
- Easy backup (just copy .db file)

**Limitations**:
- Not suitable for high concurrency
- Single-user at a time
- Max ~10 concurrent connections

### Option B: PostgreSQL (Production Recommended)

#### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Auto-start on boot

# Create database and user
sudo -u postgres psql << EOF
CREATE USER kyc_user WITH PASSWORD 'secure_password_here';
ALTER ROLE kyc_user SET client_encoding TO 'utf8';
ALTER ROLE kyc_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kyc_user SET default_transaction_deferrable TO on;
ALTER ROLE kyc_user SET timezone TO 'UTC';
CREATE DATABASE kyc_db OWNER kyc_user;
GRANT ALL PRIVILEGES ON DATABASE kyc_db TO kyc_user;
\q
EOF

# Test connection
psql -U kyc_user -d kyc_db -h localhost
```

#### macOS

```bash
# Install PostgreSQL via Homebrew
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database and user
psql postgres << EOF
CREATE USER kyc_user WITH PASSWORD 'secure_password_here';
ALTER ROLE kyc_user SET client_encoding TO 'utf8';
ALTER ROLE kyc_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kyc_user SET default_transaction_deferrable TO on;
ALTER ROLE kyc_user SET timezone TO 'UTC';
CREATE DATABASE kyc_db OWNER kyc_user;
GRANT ALL PRIVILEGES ON DATABASE kyc_db TO kyc_user;
EOF

# Test connection
psql -U kyc_user -d kyc_db -h localhost
```

#### Windows

1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Remember the password for "postgres" user
4. Use pgAdmin or command line to create database:

```bat
# Connect as postgres
psql -U postgres

# Execute in psql prompt
CREATE USER kyc_user WITH PASSWORD 'secure_password_here';
CREATE DATABASE kyc_db OWNER kyc_user;
GRANT ALL PRIVILEGES ON DATABASE kyc_db TO kyc_user;
```

#### Update .env

```env
DATABASE_URL=postgresql://kyc_user:secure_password_here@localhost:5432/kyc_db

# Optional: Enable query logging
SQL_ECHO=true  # Set to false in production
```

#### Test Connection

```bash
python -c "from database import init_db; init_db()"
# Should initialize database schema successfully
```

---

## Configuration

### Environment Variables

Create or edit `.env` file with these settings:

#### Database
```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/kyc_db

# SQLite (development)
DATABASE_URL=sqlite:///./kyc.db

# Enable SQL query logging (development only)
SQL_ECHO=false
```

#### JWT Authentication
```env
# Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=<your-secure-key>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Server
```env
HOST=0.0.0.0
PORT=8000
ENV=development  # or production
LOG_LEVEL=info   # debug, info, warning, error, critical
```

#### CORS (Cross-Origin Requests)
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000
```

#### File Upload
```env
MAX_UPLOAD_SIZE_MB=10
UPLOAD_DIR=./uploads
```

### Production Configuration

For production deployment:

```env
# Production security
ENV=production
DEBUG=false
LOG_LEVEL=warning
SECRET_KEY=<long-random-secure-key>

# Production database
DATABASE_URL=postgresql://kyc_user:strong_password@prod-db-host:5432/kyc_db

# Production server
HOST=0.0.0.0
PORT=8000

# CORS for production domain
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Disable SQL logging in production
SQL_ECHO=false
```

---

## Verification

### 1. Application Startup

```bash
python main.py

# Expected output:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

### 2. Health Check

```bash
# Terminal 1: Application running
python main.py

# Terminal 2: Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","service":"KYC Backend","version":"1.0.0"}
```

### 3. API Documentation

Open browser:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 4. Run Test Suite

```bash
pip install requests  # If not already installed
python test_api.py

# Should show:
# ✓ All tests passed successfully
```

### 5. Manual API Test

```bash
# Register a user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"SecurePass123"}'

# Expected: User object with id, email, role, etc.
```

---

## Docker Setup

### Prerequisites
- Docker Desktop installed
- 2+ GB available RAM

### Quick Start with Docker Compose

```bash
# Navigate to project directory
cd kyc_backend

# Start services
docker-compose up

# Expected output:
# postgres_1  | database system is ready to accept connections
# kyc_api_1   | Uvicorn running on http://0.0.0.0:8000
```

### Access Running Services

```bash
# API Documentation
# http://localhost:8000/docs

# PostgreSQL Database
# Host: localhost
# Port: 5432
# User: kyc_user
# Password: kyc_password_secure
# Database: kyc_db

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Manual Docker Build

```bash
# Build image
docker build -t kyc_backend:latest .

# Run container with PostgreSQL
docker run -d \
  --name kyc_api \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e SECRET_KEY=your-secret-key \
  kyc_backend:latest

# View logs
docker logs kyc_api

# Stop container
docker stop kyc_api
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

**Solution**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Issue: "Cannot import name 'text' from sqlalchemy"

**Solution**:
```bash
# Update SQLAlchemy
pip install --upgrade sqlalchemy

# Or specific version
pip install sqlalchemy==2.0.23
```

### Issue: Database Connection Error

**For SQLite**:
```bash
# Delete existing database to reset
rm kyc.db

# Run application to recreate
python main.py
```

**For PostgreSQL**:
```bash
# Test connection
psql -U kyc_user -d kyc_db -h localhost -c "SELECT 1"

# Check DATABASE_URL in .env
# Format: postgresql://user:password@host:5432/database

# Verify user exists
sudo -u postgres psql -c "\du"

# Recreate user if needed
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS kyc_db;
DROP USER IF EXISTS kyc_user;
CREATE USER kyc_user WITH PASSWORD 'password';
CREATE DATABASE kyc_db OWNER kyc_user;
GRANT ALL PRIVILEGES ON DATABASE kyc_db TO kyc_user;
EOF
```

### Issue: Port 8000 Already in Use

```bash
# Linux/macOS: Find process using port 8000
lsof -i :8000

# Windows: Find process using port 8000
netstat -ano | findstr :8000

# Kill process
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=8001 python main.py
```

### Issue: JWT Token Validation Fails

```bash
# Ensure SECRET_KEY matches between requests
# In .env, verify SECRET_KEY is set correctly

# If using multiple instances, use same SECRET_KEY
# Generate and use consistent key:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Issue: CORS Errors

```env
# Check ALLOWED_ORIGINS includes your frontend
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# For production
ALLOWED_ORIGINS=https://yourdomain.com
```

### Issue: Database Not Initializing

```bash
# Check schema.sql exists
ls -la schema.sql

# Manually initialize
python -c "from database import init_db; init_db()"

# Check logs for specific error
tail -50 application.log
```

### Issue: Virtual Environment Not Working

```bash
# Recreate virtual environment
rm -rf venv

# Create fresh
python -m venv venv

# Activate
source venv/bin/activate

# Reinstall
pip install -r requirements.txt
```

---

## Next Steps After Installation

1. **Read Documentation**
   - [README.md](README.md) - Full API documentation
   - [QUICK_START.md](QUICK_START.md) - Quick reference guide
   - [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture details

2. **Test the API**
   - Visit http://localhost:8000/docs
   - Use the interactive Swagger editor
   - Run `python test_api.py` for full test suite

3. **Configure Production** (if deploying)
   - Update `.env` with production settings
   - Set strong `SECRET_KEY`
   - Use PostgreSQL instead of SQLite
   - Configure CORS for your domain
   - Set `ENV=production`

4. **Deploy** (choose one)
   - Docker Compose (recommended)
   - Gunicorn + Nginx
   - AWS, Google Cloud, Azure
   - PaaS service (Heroku, Railway, etc.)

---

## Support and Help

- **API Documentation**: http://localhost:8000/docs
- **Issues**: Check Troubleshooting section
- **Logs**: Check console output or configure file logging
- **Database**: Verify connection with appropriate CLI tool

---

**Installation Complete!** 🎉

Your KYC Backend is ready to use. Start building!

