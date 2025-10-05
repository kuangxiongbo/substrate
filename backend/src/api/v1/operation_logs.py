"""
操作日志API
提供用户操作日志的查询、过滤和导出功能
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
import csv
import io
import json

from ...database import get_db
from ...models.user import User
from ...models.operation_log import OperationLog
from ...schemas.operation_log import OperationLogResponse, OperationLogListResponse
from ...dependencies import get_current_user
from ...utils.security import require_permissions

router = APIRouter()

@router.get("/", response_model=OperationLogListResponse)
async def get_operation_logs(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(10, ge=1, le=100, description="每页数量"),
    action: Optional[str] = Query(None, description="操作类型过滤"),
    result: Optional[str] = Query(None, description="结果过滤"),
    start_date: Optional[datetime] = Query(None, description="开始日期"),
    end_date: Optional[datetime] = Query(None, description="结束日期"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的操作日志
    """
    try:
        # 构建查询条件
        query = db.query(OperationLog).filter(
            OperationLog.user_id == current_user.id
        )
        
        # 操作类型过滤
        if action and action != 'all':
            query = query.filter(OperationLog.action == action)
        
        # 结果过滤
        if result and result != 'all':
            query = query.filter(OperationLog.result == result)
        
        # 日期范围过滤
        if start_date:
            query = query.filter(OperationLog.created_at >= start_date)
        if end_date:
            query = query.filter(OperationLog.created_at <= end_date)
        
        # 搜索过滤
        if search:
            search_filter = or_(
                OperationLog.action.ilike(f'%{search}%'),
                OperationLog.resource.ilike(f'%{search}%'),
                OperationLog.details.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        
        # 排序和分页
        total = query.count()
        logs = query.order_by(desc(OperationLog.created_at)).offset(
            (page - 1) * size
        ).limit(size).all()
        
        # 转换为响应格式
        log_responses = []
        for log in logs:
            log_responses.append(OperationLogResponse(
                id=log.id,
                timestamp=log.created_at.isoformat(),
                user_id=log.user_id,
                user_name=current_user.name,
                action=log.action,
                resource=log.resource,
                result=log.result,
                ip_address=log.ip_address,
                user_agent=log.user_agent,
                details=log.details
            ))
        
        return OperationLogListResponse(
            logs=log_responses,
            total=total,
            page=page,
            size=size,
            pages=(total + size - 1) // size
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取操作日志失败: {str(e)}")

@router.get("/export")
async def export_operation_logs(
    action: Optional[str] = Query(None, description="操作类型过滤"),
    result: Optional[str] = Query(None, description="结果过滤"),
    start_date: Optional[datetime] = Query(None, description="开始日期"),
    end_date: Optional[datetime] = Query(None, description="结束日期"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    导出当前用户的操作日志为CSV文件
    """
    try:
        # 构建查询条件（与get_operation_logs相同）
        query = db.query(OperationLog).filter(
            OperationLog.user_id == current_user.id
        )
        
        if action and action != 'all':
            query = query.filter(OperationLog.action == action)
        
        if result and result != 'all':
            query = query.filter(OperationLog.result == result)
        
        if start_date:
            query = query.filter(OperationLog.created_at >= start_date)
        if end_date:
            query = query.filter(OperationLog.created_at <= end_date)
        
        if search:
            search_filter = or_(
                OperationLog.action.ilike(f'%{search}%'),
                OperationLog.resource.ilike(f'%{search}%'),
                OperationLog.details.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        
        # 获取所有符合条件的日志
        logs = query.order_by(desc(OperationLog.created_at)).all()
        
        # 创建CSV内容
        output = io.StringIO()
        writer = csv.writer(output)
        
        # 写入表头
        writer.writerow([
            '时间', '用户', '操作', '资源', '结果', 'IP地址', '用户代理', '详情'
        ])
        
        # 写入数据
        for log in logs:
            writer.writerow([
                log.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                current_user.name,
                log.action,
                log.resource,
                log.result,
                log.ip_address,
                log.user_agent,
                log.details
            ])
        
        # 重置文件指针
        output.seek(0)
        
        # 创建响应
        filename = f"operation_logs_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8')),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"导出操作日志失败: {str(e)}")

@router.delete("/{log_id}")
async def delete_operation_log(
    log_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    删除指定的操作日志（仅限当前用户的日志）
    """
    try:
        log = db.query(OperationLog).filter(
            OperationLog.id == log_id,
            OperationLog.user_id == current_user.id
        ).first()
        
        if not log:
            raise HTTPException(status_code=404, detail="操作日志不存在")
        
        db.delete(log)
        db.commit()
        
        return {"message": "操作日志删除成功"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除操作日志失败: {str(e)}")

@router.delete("/")
async def clear_operation_logs(
    days: int = Query(30, ge=1, le=365, description="保留天数"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    清理指定天数之前的操作日志
    """
    try:
        cutoff_date = datetime.now() - timedelta(days=days)
        
        deleted_count = db.query(OperationLog).filter(
            OperationLog.user_id == current_user.id,
            OperationLog.created_at < cutoff_date
        ).delete()
        
        db.commit()
        
        return {
            "message": f"成功清理 {deleted_count} 条操作日志",
            "deleted_count": deleted_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"清理操作日志失败: {str(e)}")
