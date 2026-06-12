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
    """Australian document type enumeration for KYC verification."""

    PASSPORT = "Passport"
    DRIVERS_LICENCE = "DriversLicence"
    MEDICARE_CARD = "MedicareCard"
    PROOF_OF_AGE_CARD = "ProofOfAgeCard"
    UTILITY_BILL = "UtilityBill"
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


class DocumentOCRStatus(str, Enum):
    """OCR processing status for documents."""

    NOT_STARTED = "not_started"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class DocumentVerificationStatus(str, Enum):
    """Document verification status."""

    PENDING = "pending"
    VERIFIED = "verified"
    FAILED = "failed"
    REQUIRES_REVIEW = "requires_review"

