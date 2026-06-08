"""
services/storage/factory.py
============================
Returns the correct storage backend based on STORAGE_BACKEND env var.
"""

import os

from services.storage.base import BaseStorageBackend


def get_storage_backend() -> BaseStorageBackend:
    """Factory — reads STORAGE_BACKEND env var (default: local)."""
    backend = os.getenv("STORAGE_BACKEND", "local").lower()

    if backend == "local":
        from services.storage.local_backend import LocalStorageBackend

        return LocalStorageBackend()
    elif backend in ("s3", "minio"):
        from services.storage.s3_backend import S3StorageBackend

        return S3StorageBackend()
    else:
        raise ValueError(
            f"Unknown STORAGE_BACKEND: {backend!r}. Supported: local, s3, minio"
        )
