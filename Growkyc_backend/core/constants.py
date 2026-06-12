"""
Application-wide constants and configuration values.
Centralizes magic strings and values used throughout the application.
"""

# ==================== ERROR MESSAGES ====================
ERROR_INVALID_EMAIL_PASSWORD = "Invalid email or password"
ERROR_USER_NOT_FOUND = "User not found"
ERROR_USER_INACTIVE = "User account is inactive"
ERROR_USER_ALREADY_EXISTS = "Email already registered"
ERROR_KYC_EXISTS = "You already have an active KYC submission"
ERROR_KYC_NOT_FOUND = "No KYC record found"
ERROR_KYC_NO_IDENTIFIERS = "At least one identifier (Aadhaar or PAN) is required"
ERROR_DOCUMENT_NOT_FOUND = "Document not found"
ERROR_INVALID_KYC_STATUS = "Invalid KYC status for this operation"
ERROR_UNAUTHORIZED_KYC_ACCESS = "You can only access your own KYC"
ERROR_ADMIN_REQUIRED = "Admin privileges required"
ERROR_ADMIN_OR_AGENT_REQUIRED = "Admin or Agent privileges required"
ERROR_INVALID_TOKEN = "Invalid or expired token"
ERROR_INVALID_PASSWORD = "Current password is incorrect"
ERROR_DATABASE = "Database operation failed"
ERROR_INTERNAL_SERVER = "Internal server error"

# ==================== SUCCESS MESSAGES ====================
SUCCESS_USER_REGISTERED = "User registered successfully"
SUCCESS_LOGIN = "Login successful"
SUCCESS_PASSWORD_CHANGED = "Password changed successfully"
SUCCESS_KYC_SUBMITTED = "KYC submitted successfully"
SUCCESS_DOCUMENT_UPLOADED = "Document uploaded successfully"
SUCCESS_KYC_APPROVED = "KYC approved successfully"
SUCCESS_KYC_REJECTED = "KYC rejected successfully"
SUCCESS_BULK_APPROVAL = "Bulk approval completed"

# ==================== ROLE NAMES ====================
ROLE_ADMIN = "Admin"
ROLE_AGENT = "Agent"
ROLE_USER = "User"

# ==================== STATUS VALUES ====================
STATUS_PENDING = "Pending"
STATUS_APPROVED = "Approved"
STATUS_REJECTED = "Rejected"

# ==================== DOCUMENT TYPES ====================
DOC_TYPE_AADHAAR = "Aadhaar"
DOC_TYPE_PAN = "PAN"
DOC_TYPE_PASSPORT = "Passport"
DOC_TYPE_DRIVING_LICENSE = "DrivingLicense"
DOC_TYPE_UTILITY = "Utility"
DOC_TYPE_OTHER = "Other"

# ==================== LIMITS & CONSTRAINTS ====================
MAX_NAME_LENGTH = 255
MIN_NAME_LENGTH = 2
MIN_PASSWORD_LENGTH = 12
MAX_PASSWORD_LENGTH = 128
AADHAAR_LENGTH = 12
PAN_LENGTH = 10
MAX_REJECTION_REASON_LENGTH = 500
MIN_REJECTION_REASON_LENGTH = 10
MAX_FILE_NAME_LENGTH = 255
MAX_BULK_APPROVE_SIZE = 100
DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 100
MIN_PAGE_SIZE = 1

# ==================== TOKEN & AUTH ====================
TOKEN_TYPE_BEARER = "bearer"
JWT_ALGORITHM_HS256 = "HS256"
DEFAULT_TOKEN_EXPIRE_MINUTES = 30
DEFAULT_REFRESH_TOKEN_EXPIRE_DAYS = 7

# ==================== PAGINATION ====================
DEFAULT_SKIP = 0
DEFAULT_LIMIT = 10
MAX_LIMIT = 100

# ==================== TIMESTAMPS ====================
POOL_RECYCLE_SECONDS = 3600  # 1 hour
CONNECTION_TIMEOUT_SECONDS = 30

# ==================== VALIDATION PATTERNS ====================
EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
PAN_REGEX = r"^[A-Z]{5}[0-9]{4}[A-Z]$"
PHONE_REGEX = r"^[0-9]{10,13}$"
NAME_REGEX = r"^[a-zA-Z\s\-']+$"

# ==================== AUDIT LOG ACTIONS ====================
AUDIT_KYC_SUBMITTED = "Initial KYC submission"
AUDIT_KYC_APPROVED = "KYC approved"
AUDIT_KYC_REJECTED = "KYC rejected"
AUDIT_DOCUMENT_UPLOADED = "Document uploaded"

# ==================== API ENDPOINTS ====================
ENDPOINT_AUTH = "/auth"
ENDPOINT_KYC = "/kyc"
ENDPOINT_ADMIN = "/admin"

# ==================== HTTP STATUS DESCRIPTIONS ====================
STATUS_201_DESCRIPTION = "Resource created successfully"
STATUS_400_DESCRIPTION = "Bad request - validation error"
STATUS_401_DESCRIPTION = "Unauthorized - authentication required"
STATUS_403_DESCRIPTION = "Forbidden - insufficient permissions"
STATUS_404_DESCRIPTION = "Resource not found"
STATUS_409_DESCRIPTION = "Conflict - resource already exists"
STATUS_422_DESCRIPTION = "Unprocessable entity - validation error"
STATUS_500_DESCRIPTION = "Internal server error"
