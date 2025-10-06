"""
Token Management API Routes
Token refresh operations
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import RefreshRequest, TokenResponse, ErrorResponse
from src.services import AuthService
from src.dependencies import get_client_ip
from src.utils.constants import ERROR_CODES

router = APIRouter()


# ============================================================================
# Token Refresh (FR-018, FR-020)
# ============================================================================

@router.post(
    "/refresh",
    response_model=TokenResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid or expired refresh token"}
    }
)
async def refresh_token(
    request: RefreshRequest,
    db: Session = Depends(get_db),
    client_ip: str = Depends(get_client_ip)
):
    """
    Refresh access token using refresh token (FR-018, FR-020)
    
    - Validates refresh token
    - Issues new access token
    - Rotates refresh token (FR-020)
    - Revokes old refresh token
    """
    auth_service = AuthService(db)
    
    success, new_tokens, error = auth_service.refresh_token(
        refresh_token=request.refresh_token,
        ip_address=client_ip
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error or ERROR_CODES["INVALID_TOKEN"]
        )
    
    return TokenResponse(
        access_token=new_tokens["access_token"],
        refresh_token=new_tokens["refresh_token"],
        token_type=new_tokens["token_type"],
        expires_in=new_tokens["expires_in"]
    )

