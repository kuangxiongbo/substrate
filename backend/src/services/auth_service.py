"""
Authentication Service
Core authentication logic - login, logout, password management
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Tuple
from sqlalchemy.orm import Session
import uuid

from src.models import User, VerificationToken, TokenPurpose, EventType, EventResult, AccountStatus
from src.services.password_service import PasswordService
from src.services.token_service import TokenService
from src.services.email_service import EmailService
from src.services.security_service import SecurityService
from src.services.user_service import UserService
from src.utils.security import generate_password_reset_token, get_password_reset_expiry


class AuthService:
    """
    Authentication service - orchestrates all auth operations
    
    Responsibilities:
    - User registration (FR-001 to FR-007)
    - User login (FR-008 to FR-014)
    - Token refresh (FR-018, FR-020)
    - Logout (FR-016)
    - Password change (FR-021, FR-022, FR-023)
    - Password reset (FR-024 to FR-028)
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.password_service = PasswordService()
        self.token_service = TokenService(db)
        self.email_service = EmailService()
        self.security_service = SecurityService(db)
        self.user_service = UserService(db)
    
    # ========================================================================
    # Registration (FR-001 to FR-007)
    # ========================================================================
    
    async def register(
        self,
        email: str,
        password: str,
        consent: bool,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Tuple[bool, Optional[Dict], List[str]]:
        """
        Register a new user (FR-001 to FR-007)
        
        Args:
            email: User email
            password: Plain text password
            consent: GDPR consent
            ip_address: Registration IP
            user_agent: Client user agent
            
        Returns:
            Tuple of (success: bool, user_data: dict or None, errors: List[str])
        """
        success, user, errors = await self.user_service.create_user(
            email=email,
            password=password,
            consent=consent,
            ip_address=ip_address
        )
        
        if success and user:
            return True, {
                "user_id": user.id,
                "email": user.email,
                "message": "Registration successful. Please check your email for verification."
            }, []
        
        return False, None, errors
    
    # ========================================================================
    # Login (FR-008 to FR-014)
    # ========================================================================
    
    async def login(
        self,
        email: str,
        password: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Tuple[bool, Optional[Dict], Optional[str]]:
        """
        Authenticate user and issue tokens (FR-008 to FR-014)
        
        Args:
            email: User email
            password: Plain text password
            ip_address: Login IP address
            user_agent: Client user agent
            
        Returns:
            Tuple of (success: bool, tokens: dict or None, error: str or None)
            
        Process:
        1. Find user by email
        2. Check account lockout (FR-012)
        3. Verify password (FR-009)
        4. Check email verification
        5. Generate JWT tokens (FR-008, FR-009)
        6. Reset failed attempts
        7. Update last login
        8. Log success
        """
        # Get user
        user = self.user_service.get_user_by_email(email)
        
        # Generic error message for security (FR-010)
        generic_error = "Invalid email or password"
        
        if not user:
            # Log failed attempt (no user_id)
            self.security_service.log_event(
                event_type=EventType.LOGIN_FAILED,
                result=EventResult.FAILURE,
                ip_address=ip_address,
                user_agent=user_agent,
                details="Email not found"
            )
            return False, None, generic_error
        
        # Check account lockout (FR-012)
        is_locked, locked_until = self.security_service.check_account_lockout(user)
        if is_locked:
            return False, None, f"Account is locked until {locked_until.strftime('%Y-%m-%d %H:%M:%S UTC')}"
        
        # Verify password
        is_valid_password = self.password_service.verify_password(password, user.password_hash)
        
        if not is_valid_password:
            # Increment failed attempts (FR-011)
            attempts = self.security_service.increment_failed_attempts(user, ip_address)
            
            if attempts >= 5:
                return False, None, "Account locked due to multiple failed login attempts"
            
            return False, None, generic_error
        
        # Check email verification
        if not user.email_verified:
            return False, None, "Please verify your email address before logging in"
        
        # Check account status
        if user.account_status != AccountStatus.ACTIVE:
            return False, None, "Account is not active"
        
        # Generate tokens (FR-008, FR-009)
        tokens = self.token_service.generate_token_pair(
            user_id=user.id,
            device_info=user_agent
        )
        
        # Reset failed attempts
        self.security_service.reset_failed_attempts(user)
        
        # Update last login
        self.user_service.update_last_login(user)
        
        # Log successful login
        self.security_service.log_event(
            event_type=EventType.LOGIN_SUCCESS,
            result=EventResult.SUCCESS,
            user_id=user.id,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Return tokens and user info
        return True, {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": tokens["token_type"],
            "expires_in": tokens["expires_in"],
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.email.split('@')[0],  # 使用邮箱前缀作为用户名
                "role": "管理员" if "admin" in user.email.lower() else "用户",
                "avatar": None,
                "email_verified": user.email_verified,
                "account_status": user.account_status.value,
                "failed_login_attempts": user.failed_login_attempts,
                "account_locked_until": user.account_locked_until.isoformat() if user.account_locked_until else None,
                "registration_timestamp": user.registration_timestamp.isoformat() if user.registration_timestamp else None,
                "last_login_timestamp": user.last_login_timestamp.isoformat() if user.last_login_timestamp else None,
                "last_password_change": user.last_password_change.isoformat() if user.last_password_change else None,
                "consent_timestamp": user.consent_timestamp.isoformat() if user.consent_timestamp else None,
                "consent_status": user.consent_status,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None,
            }
        }, None
    
    # ========================================================================
    # Logout (FR-016)
    # ========================================================================
    
    def logout(
        self,
        user_id: uuid.UUID,
        refresh_token_jti: str,
        ip_address: Optional[str] = None
    ) -> bool:
        """
        Logout user and revoke tokens (FR-016)
        
        Args:
            user_id: User UUID
            refresh_token_jti: Refresh token JTI to revoke
            ip_address: IP address for logging
            
        Returns:
            True if successful
        """
        # Revoke refresh token
        self.token_service.revoke_token(refresh_token_jti)
        
        # Log logout
        self.security_service.log_event(
            event_type=EventType.LOGOUT,
            result=EventResult.SUCCESS,
            user_id=user_id,
            ip_address=ip_address
        )
        
        return True
    
    # ========================================================================
    # Password Change (FR-021, FR-022, FR-023)
    # ========================================================================
    
    async def change_password(
        self,
        user_id: uuid.UUID,
        current_password: str,
        new_password: str,
        ip_address: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Change user password (FR-021, FR-022, FR-023)
        
        Args:
            user_id: User UUID
            current_password: Current password for verification (FR-022)
            new_password: New password
            ip_address: IP address for logging
            
        Returns:
            Tuple of (success: bool, error: str or None)
            
        Process:
        1. Verify current password (FR-022)
        2. Validate new password (FR-023)
        3. Hash new password
        4. Update password
        5. Revoke all tokens (FR-027)
        6. Send confirmation email (FR-040)
        7. Log event
        """
        user = self.user_service.get_user_by_id(user_id)
        if not user:
            return False, "User not found"
        
        # Verify current password (FR-022)
        is_valid = self.password_service.verify_password(current_password, user.password_hash)
        if not is_valid:
            return False, "Current password is incorrect"
        
        # Validate new password (FR-023)
        is_valid_new, new_hash, errors = self.password_service.validate_and_hash(
            new_password, user.email
        )
        if not is_valid_new:
            return False, "; ".join(errors)
        
        # Update password
        self.user_service.update_password(user, new_hash, ip_address)
        
        # Revoke all existing tokens (FR-027)
        revoked_count = self.token_service.revoke_all_user_tokens(user_id)
        
        # Send confirmation email (FR-040)
        await self.email_service.send_password_changed_email(user.email)
        
        return True, None
    
    # ========================================================================
    # Password Reset (FR-024 to FR-028)
    # ========================================================================
    
    async def forgot_password(
        self,
        email: str,
        ip_address: Optional[str] = None
    ) -> bool:
        """
        Request password reset (FR-024, FR-025)
        
        Args:
            email: User email
            ip_address: IP address for logging
            
        Returns:
            Always returns True for security (don't reveal if email exists)
            
        Note: Always returns success to prevent email enumeration
        """
        user = self.user_service.get_user_by_email(email)
        
        if user and user.email_verified:
            # Create password reset token
            token = VerificationToken(
                id=uuid.uuid4(),
                token=generate_password_reset_token(),
                user_id=user.id,
                token_type=TokenPurpose.PASSWORD_RESET,
                created_at=datetime.utcnow(),
                expires_at=get_password_reset_expiry(),
                used=False
            )
            
            self.db.add(token)
            self.db.flush()
            
            # Send reset email (FR-025, FR-026)
            await self.email_service.send_password_reset_email(
                to_email=user.email,
                reset_token=token.token
            )
            
            # Log request
            self.security_service.log_event(
                event_type=EventType.PASSWORD_RESET_REQUESTED,
                result=EventResult.SUCCESS,
                user_id=user.id,
                ip_address=ip_address
            )
            
            self.db.commit()
        
        # Always return True (security - don't reveal if email exists)
        return True
    
    async def reset_password(
        self,
        token_str: str,
        new_password: str,
        ip_address: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Reset password using reset token (FR-027, FR-028)
        
        Args:
            token_str: Password reset token
            new_password: New password
            ip_address: IP address for logging
            
        Returns:
            Tuple of (success: bool, error: str or None)
            
        Process:
        1. Validate token (FR-028 - one-time use)
        2. Check expiration (FR-025 - 1 hour)
        3. Validate new password
        4. Update password
        5. Revoke all tokens (FR-027)
        6. Send confirmation email (FR-040)
        """
        # Find token
        token = self.db.query(VerificationToken).filter(
            VerificationToken.token == token_str,
            VerificationToken.token_type == TokenPurpose.PASSWORD_RESET
        ).first()
        
        if not token:
            return False, "Invalid or expired reset token"
        
        # Check if already used (FR-028)
        if token.used:
            return False, "This reset link has already been used"
        
        # Check expiration
        if not token.is_valid():
            return False, "Reset link has expired. Please request a new one."
        
        # Get user
        user = self.user_service.get_user_by_id(token.user_id)
        if not user:
            return False, "User not found"
        
        # Validate new password
        is_valid, new_hash, errors = self.password_service.validate_and_hash(
            new_password, user.email
        )
        if not is_valid:
            return False, "; ".join(errors)
        
        # Update password
        self.user_service.update_password(user, new_hash, ip_address)
        
        # Mark token as used (one-time use)
        token.mark_as_used()
        
        # Revoke all existing tokens (FR-027)
        self.token_service.revoke_all_user_tokens(user.id)
        
        # Log password reset completion
        self.security_service.log_event(
            event_type=EventType.PASSWORD_RESET_COMPLETED,
            result=EventResult.SUCCESS,
            user_id=user.id,
            ip_address=ip_address
        )
        
        # Send confirmation email (FR-040)
        await self.email_service.send_password_changed_email(user.email)
        
        self.db.commit()
        
        return True, None
    
    # ========================================================================
    # Token Operations
    # ========================================================================
    
    def refresh_token(
        self,
        refresh_token: str,
        ip_address: Optional[str] = None
    ) -> Tuple[bool, Optional[Dict], Optional[str]]:
        """
        Refresh access token (FR-018, FR-020)
        
        Args:
            refresh_token: Current refresh token
            ip_address: IP address for logging
            
        Returns:
            Tuple of (success: bool, new_tokens: dict, error: str)
        """
        success, new_tokens, error = self.token_service.refresh_access_token(refresh_token)
        
        if success:
            # Log token refresh
            # Extract user_id from token for logging
            from src.utils.security import decode_token
            try:
                payload = decode_token(refresh_token)
                user_id = uuid.UUID(payload.get("sub"))
                
                self.security_service.log_event(
                    event_type=EventType.TOKEN_REFRESH,
                    result=EventResult.SUCCESS,
                    user_id=user_id,
                    ip_address=ip_address
                )
            except:
                pass  # Log without user_id if decode fails
        
        return success, new_tokens, error
    
    # ========================================================================
    # Password Policy
    # ========================================================================
    
    def get_password_requirements(self) -> Dict:
        """
        Get current password policy requirements (FR-041)
        
        Returns:
            Password policy configuration dict
        """
        return self.password_service.get_policy_requirements()
    
    def validate_password_strength(self, password: str, email: str = None) -> Dict:
        """
        Check password strength and policy compliance
        
        Args:
            password: Password to check
            email: User email (for security checks)
            
        Returns:
            Strength analysis dict
        """
        return self.password_service.get_password_strength(password)




