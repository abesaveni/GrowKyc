"""
User service handling user management operations.
"""

import logging
from typing import List, Tuple

from sqlalchemy.orm import Session

from core.enums import UserRole
from core.exceptions import DatabaseError, ResourceNotFoundError
from models import User

logger = logging.getLogger(__name__)


class UserService:
    """Service for handling user management operations."""

    def __init__(self, db: Session):
        """Initialize with database session."""
        self.db = db
        self.logger = logging.getLogger(__name__)

    def get_user_by_id(self, user_id: int) -> User:
        """
        Get user by ID.

        Args:
            user_id: User ID

        Returns:
            User instance

        Raises:
            ResourceNotFoundError: If user not found
        """
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ResourceNotFoundError("User", user_id)
        return user

    def get_user_by_email(self, email: str) -> User:
        """
        Get user by email.

        Args:
            email: User email

        Returns:
            User instance or None if not found
        """
        try:
            return self.db.query(User).filter(User.email == email).first()
        except Exception as e:
            self.logger.error(f"Error fetching user by email: {str(e)}")
            return None

    def list_users(
        self, skip: int = 0, limit: int = 10, role: UserRole = None
    ) -> Tuple[List[User], int]:
        """
        List users with optional role filtering.

        Args:
            skip: Number of records to skip
            limit: Number of records to return
            role: Optional role filter

        Returns:
            Tuple of (users list, total count)
        """
        try:
            query = self.db.query(User)

            if role:
                query = query.filter(User.role == role)

            total = query.count()
            users = query.offset(skip).limit(limit).all()

            return users, total
        except Exception as e:
            self.logger.error(f"Error listing users: {str(e)}")
            raise DatabaseError("Failed to list users")

    def toggle_user_active(self, user: User) -> User:
        """
        Toggle user's active status.

        Args:
            user: User instance

        Returns:
            Updated User instance

        Raises:
            DatabaseError: If operation fails
        """
        try:
            user.is_active = not user.is_active
            self.db.commit()
            self.db.refresh(user)

            status = "activated" if user.is_active else "deactivated"
            self.logger.info(f"User {user.id} {status}")

            return user
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error toggling user active status: {str(e)}")
            raise DatabaseError("Failed to toggle user status")

    def update_user_role(self, user: User, new_role: UserRole) -> User:
        """
        Update user's role.

        Args:
            user: User instance
            new_role: New role

        Returns:
            Updated User instance

        Raises:
            DatabaseError: If operation fails
        """
        try:
            old_role = user.role
            user.role = new_role
            self.db.commit()
            self.db.refresh(user)

            self.logger.info(
                f"User {user.id} role changed from {old_role.value} to {new_role.value}"
            )

            return user
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Error updating user role: {str(e)}")
            raise DatabaseError("Failed to update user role")

    def get_kyc_stats(self, user: User) -> dict:
        """
        Get KYC statistics for a user.

        Args:
            user: User instance

        Returns:
            Dict with KYC statistics
        """
        try:
            from core.enums import KYCStatus
            from models import KYC

            total_kyc = self.db.query(KYC).filter(KYC.user_id == user.id).count()
            pending_kyc = (
                self.db.query(KYC)
                .filter(KYC.user_id == user.id, KYC.status == KYCStatus.PENDING)
                .count()
            )
            approved_kyc = (
                self.db.query(KYC)
                .filter(KYC.user_id == user.id, KYC.status == KYCStatus.APPROVED)
                .count()
            )
            rejected_kyc = (
                self.db.query(KYC)
                .filter(KYC.user_id == user.id, KYC.status == KYCStatus.REJECTED)
                .count()
            )

            return {
                "total": total_kyc,
                "pending": pending_kyc,
                "approved": approved_kyc,
                "rejected": rejected_kyc,
            }
        except Exception as e:
            self.logger.error(f"Error getting KYC stats: {str(e)}")
            return {}
