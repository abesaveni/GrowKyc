"""
Custom exception classes for KYC application.
Provides domain-specific exceptions with proper HTTP status codes.
"""

from fastapi import status


class KYCException(Exception):
    """Base exception for KYC application"""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationError(KYCException):
    """Raised when authentication fails"""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)


class AuthorizationError(KYCException):
    """Raised when user lacks required permissions"""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


class ResourceNotFoundError(KYCException):
    """Raised when a resource is not found"""

    def __init__(self, resource: str, resource_id: int):
        message = f"{resource} with ID {resource_id} not found"
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class DuplicateResourceError(KYCException):
    """Raised when attempting to create a duplicate resource"""

    def __init__(self, resource: str, field: str):
        message = f"{resource} with this {field} already exists"
        super().__init__(message, status.HTTP_409_CONFLICT)


class ValidationError(KYCException):
    """Raised when validation fails"""

    def __init__(self, message: str):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY)


class InvalidStateError(KYCException):
    """Raised when operation is invalid for current state"""

    def __init__(self, message: str):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)


class DatabaseError(KYCException):
    """Raised when database operation fails"""

    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfigurationError(Exception):
    """Raised when application configuration is invalid"""

    pass
