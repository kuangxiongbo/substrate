"""
Password Management Schemas
Pydantic models for password reset and policy
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ============================================================================
# Password Reset
# ============================================================================

class ForgotPasswordRequest(BaseModel):
    """Forgot password request"""
    email: EmailStr = Field(
        ...,
        description="Email address for password reset",
        examples=["user@example.com"]
    )


class ForgotPasswordResponse(BaseModel):
    """Forgot password response (always returns success for security)"""
    message: str = Field(
        default="If the email exists, a password reset link has been sent.",
        description="Generic success message (doesn't reveal if email exists)"
    )


class ResetPasswordRequest(BaseModel):
    """Reset password using token"""
    token: str = Field(
        ...,
        description="Password reset token from email"
    )
    new_password: str = Field(
        ...,
        min_length=8,
        description="New password (must meet policy requirements)"
    )


class ResetPasswordResponse(BaseModel):
    """Password reset response"""
    message: str = Field(
        default="Password reset successful. All sessions have been invalidated. Please log in.",
        description="Success message"
    )


# ============================================================================
# Password Policy
# ============================================================================

class PasswordRequirementsResponse(BaseModel):
    """Current password policy requirements"""
    level: str = Field(
        ...,
        description="Security level: basic or high",
        examples=["basic", "high"]
    )
    min_length: int = Field(
        ...,
        description="Minimum password length",
        examples=[8, 12]
    )
    require_uppercase: bool = Field(
        ...,
        description="Requires at least one uppercase letter"
    )
    require_lowercase: bool = Field(
        ...,
        description="Requires at least one lowercase letter"
    )
    require_digit: bool = Field(
        ...,
        description="Requires at least one digit"
    )
    require_special: bool = Field(
        ...,
        description="Requires at least one special character"
    )
    description: str = Field(
        ...,
        description="Human-readable policy description",
        examples=[
            "Password must be at least 8 characters with uppercase, lowercase, and digit",
            "Password must be at least 12 characters with uppercase, lowercase, digit, and special character"
        ]
    )


class PasswordStrengthResponse(BaseModel):
    """Password strength validation response"""
    valid: bool = Field(
        ...,
        description="Whether password meets current policy"
    )
    strength: str = Field(
        ...,
        description="Strength rating: weak, medium, strong",
        examples=["weak", "medium", "strong"]
    )
    score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Strength score (0-100)"
    )
    feedback: list[str] = Field(
        default_factory=list,
        description="Improvement suggestions",
        examples=[
            ["Add uppercase letters", "Add numbers"],
            ["Password is strong!"]
        ]
    )
    meets_policy: bool = Field(
        ...,
        description="Whether password meets current policy requirements"
    )


# ============================================================================
# Password Validation
# ============================================================================

class ValidatePasswordRequest(BaseModel):
    """Request to validate password strength"""
    password: str = Field(
        ...,
        description="Password to validate"
    )


class PasswordPolicyViolation(BaseModel):
    """Password policy violation details"""
    rule: str = Field(
        ...,
        description="Violated rule",
        examples=["min_length", "require_uppercase", "require_special"]
    )
    message: str = Field(
        ...,
        description="Human-readable violation message",
        examples=[
            "Password must be at least 12 characters long",
            "Password must contain at least one uppercase letter"
        ]
    )


class PasswordValidationResult(BaseModel):
    """Detailed password validation result"""
    valid: bool = Field(
        ...,
        description="Overall validation result"
    )
    policy_level: str = Field(
        ...,
        description="Policy level applied: basic or high"
    )
    violations: list[PasswordPolicyViolation] = Field(
        default_factory=list,
        description="List of policy violations (empty if valid)"
    )
    suggestions: list[str] = Field(
        default_factory=list,
        description="Improvement suggestions"
    )

