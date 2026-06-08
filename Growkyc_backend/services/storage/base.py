"""
services/storage/base.py
========================
Abstract base class for storage backends.
"""

import hashlib
from abc import ABC, abstractmethod


class BaseStorageBackend(ABC):
    """Abstract storage backend interface."""

    @abstractmethod
    def upload(
        self, key: str, content: bytes, content_type: str = "application/octet-stream"
    ) -> str:
        """Upload file bytes. Returns the storage key."""

    @abstractmethod
    def generate_signed_url(self, key: str, expiry_seconds: int = 3600) -> str:
        """Return a temporary signed/pre-signed download URL."""

    @abstractmethod
    def delete(self, key: str) -> bool:
        """Delete a file. Returns True on success."""

    @staticmethod
    def compute_checksum(content: bytes) -> str:
        """SHA-256 checksum of file bytes."""
        return hashlib.sha256(content).hexdigest()
