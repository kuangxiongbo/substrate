"""
VerificationToken Model
Email verification and password reset tokens
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from src.database import Base


class TokenPurpose(enum.Enum):
    """Verification token purpose enum"""
    EMAIL_VERIFICATION = "email_verification"
    PASSWORD_RESET = "password_reset"


class VerificationToken(Base):
    """
    Verification Token model
    
    Purpose:
    - Email verification (24-hour expiration)
    - Password reset (1-hour expiration)
    - One-time use tokens
    - Secure random token generation
    """
    __tablename__ = "verification_tokens"
    
    # Primary Key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Token record identifier"
    )
    
    # Token Value (secure random string)
    token = Column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
        comment="Cryptographically secure random token"
    )
    
    # User Reference
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Associated user"
    )
    
    # Token Purpose
    token_type = Column(
        SQLEnum(TokenPurpose),
        nullable=False,
        comment="Token purpose: email_verification or password_reset"
    )
    
    # Timestamps
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Token creation time"
    )
    
    expires_at = Column(
        DateTime,
        nullable=False,
        index=True,
        comment="Token expiration time"
    )
    
    # One-time Use
    used = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="One-time use flag"
    )
    
    used_at = Column(
        DateTime,
        nullable=True,
        comment="When token was used"
    )
    
    # Relationships
    user = relationship("User", backref="verification_tokens")
    
    def __repr__(self):
        return f"<VerificationToken(id={self.id}, type={self.token_type.value}, used={self.used})>"
    
    def is_valid(self) -> bool:
        """Check if token is still valid"""
        if self.used:
            return False
        
        if datetime.utcnow() >= self.expires_at:
            return False
        
        return True
    
    def mark_as_used(self):
        """Mark token as used (one-time use)"""
        self.used = True
        self.used_at = datetime.utcnow()
    
    def is_expired(self) -> bool:
        """Check if token is expired"""
        return datetime.utcnow() >= self.expires_at

