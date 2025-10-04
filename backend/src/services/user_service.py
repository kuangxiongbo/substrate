"""
User Service
User management operations
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, List
from sqlalchemy.orm import Session
import uuid

from src.models import User, VerificationToken, AccountStatus, TokenPurpose
from src.models.security_log import EventType, EventResult
from src.services.password_service import PasswordService
from src.services.email_service import EmailService
from src.services.security_service import SecurityService
from src.utils.security import generate_verification_token, get_email_verification_expiry
from src.utils.validators import validate_email_format


class UserService:
    """
    Service for user management operations
    
    Responsibilities:
    - Create users (FR-001)
    - Get user by email/ID
    - Verify email (FR-005, FR-006)
    - Update user profile
    - Delete user (GDPR FR-036)
    - Export user data (GDPR FR-036)
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.password_service = PasswordService()
        self.email_service = EmailService()
        self.security_service = SecurityService(db)
    
    # ========================================================================
    # User Creation (FR-001, FR-005)
    # ========================================================================
    
    async def create_user(
        self,
        email: str,
        password: str,
        consent: bool,
        ip_address: Optional[str] = None
    ) -> tuple[bool, Optional[User], List[str]]:
        """
        Create a new user account (FR-001, FR-005)
        
        Args:
            email: User email address
            password: Plain text password
            consent: GDPR consent
            ip_address: Registration IP address
            
        Returns:
            Tuple of (success: bool, user: User or None, errors: List[str])
            
        Process:
        1. Validate email format (FR-002)
        2. Check for duplicate email (FR-004)
        3. Validate and hash password (FR-003)
        4. Create user in INACTIVE state (FR-005)
        5. Send verification email (FR-006)
        6. Log registration event
        """
        errors = []
        
        # Validate email format (FR-002)
        is_valid_email, normalized_email = validate_email_format(email)
        if not is_valid_email:
            errors.append(f"Invalid email format: {normalized_email}")
            return False, None, errors
        
        # Check for duplicate email (FR-004)
        existing_user = self.get_user_by_email(normalized_email)
        if existing_user:
            errors.append("An account with this email already exists")
            return False, None, errors
        
        # Validate and hash password (FR-003)
        is_valid_pwd, password_hash, pwd_errors = self.password_service.validate_and_hash(
            password, normalized_email
        )
        if not is_valid_pwd:
            return False, None, pwd_errors
        
        # Check consent
        if not consent:
            errors.append("User consent is required for registration")
            return False, None, errors
        
        # Create user (FR-005 - INACTIVE until email verified)
        user = User(
            id=uuid.uuid4(),
            email=normalized_email,
            password_hash=password_hash,
            email_verified=False,
            account_status=AccountStatus.INACTIVE,
            consent_status=consent,
            consent_timestamp=datetime.utcnow()
        )
        
        self.db.add(user)
        self.db.flush()  # Get user.id without committing
        
        # Create verification token
        verification_token = self.create_verification_token(user.id)
        
        # Send verification email (FR-006)
        email_sent = await self.email_service.send_verification_email(
            to_email=normalized_email,
            verification_token=verification_token.token
        )
        
        # Log registration
        self.security_service.log_event(
            event_type=EventType.REGISTRATION,
            result=EventResult.SUCCESS,
            user_id=user.id,
            ip_address=ip_address,
            additional_context={"email_sent": email_sent}
        )
        
        self.db.commit()
        
        return True, user, []
    
    # ========================================================================
    # User Retrieval
    # ========================================================================
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email address
        
        Args:
            email: Email address (will be normalized)
            
        Returns:
            User instance or None
        """
        normalized_email = email.lower()
        return self.db.query(User).filter(
            User.email == normalized_email
        ).first()
    
    def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        """
        Get user by ID
        
        Args:
            user_id: User UUID
            
        Returns:
            User instance or None
        """
        return self.db.query(User).filter(User.id == user_id).first()
    
    # ========================================================================
    # Email Verification (FR-006)
    # ========================================================================
    
    def create_verification_token(self, user_id: uuid.UUID) -> VerificationToken:
        """
        Create email verification token
        
        Args:
            user_id: User UUID
            
        Returns:
            VerificationToken instance
        """
        token = VerificationToken(
            id=uuid.uuid4(),
            token=generate_verification_token(),
            user_id=user_id,
            token_type=TokenPurpose.EMAIL_VERIFICATION,
            created_at=datetime.utcnow(),
            expires_at=get_email_verification_expiry(),
            used=False
        )
        
        self.db.add(token)
        self.db.commit()
        
        return token
    
    def verify_email(
        self,
        token_str: str,
        ip_address: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Verify user email using verification token
        
        Args:
            token_str: Verification token string
            ip_address: IP address for logging
            
        Returns:
            Tuple of (success: bool, error_message: str or None)
        """
        # Find token
        token = self.db.query(VerificationToken).filter(
            VerificationToken.token == token_str,
            VerificationToken.token_type == TokenPurpose.EMAIL_VERIFICATION
        ).first()
        
        if not token:
            return False, "Invalid verification token"
        
        # Check if already used
        if token.used:
            return False, "This verification link has already been used"
        
        # Check expiration
        if not token.is_valid():
            return False, "Verification link has expired. Please request a new one."
        
        # Get user
        user = self.get_user_by_id(token.user_id)
        if not user:
            return False, "User not found"
        
        # Mark email as verified
        user.email_verified = True
        user.account_status = AccountStatus.ACTIVE
        
        # Mark token as used
        token.mark_as_used()
        
        # Log verification
        self.security_service.log_event(
            event_type=EventType.EMAIL_VERIFICATION,
            result=EventResult.SUCCESS,
            user_id=user.id,
            ip_address=ip_address
        )
        
        self.db.commit()
        
        return True, None
    
    # ========================================================================
    # User Updates
    # ========================================================================
    
    def update_last_login(self, user: User) -> None:
        """
        Update last login timestamp
        
        Args:
            user: User instance
        """
        user.last_login_timestamp = datetime.utcnow()
        self.db.commit()
    
    def update_password(
        self,
        user: User,
        new_password_hash: str,
        ip_address: Optional[str] = None
    ) -> None:
        """
        Update user password (FR-021)
        
        Args:
            user: User instance
            new_password_hash: New hashed password
            ip_address: IP address for logging
        """
        user.password_hash = new_password_hash
        user.last_password_change = datetime.utcnow()
        
        # Log password change
        self.security_service.log_event(
            event_type=EventType.PASSWORD_CHANGE,
            result=EventResult.SUCCESS,
            user_id=user.id,
            ip_address=ip_address
        )
        
        self.db.commit()
    
    # ========================================================================
    # GDPR Operations (FR-036)
    # ========================================================================
    
    def export_user_data(self, user_id: uuid.UUID) -> Dict:
        """
        Export all user data (GDPR Right to Access)
        
        Args:
            user_id: User UUID
            
        Returns:
            Dict with all user data
        """
        user = self.get_user_by_id(user_id)
        if not user:
            return {}
        
        # Get related data
        security_logs = self.security_service.get_user_security_logs(user_id)
        
        # Log data export request
        self.security_service.log_event(
            event_type=EventType.DATA_EXPORT_REQUEST,
            result=EventResult.SUCCESS,
            user_id=user_id
        )
        
        return {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "email_verified": user.email_verified,
                "account_status": user.account_status.value,
                "registration_timestamp": user.registration_timestamp.isoformat(),
                "last_login_timestamp": user.last_login_timestamp.isoformat() if user.last_login_timestamp else None,
                "last_password_change": user.last_password_change.isoformat(),
                "consent_timestamp": user.consent_timestamp.isoformat(),
                "consent_status": user.consent_status,
            },
            "security_logs": [
                {
                    "timestamp": log.timestamp.isoformat(),
                    "event_type": log.event_type.value,
                    "result": log.result.value,
                    "ip_address": log.ip_address,
                }
                for log in security_logs
            ],
            "export_timestamp": datetime.utcnow().isoformat()
        }
    
    def delete_user_account(
        self,
        user_id: uuid.UUID,
        ip_address: Optional[str] = None
    ) -> tuple[bool, datetime]:
        """
        Mark user account for deletion (GDPR Right to Deletion)
        
        Args:
            user_id: User UUID
            ip_address: IP address for logging
            
        Returns:
            Tuple of (success: bool, permanent_deletion_date: datetime)
            
        Note:
            - Soft delete: marks account as DELETED
            - 30-day grace period before permanent deletion
            - User can cancel by logging in during grace period
        """
        user = self.get_user_by_id(user_id)
        if not user:
            return False, datetime.utcnow()
        
        # Mark as deleted (soft delete)
        user.account_status = AccountStatus.DELETED
        deletion_date = datetime.utcnow() + timedelta(days=30)
        
        # Log deletion request
        self.security_service.log_event(
            event_type=EventType.DATA_DELETION_REQUEST,
            result=EventResult.SUCCESS,
            user_id=user_id,
            ip_address=ip_address,
            additional_context={
                "permanent_deletion_date": deletion_date.isoformat(),
                "grace_period_days": 30
            }
        )
        
        self.db.commit()
        
        return True, deletion_date













