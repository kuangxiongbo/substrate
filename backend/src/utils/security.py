"""
Security Utilities
Password hashing (Argon2) and JWT token operations
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import secrets
import uuid

from passlib.context import CryptContext
from jose import JWTError, jwt

from src.config import settings


# ============================================================================
# Password Hashing (Argon2id)
# ============================================================================

# Password context with Argon2id (preferred) and bcrypt (fallback)
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
    argon2__memory_cost=65536,  # 64 MB
    argon2__time_cost=2,
    argon2__parallelism=4,
)


def hash_password(password: str) -> str:
    """
    Hash a password using Argon2id
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
        
    Example:
        >>> hashed = hash_password("SecurePass123!")
        >>> hashed.startswith("$argon2id$")
        True
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
        
    Example:
        >>> hashed = hash_password("SecurePass123!")
        >>> verify_password("SecurePass123!", hashed)
        True
        >>> verify_password("WrongPassword", hashed)
        False
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def needs_rehash(hashed_password: str) -> bool:
    """
    Check if password hash needs to be updated
    (e.g., algorithm changed or cost factors increased)
    
    Args:
        hashed_password: Current hashed password
        
    Returns:
        True if hash should be updated, False otherwise
    """
    return pwd_context.needs_update(hashed_password)


# ============================================================================
# JWT Token Operations
# ============================================================================

def create_access_token(
    user_id: uuid.UUID,
    jti: Optional[str] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token
    
    Args:
        user_id: User UUID
        jti: JWT ID (for blacklisting), auto-generated if None
        expires_delta: Custom expiration time, defaults to 1 hour
        
    Returns:
        Encoded JWT access token string
        
    Example:
        >>> token = create_access_token(user_id=user.id)
        >>> # Use in Authorization header: Bearer {token}
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    if jti is None:
        jti = str(uuid.uuid4())
    
    expire = datetime.utcnow() + expires_delta
    
    payload = {
        "sub": str(user_id),  # Subject (user ID)
        "exp": expire,         # Expiration time
        "iat": datetime.utcnow(),  # Issued at
        "jti": jti,           # JWT ID (for revocation)
        "type": "access"      # Token type
    }
    
    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def create_refresh_token(
    user_id: uuid.UUID,
    jti: Optional[str] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT refresh token
    
    Args:
        user_id: User UUID
        jti: JWT ID, auto-generated if None
        expires_delta: Custom expiration time, defaults to 7 days
        
    Returns:
        Encoded JWT refresh token string
        
    Note:
        Refresh tokens should also be stored in database for rotation tracking
    """
    if expires_delta is None:
        expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    if jti is None:
        jti = str(uuid.uuid4())
    
    expire = datetime.utcnow() + expires_delta
    
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": jti,
        "type": "refresh"
    }
    
    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload dict if valid, None if invalid
        
    Raises:
        JWTError: If token is invalid, expired, or malformed
        
    Example:
        >>> payload = decode_token(access_token)
        >>> user_id = uuid.UUID(payload["sub"])
        >>> jti = payload["jti"]
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise JWTError(f"Token validation failed: {str(e)}")


def verify_token(token: str, expected_type: str = "access") -> Optional[uuid.UUID]:
    """
    Verify a JWT token and return user ID
    
    Args:
        token: JWT token string
        expected_type: Expected token type ('access' or 'refresh')
        
    Returns:
        User UUID if token is valid, None if invalid
        
    Example:
        >>> user_id = verify_token(token, "access")
        >>> if user_id:
        ...     print(f"Valid token for user {user_id}")
    """
    try:
        payload = decode_token(token)
        
        # Check token type
        if payload.get("type") != expected_type:
            return None
        
        # Extract user ID
        user_id_str = payload.get("sub")
        if not user_id_str:
            return None
        
        return uuid.UUID(user_id_str)
        
    except (JWTError, ValueError):
        return None


def get_token_jti(token: str) -> Optional[str]:
    """
    Extract JTI (JWT ID) from token
    
    Args:
        token: JWT token string
        
    Returns:
        JTI string if token is valid, None otherwise
        
    Usage:
        Used for token blacklisting and revocation
    """
    try:
        payload = decode_token(token)
        return payload.get("jti")
    except JWTError:
        return None


def is_token_expired(token: str) -> bool:
    """
    Check if a token is expired
    
    Args:
        token: JWT token string
        
    Returns:
        True if expired, False if still valid
    """
    try:
        payload = decode_token(token)
        exp_timestamp = payload.get("exp")
        
        if not exp_timestamp:
            return True
        
        exp_datetime = datetime.fromtimestamp(exp_timestamp)
        return datetime.utcnow() >= exp_datetime
        
    except JWTError:
        return True  # Invalid tokens are considered expired


# ============================================================================
# Secure Random Token Generation
# ============================================================================

def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token
    
    Args:
        length: Token length in bytes (default 32 = 64 hex chars)
        
    Returns:
        Hex-encoded secure random string
        
    Usage:
        Used for email verification and password reset tokens
        
    Example:
        >>> token = generate_secure_token()
        >>> len(token)
        64
    """
    return secrets.token_hex(length)


def generate_verification_token() -> str:
    """
    Generate a secure token for email verification
    
    Returns:
        64-character hex string
    """
    return generate_secure_token(32)


def generate_password_reset_token() -> str:
    """
    Generate a secure token for password reset
    
    Returns:
        64-character hex string
    """
    return generate_secure_token(32)


# ============================================================================
# Token Expiration Helpers
# ============================================================================

def get_access_token_expiry() -> datetime:
    """
    Get access token expiration datetime
    
    Returns:
        Datetime 1 hour from now (configurable)
    """
    return datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )


def get_refresh_token_expiry() -> datetime:
    """
    Get refresh token expiration datetime
    
    Returns:
        Datetime 7 days from now (configurable)
    """
    return datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )


def get_email_verification_expiry() -> datetime:
    """
    Get email verification token expiration
    
    Returns:
        Datetime 24 hours from now (configurable)
    """
    return datetime.utcnow() + timedelta(
        hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS
    )


def get_password_reset_expiry() -> datetime:
    """
    Get password reset token expiration
    
    Returns:
        Datetime 1 hour from now (configurable)
    """
    return datetime.utcnow() + timedelta(
        hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS
    )


# ============================================================================
# Authentication Dependencies
# ============================================================================

def get_current_user(token: str = None) -> Optional[Any]:
    """
    Get current authenticated user from JWT token
    
    Args:
        token: JWT access token
        
    Returns:
        User object if token is valid, None otherwise
        
    Note:
        This is a simplified version for admin API.
        In production, use proper FastAPI dependency injection.
    """
    if not token:
        return None
    
    try:
        user_id = verify_token(token, "access")
        if not user_id:
            return None
        
        # Import here to avoid circular imports
        from src.database import get_db
        from src.models import User
        
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()
        return user
        
    except Exception:
        return None











