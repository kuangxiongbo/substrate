"""
Pydantic Schemas Package
Exports all request/response models for the authentication API
"""

# Authentication Schemas
from src.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    TokenResponse,
    LogoutRequest,
    LogoutResponse,
    VerifyEmailResponse,
    ResendVerificationRequest,
    ErrorResponse,
    ValidationError,
)

# User Schemas
from src.schemas.user import (
    UserResponse,
    UserDetailResponse,
    UserUpdateRequest,
    ChangePasswordRequest,
    ChangePasswordResponse,
    UserDataExport,
    DeleteAccountRequest,
    DeleteAccountResponse,
    UserStats,
)

# Token Schemas
from src.schemas.token import (
    TokenPayload,
    AccessToken,
    RefreshToken,
    TokenPair,
    TokenValidationResult,
    ActiveTokenResponse,
    RevokeTokenRequest,
    RevokeTokenResponse,
    RevokeAllTokensResponse,
)

# Password Schemas
from src.schemas.password import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    PasswordRequirementsResponse,
    PasswordStrengthResponse,
    ValidatePasswordRequest,
    PasswordPolicyViolation,
    PasswordValidationResult,
)

# Verification Schemas
from src.schemas.verification import (
    EmailVerificationResponse,
    EmailVerificationError,
    ResendVerificationEmailRequest,
    ResendVerificationEmailResponse,
    VerificationStatusResponse,
)

__all__ = [
    # Authentication
    "RegisterRequest",
    "RegisterResponse",
    "LoginRequest",
    "LoginResponse",
    "RefreshRequest",
    "TokenResponse",
    "LogoutRequest",
    "LogoutResponse",
    "VerifyEmailResponse",
    "ResendVerificationRequest",
    "ErrorResponse",
    "ValidationError",
    
    # User
    "UserResponse",
    "UserDetailResponse",
    "UserUpdateRequest",
    "ChangePasswordRequest",
    "ChangePasswordResponse",
    "UserDataExport",
    "DeleteAccountRequest",
    "DeleteAccountResponse",
    "UserStats",
    
    # Token
    "TokenPayload",
    "AccessToken",
    "RefreshToken",
    "TokenPair",
    "TokenValidationResult",
    "ActiveTokenResponse",
    "RevokeTokenRequest",
    "RevokeTokenResponse",
    "RevokeAllTokensResponse",
    
    # Password
    "ForgotPasswordRequest",
    "ForgotPasswordResponse",
    "ResetPasswordRequest",
    "ResetPasswordResponse",
    "PasswordRequirementsResponse",
    "PasswordStrengthResponse",
    "ValidatePasswordRequest",
    "PasswordPolicyViolation",
    "PasswordValidationResult",
    
    # Verification
    "EmailVerificationResponse",
    "EmailVerificationError",
    "ResendVerificationEmailRequest",
    "ResendVerificationEmailResponse",
    "VerificationStatusResponse",
]

