"""
User Management API Routes
User profile, password change, GDPR operations
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import (
    UserResponse,
    ChangePasswordRequest, ChangePasswordResponse,
    UserDataExport,
    DeleteAccountRequest, DeleteAccountResponse,
    ErrorResponse
)
from src.services import AuthService, UserService, TokenService
from src.dependencies import get_current_user, get_client_ip
from src.models import User
from src.utils.constants import ERROR_CODES, SUCCESS_MESSAGES

router = APIRouter()


# ============================================================================
# Get Current User Profile
# ============================================================================

@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Not authenticated"}
    }
)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's profile
    
    - Requires valid JWT token
    - Returns user information (no sensitive data)
    """
    return UserResponse.model_validate(current_user)


# ============================================================================
# Change Password (FR-021, FR-022, FR-023)
# ============================================================================

@router.post(
    "/me/change-password",
    response_model=ChangePasswordResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid password"},
        401: {"model": ErrorResponse, "description": "Not authenticated"}
    }
)
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Change user password (FR-021, FR-022, FR-023)
    
    - Requires current password verification (FR-022)
    - Validates new password strength (FR-023)
    - Revokes all existing JWT tokens (FR-027)
    - Sends confirmation email (FR-040)
    """
    auth_service = AuthService(db)
    
    success, error = await auth_service.change_password(
        user_id=current_user.id,
        current_password=request.current_password,
        new_password=request.new_password,
        ip_address=client_ip
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error or "Password change failed"
        )
    
    return ChangePasswordResponse(
        message=SUCCESS_MESSAGES["password_changed"]
    )


# ============================================================================
# GDPR: Export User Data (FR-036)
# ============================================================================

@router.get(
    "/me/data",
    response_model=UserDataExport,
    responses={
        401: {"model": ErrorResponse, "description": "Not authenticated"}
    }
)
async def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Export all user data (GDPR Right to Access) (FR-036)
    
    - Returns all personal data
    - Includes security logs (90 days)
    - Includes active tokens
    - Logs export request
    """
    user_service = UserService(db)
    token_service = TokenService(db)
    
    # Get all user data
    user_data = user_service.export_user_data(current_user.id)
    
    # Get active tokens
    active_tokens = token_service.get_active_tokens(current_user.id)
    
    from src.schemas.user import UserDetailResponse
    return UserDataExport(
        user=UserDetailResponse.model_validate(current_user),
        security_logs=user_data.get("security_logs", []),
        active_tokens=[
            {
                "jti": token.jti,
                "type": token.token_type.value,
                "issued_at": token.issued_at.isoformat(),
                "expires_at": token.expires_at.isoformat()
            }
            for token in active_tokens
        ]
    )


# ============================================================================
# GDPR: Delete Account (FR-036)
# ============================================================================

@router.delete(
    "/me",
    response_model=DeleteAccountResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid password or missing confirmation"},
        401: {"model": ErrorResponse, "description": "Not authenticated"}
    }
)
async def delete_account(
    request: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Delete user account (GDPR Right to Deletion) (FR-036)
    
    - Requires password confirmation
    - Requires explicit confirmation
    - Soft delete with 30-day grace period
    - Can be cancelled by logging in during grace period
    - Logs deletion request
    """
    # Validate confirmation
    if not request.confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_CODES["DELETION_NOT_CONFIRMED"]
        )
    
    # Verify password
    from src.services import PasswordService
    password_service = PasswordService()
    
    is_valid = password_service.verify_password(
        request.password,
        current_user.password_hash
    )
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_CODES["INCORRECT_PASSWORD"]
        )
    
    # Delete account
    user_service = UserService(db)
    success, deletion_date = user_service.delete_user_account(
        user_id=current_user.id,
        ip_address=client_ip
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account deletion failed"
        )
    
    return DeleteAccountResponse(
        message=SUCCESS_MESSAGES["account_deleted"],
        deletion_date=deletion_date
    )

