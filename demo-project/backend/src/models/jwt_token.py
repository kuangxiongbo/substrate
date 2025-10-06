"""
JWTToken Model
Tracks refresh tokens and revoked access tokens
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from src.database import Base


class TokenType(enum.Enum):
    """JWT token type enum"""
    ACCESS = "access"
    REFRESH = "refresh"


class JWTToken(Base):
    """
    JWT Token model for session tracking
    
    Purpose:
    - Track refresh tokens (stored value)
    - Blacklist revoked access tokens (by JTI)
    - Enable token rotation for security
    - Support logout and password change invalidation
    """
    __tablename__ = "jwt_tokens"
    
    # Primary Key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Token record identifier"
    )
    
    # JWT ID (for access tokens when revoked)
    jti = Column(
        String(36),
        unique=True,
        nullable=False,
        index=True,
        comment="JWT ID claim (for blacklisting)"
    )
    
    # User Reference
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Associated user"
    )
    
    # Token Type
    token_type = Column(
        SQLEnum(TokenType),
        nullable=False,
        comment="Token type: access or refresh"
    )
    
    # Refresh Token Value (null for access tokens)
    token_value = Column(
        String(512),
        nullable=True,
        comment="Refresh token value (null for access tokens in blacklist)"
    )
    
    # Timestamps
    issued_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Token issue time"
    )
    
    expires_at = Column(
        DateTime,
        nullable=False,
        index=True,
        comment="Token expiration time"
    )
    
    # Revocation
    revoked = Column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
        comment="Token revocation status"
    )
    
    revoked_at = Column(
        DateTime,
        nullable=True,
        comment="When token was revoked"
    )
    
    # Device Tracking (optional)
    device_info = Column(
        String(255),
        nullable=True,
        comment="User-agent for tracking sessions"
    )
    
    # Record Management
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Record creation timestamp"
    )
    
    # Relationships
    user = relationship("User", backref="tokens")
    
    def __repr__(self):
        return f"<JWTToken(id={self.id}, type={self.token_type.value}, revoked={self.revoked})>"
    
    def is_valid(self) -> bool:
        """Check if token is still valid"""
        if self.revoked:
            return False
        
        if datetime.utcnow() >= self.expires_at:
            return False
        
        return True
    
    def revoke(self):
        """Revoke this token"""
        self.revoked = True
        self.revoked_at = datetime.utcnow()

