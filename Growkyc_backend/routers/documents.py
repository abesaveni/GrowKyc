from dependencies import get_admin_or_agent_user
from pydantic import BaseModel
from typing import Optional
import logging

from fastapi import (APIRouter, Depends, File, Form, HTTPException, UploadFile,
                     status)
from sqlalchemy.orm import Session

from core.exceptions import (DatabaseError, InvalidStateError,
                             ResourceNotFoundError, ValidationError)
from database import get_db
from dependencies import get_current_user
from models import User
from services.document_service import DocumentService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def documents_upload(
    kyc_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Frontend-compatible documents upload endpoint.

    This wraps the internal upload logic and keeps the external path
    `/documents/upload` expected by the frontend.
    """
    try:
        from core.enums import DocumentType
        from services.kyc_service import KYCService

        # Validate document type
        try:
            doc_type = DocumentType[document_type]
        except KeyError:
            try:
                doc_type = DocumentType(document_type)
            except ValueError:
                raise ValidationError(f"Invalid document type: {document_type}")

        kyc = KYCService(db).get_kyc_by_id(kyc_id)

        doc_service = DocumentService(db)
        document = doc_service.upload_document_from_file(
            kyc=kyc,
            document_type=doc_type,
            uploaded_file=file,
            user=current_user,
        )
        return {
            "id": document.id,
            "file_path": document.file_path,
            "file_name": document.file_name,
        }

    except (ValidationError, InvalidStateError) as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
    except Exception as e:
        logger.error(f"Documents upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload document",
        )


# ============================================================
# Phase 5: Enterprise Document Management Endpoints
# ============================================================





class DocumentVerifyRequest(BaseModel):
    approved: bool
    notes: Optional[str] = None


@router.get("/{document_id}")
async def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return full enterprise metadata for a document."""
    from models import Document

    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.id,
        "file_name": doc.file_name,
        "type": doc.type,
        "mime_type": doc.mime_type,
        "file_size_bytes": doc.file_size_bytes,
        "verification_status": doc.verification_status,
        "ocr_status": doc.ocr_status,
        "tamper_detection_status": doc.tamper_detection_status,
        "checksum_hash": doc.checksum_hash,
        "issue_date": doc.issue_date,
        "expiry_date": doc.expiry_date,
        "issuing_country": doc.issuing_country,
        "storage_backend": doc.storage_backend,
        "document_version": doc.document_version,
        "uploaded_at": doc.uploaded_at,
    }


@router.get("/{document_id}/download-url")
async def get_download_url(
    document_id: int,
    expiry_seconds: int = 3600,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate a temporary signed download URL for a document."""
    try:
        service = DocumentService(db)
        url = service.generate_download_url(document_id, expiry_seconds)
        return {
            "document_id": document_id,
            "download_url": url,
            "expires_in_seconds": expiry_seconds,
        }
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        logger.error(f"Download URL generation failed: {e}")
        raise HTTPException(status_code=500, detail="Could not generate download URL")


@router.post("/{document_id}/verify")
async def verify_document(
    document_id: int,
    body: DocumentVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Mark a document as verified or rejected by a compliance officer."""
    try:
        service = DocumentService(db)
        doc = service.verify_document(
            document_id=document_id,
            reviewer_id=current_user.id,
            approved=body.approved,
            notes=body.notes,
        )
        return {
            "document_id": doc.id,
            "verification_status": doc.verification_status,
            "review_status": doc.review_status,
            "reviewed_at": doc.reviewed_at,
        }
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=404, detail=e.message)
    except Exception as e:
        logger.error(f"Document verification error: {e}")
        raise HTTPException(status_code=500, detail="Verification failed")


@router.get("/expiring")
async def get_expiring_documents(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """List all documents expiring within the next N days."""
    service = DocumentService(db)
    docs = service.get_expiring_documents(days=days)
    return [
        {
            "id": d.id,
            "file_name": d.file_name,
            "type": d.type,
            "expiry_date": d.expiry_date,
            "client_id": d.client_id,
            "verification_status": d.verification_status,
        }
        for d in docs
    ]


@router.post("/{document_id}/extract")
async def trigger_document_extraction(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Trigger manual synchronous extraction and parsing."""
    try:
        from services.document_intelligence_service import \
            DocumentIntelligenceService

        service = DocumentIntelligenceService(db)
        ext = service.extract_and_parse(document_id=document_id)
        return {
            "document_id": document_id,
            "extraction_id": ext.id,
            "status": ext.status,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{document_id}/extraction")
async def get_document_extraction(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Get the latest intelligent extraction data."""
    from models.document_intelligence import DocumentExtraction

    ext = (
        db.query(DocumentExtraction)
        .filter(DocumentExtraction.document_id == document_id)
        .order_by(DocumentExtraction.id.desc())
        .first()
    )
    if not ext:
        raise HTTPException(status_code=404, detail="Extraction not found")
    return {
        "status": ext.status,
        "confidence": ext.normalized_confidence,
        "data": ext.extracted_data,
    }


@router.get("/{document_id}/fraud-analysis")
async def get_document_fraud_analysis(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_agent_user),
):
    """Get the latest intelligent fraud checks."""
    from models.document_intelligence import DocumentFraudCheck

    fraud = (
        db.query(DocumentFraudCheck)
        .filter(DocumentFraudCheck.document_id == document_id)
        .order_by(DocumentFraudCheck.id.desc())
        .first()
    )
    if not fraud:
        raise HTTPException(status_code=404, detail="Fraud analysis not found")
    return {
        "is_duplicate": fraud.is_duplicate,
        "tamper_score": fraud.tamper_score,
        "indicators": fraud.fraud_indicators,
    }
