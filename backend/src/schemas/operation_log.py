"""
操作日志数据模式
定义操作日志的请求和响应数据结构
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from ..models.operation_log import OperationResult

class OperationLogBase(BaseModel):
    """操作日志基础模式"""
    action: str = Field(..., description="操作类型")
    resource: str = Field(..., description="操作的资源")
    result: OperationResult = Field(..., description="操作结果")
    details: Optional[str] = Field(None, description="操作详情")
    ip_address: Optional[str] = Field(None, description="IP地址")
    user_agent: Optional[str] = Field(None, description="用户代理")

class OperationLogCreate(OperationLogBase):
    """创建操作日志请求模式"""
    user_id: str = Field(..., description="用户ID")

class OperationLogResponse(OperationLogBase):
    """操作日志响应模式"""
    id: str = Field(..., description="日志ID")
    timestamp: str = Field(..., description="操作时间")
    user_id: str = Field(..., description="用户ID")
    user_name: str = Field(..., description="用户名")
    
    class Config:
        from_attributes = True

class OperationLogListResponse(BaseModel):
    """操作日志列表响应模式"""
    logs: List[OperationLogResponse] = Field(..., description="日志列表")
    total: int = Field(..., description="总数量")
    page: int = Field(..., description="当前页码")
    size: int = Field(..., description="每页数量")
    pages: int = Field(..., description="总页数")

class OperationLogFilter(BaseModel):
    """操作日志过滤条件"""
    action: Optional[str] = Field(None, description="操作类型过滤")
    result: Optional[str] = Field(None, description="结果过滤")
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    search: Optional[str] = Field(None, description="搜索关键词")
    page: int = Field(1, ge=1, description="页码")
    size: int = Field(10, ge=1, le=100, description="每页数量")

class OperationLogExportRequest(BaseModel):
    """操作日志导出请求"""
    action: Optional[str] = Field(None, description="操作类型过滤")
    result: Optional[str] = Field(None, description="结果过滤")
    start_date: Optional[datetime] = Field(None, description="开始日期")
    end_date: Optional[datetime] = Field(None, description="结束日期")
    search: Optional[str] = Field(None, description="搜索关键词")
    format: str = Field("csv", description="导出格式")
