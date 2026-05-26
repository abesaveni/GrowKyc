"""Local file storage management for documents"""

import logging
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Tuple

from core.exceptions import DatabaseError, ValidationError

logger = logging.getLogger(__name__)

# Base uploads directory
UPLOADS_DIR = "uploads"


class FileManager:
    """Manage local file storage operations"""

    ALLOWED_DOCUMENT_TYPES = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/pdf": ".pdf",
        "application/pdf": ".pdf",
    }

    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    @staticmethod
    def ensure_upload_dir_exists() -> None:
        """Ensure the uploads directory exists"""
        try:
            Path(UPLOADS_DIR).mkdir(parents=True, exist_ok=True)
            logger.info(f"Uploads directory ready: {UPLOADS_DIR}")
        except Exception as e:
            logger.error(f"Failed to create uploads directory: {str(e)}")
            raise DatabaseError("Failed to create uploads directory")

    @staticmethod
    def get_kyc_upload_dir(kyc_id: str) -> str:
        """Get the directory path for a specific KYC's documents"""
        return os.path.join(UPLOADS_DIR, f"kyc_{kyc_id}")

    @staticmethod
    def save_file(
        file_data: bytes, filename: str, kyc_id: str, file_type: str = None
    ) -> Tuple[str, str]:
        """
        Save file locally and return file path and filename.

        Args:
            file_data: File binary data
            filename: Original filename
            kyc_id: Associated KYC record ID
            file_type: MIME type of file

        Returns:
            Tuple of (file_path, saved_filename)

        Raises:
            ValidationError: If file type or size invalid
            DatabaseError: If save operation fails
        """
        try:
            # Validate file size
            if len(file_data) > FileManager.MAX_FILE_SIZE:
                raise ValidationError(
                    "File size exceeds "
                    f"{FileManager.MAX_FILE_SIZE / 1024 / 1024}MB limit"
                )

            # Validate file type
            if file_type and file_type not in FileManager.ALLOWED_DOCUMENT_TYPES:
                raise ValidationError(
                    f"File type {file_type} not allowed. Allowed: "
                    f"{', '.join(FileManager.ALLOWED_DOCUMENT_TYPES.keys())}"
                )

            # Ensure uploads directory exists
            FileManager.ensure_upload_dir_exists()

            # Create KYC-specific directory
            kyc_dir = FileManager.get_kyc_upload_dir(kyc_id)
            Path(kyc_dir).mkdir(parents=True, exist_ok=True)

            # Generate filename with timestamp
            extension = FileManager.ALLOWED_DOCUMENT_TYPES.get(file_type, "")
            if not extension:
                _, ext = os.path.splitext(filename)
                extension = ext if ext else ""

            base_name = os.path.splitext(filename)[0]
            timestamp = int(datetime.utcnow().timestamp() * 1000)
            saved_filename = f"{base_name}_{timestamp}{extension}"

            # Full file path
            file_path = os.path.join(kyc_dir, saved_filename)

            # Save file
            with open(file_path, "wb") as f:
                f.write(file_data)

            logger.info(f"File saved successfully: {file_path}")
            return file_path, saved_filename

        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"File save error: {str(e)}")
            raise DatabaseError(f"Failed to save file: {str(e)}")

    @staticmethod
    def save_uploaded_file(file_content, kyc_id: str) -> Tuple[str, str]:
        """
        Save an uploaded file from FastAPI UploadFile.

        Args:
            file_content: FastAPI UploadFile object
            kyc_id: Associated KYC record ID

        Returns:
            Tuple of (file_path, saved_filename)

        Raises:
            ValidationError: If file type or size invalid
            DatabaseError: If save operation fails
        """
        try:
            # Ensure uploads directory exists
            FileManager.ensure_upload_dir_exists()

            # Create KYC-specific directory
            kyc_dir = FileManager.get_kyc_upload_dir(kyc_id)
            Path(kyc_dir).mkdir(parents=True, exist_ok=True)

            # Generate filename with timestamp
            extension = FileManager.ALLOWED_DOCUMENT_TYPES.get(
                file_content.content_type, ""
            )
            if not extension:
                _, ext = os.path.splitext(file_content.filename)
                extension = ext if ext else ""

            base_name = os.path.splitext(file_content.filename)[0]
            timestamp = int(datetime.utcnow().timestamp() * 1000)
            saved_filename = f"{base_name}_{timestamp}{extension}"

            # Full file path
            file_path = os.path.join(kyc_dir, saved_filename)

            # Save file using shutil
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file_content.file, buffer)

            logger.info(f"Uploaded file saved successfully: {file_path}")
            return file_path, saved_filename

        except Exception as e:
            logger.error(f"File upload save error: {str(e)}")
            raise DatabaseError(f"Failed to save uploaded file: {str(e)}")

    @staticmethod
    def delete_file(file_path: str) -> bool:
        """
        Delete a file from local storage.

        Args:
            file_path: Path to file to delete

        Returns:
            True if successful, False otherwise
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"File deleted: {file_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"File delete error: {str(e)}")
            return False
