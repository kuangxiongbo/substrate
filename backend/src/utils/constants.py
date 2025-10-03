"""
Constants and Configuration
Application-wide constants, enums, and configuration values
"""
from datetime import timedelta


# ============================================================================
# Password Policies (from FR-003, FR-004)
# ============================================================================

PASSWORD_POLICIES = {
    "basic": {
        "name": "Basic Security",
        "min_length": 8,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digit": True,
        "require_special": False,
        "description": "Minimum 8 characters with uppercase, lowercase, and digit"
    },
    "high": {
        "name": "High Security",
        "min_length": 12,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digit": True,
        "require_special": True,
        "description": "Minimum 12 characters with uppercase, lowercase, digit, and special character"
    }
}


# ============================================================================
# Token Expiration (from FR-009, FR-019)
# ============================================================================

TOKEN_EXPIRY = {
    "access": timedelta(hours=1),           # 1 hour (FR-009)
    "refresh": timedelta(days=7),           # 7 days (FR-009)
    "email_verification": timedelta(hours=24),  # 24 hours
    "password_reset": timedelta(hours=1),   # 1 hour (FR-022)
}


# ============================================================================
# Security Event Types (from SecurityLog model)
# ============================================================================

EVENT_TYPES = {
    # Authentication Events
    "LOGIN_SUCCESS": "login_success",
    "LOGIN_FAILED": "login_failed",
    "LOGOUT": "logout",
    
    # Registration & Verification
    "REGISTRATION": "registration",
    "EMAIL_VERIFICATION": "email_verification",
    
    # Password Management
    "PASSWORD_CHANGE": "password_change",
    "PASSWORD_RESET_REQUESTED": "password_reset_requested",
    "PASSWORD_RESET_COMPLETED": "password_reset_completed",
    
    # Account Security
    "ACCOUNT_LOCKED": "account_locked",
    "ACCOUNT_UNLOCKED": "account_unlocked",
    
    # Token Management
    "TOKEN_REFRESH": "token_refresh",
    "INVALID_TOKEN": "invalid_token",
    "TOKEN_REVOKED": "token_revoked",
    
    # Rate Limiting
    "RATE_LIMIT_EXCEEDED": "rate_limit_exceeded",
    
    # GDPR
    "DATA_EXPORT_REQUEST": "data_export_request",
    "DATA_DELETION_REQUEST": "data_deletion_request",
}


# ============================================================================
# Account Status (from User model)
# ============================================================================

ACCOUNT_STATUS = {
    "ACTIVE": "active",
    "INACTIVE": "inactive",
    "LOCKED": "locked",
    "DELETED": "deleted",
}


# ============================================================================
# Security Settings (from FR-010, FR-011, FR-012)
# ============================================================================

# Rate Limiting (FR-010)
RATE_LIMIT = {
    "login_attempts": 5,          # Max attempts
    "login_window_minutes": 15,   # Time window
    "lockout_duration_minutes": 30,  # Account lockout duration (FR-011, FR-012)
}

# Account Lockout (FR-011, FR-012)
MAX_FAILED_LOGIN_ATTEMPTS = 5
ACCOUNT_LOCKOUT_DURATION = timedelta(minutes=30)


# ============================================================================
# HTTP Status Codes
# ============================================================================

HTTP_STATUS = {
    "OK": 200,
    "CREATED": 201,
    "NO_CONTENT": 204,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "CONFLICT": 409,
    "GONE": 410,  # For used tokens
    "LOCKED": 423,  # For locked accounts
    "TOO_MANY_REQUESTS": 429,
    "INTERNAL_SERVER_ERROR": 500,
}


# ============================================================================
# Error Codes (Machine-readable)
# ============================================================================

ERROR_CODES = {
    # Authentication Errors
    "INVALID_CREDENTIALS": "Invalid email or password",
    "ACCOUNT_NOT_FOUND": "Account not found",
    "ACCOUNT_LOCKED": "Account is temporarily locked due to multiple failed login attempts",
    "ACCOUNT_DISABLED": "Account has been disabled",
    "EMAIL_NOT_VERIFIED": "Please verify your email address before logging in",
    
    # Registration Errors
    "EMAIL_ALREADY_EXISTS": "An account with this email already exists",
    "WEAK_PASSWORD": "Password does not meet security requirements",
    "INVALID_EMAIL": "Invalid email address format",
    "CONSENT_REQUIRED": "User consent is required for registration",
    
    # Token Errors
    "INVALID_TOKEN": "Token is invalid or has expired",
    "TOKEN_EXPIRED": "Token has expired",
    "TOKEN_ALREADY_USED": "This token has already been used",
    "TOKEN_REVOKED": "Token has been revoked",
    "INVALID_TOKEN_TYPE": "Invalid token type",
    
    # Password Errors
    "INCORRECT_PASSWORD": "Current password is incorrect",
    "PASSWORD_TOO_WEAK": "New password does not meet security requirements",
    "PASSWORD_RESET_FAILED": "Password reset failed",
    
    # Rate Limiting
    "RATE_LIMIT_EXCEEDED": "Too many requests. Please try again later",
    "TOO_MANY_LOGIN_ATTEMPTS": "Too many failed login attempts. Account temporarily locked",
    
    # GDPR
    "DELETION_NOT_CONFIRMED": "Account deletion must be explicitly confirmed",
    "INSUFFICIENT_PERMISSIONS": "Insufficient permissions to perform this action",
}


# ============================================================================
# Email Templates
# ============================================================================

EMAIL_TEMPLATES = {
    "verification": "email_verification.html",
    "password_reset": "password_reset.html",
    "password_changed": "password_changed.html",
    "account_locked": "account_locked.html",
    "account_deleted": "account_deleted.html",
}


# ============================================================================
# GDPR Settings (from FR-036)
# ============================================================================

GDPR_SETTINGS = {
    "data_retention_days": 90,              # Security log retention (FR-032)
    "deletion_grace_period_days": 30,       # Account deletion grace period
    "export_format": "json",                # Data export format
}


# ============================================================================
# API Response Messages
# ============================================================================

SUCCESS_MESSAGES = {
    "registration": "Registration successful. Please check your email for verification.",
    "login": "Login successful",
    "logout": "Logout successful",
    "email_verified": "Email verified successfully. You can now log in.",
    "password_changed": "Password changed successfully. All sessions have been invalidated.",
    "password_reset_sent": "If the email exists, a password reset link has been sent.",
    "password_reset_complete": "Password reset successful. Please log in with your new password.",
    "data_exported": "Your data has been exported successfully.",
    "account_deleted": "Account marked for deletion. Data will be permanently removed in 30 days.",
}


# ============================================================================
# Validation Patterns
# ============================================================================

# Regex patterns for password validation
REGEX_PATTERNS = {
    "uppercase": r'[A-Z]',
    "lowercase": r'[a-z]',
    "digit": r'\d',
    "special": r'[!@#$%^&*(),.?":{}|<>]',
    "email": r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
}


# ============================================================================
# Database Constants
# ============================================================================

# Index names (for reference)
DB_INDEXES = {
    "user_email": "idx_user_email",
    "user_status": "idx_user_status",
    "token_jti": "idx_token_jti",
    "token_user_revoked": "idx_token_user_revoked",
    "token_expires": "idx_token_expires",
    "verification_token": "idx_verification_token",
    "verification_user": "idx_verification_user",
    "verification_expires": "idx_verification_expires",
    "log_timestamp": "idx_log_timestamp",
    "log_user_timestamp": "idx_log_user_timestamp",
    "log_event_type": "idx_log_event_type",
}


# ============================================================================
# Security Headers
# ============================================================================

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'",
}


# ============================================================================
# CORS Settings
# ============================================================================

DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]


# ============================================================================
# API Version
# ============================================================================

API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"

