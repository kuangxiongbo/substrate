"""
Authentication Request/Response Schemas
Pydantic models for registration, login, and token operations
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import uuid


# ============================================================================
# Registration
# ============================================================================

class RegisterRequest(BaseModel):
    """User registration request"""
    email: EmailStr = Field(
        ...,
        description="User email address (will be normalized to lowercase)",
        examples=["user@example.com"]
    )
    password: str = Field(
        ...,
        min_length=8,
        description="Password (minimum 8 characters, must meet policy requirements)",
        examples=["SecurePass123!"]
    )
    consent: bool = Field(
        ...,
        description="GDPR data processing consent (must be true)"
    )
    
    @field_validator('consent')
    @classmethod
    def consent_must_be_true(cls, v):
        if not v:
            raise ValueError('User consent is required for registration')
        return v
    
    @field_validator('email')
    @classmethod
    def email_lowercase(cls, v):
        """Normalize email to lowercase"""
        return v.lower() if v else v


class RegisterResponse(BaseModel):
    """User registration response"""
    message: str = Field(
        ...,
        description="Success message",
        examples=["Registration successful. Please check your email for verification."]
    )
    user_id: uuid.UUID = Field(
        ...,
        description="Newly created user ID"
    )
    email: str = Field(
        ...,
        description="Registered email address"
    )


# ============================================================================
# Login
# ============================================================================

class LoginRequest(BaseModel):
    """User login request"""
    email: EmailStr = Field(
        ...,
        description="User email address",
        examples=["user@example.com"]
    )
    password: str = Field(
        ...,
        description="User password"
    )
    
    @field_validator('email')
    @classmethod
    def email_lowercase(cls, v):
        """Normalize email to lowercase"""
        return v.lower() if v else v


class LoginResponse(BaseModel):
    """User login response with JWT tokens"""
    access_token: str = Field(
        ...,
        description="JWT access token (valid for 1 hour)"
    )
    refresh_token: str = Field(
        ...,
        description="JWT refresh token (valid for 7 days)"
    )
    token_type: str = Field(
        default="bearer",
        description="Token type for Authorization header"
    )
    expires_in: int = Field(
        ...,
        description="Access token expiration time in seconds",
        examples=[3600]
    )
    user: dict = Field(
        ...,
        description="Basic user information"
    )


# ============================================================================
# Token Operations
# ============================================================================

class RefreshRequest(BaseModel):
    """Token refresh request"""
    refresh_token: str = Field(
        ...,
        description="Valid refresh token"
    )


class TokenResponse(BaseModel):
    """Token response (for refresh operations)"""
    access_token: str = Field(
        ...,
        description="New JWT access token"
    )
    refresh_token: str = Field(
        ...,
        description="New JWT refresh token (rotated)"
    )
    token_type: str = Field(
        default="bearer",
        description="Token type"
    )
    expires_in: int = Field(
        ...,
        description="Token expiration in seconds"
    )


class LogoutRequest(BaseModel):
    """Logout request"""
    refresh_token: str = Field(
        ...,
        description="Refresh token to revoke"
    )


class LogoutResponse(BaseModel):
    """Logout response"""
    message: str = Field(
        default="Logout successful",
        description="Success message"
    )


# ============================================================================
# Email Verification
# ============================================================================

class VerifyEmailResponse(BaseModel):
    """Email verification response"""
    message: str = Field(
        ...,
        description="Verification result message",
        examples=["Email verified successfully. You can now log in."]
    )
    email: str = Field(
        ...,
        description="Verified email address"
    )


class ResendVerificationRequest(BaseModel):
    """Request to resend verification email"""
    email: EmailStr = Field(
        ...,
        description="Email address to resend verification to"
    )


# ============================================================================
# Error Responses
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response"""
    detail: str = Field(
        ...,
        description="Error message",
        examples=["Invalid credentials"]
    )
    error_code: Optional[str] = Field(
        None,
        description="Machine-readable error code",
        examples=["INVALID_CREDENTIALS", "ACCOUNT_LOCKED"]
    )


class ValidationError(BaseModel):
    """Validation error response"""
    detail: list = Field(
        ...,
        description="List of validation errors"
    )


# Note: LoginResponse.user uses dict instead of UserResponse
# to avoid circular import issues with Pydantic



