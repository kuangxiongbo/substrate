"""
Password Management API Routes
Password reset operations
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import (
    ForgotPasswordRequest, ForgotPasswordResponse,
    ResetPasswordRequest, ResetPasswordResponse,
    ErrorResponse
)
from src.services import AuthService
from src.dependencies import get_client_ip
from src.utils.constants import ERROR_CODES, SUCCESS_MESSAGES

router = APIRouter()


# ============================================================================
# Forgot Password (FR-024, FR-025)
# ============================================================================

@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid email format"}
    }
)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Request password reset email (FR-024, FR-025)
    
    - Sends reset email if email exists (FR-025)
    - Always returns 200 for security (don't reveal if email exists) (FR-026)
    - 1-hour reset token expiration (FR-022)
    """
    auth_service = AuthService(db)
    
    await auth_service.forgot_password(
        email=request.email,
        ip_address=client_ip
    )
    
    # Always return success (security measure)
    return ForgotPasswordResponse(
        message=SUCCESS_MESSAGES["password_reset_sent"]
    )


# ============================================================================
# Reset Password (FR-027, FR-028)
# ============================================================================

@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid token or weak password"},
        410: {"model": ErrorResponse, "description": "Token already used"}
    }
)
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Reset password using reset token (FR-027, FR-028)
    
    - Validates reset token (1-hour expiry)
    - Validates new password strength
    - One-time use enforcement (FR-028)
    - Revokes all existing JWT tokens (FR-027)
    - Sends confirmation email
    """
    auth_service = AuthService(db)
    
    success, error = await auth_service.reset_password(
        token_str=request.token,
        new_password=request.new_password,
        ip_address=client_ip
    )
    
    if not success:
        # Check if token was already used
        if "already used" in (error or ""):
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail=error
            )
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error or "Password reset failed"
        )
    
    return ResetPasswordResponse(
        message=SUCCESS_MESSAGES["password_reset_complete"]
    )

