"""services/storage/__init__.py"""

from services.storage.factory import get_storage_backend

__all__ = ["get_storage_backend"]
