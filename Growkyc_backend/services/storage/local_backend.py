"""
services/storage/local_backend.py
==================================
Local filesystem storage backend — backward compatible with existing uploads/.
"""

import hashlib
import hmac
import logging
import os
import time
from pathlib import Path

from services.storage.base import BaseStorageBackend

logger = logging.getLogger(__name__)
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")


class LocalStorageBackend(BaseStorageBackend):
    """Stores files on local disk for development and local storage mode."""

    def __init__(self, base_dir: str = UPLOAD_DIR):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def upload(
        self, key: str, content: bytes, content_type: str = "application/octet-stream"
    ) -> str:
        dest = self.base_dir / key
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as f:
            f.write(content)
        logger.info(f"[LocalStorage] Uploaded {key} ({len(content)} bytes)")
        return key

    def generate_signed_url(self, key: str, expiry_seconds: int = 3600) -> str:
        """Generate a local signed token URL. In production replace with real CDN."""
        expires_at = int(time.time()) + expiry_seconds
        secret = os.getenv("SECRET_KEY", "dev-secret").encode()
        signature = hmac.new(
            secret, f"{key}:{expires_at}".encode(), hashlib.sha256
        ).hexdigest()
        return f"/api/v1/documents/download/{key}?expires={expires_at}&sig={signature}"

    def delete(self, key: str) -> bool:
        path = self.base_dir / key
        if path.exists():
            path.unlink()
            return True
        return False
