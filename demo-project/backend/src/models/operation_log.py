"""
操作日志数据模型
记录用户的各种操作行为
"""

from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from ..database import Base

class OperationResult(str, enum.Enum):
    """操作结果枚举"""
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"

class OperationLog(Base):
    """操作日志模型"""
    __tablename__ = "operation_logs"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Unique operation log identifier"
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
        comment="User who performed the operation"
    )
    
    # 操作信息
    action = Column(String(100), nullable=False, index=True)  # 操作类型，如 LOGIN, LOGOUT, CREATE_USER 等
    resource = Column(String(200), nullable=False)  # 操作的资源，如 auth/login, user/profile 等
    result = Column(Enum(OperationResult), nullable=False, index=True)  # 操作结果
    
    # 详细信息
    details = Column(Text, nullable=True)  # 操作详情描述
    ip_address = Column(String(45), nullable=True)  # IP地址
    user_agent = Column(Text, nullable=True)  # 用户代理
    
    # 时间信息
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # 关联关系
    user = relationship("User", back_populates="operation_logs")

    def __repr__(self):
        return f"<OperationLog(id={self.id}, user_id={self.user_id}, action={self.action}, result={self.result})>"



