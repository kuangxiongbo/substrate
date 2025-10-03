"""
User Request/Response Schemas
Pydantic models for user profile and management
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid


# ============================================================================
# User Response Models
# ============================================================================

class UserResponse(BaseModel):
    """User profile response (safe for public exposure)"""
    id: uuid.UUID = Field(
        ...,
        description="User unique identifier"
    )
    email: str = Field(
        ...,
        description="User email address"
    )
    email_verified: bool = Field(
        ...,
        description="Email verification status"
    )
    account_status: str = Field(
        ...,
        description="Account status: active, inactive, locked, deleted",
        examples=["active"]
    )
    registration_timestamp: datetime = Field(
        ...,
        description="Account creation date"
    )
    last_login_timestamp: Optional[datetime] = Field(
        None,
        description="Last successful login time"
    )
    
    class Config:
        from_attributes = True  # For SQLAlchemy model conversion


class UserDetailResponse(UserResponse):
    """Detailed user profile (includes additional fields)"""
    last_password_change: datetime = Field(
        ...,
        description="Last password change timestamp"
    )
    consent_timestamp: datetime = Field(
        ...,
        description="GDPR consent timestamp"
    )
    consent_status: bool = Field(
        ...,
        description="Data processing consent status"
    )
    created_at: datetime = Field(
        ...,
        description="Record creation timestamp"
    )
    updated_at: datetime = Field(
        ...,
        description="Record last update timestamp"
    )


# ============================================================================
# User Update Models
# ============================================================================

class UserUpdateRequest(BaseModel):
    """User profile update request"""
    email: Optional[EmailStr] = Field(
        None,
        description="New email address (requires re-verification)"
    )
    # Add other updatable fields as needed
    
    class Config:
        # Exclude None values when converting to dict
        exclude_none = True


class ChangePasswordRequest(BaseModel):
    """Change password request"""
    current_password: str = Field(
        ...,
        description="Current password for verification"
    )
    new_password: str = Field(
        ...,
        min_length=8,
        description="New password (must meet policy requirements)"
    )


class ChangePasswordResponse(BaseModel):
    """Change password response"""
    message: str = Field(
        default="Password changed successfully. All sessions have been invalidated.",
        description="Success message"
    )


# ============================================================================
# GDPR Data Export
# ============================================================================

class UserDataExport(BaseModel):
    """GDPR user data export response"""
    user: UserDetailResponse = Field(
        ...,
        description="Complete user profile data"
    )
    security_logs: list = Field(
        ...,
        description="Security event history (last 90 days)"
    )
    active_tokens: list = Field(
        ...,
        description="Active JWT sessions"
    )
    export_timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Data export generation time"
    )
    
    class Config:
        from_attributes = True


# ============================================================================
# Account Deletion
# ============================================================================

class DeleteAccountRequest(BaseModel):
    """Account deletion request (GDPR Right to Deletion)"""
    password: str = Field(
        ...,
        description="Password confirmation for security"
    )
    confirm: bool = Field(
        ...,
        description="Explicit confirmation (must be true)"
    )
    
    def validate_confirmation(self):
        """Validate that confirm is True"""
        if not self.confirm:
            raise ValueError("Account deletion must be explicitly confirmed")
        return True


class DeleteAccountResponse(BaseModel):
    """Account deletion response"""
    message: str = Field(
        ...,
        description="Deletion confirmation message",
        examples=["Account marked for deletion. Data will be permanently removed in 30 days. Log in within this period to cancel."]
    )
    deletion_date: datetime = Field(
        ...,
        description="Permanent deletion scheduled date"
    )


# ============================================================================
# User Statistics (Optional)
# ============================================================================

class UserStats(BaseModel):
    """User statistics and activity"""
    total_logins: int = Field(
        ...,
        description="Total number of successful logins"
    )
    failed_attempts: int = Field(
        ...,
        description="Current failed login attempts"
    )
    last_activity: Optional[datetime] = Field(
        None,
        description="Last activity timestamp"
    )
    active_sessions: int = Field(
        ...,
        description="Number of active sessions"
    )

