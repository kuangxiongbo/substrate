"""
Utilities Package
Exports security, validation, and constant utilities
"""
from src.utils.security import (
    # Password hashing
    hash_password,
    verify_password,
    needs_rehash,
    
    # JWT operations
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_token,
    get_token_jti,
    is_token_expired,
    
    # Secure token generation
    generate_secure_token,
    generate_verification_token,
    generate_password_reset_token,
    
    # Expiration helpers
    get_access_token_expiry,
    get_refresh_token_expiry,
    get_email_verification_expiry,
    get_password_reset_expiry,
)

from src.utils.validators import (
    # Email validation
    validate_email_format,
    is_valid_email,
    
    # Password policy
    get_password_policy,
    validate_password_policy,
    check_password_strength,
    
    # Security checks
    is_common_password,
    contains_email,
    validate_password_security,
)

from src.utils.constants import (
    # Policies and settings
    PASSWORD_POLICIES,
    TOKEN_EXPIRY,
    RATE_LIMIT,
    GDPR_SETTINGS,
    
    # Event types
    EVENT_TYPES,
    
    # Status codes
    HTTP_STATUS,
    ERROR_CODES,
    SUCCESS_MESSAGES,
    
    # Security
    SECURITY_HEADERS,
    DEFAULT_CORS_ORIGINS,
    
    # API
    API_VERSION,
    API_PREFIX,
)

__all__ = [
    # Password functions
    "hash_password",
    "verify_password",
    "needs_rehash",
    
    # JWT functions
    "create_access_token",
    "create_refresh_token",
    "decode_token",
    "verify_token",
    "get_token_jti",
    "is_token_expired",
    
    # Token generation
    "generate_secure_token",
    "generate_verification_token",
    "generate_password_reset_token",
    
    # Expiration helpers
    "get_access_token_expiry",
    "get_refresh_token_expiry",
    "get_email_verification_expiry",
    "get_password_reset_expiry",
    
    # Email validation
    "validate_email_format",
    "is_valid_email",
    
    # Password validation
    "get_password_policy",
    "validate_password_policy",
    "check_password_strength",
    "is_common_password",
    "contains_email",
    "validate_password_security",
    
    # Constants
    "PASSWORD_POLICIES",
    "TOKEN_EXPIRY",
    "EVENT_TYPES",
    "HTTP_STATUS",
    "ERROR_CODES",
    "SUCCESS_MESSAGES",
    "RATE_LIMIT",
    "GDPR_SETTINGS",
    "SECURITY_HEADERS",
    "DEFAULT_CORS_ORIGINS",
    "API_VERSION",
    "API_PREFIX",
]

