"""
Token Schemas
Pydantic models for JWT token management
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


# ============================================================================
# JWT Token Models
# ============================================================================

class TokenPayload(BaseModel):
    """JWT token payload structure"""
    sub: str = Field(
        ...,
        description="Subject (user ID)"
    )
    exp: int = Field(
        ...,
        description="Expiration time (Unix timestamp)"
    )
    iat: int = Field(
        ...,
        description="Issued at (Unix timestamp)"
    )
    jti: str = Field(
        ...,
        description="JWT ID (for blacklisting)"
    )
    type: str = Field(
        ...,
        description="Token type: access or refresh",
        examples=["access", "refresh"]
    )


class AccessToken(BaseModel):
    """Access token model"""
    token: str = Field(
        ...,
        description="JWT access token string"
    )
    expires_at: datetime = Field(
        ...,
        description="Token expiration timestamp"
    )
    token_type: str = Field(
        default="bearer",
        description="Token type for Authorization header"
    )


class RefreshToken(BaseModel):
    """Refresh token model"""
    token: str = Field(
        ...,
        description="JWT refresh token string"
    )
    expires_at: datetime = Field(
        ...,
        description="Token expiration timestamp"
    )


class TokenPair(BaseModel):
    """Access and refresh token pair"""
    access_token: AccessToken = Field(
        ...,
        description="Access token (1 hour validity)"
    )
    refresh_token: RefreshToken = Field(
        ...,
        description="Refresh token (7 days validity)"
    )


# ============================================================================
# Token Validation
# ============================================================================

class TokenValidationResult(BaseModel):
    """Token validation result"""
    valid: bool = Field(
        ...,
        description="Whether token is valid"
    )
    user_id: Optional[uuid.UUID] = Field(
        None,
        description="User ID from token (if valid)"
    )
    jti: Optional[str] = Field(
        None,
        description="JWT ID (if valid)"
    )
    error: Optional[str] = Field(
        None,
        description="Error message (if invalid)"
    )
    expires_at: Optional[datetime] = Field(
        None,
        description="Token expiration time"
    )


# ============================================================================
# Token Management
# ============================================================================

class ActiveTokenResponse(BaseModel):
    """Active token information"""
    jti: str = Field(
        ...,
        description="JWT ID"
    )
    token_type: str = Field(
        ...,
        description="Token type: access or refresh"
    )
    issued_at: datetime = Field(
        ...,
        description="Token issue time"
    )
    expires_at: datetime = Field(
        ...,
        description="Token expiration time"
    )
    device_info: Optional[str] = Field(
        None,
        description="Device/browser information"
    )
    is_current: bool = Field(
        ...,
        description="Whether this is the current session"
    )
    
    class Config:
        from_attributes = True


class RevokeTokenRequest(BaseModel):
    """Request to revoke a specific token"""
    jti: str = Field(
        ...,
        description="JWT ID to revoke"
    )


class RevokeTokenResponse(BaseModel):
    """Token revocation response"""
    message: str = Field(
        default="Token revoked successfully",
        description="Success message"
    )
    jti: str = Field(
        ...,
        description="Revoked token JTI"
    )


class RevokeAllTokensResponse(BaseModel):
    """Response for revoking all user tokens"""
    message: str = Field(
        ...,
        description="Success message",
        examples=["All tokens revoked successfully. Please log in again."]
    )
    revoked_count: int = Field(
        ...,
        description="Number of tokens revoked"
    )

