"""
Verification Schemas
Pydantic models for email verification
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


# ============================================================================
# Email Verification
# ============================================================================

class EmailVerificationResponse(BaseModel):
    """Email verification response"""
    message: str = Field(
        ...,
        description="Verification result message",
        examples=[
            "Email verified successfully. You can now log in.",
            "Email already verified."
        ]
    )
    email: str = Field(
        ...,
        description="Verified email address"
    )
    verified_at: datetime = Field(
        ...,
        description="Verification timestamp"
    )


class EmailVerificationError(BaseModel):
    """Email verification error response"""
    error: str = Field(
        ...,
        description="Error type",
        examples=["invalid_token", "expired_token", "already_used"]
    )
    message: str = Field(
        ...,
        description="Error message",
        examples=[
            "Verification token is invalid or expired",
            "This verification link has already been used"
        ]
    )


class ResendVerificationEmailRequest(BaseModel):
    """Request to resend verification email"""
    email: EmailStr = Field(
        ...,
        description="Email address to resend verification to"
    )


class ResendVerificationEmailResponse(BaseModel):
    """Response for resend verification email"""
    message: str = Field(
        ...,
        description="Response message",
        examples=[
            "Verification email sent. Please check your inbox.",
            "Email is already verified."
        ]
    )
    email: str = Field(
        ...,
        description="Email address"
    )
    token_expires_at: Optional[datetime] = Field(
        None,
        description="New verification token expiration time"
    )


# ============================================================================
# Verification Status
# ============================================================================

class VerificationStatusResponse(BaseModel):
    """Verification status check response"""
    email: str = Field(
        ...,
        description="Email address"
    )
    verified: bool = Field(
        ...,
        description="Whether email is verified"
    )
    verified_at: Optional[datetime] = Field(
        None,
        description="Verification timestamp (if verified)"
    )
    pending_verification: bool = Field(
        ...,
        description="Whether there's a pending verification token"
    )
    can_resend: bool = Field(
        ...,
        description="Whether user can request a new verification email"
    )

