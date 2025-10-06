"""
SecurityLog Model
Security audit trail for authentication events
"""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from src.database import Base


class EventType(enum.Enum):
    """Security event type enum"""
    # Authentication Events
    LOGIN_SUCCESS = "login_success"
    LOGIN_FAILED = "login_failed"
    LOGOUT = "logout"
    
    # Registration & Verification
    REGISTRATION = "registration"
    EMAIL_VERIFICATION = "email_verification"
    
    # Password Management
    PASSWORD_CHANGE = "password_change"
    PASSWORD_RESET_REQUESTED = "password_reset_requested"
    PASSWORD_RESET_COMPLETED = "password_reset_completed"
    
    # Account Security
    ACCOUNT_LOCKED = "account_locked"
    ACCOUNT_UNLOCKED = "account_unlocked"
    
    # Token Management
    TOKEN_REFRESH = "token_refresh"
    INVALID_TOKEN = "invalid_token"
    
    # Rate Limiting
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
    
    # GDPR
    DATA_EXPORT_REQUEST = "data_export_request"
    DATA_DELETION_REQUEST = "data_deletion_request"


class EventResult(enum.Enum):
    """Event result enum"""
    SUCCESS = "success"
    FAILURE = "failure"


class SecurityLog(Base):
    """
    Security Log model for audit trail
    
    Purpose:
    - Track all authentication and security events
    - 90-day retention for compliance
    - Support security analysis and monitoring
    - GDPR audit trail
    
    Retention: 90 days (partitioned by month)
    """
    __tablename__ = "security_logs"
    
    # Primary Key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Log entry identifier"
    )
    
    # Event Information
    event_type = Column(
        SQLEnum(EventType),
        nullable=False,
        index=True,
        comment="Type of security event"
    )
    
    # User Reference (nullable for anonymous events)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Associated user (null for failed logins with unknown email)"
    )
    
    # Timestamp
    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
        comment="Event occurrence time"
    )
    
    # Client Information
    ip_address = Column(
        String(45),  # IPv6 max length
        nullable=True,
        comment="Source IP address (IPv4 or IPv6)"
    )
    
    user_agent = Column(
        String(512),
        nullable=True,
        comment="Client user agent string"
    )
    
    # Result
    result = Column(
        SQLEnum(EventResult),
        nullable=False,
        comment="Event result: success or failure"
    )
    
    failure_reason = Column(
        String(255),
        nullable=True,
        comment="Reason for failure (if applicable)"
    )
    
    # Additional Context (JSONB for flexibility)
    additional_context = Column(
        JSON,
        nullable=True,
        comment="Extra event data (JSON format)"
    )
    
    # Relationships
    user = relationship("User", backref="security_logs")
    
    def __repr__(self):
        return f"<SecurityLog(id={self.id}, event={self.event_type.value}, result={self.result.value})>"
    
    @classmethod
    def create_log(
        cls,
        event_type: EventType,
        result: EventResult,
        user_id: uuid.UUID = None,
        ip_address: str = None,
        user_agent: str = None,
        failure_reason: str = None,
        additional_context: dict = None
    ):
        """
        Factory method to create a security log entry
        
        Usage:
            log = SecurityLog.create_log(
                event_type=EventType.LOGIN_SUCCESS,
                result=EventResult.SUCCESS,
                user_id=user.id,
                ip_address=request.client.host
            )
        """
        return cls(
            event_type=event_type,
            result=result,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            failure_reason=failure_reason,
            additional_context=additional_context
        )

