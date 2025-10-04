"""
User Model
Represents a registered account holder
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, Enum as SQLEnum, Table, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from src.database import Base


class AccountStatus(enum.Enum):
    """User account status enum"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    LOCKED = "locked"
    DELETED = "deleted"


class User(Base):
    """
    User model for authentication system
    
    State Transitions:
    - inactive → active (email verification)
    - active → locked (5 failed logins)
    - locked → active (lockout expiration)
    - * → deleted (user deletion request)
    """
    __tablename__ = "users"
    
    # Primary Key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Unique user identifier"
    )
    
    # Authentication
    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="User email address (lowercase normalized)"
    )
    
    password_hash = Column(
        String(255),
        nullable=False,
        comment="Argon2id hashed password"
    )
    
    # Email Verification
    email_verified = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Email verification status"
    )
    
    # Account Status
    account_status = Column(
        SQLEnum(AccountStatus),
        default=AccountStatus.INACTIVE,
        nullable=False,
        index=True,
        comment="Account status: active|inactive|locked|deleted"
    )
    
    # Security: Account Lockout
    failed_login_attempts = Column(
        Integer,
        default=0,
        nullable=False,
        comment="Consecutive failed login counter"
    )
    
    account_locked_until = Column(
        DateTime,
        nullable=True,
        comment="Lockout expiration timestamp (30 min after 5 failures)"
    )
    
    # Timestamps
    registration_timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Account creation time"
    )
    
    last_login_timestamp = Column(
        DateTime,
        nullable=True,
        comment="Last successful login time"
    )
    
    last_password_change = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Last password update time"
    )
    
    # GDPR Compliance
    consent_timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="GDPR data processing consent timestamp"
    )
    
    consent_status = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Data processing consent status"
    )
    
    # User Preferences
    theme_preference = Column(
        String(20),
        default='auto',
        nullable=False,
        comment="User theme preference: light, dark, or auto"
    )
    
    layout_preference = Column(
        String(20),
        default='sidebar',
        nullable=False,
        comment="User layout preference: sidebar, top, or auto"
    )
    
    follow_system_theme = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether to follow system theme preference"
    )
    
    remember_preferences = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether to remember user preferences"
    )
    
    custom_theme_config = Column(
        String(1000),
        nullable=True,
        comment="Custom theme configuration (JSON string)"
    )
    
    custom_layout_config = Column(
        String(1000),
        nullable=True,
        comment="Custom layout configuration (JSON string)"
    )
    
    preferences_updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Last preferences update time"
    )
    
    # Record Management
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Record creation timestamp"
    )
    
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
        comment="Record last update timestamp"
    )
    
    # 角色关系 (延迟定义避免循环导入)
    roles = relationship("Role", secondary="user_roles", back_populates="users")
    
    # 用户偏好关系
    preferences = relationship("UserPreferences", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, status={self.account_status.value})>"
    
    def is_active(self) -> bool:
        """Check if account is active and not locked"""
        if self.account_status != AccountStatus.ACTIVE:
            return False
        
        if self.account_locked_until:
            if datetime.utcnow() < self.account_locked_until:
                return False
        
        return True
    
    def is_locked(self) -> bool:
        """Check if account is currently locked"""
        if self.account_status == AccountStatus.LOCKED:
            return True
        
        if self.account_locked_until and datetime.utcnow() < self.account_locked_until:
            return True
        
        return False
    
    # 角色关系 (延迟导入避免循环依赖)
    def get_roles(self):
        """获取用户角色"""
        from src.models.role import user_roles, Role
        return self.roles
    
    def has_role(self, role_name: str) -> bool:
        """检查用户是否具有指定角色"""
        return any(role.name == role_name for role in self.roles)
    
    def has_permission(self, permission_name: str) -> bool:
        """检查用户是否具有指定权限"""
        for role in self.roles:
            if any(perm.name == permission_name for perm in role.permissions):
                return True
        return False
    
    def is_super_admin(self) -> bool:
        """检查是否为超级管理员"""
        return self.has_role('super_admin')











