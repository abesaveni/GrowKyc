"""KYC Backend Configuration Module"""

import os
import sys

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ===== Environment =====
ENV = os.getenv("ENV", "development")
IS_PRODUCTION = ENV.lower() == "production"

# ===== Database Configuration =====
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kyc.db")

SQL_ECHO = os.getenv("SQL_ECHO", "false").lower() == "true"


# ===== JWT Configuration =====
_SECRET_KEY = os.getenv("SECRET_KEY", "")

_INSECURE_DEFAULT = "your-secret-key-change-in-production"

if IS_PRODUCTION:
    if not _SECRET_KEY or _SECRET_KEY == _INSECURE_DEFAULT:
        print(
            "FATAL: SECRET_KEY is not set or uses the insecure default in production. "
            "Set a strong random SECRET_KEY (32+ chars) and restart.",
            file=sys.stderr,
        )
        sys.exit(1)
    if len(_SECRET_KEY) < 32:
        print(
            "FATAL: SECRET_KEY is too short (< 32 characters) for production.",
            file=sys.stderr,
        )
        sys.exit(1)
elif not _SECRET_KEY or _SECRET_KEY == _INSECURE_DEFAULT:
    # Development fallback: warn but allow
    import secrets as _secrets
    _SECRET_KEY = _secrets.token_hex(32)
    print(
        "WARNING: SECRET_KEY not set. Generated a random key for this session. "
        "Set SECRET_KEY in your .env for a persistent key.",
        file=sys.stderr,
    )

SECRET_KEY: str = _SECRET_KEY

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


# ===== Server Configuration =====
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "info")


# ===== CORS Configuration =====
_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:8000,"
    "http://127.0.0.1:3000,http://127.0.0.1:8000",
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

if IS_PRODUCTION and "*" in ALLOWED_ORIGINS:
    print(
        "FATAL: ALLOWED_ORIGINS contains wildcard '*' in production. "
        "Restrict CORS to explicit origins.",
        file=sys.stderr,
    )
    sys.exit(1)


# ===== File Upload Configuration =====
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ===== Application Settings =====
APP_NAME = "KYC System API"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "Production-ready KYC backend with role-based access control"

# Database pool settings for PostgreSQL
DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "10"))
DB_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "20"))


# ===== Validation Settings =====
MIN_PASSWORD_LENGTH = 12
MIN_REJECTION_REASON_LENGTH = 10
AADHAAR_LENGTH = 12
PAN_LENGTH = 10
PASSWORD_REQUIRE_UPPERCASE = True
PASSWORD_REQUIRE_LOWERCASE = True
PASSWORD_REQUIRE_DIGIT = True
PASSWORD_REQUIRE_SPECIAL = True


# ===== Debug Mode =====
DEBUG = not IS_PRODUCTION


if __name__ == "__main__":
    print(f"Database URL: {DATABASE_URL}")
    print(f"Environment: {ENV}")
    print(f"JWT Expiration: {ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
    print(f"CORS Origins: {ALLOWED_ORIGINS}")
    print(f"Debug Mode: {DEBUG}")
