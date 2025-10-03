"""
Authentication API Routes
Register, login, logout, email verification
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import (
    RegisterRequest, RegisterResponse,
    LoginRequest, LoginResponse,
    LogoutRequest, LogoutResponse,
    VerifyEmailResponse,
    PasswordRequirementsResponse,
    ErrorResponse
)
from src.services import AuthService, UserService
from src.dependencies import get_current_user, get_client_ip
from src.models import User
from src.utils.constants import ERROR_CODES, SUCCESS_MESSAGES

router = APIRouter()


# ============================================================================
# Registration (FR-001 to FR-007)
# ============================================================================

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid input or duplicate email"},
        422: {"description": "Validation error"}
    }
)
async def register(
    request: RegisterRequest,
    http_request: Request,
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Register a new user account (FR-001 to FR-007)
    
    - Validates email format (FR-002)
    - Enforces password policy (FR-003)
    - Prevents duplicate emails (FR-004)
    - Creates inactive account (FR-005)
    - Sends verification email (FR-006)
    - Requires GDPR consent (FR-007)
    """
    auth_service = AuthService(db)
    
    success, user_data, errors = await auth_service.register(
        email=request.email,
        password=request.password,
        consent=request.consent,
        ip_address=client_ip,
        user_agent=http_request.headers.get("user-agent")
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(errors) if errors else "Registration failed"
        )
    
    return RegisterResponse(
        message=SUCCESS_MESSAGES["registration"],
        user_id=user_data["user_id"],
        email=user_data["email"]
    )


# ============================================================================
# Login (FR-008 to FR-014)
# ============================================================================

@router.post(
    "/login",
    response_model=LoginResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
        423: {"model": ErrorResponse, "description": "Account locked"}
    }
)
async def login(
    request: LoginRequest,
    http_request: Request,
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Authenticate user and issue JWT tokens (FR-008 to FR-014)
    
    - Authenticates via email/password (FR-008)
    - Issues JWT access + refresh tokens (FR-009)
    - Generic error messages (FR-010)
    - Rate limiting applied (FR-011)
    - Account lockout after 5 failures (FR-012)
    - Token validation (FR-013, FR-014)
    """
    auth_service = AuthService(db)
    
    success, tokens, error = await auth_service.login(
        email=request.email,
        password=request.password,
        ip_address=client_ip,
        user_agent=http_request.headers.get("user-agent")
    )
    
    if not success:
        # Check if account is locked
        if "locked" in (error or "").lower():
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=error
            )
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error or ERROR_CODES["INVALID_CREDENTIALS"]
        )
    
    return LoginResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        expires_in=tokens["expires_in"],
        user=tokens["user"]
    )


# ============================================================================
# Logout (FR-016)
# ============================================================================

@router.post(
    "/logout",
    response_model=LogoutResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid or missing token"}
    }
)
async def logout(
    request: LogoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Logout user and revoke tokens (FR-016)
    
    - Revokes refresh token
    - Logs logout event
    - Invalidates current session
    """
    auth_service = AuthService(db)
    
    # Extract JTI from refresh token
    from src.utils.security import get_token_jti
    refresh_jti = get_token_jti(request.refresh_token)
    
    if not refresh_jti:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refresh token"
        )
    
    auth_service.logout(
        user_id=current_user.id,
        refresh_token_jti=refresh_jti,
        ip_address=client_ip
    )
    
    return LogoutResponse(message=SUCCESS_MESSAGES["logout"])


# ============================================================================
# Email Verification (FR-006)
# ============================================================================

@router.get(
    "/verify-email/{token}",
    response_model=VerifyEmailResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid or expired token"},
        410: {"model": ErrorResponse, "description": "Token already used"}
    }
)
async def verify_email(
    token: str,
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Verify user email address (FR-006)
    
    - Validates verification token
    - Activates user account
    - One-time use enforcement
    """
    user_service = UserService(db)
    
    success, error = user_service.verify_email(token, client_ip)
    
    if not success:
        # Check if token was already used
        if "already used" in (error or ""):
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail=error
            )
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error or "Invalid verification token"
        )
    
    # Get user email from token
    from src.models import VerificationToken
    token_obj = db.query(VerificationToken).filter(
        VerificationToken.token == token
    ).first()
    
    user = user_service.get_user_by_id(token_obj.user_id) if token_obj else None
    
    return VerifyEmailResponse(
        message=SUCCESS_MESSAGES["email_verified"],
        email=user.email if user else ""
    )


# ============================================================================
# Password Requirements (FR-041)
# ============================================================================

@router.get(
    "/password-requirements",
    response_model=PasswordRequirementsResponse
)
async def get_password_requirements(
    db: Session = Depends(get_db)
):
    """
    Get current password policy requirements (FR-041)
    
    - Returns configured policy level (basic or high)
    - Shows all password requirements
    - Helps users create compliant passwords
    """
    auth_service = AuthService(db)
    policy = auth_service.get_password_requirements()
    
    return PasswordRequirementsResponse(**policy)



