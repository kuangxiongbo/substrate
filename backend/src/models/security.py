"""
安全相关数据模型
包括登录尝试记录、IP冻结记录等
"""
from datetime import datetime, timedelta
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from src.database import Base

class LoginAttemptResult(enum.Enum):
    """登录尝试结果枚举"""
    SUCCESS = "success"
    FAILED_PASSWORD = "failed_password"
    FAILED_CAPTCHA = "failed_captcha"
    ACCOUNT_LOCKED = "account_locked"
    IP_FROZEN = "ip_frozen"
    ACCOUNT_INACTIVE = "account_inactive"

class SecurityLevel(enum.Enum):
    """安全策略级别枚举"""
    BASIC = "basic"
    ADVANCED = "advanced"

class LoginAttempt(Base):
    """
    登录尝试记录表
    记录所有登录尝试，用于安全策略分析
    """
    __tablename__ = "login_attempts"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="唯一标识符"
    )
    
    # 用户信息
    user_id = Column(
        UUID(as_uuid=True),
        nullable=True,
        comment="用户ID（登录失败时可能为空）"
    )
    
    email = Column(
        String(255),
        nullable=True,
        comment="尝试登录的邮箱"
    )
    
    # 网络信息
    ip_address = Column(
        String(45),
        nullable=False,
        comment="IP地址（支持IPv6）"
    )
    
    user_agent = Column(
        Text,
        nullable=True,
        comment="用户代理字符串"
    )
    
    # 登录结果
    result = Column(
        String(50),
        nullable=False,
        comment="登录结果"
    )
    
    failure_reason = Column(
        String(255),
        nullable=True,
        comment="失败原因"
    )
    
    # 验证码信息
    captcha_required = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="是否需要验证码"
    )
    
    captcha_verified = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="验证码是否验证通过"
    )
    
    # 时间戳
    attempt_time = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="尝试时间"
    )
    
    # 索引
    __table_args__ = (
        Index('idx_login_attempts_ip_time', 'ip_address', 'attempt_time'),
        Index('idx_login_attempts_email_time', 'email', 'attempt_time'),
        Index('idx_login_attempts_user_time', 'user_id', 'attempt_time'),
    )

    def __repr__(self):
        return f"<LoginAttempt(id={self.id}, email={self.email}, ip={self.ip_address}, result={self.result})>"

class IPFreeze(Base):
    """
    IP冻结记录表
    记录被冻结的IP地址及其相关信息
    """
    __tablename__ = "ip_freezes"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="唯一标识符"
    )
    
    # IP信息
    ip_address = Column(
        String(45),
        nullable=False,
        unique=True,
        comment="被冻结的IP地址"
    )
    
    # 冻结原因
    reason = Column(
        String(255),
        nullable=False,
        comment="冻结原因"
    )
    
    # 冻结时间
    frozen_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="冻结时间"
    )
    
    # 解冻时间
    unfreeze_at = Column(
        DateTime,
        nullable=False,
        comment="自动解冻时间"
    )
    
    # 手动解冻
    manually_unfrozen = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="是否手动解冻"
    )
    
    unfrozen_by = Column(
        UUID(as_uuid=True),
        nullable=True,
        comment="解冻操作员ID"
    )
    
    unfrozen_at = Column(
        DateTime,
        nullable=True,
        comment="解冻时间"
    )
    
    # 统计信息
    failed_attempts = Column(
        Integer,
        default=0,
        nullable=False,
        comment="失败尝试次数"
    )
    
    # 索引
    __table_args__ = (
        Index('idx_ip_freezes_ip', 'ip_address'),
        Index('idx_ip_freezes_time', 'frozen_at'),
    )

    def is_frozen(self) -> bool:
        """检查IP是否仍然被冻结"""
        if self.manually_unfrozen:
            return False
        
        return datetime.utcnow() < self.unfreeze_at

    def __repr__(self):
        return f"<IPFreeze(id={self.id}, ip={self.ip_address}, frozen_at={self.frozen_at})>"

class EmailVerificationLimit(Base):
    """
    邮箱验证码频率限制表
    防止暴力注册和验证码滥用
    """
    __tablename__ = "email_verification_limits"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="唯一标识符"
    )
    
    # 限制类型
    limit_type = Column(
        String(50),
        nullable=False,
        comment="限制类型：email, ip, global"
    )
    
    # 限制标识
    identifier = Column(
        String(255),
        nullable=False,
        comment="限制标识（邮箱、IP或global）"
    )
    
    # 计数信息
    request_count = Column(
        Integer,
        default=0,
        nullable=False,
        comment="请求次数"
    )
    
    # 时间窗口
    window_start = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="时间窗口开始时间"
    )
    
    window_end = Column(
        DateTime,
        nullable=False,
        comment="时间窗口结束时间"
    )
    
    # 最后请求时间
    last_request = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="最后请求时间"
    )
    
    # 索引
    __table_args__ = (
        Index('idx_email_limits_type_id', 'limit_type', 'identifier'),
        Index('idx_email_limits_time', 'window_start', 'window_end'),
    )

    def is_within_limit(self, max_requests: int) -> bool:
        """检查是否在限制范围内"""
        return self.request_count < max_requests

    def reset_window(self, window_duration: timedelta):
        """重置时间窗口"""
        self.window_start = datetime.utcnow()
        self.window_end = self.window_start + window_duration
        self.request_count = 0

    def __repr__(self):
        return f"<EmailVerificationLimit(id={self.id}, type={self.limit_type}, identifier={self.identifier}, count={self.request_count})>"
