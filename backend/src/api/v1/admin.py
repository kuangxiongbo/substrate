"""
Admin API Endpoints
超级管理员系统管理接口
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from src.database import get_db
from src.models import User, SystemConfig, Role, Permission
from src.services.auth_service import AuthService
from src.utils.security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

# Pydantic 模型
class SystemConfigResponse(BaseModel):
    id: str
    key: str
    value: str
    value_type: str
    category: str
    description: Optional[str]
    is_encrypted: bool
    is_public: bool
    created_at: str
    updated_at: Optional[str]

class SystemConfigUpdate(BaseModel):
    value: str

class SystemConfigCreate(BaseModel):
    key: str
    value: str
    value_type: str = "string"
    category: str
    description: Optional[str] = None
    is_encrypted: bool = False
    is_public: bool = False

class UserResponse(BaseModel):
    id: str
    email: str
    email_verified: bool
    account_status: str
    failed_login_attempts: int
    account_locked_until: Optional[str]
    registration_timestamp: str
    last_login_timestamp: Optional[str]
    roles: List[str]
    created_at: str
    updated_at: Optional[str]

class UserUpdate(BaseModel):
    email_verified: Optional[bool] = None
    account_status: Optional[str] = None

class RoleResponse(BaseModel):
    id: str
    name: str
    display_name: str
    description: Optional[str]
    is_system: bool
    is_active: bool
    permissions: List[str]
    created_at: str
    updated_at: Optional[str]

class PermissionResponse(BaseModel):
    id: str
    name: str
    display_name: str
    description: Optional[str]
    resource: str
    action: str
    is_system: bool
    is_active: bool
    created_at: str
    updated_at: Optional[str]

# 权限检查装饰器
def require_permission(permission_name: str):
    """权限检查装饰器"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="未认证"
                )
            
            if not current_user.has_permission(permission_name):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"需要权限: {permission_name}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# 系统配置管理
@router.get("/configs", response_model=List[SystemConfigResponse])
async def get_system_configs(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取系统配置列表"""
    if not current_user.has_permission("system.config.read"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要系统配置查看权限"
        )
    
    query = db.query(SystemConfig)
    if category:
        query = query.filter(SystemConfig.category == category)
    
    configs = query.all()
    return [
        SystemConfigResponse(
            id=str(config.id),
            key=config.key,
            value=config.value,
            value_type=config.value_type,
            category=config.category,
            description=config.description,
            is_encrypted=config.is_encrypted,
            is_public=config.is_public,
            created_at=config.created_at.isoformat(),
            updated_at=config.updated_at.isoformat() if config.updated_at else None
        )
        for config in configs
    ]

@router.get("/configs/{config_key}", response_model=SystemConfigResponse)
async def get_system_config(
    config_key: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定系统配置"""
    if not current_user.has_permission("system.config.read"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要系统配置查看权限"
        )
    
    config = db.query(SystemConfig).filter(SystemConfig.key == config_key).first()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="配置不存在"
        )
    
    return SystemConfigResponse(
        id=str(config.id),
        key=config.key,
        value=config.value,
        value_type=config.value_type,
        category=config.category,
        description=config.description,
        is_encrypted=config.is_encrypted,
        is_public=config.is_public,
        created_at=config.created_at.isoformat(),
        updated_at=config.updated_at.isoformat() if config.updated_at else None
    )

@router.put("/configs/{config_key}", response_model=SystemConfigResponse)
async def update_system_config(
    config_key: str,
    config_update: SystemConfigUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新系统配置"""
    if not current_user.has_permission("system.config.update"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要系统配置修改权限"
        )
    
    config = db.query(SystemConfig).filter(SystemConfig.key == config_key).first()
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="配置不存在"
        )
    
    config.value = config_update.value
    db.commit()
    db.refresh(config)
    
    return SystemConfigResponse(
        id=str(config.id),
        key=config.key,
        value=config.value,
        value_type=config.value_type,
        category=config.category,
        description=config.description,
        is_encrypted=config.is_encrypted,
        is_public=config.is_public,
        created_at=config.created_at.isoformat(),
        updated_at=config.updated_at.isoformat() if config.updated_at else None
    )

# 用户管理
@router.get("/users", response_model=List[UserResponse])
async def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取用户列表"""
    if not current_user.has_permission("user.read"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要用户查看权限"
        )
    
    users = db.query(User).all()
    return [
        UserResponse(
            id=str(user.id),
            email=user.email,
            email_verified=user.email_verified,
            account_status=user.account_status.value,
            failed_login_attempts=user.failed_login_attempts,
            account_locked_until=user.account_locked_until.isoformat() if user.account_locked_until else None,
            registration_timestamp=user.registration_timestamp.isoformat(),
            last_login_timestamp=user.last_login_timestamp.isoformat() if user.last_login_timestamp else None,
            roles=[role.name for role in user.roles],
            created_at=user.created_at.isoformat(),
            updated_at=user.updated_at.isoformat() if user.updated_at else None
        )
        for user in users
    ]

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定用户信息"""
    if not current_user.has_permission("user.read"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要用户查看权限"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        email_verified=user.email_verified,
        account_status=user.account_status.value,
        failed_login_attempts=user.failed_login_attempts,
        account_locked_until=user.account_locked_until.isoformat() if user.account_locked_until else None,
        registration_timestamp=user.registration_timestamp.isoformat(),
        last_login_timestamp=user.last_login_timestamp.isoformat() if user.last_login_timestamp else None,
        roles=[role.name for role in user.roles],
        created_at=user.created_at.isoformat(),
        updated_at=user.updated_at.isoformat() if user.updated_at else None
    )

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新用户信息"""
    if not current_user.has_permission("user.update"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要用户修改权限"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    if user_update.email_verified is not None:
        user.email_verified = user_update.email_verified
    
    if user_update.account_status is not None:
        from src.models import AccountStatus
        user.account_status = AccountStatus(user_update.account_status)
    
    db.commit()
    db.refresh(user)
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        email_verified=user.email_verified,
        account_status=user.account_status.value,
        failed_login_attempts=user.failed_login_attempts,
        account_locked_until=user.account_locked_until.isoformat() if user.account_locked_until else None,
        registration_timestamp=user.registration_timestamp.isoformat(),
        last_login_timestamp=user.last_login_timestamp.isoformat() if user.last_login_timestamp else None,
        roles=[role.name for role in user.roles],
        created_at=user.created_at.isoformat(),
        updated_at=user.updated_at.isoformat() if user.updated_at else None
    )

# 角色管理
@router.get("/roles", response_model=List[RoleResponse])
async def get_roles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取角色列表"""
    if not current_user.has_permission("role.read"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要角色查看权限"
        )
    
    roles = db.query(Role).all()
    return [
        RoleResponse(
            id=str(role.id),
            name=role.name,
            display_name=role.display_name,
            description=role.description,
            is_system=role.is_system,
            is_active=role.is_active,
            permissions=[perm.name for perm in role.permissions],
            created_at=role.created_at.isoformat(),
            updated_at=role.updated_at.isoformat() if role.updated_at else None
        )
        for role in roles
    ]

# 权限管理
@router.get("/permissions", response_model=List[PermissionResponse])
async def get_permissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取权限列表"""
    if not current_user.has_permission("role.read"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要角色查看权限"
        )
    
    permissions = db.query(Permission).all()
    return [
        PermissionResponse(
            id=str(perm.id),
            name=perm.name,
            display_name=perm.display_name,
            description=perm.description,
            resource=perm.resource,
            action=perm.action,
            is_system=perm.is_system,
            is_active=perm.is_active,
            created_at=perm.created_at.isoformat(),
            updated_at=perm.updated_at.isoformat() if perm.updated_at else None
        )
        for perm in permissions
    ]

# 系统统计
@router.get("/stats")
async def get_system_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取系统统计信息"""
    if not current_user.has_permission("system.config.read"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要系统配置查看权限"
        )
    
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.account_status == "active").count()
    total_roles = db.query(Role).count()
    total_permissions = db.query(Permission).count()
    total_configs = db.query(SystemConfig).count()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_roles": total_roles,
        "total_permissions": total_permissions,
        "total_configs": total_configs
    }
