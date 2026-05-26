"""
Base service class with common functionality for all services.
Provides database session management, logging, and error handling.
"""

import logging
from typing import Generic, List, Optional, TypeVar

from sqlalchemy.orm import Session

from core.exceptions import DatabaseError, ResourceNotFoundError

logger = logging.getLogger(__name__)

T = TypeVar("T")


class BaseService(Generic[T]):
    """
    Base service class providing common CRUD operations and utilities.

    All services should inherit from this class to leverage common functionality.
    """

    def __init__(self, db: Session, model_class: type):
        """
        Initialize service with database session and model class.

        Args:
            db: SQLAlchemy session
            model_class: SQLAlchemy model class to operate on
        """
        self.db = db
        self.model_class = model_class
        self.logger = logging.getLogger(self.__class__.__name__)

    def get_by_id(self, id: int) -> Optional[T]:
        """
        Get single record by ID.

        Args:
            id: Record ID

        Returns:
            Model instance or None

        Raises:
            DatabaseError: If database operation fails
        """
        try:
            return (
                self.db.query(self.model_class)
                .filter(self.model_class.id == id)
                .first()
            )
        except Exception as e:
            self.logger.error(
                f"Error fetching {self.model_class.__name__} by ID {id}: {str(e)}"
            )
            raise DatabaseError(f"Failed to fetch {self.model_class.__name__}")

    def get_all(self, skip: int = 0, limit: int = 10) -> tuple[List[T], int]:
        """
        Get all records with pagination.

        Args:
            skip: Number of records to skip
            limit: Number of records to return

        Returns:
            Tuple of (records list, total count)

        Raises:
            DatabaseError: If database operation fails
        """
        try:
            total = self.db.query(self.model_class).count()
            records = self.db.query(self.model_class).offset(skip).limit(limit).all()
            return records, total
        except Exception as e:
            self.logger.error(
                f"Error fetching all {self.model_class.__name__}: {str(e)}"
            )
            raise DatabaseError(f"Failed to fetch {self.model_class.__name__} records")

    def create(self, **kwargs) -> T:
        """
        Create new record.

        Args:
            **kwargs: Model fields as keyword arguments

        Returns:
            Created model instance

        Raises:
            DatabaseError: If creation fails
        """
        try:
            instance = self.model_class(**kwargs)
            self.db.add(instance)
            self.db.commit()
            self.db.refresh(instance)
            self.logger.info(
                f"Created {self.model_class.__name__} with ID {instance.id}"
            )
            return instance
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error creating {self.model_class.__name__}: {str(e)}")
            raise DatabaseError(f"Failed to create {self.model_class.__name__}")

    def update(self, id: int, **kwargs) -> T:
        """
        Update record by ID.

        Args:
            id: Record ID
            **kwargs: Fields to update

        Returns:
            Updated model instance

        Raises:
            ResourceNotFoundError: If record not found
            DatabaseError: If update fails
        """
        try:
            instance = self.get_by_id(id)
            if not instance:
                raise ResourceNotFoundError(self.model_class.__name__, id)

            for key, value in kwargs.items():
                if hasattr(instance, key):
                    setattr(instance, key, value)

            self.db.commit()
            self.db.refresh(instance)
            self.logger.info(f"Updated {self.model_class.__name__} with ID {id}")
            return instance
        except ResourceNotFoundError:
            raise
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error updating {self.model_class.__name__}: {str(e)}")
            raise DatabaseError(f"Failed to update {self.model_class.__name__}")

    def delete(self, id: int) -> bool:
        """
        Delete record by ID.

        Args:
            id: Record ID

        Returns:
            True if deleted, False if not found

        Raises:
            DatabaseError: If deletion fails
        """
        try:
            instance = self.get_by_id(id)
            if not instance:
                return False

            self.db.delete(instance)
            self.db.commit()
            self.logger.info(f"Deleted {self.model_class.__name__} with ID {id}")
            return True
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error deleting {self.model_class.__name__}: {str(e)}")
            raise DatabaseError(f"Failed to delete {self.model_class.__name__}")

    def exists(self, **filters) -> bool:
        """
        Check if record exists with given filters.

        Args:
            **filters: Filter conditions

        Returns:
            True if record exists, False otherwise
        """
        try:
            query = self.db.query(self.model_class)
            for key, value in filters.items():
                if hasattr(self.model_class, key):
                    query = query.filter(getattr(self.model_class, key) == value)
            return query.first() is not None
        except Exception as e:
            self.logger.error(f"Error checking existence: {str(e)}")
            return False

    def filter_by(self, **filters) -> List[T]:
        """
        Get records filtered by given conditions.

        Args:
            **filters: Filter conditions

        Returns:
            List of matching records
        """
        try:
            query = self.db.query(self.model_class)
            for key, value in filters.items():
                if hasattr(self.model_class, key):
                    query = query.filter(getattr(self.model_class, key) == value)
            return query.all()
        except Exception as e:
            self.logger.error(f"Error filtering {self.model_class.__name__}: {str(e)}")
            return []
