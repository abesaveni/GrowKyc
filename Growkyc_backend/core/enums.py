"""
Core enumerations for the KYC system.
Defines all enum types used throughout the application.
"""

from enum import Enum


class UserRole(str, Enum):
    """User role enumeration."""

    ADMIN = "Admin"
    USER = "User"
    AGENT = "Agent"
    ANALYST = "Analyst"
    COMPLIANCE_OFFICER = "Compliance_Officer"
    MLRO = "MLRO"
    PARTNER = "Partner"


class KYCOnboardingStatus(str, Enum):
    """KYC onboarding status enumeration."""

    DRAFT = "draft"
    SUBMITTED = "submitted"
    VERIFIED = "verified"
    APPROVED = "approved"


class KYCStatus(str, Enum):
    """KYC submission status enumeration."""

    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"


class DocumentType(str, Enum):
    """Document type enumeration for KYC verification."""

    AADHAAR = "Aadhaar"
    PAN = "PAN"
    PASSPORT = "Passport"
    DRIVING_LICENSE = "DrivingLicense"
    UTILITY = "Utility"
    AADHAAR_CARD = "AadhaarCard"
    OTHER = "Other"


class NotificationType(str, Enum):
    """Notification type enumeration."""

    KYC_SUBMITTED = "kyc_submitted"
    KYC_APPROVED = "kyc_approved"
    KYC_REJECTED = "kyc_rejected"
    KYC_VERIFIED = "kyc_verified"
    DOCUMENT_UPLOADED = "document_uploaded"
    REQUEST_RESUBMISSION = "request_resubmission"
    # Used by monitoring, scheduler, approval services
    SYSTEM_ALERT = "system_alert"


class NotificationStatus(str, Enum):
    """Notification status enumeration."""

    UNREAD = "unread"
    READ = "read"
    ARCHIVED = "archived"


class RiskLevel(str, Enum):
    """Risk levels for clients."""

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class CaseStatus(str, Enum):
    """Case processing statuses."""

    OPEN = "open"
    INVESTIGATING = "investigating"
    ESCALATED = "escalated"
    CLOSED = "closed"


class ReportType(str, Enum):
    """Compliance report types."""

    SMR = "SMR"
    TTR = "TTR"
    IFTI = "IFTI"


class PaymentStatus(str, Enum):
    """Payment status enumeration."""

    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

