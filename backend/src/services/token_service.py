"""
Token Service
JWT token generation, validation, rotation, and revocation
"""
from datetime import datetime, timedelta
from typing import Optional, Tuple, Dict, List
from sqlalchemy.orm import Session
import uuid

from src.models import JWTToken, TokenType
from src.utils.security import (
    create_access_token,
    create_refresh_token,
    verify_token,
    decode_token,
    get_token_jti,
    get_access_token_expiry,
    get_refresh_token_expiry,
)
from src.utils.constants import SUCCESS_MESSAGES


class TokenService:
    """
    Service for JWT token operations
    
    Responsibilities:
    - Generate access and refresh tokens (FR-009)
    - Validate tokens (FR-013, FR-014)
    - Refresh access tokens (FR-018)
    - Rotate refresh tokens (FR-020)
    - Revoke tokens on logout/password change (FR-016, FR-027)
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def generate_token_pair(
        self,
        user_id: uuid.UUID,
        device_info: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Generate access and refresh token pair (FR-009)
        
        Args:
            user_id: User UUID
            device_info: Optional device/user-agent info
            
        Returns:
            Dict with access_token, refresh_token, token_type, expires_in
            
        Example:
            >>> tokens = token_service.generate_token_pair(user.id)
            >>> access = tokens["access_token"]
            >>> refresh = tokens["refresh_token"]
        """
        # Generate tokens
        access_jti = str(uuid.uuid4())
        refresh_jti = str(uuid.uuid4())
        
        access_token = create_access_token(user_id, jti=access_jti)
        refresh_token = create_refresh_token(user_id, jti=refresh_jti)
        
        # Store refresh token in database for rotation tracking
        refresh_token_record = JWTToken(
            id=uuid.uuid4(),
            jti=refresh_jti,
            user_id=user_id,
            token_type=TokenType.REFRESH,
            token_value=refresh_token,
            issued_at=datetime.utcnow(),
            expires_at=get_refresh_token_expiry(),
            revoked=False,
            device_info=device_info
        )
        
        self.db.add(refresh_token_record)
        self.db.commit()
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": 3600  # 1 hour in seconds
        }
    
    def validate_access_token(self, token: str) -> Tuple[bool, Optional[uuid.UUID], Optional[str]]:
        """
        Validate an access token (FR-013)
        
        Args:
            token: JWT access token
            
        Returns:
            Tuple of (is_valid: bool, user_id: UUID or None, error: str or None)
            
        Checks:
        - Token format and signature
        - Token expiration
        - Token type (must be 'access')
        - Token not in blacklist (revoked)
        """
        try:
            # Decode and verify token
            user_id = verify_token(token, expected_type="access")
            
            if not user_id:
                return False, None, "Invalid token type or format"
            
            # Check if token is blacklisted (revoked)
            jti = get_token_jti(token)
            if jti:
                revoked_token = self.db.query(JWTToken).filter(
                    JWTToken.jti == jti,
                    JWTToken.revoked == True
                ).first()
                
                if revoked_token:
                    return False, None, "Token has been revoked"
            
            return True, user_id, None
            
        except Exception as e:
            return False, None, f"Token validation failed: {str(e)}"
    
    def refresh_access_token(
        self,
        refresh_token: str
    ) -> Tuple[bool, Optional[Dict[str, str]], Optional[str]]:
        """
        Refresh access token using refresh token (FR-018, FR-020)
        
        Args:
            refresh_token: Valid refresh token
            
        Returns:
            Tuple of (success: bool, new_tokens: dict or None, error: str or None)
            
        Implements token rotation (FR-020):
        - Issues new access token
        - Issues new refresh token
        - Revokes old refresh token
        """
        try:
            # Verify refresh token
            user_id = verify_token(refresh_token, expected_type="refresh")
            
            if not user_id:
                return False, None, "Invalid refresh token"
            
            # Find refresh token in database
            jti = get_token_jti(refresh_token)
            token_record = self.db.query(JWTToken).filter(
                JWTToken.jti == jti,
                JWTToken.token_type == TokenType.REFRESH,
                JWTToken.revoked == False
            ).first()
            
            if not token_record:
                return False, None, "Refresh token not found or already revoked"
            
            # Check expiration
            if datetime.utcnow() >= token_record.expires_at:
                return False, None, "Refresh token expired"
            
            # Revoke old refresh token (token rotation)
            token_record.revoke()
            
            # Generate new token pair
            new_tokens = self.generate_token_pair(
                user_id,
                device_info=token_record.device_info
            )
            
            self.db.commit()
            
            return True, new_tokens, None
            
        except Exception as e:
            self.db.rollback()
            return False, None, f"Token refresh failed: {str(e)}"
    
    def revoke_token(self, jti: str) -> bool:
        """
        Revoke a specific token by JTI (FR-016)
        
        Args:
            jti: JWT ID to revoke
            
        Returns:
            True if revoked, False if not found
        """
        token = self.db.query(JWTToken).filter(JWTToken.jti == jti).first()
        
        if not token:
            # Create blacklist entry for access tokens
            # (they're not stored unless revoked)
            return False
        
        token.revoke()
        self.db.commit()
        
        return True
    
    def revoke_all_user_tokens(self, user_id: uuid.UUID) -> int:
        """
        Revoke all tokens for a user (FR-027)
        
        Used when:
        - User changes password
        - User resets password
        - Account is compromised
        
        Args:
            user_id: User UUID
            
        Returns:
            Number of tokens revoked
        """
        tokens = self.db.query(JWTToken).filter(
            JWTToken.user_id == user_id,
            JWTToken.revoked == False
        ).all()
        
        count = 0
        for token in tokens:
            token.revoke()
            count += 1
        
        self.db.commit()
        
        return count
    
    def get_active_tokens(self, user_id: uuid.UUID) -> List[JWTToken]:
        """
        Get all active tokens for a user
        
        Args:
            user_id: User UUID
            
        Returns:
            List of active JWTToken records
        """
        return self.db.query(JWTToken).filter(
            JWTToken.user_id == user_id,
            JWTToken.revoked == False,
            JWTToken.expires_at > datetime.utcnow()
        ).all()
    
    def cleanup_expired_tokens(self) -> int:
        """
        Delete expired and revoked tokens (cleanup job)
        
        Removes tokens that are:
        - Expired for more than 24 hours
        - Revoked and expired
        
        Returns:
            Number of tokens deleted
        """
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        
        deleted = self.db.query(JWTToken).filter(
            JWTToken.expires_at < cutoff_time
        ).delete()
        
        self.db.commit()
        
        return deleted











