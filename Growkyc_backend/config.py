"""KYC Backend Configuration Module"""

import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# ===== Database Configuration =====
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kyc.db")

SQL_ECHO = os.getenv("SQL_ECHO", "false").lower() == "true"


# ===== JWT Configuration =====
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


# ===== Server Configuration =====
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
ENV = os.getenv("ENV", "development")
LOG_LEVEL = os.getenv("LOG_LEVEL", "info")


# ===== CORS Configuration =====
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:8000,"
    "http://127.0.0.1:3000,http://127.0.0.1:8000",
).split(",")


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
MIN_PASSWORD_LENGTH = 8
MIN_REJECTION_REASON_LENGTH = 10
AADHAAR_LENGTH = 12
PAN_LENGTH = 10


# ===== Debug Mode =====
DEBUG = ENV == "development"


if __name__ == "__main__":
    # Print current configuration (for debugging)
    print(f"Database URL: {DATABASE_URL}")
    print(f"Environment: {ENV}")
    print(f"JWT Expiration: {ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
    print(f"CORS Origins: {ALLOWED_ORIGINS}")
    print(f"Debug Mode: {DEBUG}")
