import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from models import Document

logger = logging.getLogger(__name__)


class DocumentService:
    """Service handling evidence documents and their lifecycle."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def upload_document(
        self, kyc, document_type: str, file_name: str, user
    ) -> Document:
        """Upload a document with the new compliance integrations."""
        from datetime import datetime, timedelta, timezone

        from core.enums import DocumentType, KYCStatus
        from core.exceptions import AuthorizationError, InvalidStateError
        from models import Client
        from services.audit_service import AuditService
        from services.monitoring_service import MonitoringService

        if kyc.status != KYCStatus.PENDING:
            raise InvalidStateError("Documents must be uploaded while KYC is Pending.")

        if kyc.user_id != user.id and str(user.role.value) not in [
            "Admin",
            "Agent",
            "Analyst",
            "Compliance_Officer",
        ]:
            raise AuthorizationError("Access denied.")

        # Sanitize filename: strip path separators, use UUID prefix to prevent collisions
        from pathlib import Path as _Path
        safe_name = _Path(file_name).name  # strip any directory component
        safe_name = f"{uuid4().hex}_{safe_name}"

        doc = Document(
            kyc_id=kyc.id,
            type=DocumentType(document_type),
            file_name=file_name,
            file_path=f"storage/uploads/{safe_name}",
            uploaded_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)

        # Integration STEP 4: Link to client & establish Expiry monitoring
        client = self.db.query(Client).filter(Client.user_id == kyc.user_id).first()
        if client:
            doc.client_id = client.id
            doc.uploaded_by = user.id
            # Simulation: Identify document expiry roughly +1 yr for tracking
            doc.expiry_date = datetime.now(timezone.utc) + timedelta(days=365)
            self.db.commit()

        # Integration STEP 4: Trigger Audit Log
        AuditService(self.db).log_event(
            actor_id=user.id,
            action="CREATE",
            entity_type="document",
            entity_id=doc.id,
            after_data={
                "type": document_type,
                "file_name": file_name,
                "expiry": str(doc.expiry_date),
            },
        )

        # Integration STEP 6: Execute Monitoring Scrape on File Action
        try:
            MonitoringService(self.db).run_monitoring_checks()
        except Exception as e:
            self.logger.warning(
                f"Monitoring scrape failed after doc upload, non-critical: {str(e)}"
            )

        self.logger.info(f"Document {doc.id} uploaded for KYC {kyc.id}")
        return doc

    def link_document_to_case_and_client(
        self,
        document_id: int,
        client_id: int,
        case_id: int = None,
        expiry_date: datetime = None,
    ):
        """Update a document to map it to the evidence system logic."""
        docs = self.db.query(Document).filter(Document.id == document_id).first()
        if docs:
            docs.client_id = client_id
            docs.case_id = case_id
            docs.expiry_date = expiry_date
            self.db.commit()
            self.db.refresh(docs)
            return docs
        return None

    def upload_document_from_file(
        self, kyc, document_type, uploaded_file: UploadFile, user
    ) -> Document:
        """Save an uploaded file to local storage and create a Document record.

        Minimal, safe handling: validate type/size, secure filename,
        write file, create DB record.
        """
        from core.enums import KYCStatus
        from core.exceptions import (AuthorizationError, DatabaseError,
                                     ValidationError)
        from models import Client

        # Config
        upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
        max_mb = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
        allowed_exts = {".pdf", ".jpg", ".jpeg", ".png"}

        if kyc.status != KYCStatus.PENDING:
            raise ValidationError("Documents must be uploaded while KYC is Pending.")

        if kyc.user_id != user.id and str(
            getattr(user.role, "value", user.role)
        ) not in ["Admin", "Agent", "Analyst", "Compliance_Officer"]:
            raise AuthorizationError("Access denied.")

        # Ensure filename is safe
        original_name = Path(uploaded_file.filename or "").name
        if not original_name:
            raise ValidationError("Invalid file name")

        ext = Path(original_name).suffix.lower()
        if ext not in allowed_exts:
            raise ValidationError(f"Unsupported file type: {ext}")

        # Read content to measure size (UploadFile.file is a file-like object)
        try:
            file_obj = uploaded_file.file
            file_obj.seek(0)
            content = file_obj.read()
            size_mb = len(content) / (1024 * 1024)
        except Exception as e:
            raise ValidationError(f"Failed to read uploaded file: {str(e)}")

        if size_mb > max_mb:
            raise ValidationError(f"File exceeds maximum allowed size of {max_mb} MB")

        # Validate magic bytes to prevent content-type spoofing
        _MAGIC_BYTES: dict[str, list[bytes]] = {
            ".pdf":  [b"%PDF"],
            ".jpg":  [b"\xff\xd8\xff"],
            ".jpeg": [b"\xff\xd8\xff"],
            ".png":  [b"\x89PNG"],
        }
        expected_signatures = _MAGIC_BYTES.get(ext, [])
        if expected_signatures and not any(content.startswith(sig) for sig in expected_signatures):
            raise ValidationError(f"File content does not match declared type '{ext}'")

        # Prepare destination
        file_stem = uuid4().hex
        safe_name = f"{file_stem}_{original_name}"
        dest_dir = Path(upload_dir)
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_path = dest_dir / safe_name

        # Write file to disk
        try:
            with open(dest_path, "wb") as f:
                f.write(content)
        except Exception as e:
            raise DatabaseError(f"Failed to save uploaded file: {str(e)}")

        # Create document record
        try:
            doc = Document(
                kyc_id=kyc.id,
                type=document_type,
                file_name=original_name,
                file_path=str(dest_path),
                uploaded_at=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc),
            )
            self.db.add(doc)
            self.db.commit()
            self.db.refresh(doc)

            # Link to client if available
            client = self.db.query(Client).filter(Client.user_id == kyc.user_id).first()
            if client:
                doc.client_id = client.id
                doc.uploaded_by = user.id
                # set a default expiry
                doc.expiry_date = datetime.now(timezone.utc) + timedelta(days=365)
                self.db.commit()

            # Best-effort monitoring/audit (non-blocking if fails)
            try:
                from services.audit_service import AuditService

                AuditService(self.db).log_event(
                    actor_id=user.id,
                    action="CREATE",
                    entity_type="document",
                    entity_id=doc.id,
                    after_data={
                        "file_name": original_name,
                        "path": str(dest_path),
                    },
                )
            except Exception:
                self.logger.warning("Audit log failed for uploaded file, continuing")

            self.logger.info(f"Document {doc.id} uploaded to {dest_path}")
            return doc
        except Exception:
            try:
                self.db.rollback()
            except Exception:
                self.logger.exception("Failed to rollback DB after upload error")
            # Remove file if DB failed
            try:
                if dest_path.exists():
                    dest_path.unlink()
            except Exception:
                self.logger.exception("Failed to remove file after DB failure")
            raise

    def get_client_evidence(self, client_id: int):
        """Return client documents used to assemble an evidence pack."""
        return self.db.query(Document).filter(Document.client_id == client_id).all()

    # ==================================================================
    # Phase 5: Enterprise document methods (additive — backward compat)
    # ==================================================================

    def upload_enterprise(
        self,
        kyc_id: int,
        document_type: str,
        content: bytes,
        file_name: str,
        mime_type: str,
        user_id: int,
        client_id: int = None,
        trigger_ocr: bool = True,
    ) -> Document:
        """
        Enterprise upload: computes checksum, stores via StorageFactory,
        persists metadata, and optionally triggers async OCR.
        """
        import hashlib
        from uuid import uuid4

        from core.enums import DocumentType
        from services.audit_service import AuditService
        from services.storage.factory import get_storage_backend

        storage = get_storage_backend()
        checksum = hashlib.sha256(content).hexdigest()
        backend_name = storage.__class__.__name__.lower().replace("storagebackend", "")

        # Build a tenant-namespaced key
        key = f"documents/{uuid4().hex}/{file_name}"
        storage.upload(key, content, mime_type)

        doc = Document(
            kyc_id=kyc_id,
            client_id=client_id,
            uploaded_by=user_id,
            type=DocumentType(document_type),
            file_name=file_name,
            file_path=key,  # backward compat: file_path holds key
            mime_type=mime_type,
            file_size_bytes=len(content),
            checksum_hash=checksum,
            storage_backend=backend_name,
            storage_key=key,
            verification_status="pending",
            ocr_status="not_started",
            tamper_detection_status="pending",
            document_version=1,
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)

        # Non-blocking audit
        try:
            AuditService(self.db).log_event(
                actor_id=user_id,
                action="UPLOAD",
                entity_type="document",
                entity_id=doc.id,
                after_data={"key": key, "checksum": checksum, "mime_type": mime_type},
            )
        except Exception:
            self.logger.warning(f"Audit log failed for enterprise upload doc {doc.id}")

        # Async OCR
        if trigger_ocr:
            try:
                from tasks.document_tasks import process_ocr_async

                process_ocr_async.delay(doc.id)
            except Exception as e:
                self.logger.warning(f"OCR dispatch failed: {e}")

        self.logger.info(f"[Enterprise] Document {doc.id} uploaded via {backend_name}")
        return doc

    def generate_download_url(
        self, document_id: int, expiry_seconds: int = 3600
    ) -> str:
        """Return a temporary signed URL for a document."""
        from services.storage.factory import get_storage_backend

        doc = self.db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            from core.exceptions import ResourceNotFoundError

            raise ResourceNotFoundError("Document", document_id)

        # Fall back to storage_key or file_path
        key = doc.storage_key or doc.file_path
        storage = get_storage_backend()
        return storage.generate_signed_url(key, expiry_seconds)

    def verify_document(
        self, document_id: int, reviewer_id: int, approved: bool, notes: str = None
    ) -> Document:
        """Mark a document as verified or rejected by a compliance officer."""
        from datetime import datetime, timezone

        from services.audit_service import AuditService

        doc = self.db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            from core.exceptions import ResourceNotFoundError

            raise ResourceNotFoundError("Document", document_id)

        doc.verification_status = "verified" if approved else "failed"
        doc.review_status = "approved" if approved else "rejected"
        doc.reviewed_by = reviewer_id
        doc.reviewed_at = datetime.now(timezone.utc)
        doc.review_notes = notes
        if approved:
            doc.verified_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(doc)

        try:
            AuditService(self.db).log_event(
                actor_id=reviewer_id,
                action="VERIFY",
                entity_type="document",
                entity_id=doc.id,
                after_data={"status": doc.verification_status, "notes": notes},
            )
        except Exception:
            pass

        return doc

    def get_expiring_documents(self, days: int = 30):
        """Return all documents expiring within the next N days."""
        from datetime import datetime, timedelta, timezone

        now = datetime.now(timezone.utc)
        threshold = now + timedelta(days=days)
        return (
            self.db.query(Document)
            .filter(
                Document.expiry_date != None,
                Document.expiry_date <= threshold,
                Document.expiry_date >= now,
            )
            .all()
        )
