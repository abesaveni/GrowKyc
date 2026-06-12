"""
Pydantic schemas for request/response validation.
Defines all input and output data models for the API based on ORM models.
"""

import logging
from datetime import date, datetime
from typing import Generic, List, Optional, TypeVar

from pydantic import (BaseModel, ConfigDict, EmailStr, Field, ValidationInfo,
                      computed_field, field_validator)

from core.enums import (CaseStatus, DocumentType, KYCStatus,
                        NotificationStatus, NotificationType, ReportType,
                        RiskLevel, UserRole)

logger = logging.getLogger(__name__)

# Generic type for paginated responses
T = TypeVar("T")


# ===================== USER SCHEMAS =====================


class UserRegisterRequest(BaseModel):
    """Schema for user registration"""

    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=12, max_length=255)
    role: Optional[str] = Field(default="User")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "SecurePass@123",
                "role": "User",
            }
        }


class UserLoginRequest(BaseModel):
    """Schema for user login"""

    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "SecurePass123",
            }
        }


class UserResponse(BaseModel):
    """Schema for user response without sensitive data"""

    id: int
    name: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime
    verified: bool = False

    model_config = ConfigDict(from_attributes=True)


class UserDetailResponse(UserResponse):
    """Schema for detailed user response with counts"""

    kyc_records_count: int = 0
    notifications_count: int = 0
    last_login: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """Schema for token response"""

    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)


class PasswordChangeRequest(BaseModel):
    """Schema for password change request"""

    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        """Validate password strength"""
        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)
        if not (has_upper and has_lower and has_digit):
            raise ValueError("Password must contain uppercase, lowercase, and digit")
        return v

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info: ValidationInfo) -> str:
        """Verify passwords match"""
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "current_password": "OldPass123",
                "new_password": "NewPass456",
                "confirm_password": "NewPass456",
            }
        }
    )


# ===================== KYC SCHEMAS =====================


class IdentityDocumentCreate(BaseModel):
    """Generic schema for any country's Identity Document"""

    country_code: str = Field(
        ..., min_length=2, max_length=2, description="ISO 3166-1 alpha-2"
    )
    document_category: str
    document_type: str
    document_number: str
    issuing_authority: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    metadata_json: Optional[dict] = None


class KYCSubmit(BaseModel):
    """Schema for KYC submission"""

    # [DEPRECATED] Use `documents` instead. Kept for backward compatibility.
    aadhaar: Optional[str] = Field(
        None,
        min_length=12,
        max_length=12,
        description="[DEPRECATED] Use IdentityDocument.",
    )
    pan: Optional[str] = Field(
        None,
        min_length=10,
        max_length=10,
        description="[DEPRECATED] Use IdentityDocument.",
    )

    documents: Optional[List[IdentityDocumentCreate]] = Field(default_factory=list)

    name: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None

    @field_validator("dob")
    @classmethod
    def validate_dob(cls, v: Optional[date]) -> Optional[date]:
        """Validate DOB is not in the future"""
        if v and v > date.today():
            raise ValueError("DOB cannot be in the future")
        return v

    @field_validator("aadhaar")
    @classmethod
    def validate_aadhaar(cls, v: Optional[str]) -> Optional[str]:
        """Validate Aadhaar format"""
        if v and not v.isdigit():
            raise ValueError("Aadhaar must contain only digits")
        return v

    @field_validator("pan")
    @classmethod
    def validate_pan(cls, v: Optional[str]) -> Optional[str]:
        """Validate PAN format"""
        if v and not len(v) == 10:
            raise ValueError("PAN must be exactly 10 characters")
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "aadhaar": "123456789012",
                "pan": "ABCDE1234F",
                "name": "John Doe",
                "email": "john@example.com",
                "dob": "1990-01-15",
                "gender": "M",
                "address": "123 Main St, City",
            }
        }
    )


class KYCResponse(BaseModel):
    """Schema for KYC record response"""

    id: int
    user_id: int
    status: KYCStatus
    aadhaar: Optional[str] = None
    pan: Optional[str] = None
    name: str
    dob: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    submitted_at: datetime
    approved_at: Optional[datetime] = None
    rejected_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class KYCDetailResponse(KYCResponse):
    """Schema for detailed KYC response with relationships"""

    documents: List["DocumentResponse"] = []
    audit_logs: List["KYCAuditLogResponse"] = []

    model_config = ConfigDict(from_attributes=True)


class KYCApprove(BaseModel):
    """Schema for KYC approval request"""

    approval_reason: Optional[str] = Field(None, max_length=500)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {"approval_reason": "All documents verified and validated"}
        }
    )


class KYCReject(BaseModel):
    """Schema for KYC rejection request"""

    rejection_reason: str = Field(..., min_length=10, max_length=500)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "rejection_reason": "Document quality is insufficient for verification"
            }
        }
    )


# ===================== CLIENT, CASE, APPROVAL, REPORT SCHEMAS ===========


class IndividualProfileCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    country_of_birth: Optional[str] = None
    place_of_birth: Optional[str] = None
    passport_number: Optional[str] = None
    passport_country: Optional[str] = None
    passport_expiry: Optional[date] = None
    national_id_number: Optional[str] = None
    tax_file_number: Optional[str] = None
    occupation: Optional[str] = None
    employer_name: Optional[str] = None
    annual_income_range: Optional[str] = None
    source_of_funds: Optional[str] = None
    source_of_wealth: Optional[str] = None
    residential_address: Optional[str] = None
    mailing_address: Optional[str] = None
    mobile_phone: Optional[str] = None
    email: Optional[EmailStr] = None


class IndividualProfileResponse(IndividualProfileCreate):
    id: int
    client_id: int
    tenant_id: Optional[int] = None
    is_pep: bool
    pep_details: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EntityProfileCreate(BaseModel):
    legal_name: str = Field(..., max_length=500)
    trading_name: Optional[str] = None
    entity_type: Optional[str] = None
    abn: Optional[str] = Field(None, max_length=11)
    acn: Optional[str] = Field(None, max_length=9)
    arbn: Optional[str] = Field(None, max_length=9)
    tfn: Optional[str] = Field(None, max_length=9)
    incorporation_country: Optional[str] = None
    incorporation_date: Optional[date] = None
    registration_number: Optional[str] = None
    lei: Optional[str] = Field(None, max_length=20)
    business_activity: Optional[str] = None
    industry_code: Optional[str] = None
    annual_revenue_range: Optional[str] = None
    number_of_employees: Optional[int] = None
    website: Optional[str] = None
    registered_address: Optional[str] = None
    principal_place_of_business: Optional[str] = None
    mailing_address: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    is_regulated_entity: bool = False
    regulatory_body: Optional[str] = None
    regulatory_licence_number: Optional[str] = None
    is_listed_company: bool = False
    listing_exchange: Optional[str] = None


class EntityProfileResponse(EntityProfileCreate):
    id: int
    client_id: int
    tenant_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ClientResponse(BaseModel):
    id: int
    user_id: int
    name: str
    risk_score: int
    risk_level: RiskLevel
    is_pep: bool
    is_sanctioned: bool
    geography: Optional[str] = None
    income_level: int
    is_locked: bool
    created_at: datetime
    approved_at: Optional[datetime] = None
    individual_profile: Optional[IndividualProfileResponse] = None
    entity_profile: Optional[EntityProfileResponse] = None

    model_config = ConfigDict(from_attributes=True)

    @computed_field  # type: ignore[prop-decorator]
    @property
    def compliance_status(self) -> str:
        if self.approved_at is not None:
            return "approved"
        if self.is_locked:
            return "flagged"
        return "pending"


class CaseCreate(BaseModel):
    client_id: int
    title: str = Field(..., max_length=255)
    description: Optional[str] = None


class CaseResponse(BaseModel):
    id: int
    client_id: int
    title: str
    description: Optional[str] = None
    status: CaseStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ApprovalResponse(BaseModel):
    id: int
    case_id: int
    client_id: int
    approved_by: Optional[int] = None
    role: str
    status: str
    timestamp: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportResponse(BaseModel):
    id: int
    client_id: int
    type: ReportType
    data: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardResponse(BaseModel):
    total_clients: int
    high_risk_clients: int
    pending_approvals: int
    total_cases: int


# ===================== DOCUMENT SCHEMAS =====================


class DocumentUpload(BaseModel):
    """Schema for document upload"""

    kyc_id: int
    document_type: DocumentType
    file_name: str = Field(..., min_length=1, max_length=255)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "kyc_id": 1,
                "document_type": "Aadhaar",
                "file_name": "aadhaar_123456.pdf",
            }
        }
    )


class DocumentResponse(BaseModel):
    """Schema for document response"""

    id: int
    kyc_id: int
    type: DocumentType
    file_name: str
    file_path: str
    file_size: Optional[int] = None
    uploaded_at: datetime
    verified_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ===================== AUDIT LOG SCHEMAS =====================


class KYCAuditLogResponse(BaseModel):
    """Schema for KYC audit log response"""

    id: int
    kyc_id: int
    changed_by: int
    old_status: Optional[KYCStatus] = None
    new_status: KYCStatus
    change_reason: Optional[str] = None
    changed_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ===================== NOTIFICATION SCHEMAS =====================


class NotificationCreate(BaseModel):
    """Schema for notification creation"""

    user_id: int
    type: NotificationType
    title: str = Field(..., max_length=255)
    message: str = Field(..., max_length=1000)
    related_kyc_id: Optional[int] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user_id": 1,
                "type": "KYC_SUBMITTED",
                "title": "KYC Submission",
                "message": "Your KYC has been submitted",
                "related_kyc_id": 1,
            }
        }
    )


class NotificationResponse(BaseModel):
    """Schema for notification response"""

    id: int
    user_id: int
    type: NotificationType
    title: str
    message: str
    status: NotificationStatus
    related_kyc_id: Optional[int] = None
    created_at: datetime
    read_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class NotificationMarkAsRead(BaseModel):
    """Schema for marking notification as read"""

    notification_id: int
    status: NotificationStatus = NotificationStatus.READ

    model_config = ConfigDict(
        json_schema_extra={"example": {"notification_id": 1, "status": "read"}}
    )


# ===================== PAGINATION SCHEMAS =====================


class PaginationParams(BaseModel):
    """Schema for pagination parameters"""

    skip: int = Field(0, ge=0)
    limit: int = Field(10, ge=1, le=100)

    model_config = ConfigDict(json_schema_extra={"example": {"skip": 0, "limit": 10}})


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic schema for paginated responses"""

    total: int
    skip: int
    limit: int
    items: List[T]

    model_config = ConfigDict(from_attributes=True)


# ===================== BULK OPERATION SCHEMAS =====================


class BulkApproveRequest(BaseModel):
    """Schema for bulk approve KYC requests"""

    kyc_ids: List[int] = Field(..., min_items=1, max_items=100)
    approval_reason: Optional[str] = Field(None, max_length=500)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "kyc_ids": [1, 2, 3],
                "approval_reason": "Batch verification complete",
            }
        }
    )


class BulkApproveResponse(BaseModel):
    """Schema for bulk approve response"""

    success_count: int
    failed_count: int
    failed_ids: List[int] = []
    message: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success_count": 2,
                "failed_count": 1,
                "failed_ids": [3],
                "message": "1 of 3 KYCs failed to approve",
            }
        }
    )


# ===================== EQUIFAX CREDIT SCORE SCHEMAS (US-024) ============


class EquifaxCreditScoreRequest(BaseModel):
    """Schema for Equifax mock credit score request."""

    full_name: str = Field(..., min_length=2, max_length=255)
    date_of_birth: date
    pan_number: str = Field(..., min_length=10, max_length=10)
    country: str = Field("AU", min_length=2, max_length=3)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "full_name": "Jane Smith",
                "date_of_birth": "1985-06-15",
                "pan_number": "ABCDE1234F",
                "country": "AU",
            }
        }
    )


class EquifaxCreditScoreData(BaseModel):
    """Schema for Equifax mock credit score data payload."""

    provider: str = "equifax"
    credit_score: int
    rating: str
    risk_level: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "provider": "equifax",
                "credit_score": 742,
                "rating": "GOOD",
                "risk_level": "LOW",
            }
        }
    )


class EquifaxCreditScoreResponse(BaseModel):
    """Schema for standard Equifax credit score response envelope."""

    success: bool
    message: str
    data: Optional[EquifaxCreditScoreData] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Credit score fetched successfully",
                "data": {
                    "provider": "equifax",
                    "credit_score": 742,
                    "rating": "GOOD",
                    "risk_level": "LOW",
                },
                "error": None,
                "timestamp": "2024-01-15T10:30:00",
            }
        }
    )


# ===================== AFSA INSOLVENCY SEARCH SCHEMAS (US-025) ==========


class AFSAInsolvencySearchRequest(BaseModel):
    """Schema for AFSA mock insolvency search request."""

    full_name: str = Field(..., min_length=2, max_length=255)
    entity_name: Optional[str] = Field(None, max_length=255)
    country: str = Field("AU", min_length=2, max_length=3)
    registration_number: str = Field(..., min_length=3, max_length=50)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "full_name": "John Doe",
                "entity_name": "Doe Enterprises Pty Ltd",
                "country": "AU",
                "registration_number": "REG123456",
            }
        }
    )


class AFSAInsolvencyData(BaseModel):
    """Schema for AFSA mock insolvency search result payload."""

    provider: str = "afsa"
    entity_name: str
    insolvency_found: bool
    status: str
    risk_level: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "provider": "afsa",
                "entity_name": "John Doe",
                "insolvency_found": False,
                "status": "CLEAR",
                "risk_level": "LOW",
            }
        }
    )


class AFSAInsolvencySearchResponse(BaseModel):
    """Schema for standard AFSA insolvency search response envelope."""

    success: bool
    message: str
    data: Optional[AFSAInsolvencyData] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Insolvency search completed",
                "data": {
                    "provider": "afsa",
                    "entity_name": "John Doe",
                    "insolvency_found": False,
                    "status": "CLEAR",
                    "risk_level": "LOW",
                },
                "error": None,
                "timestamp": "2024-01-15T10:30:00",
            }
        }
    )


# ===================== UBO SCHEMAS =====================


class EntityDirectorCreate(BaseModel):
    full_name: str = Field(..., max_length=500)
    role: str = Field(..., max_length=100)
    appointment_date: Optional[date] = None
    nationality: Optional[str] = None
    dob: Optional[date] = None
    identification_reference: Optional[str] = None


class EntityDirectorResponse(EntityDirectorCreate):
    id: int
    client_id: int
    tenant_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BeneficialOwnerCreate(BaseModel):
    full_name: str = Field(..., max_length=500)
    dob: Optional[date] = None
    nationality: Optional[str] = None
    country_of_residence: Optional[str] = None
    id_document_type: Optional[str] = None
    id_document_number: Optional[str] = None
    id_document_expiry: Optional[date] = None
    tax_identification_number: Optional[str] = None
    ownership_percentage: Optional[float] = None
    ownership_type: Optional[str] = None
    is_control_person: bool = False
    control_mechanism: Optional[str] = None
    is_trust_structure: bool = False
    trust_name: Optional[str] = None
    trust_type: Optional[str] = None
    trust_jurisdiction: Optional[str] = None


class BeneficialOwnerResponse(BeneficialOwnerCreate):
    id: int
    client_id: int
    tenant_id: Optional[int] = None
    is_pep: bool
    is_sanctioned: bool
    is_adverse_media: bool
    verification_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OwnershipRelationshipCreate(BaseModel):
    parent_owner_id: int
    child_owner_id: int
    relationship_type: str = Field(..., max_length=100)
    percentage_control: Optional[float] = None


class OwnershipRelationshipResponse(OwnershipRelationshipCreate):
    id: int
    tenant_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UBOSummaryResponse(BaseModel):
    total_ubos: int
    total_percentage_identified: float
    high_risk_ubos: int
    is_complex_structure: bool


# ===================== ERROR SCHEMAS =====================


class ErrorResponse(BaseModel):
    """Schema for error response"""

    detail: str
    error_code: str
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "detail": "User not found",
                "error_code": "USER_NOT_FOUND",
                "timestamp": "2024-01-15T10:30:00",
            }
        }
    )


# ===================== FORWARD REFERENCE UPDATES =====================
# Update forward references for schemas with circular dependencies
KYCDetailResponse.model_rebuild()
