"""
KYC router for handling KYC submission, status, and document management.
Delegates all business logic to KYCService and DocumentService.
"""

import logging

from fastapi import (APIRouter, Depends, File, Form, HTTPException, Response,
                     UploadFile, status)
from sqlalchemy.orm import Session

from core.exceptions import (DatabaseError, DuplicateResourceError,
                             InvalidStateError, ResourceNotFoundError,
                             ValidationError)
from database import get_db
from dependencies import (get_admin_or_agent_user, get_current_user,
                          require_role)
from models import User
from schemas import (AFSAInsolvencyData, AFSAInsolvencySearchRequest,
                     AFSAInsolvencySearchResponse, DocumentResponse,
                     DocumentUpload, EquifaxCreditScoreData,
                     EquifaxCreditScoreRequest, EquifaxCreditScoreResponse,
                     KYCApprove, KYCDetailResponse, KYCReject, KYCResponse,
                     KYCSubmit, PaginatedResponse)
from services.document_service import DocumentService
from services.kyc_service import KYCService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/kyc", tags=["kyc"])


@router.post("/submit", response_model=KYCResponse, status_code=status.HTTP_201_CREATED)
async def submit_kyc(
    request: KYCSubmit,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> KYCResponse:
    """
    Submit KYC information for the current authenticated user.

    Users can submit their Aadhaar and/or PAN information along with personal details.

    Args:
        request: KYC submission data (Aadhaar, PAN, name, DOB, etc.)
        db: Database session
        current_user: Authenticated user

    Returns:
        KYCResponse with created KYC record details

    Raises:
        HTTPException 409: If user already has an existing KYC record
        HTTPException 422: If no identifiers provided
        HTTPException 500: If creation fails
    """
    try:
        service = KYCService(db)
        is_legacy_minimal_payload = request.name is None
        kyc = service.submit_kyc(
            user=current_user,
            aadhaar=request.aadhaar,
            pan=request.pan,
            name=request.name or current_user.name,
            dob=request.dob,
            gender=request.gender,
            address=request.address,
        )
        if is_legacy_minimal_payload:
            response.status_code = status.HTTP_200_OK
        return KYCResponse.model_validate(kyc)
    except (ValidationError, InvalidStateError) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DuplicateResourceError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit KYC",
        )


@router.post(
    "/upload-document",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    request: DocumentUpload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentResponse:
    """
    Upload a document for KYC verification.

    Documents must be uploaded after KYC submission and before approval.

    Args:
        request: Document upload data (KYC ID, document type, file info)
        db: Database session
        current_user: Authenticated user

    Returns:
        DocumentResponse with uploaded document details

    Raises:
        HTTPException 404: If KYC record not found
        HTTPException 400: If KYC is not in Pending status
        HTTPException 403: If user doesn't own the KYC
        HTTPException 500: If upload fails
    """
    try:
        service = KYCService(db)
        kyc = service.get_kyc_by_id(request.kyc_id)

        doc_service = DocumentService(db)
        document = doc_service.upload_document(
            kyc=kyc,
            document_type=request.document_type,
            file_name=request.file_name,
            user=current_user,
        )
        return DocumentResponse.model_validate(document)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except (ValidationError, InvalidStateError) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload document",
        )


@router.get("/status", response_model=KYCDetailResponse)
async def get_my_kyc_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> KYCDetailResponse:
    """
    Get KYC status for the current authenticated user.

    Args:
        db: Database session
        current_user: Authenticated user

    Returns:
        KYCDetailResponse with full KYC record and documents

    Raises:
        HTTPException 404: If no KYC record found for user
        HTTPException 500: If fetch fails
    """
    try:
        service = KYCService(db)
        kyc = service.get_user_kyc(current_user)
        return KYCDetailResponse.model_validate(kyc)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch KYC status",
        )


@router.get("/user/{user_id}", response_model=KYCDetailResponse)
async def get_user_kyc(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> KYCDetailResponse:
    """
    Get KYC record for a specific user (Admin/Agent only).

    Args:
        user_id: Target user ID
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        KYCDetailResponse with full KYC details

    Raises:
        HTTPException 404: If user or KYC not found
        HTTPException 500: If fetch fails
    """
    try:
        service = KYCService(db)
        kyc = service.get_user_kyc_by_user_id(user_id)
        logger.info(f"KYC retrieved for user {user_id} by admin {admin.id}")
        return KYCDetailResponse.model_validate(kyc)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch KYC",
        )


@router.get("/list", response_model=PaginatedResponse)
async def list_kyc_records(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> dict:
    """
    List all KYC records with pagination (Admin/Agent only).

    Args:
        skip: Number of records to skip
        limit: Number of records to return (max 100)
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        PaginatedResponse with KYC records
    """
    try:
        # Validate pagination
        if skip < 0:
            skip = 0
        if limit < 1:
            limit = 1
        if limit > 100:
            limit = 100

        service = KYCService(db)
        records, total = service.list_kyc_records(skip=skip, limit=limit)

        logger.info(f"KYC records listed by admin {admin.id}")

        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "items": [KYCResponse.model_validate(r) for r in records],
        }
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list KYC records",
        )


@router.post("/approve/{kyc_id}", response_model=KYCResponse)
async def approve_kyc(
    kyc_id: int,
    request: KYCApprove,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> KYCResponse:
    """
    Approve a KYC record (Admin/Agent only).

    Args:
        kyc_id: KYC record ID
        request: Approval request with optional reason
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        Updated KYCResponse

    Raises:
        HTTPException 404: If KYC not found
        HTTPException 400: If KYC already processed
        HTTPException 500: If update fails
    """
    try:
        service = KYCService(db)
        kyc_obj = service.get_kyc_by_id(kyc_id)
        kyc = service.approve_kyc(
            kyc=kyc_obj, admin_user=admin, reason=request.approval_reason
        )
        logger.info(f"KYC {kyc_id} approved by admin {admin.id}")
        return KYCResponse.model_validate(kyc)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except InvalidStateError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve KYC",
        )


@router.post("/reject/{kyc_id}", response_model=KYCResponse)
async def reject_kyc(
    kyc_id: int,
    request: KYCReject,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_or_agent_user),
) -> KYCResponse:
    """
    Reject a KYC record (Admin/Agent only).

    Args:
        kyc_id: KYC record ID
        request: Rejection request with reason
        db: Database session
        admin: Authenticated admin/agent user

    Returns:
        Updated KYCResponse

    Raises:
        HTTPException 404: If KYC not found
        HTTPException 400: If KYC already processed
        HTTPException 500: If update fails
    """
    try:
        service = KYCService(db)
        kyc_obj = service.get_kyc_by_id(kyc_id)
        kyc = service.reject_kyc(
            kyc=kyc_obj, admin_user=admin, reason=request.rejection_reason
        )
        logger.info(f"KYC {kyc_id} rejected by admin {admin.id}")
        return KYCResponse.model_validate(kyc)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except InvalidStateError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reject KYC",
        )


@router.post(
    "/upload-file",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_kyc_file(
    kyc_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentResponse:
    """
    Upload a real file to local storage for KYC verification.

    This endpoint handles actual file uploads to local storage.
    Supported formats: JPEG, PNG, PDF
    Max file size: 5MB

    Args:
        kyc_id: KYC record ID
        document_type: Type of document (ID, PROOF_OF_ADDRESS, etc.)
        file: File to upload
        db: Database session
        current_user: Authenticated user

    Returns:
        DocumentResponse with file path

    Raises:
        HTTPException 400: If file type or size invalid
        HTTPException 404: If KYC not found
        HTTPException 422: If validation fails
        HTTPException 500: If upload fails
    """
    try:
        from core.enums import DocumentType

        # Validate document type enum
        try:
            doc_type = DocumentType[document_type]
        except KeyError:
            try:
                doc_type = DocumentType(document_type)
            except ValueError:
                raise ValidationError(f"Invalid document type: {document_type}")

        # Get KYC record
        service = KYCService(db)
        kyc = service.get_kyc_by_id(kyc_id)

        # Upload local file using the new method
        doc_service = DocumentService(db)
        document = doc_service.upload_document_from_file(
            kyc=kyc,
            document_type=doc_type,
            uploaded_file=file,
            user=current_user,
        )

        logger.info(f"File uploaded locally for KYC {kyc_id} by user {current_user.id}")
        return DocumentResponse.model_validate(document)

    except ValidationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except InvalidStateError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file",
        )


# ---- US-024: Equifax Credit Score Mock Endpoint ----


@router.post(
    "/credit-score",
    response_model=EquifaxCreditScoreResponse,
    summary="Equifax Credit Score (Mock)",
    description=(
        "Fetch a mock Equifax credit score for the given individual. "
        "Returns deterministic mock scores for demo and integration testing. "
        "Allowed roles: Admin, Agent, Analyst, Compliance_Officer, MLRO."
    ),
    tags=["kyc"],
)
async def get_credit_score(
    request: EquifaxCreditScoreRequest,
    current_user: User = Depends(
        require_role(["Admin", "Agent", "Analyst", "Compliance_Officer", "MLRO"])
    ),
) -> EquifaxCreditScoreResponse:
    """
    US-024 — Equifax Credit Score Mock API.

    Args:
        request: Credit score request (full_name, date_of_birth, pan_number, country)
        current_user: Authenticated user with allowed role

    Returns:
        EquifaxCreditScoreResponse with provider, credit_score, rating, risk_level

    Raises:
        HTTPException 403: If user role is not permitted
        HTTPException 500: If mock scoring fails
    """
    from services.screening_service import ScreeningService

    logger.info(
        f"Credit score request received for PAN {request.pan_number[:4]}**** "
        f"by user {current_user.id} (role={current_user.role})"
    )

    try:
        service = ScreeningService(db=None)  # No DB needed for mock
        score_data = service.get_equifax_credit_score(
            full_name=request.full_name, pan_number=request.pan_number
        )

        logger.info(
            f"Credit score response generated: score={score_data['credit_score']} "
            f"rating={score_data['rating']} for user {current_user.id}"
        )

        return EquifaxCreditScoreResponse(
            success=True,
            message="Credit score fetched successfully",
            data=EquifaxCreditScoreData(**score_data),
            error=None,
        )

    except Exception as e:
        logger.error(f"Credit score error for user {current_user.id}: {str(e)}")
        return EquifaxCreditScoreResponse(
            success=False,
            message="Failed to fetch credit score",
            data=None,
            error="Credit score service temporarily unavailable",
        )


# ---- US-025: AFSA Insolvency Search Mock Endpoint ----


@router.post(
    "/insolvency-search",
    response_model=AFSAInsolvencySearchResponse,
    summary="AFSA Insolvency Search (Mock)",
    description=(
        "Search the AFSA register for insolvency records on a given "
        "individual or entity. "
        "Returns deterministic mock results for demo and integration testing. "
        "Allowed roles: Admin, Agent, Analyst, Compliance_Officer, MLRO."
    ),
    tags=["kyc"],
)
async def insolvency_search(
    request: AFSAInsolvencySearchRequest,
    current_user: User = Depends(
        require_role(["Admin", "Agent", "Analyst", "Compliance_Officer", "MLRO"])
    ),
) -> AFSAInsolvencySearchResponse:
    """
    US-025 — AFSA Insolvency Search Mock API.

    Args:
        request: Insolvency search request.
            Includes full_name, entity_name, country, registration_number.
        current_user: Authenticated user with allowed role

    Returns:
        AFSAInsolvencySearchResponse with provider, entity_name,
        insolvency_found, status, risk_level.

    Raises:
        HTTPException 403: If user role is not permitted
        HTTPException 500: If mock search fails
    """
    from services.screening_service import ScreeningService

    entity = request.entity_name or request.full_name

    logger.info(
        "AFSA insolvency search request received for reg "
        f"{request.registration_number[:4]}**** "
        f"by user {current_user.id} (role={current_user.role})"
    )

    try:
        service = ScreeningService(db=None)  # No DB needed for mock
        result = service.get_afsa_insolvency_search(
            full_name=entity, registration_number=request.registration_number
        )

        logger.info(
            f"AFSA insolvency response generated: status={result['status']} "
            f"insolvency_found={result['insolvency_found']} for user {current_user.id}"
        )

        return AFSAInsolvencySearchResponse(
            success=True,
            message="Insolvency search completed",
            data=AFSAInsolvencyData(**result),
            error=None,
        )

    except Exception as e:
        logger.error(
            f"AFSA insolvency search error for user {current_user.id}: {str(e)}"
        )
        return AFSAInsolvencySearchResponse(
            success=False,
            message="Failed to complete insolvency search",
            data=None,
            error="AFSA insolvency search service temporarily unavailable",
        )
