"""
Admin API Endpoints
超级管理员系统管理接口
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from src.database import get_db
from src.models.user import User
from src.models.role import Role, Permission, SystemConfig
# from src.services.auth_service import AuthService
# from src.dependencies import get_current_user

# Temporary mock function for development
def get_current_user():
    """Temporary mock function for development"""
    # 创建一个临时的用户对象用于开发测试
    class MockUser:
        def __init__(self):
            self.id = "mock-user-id"
            self.email = "demo@example.com"
            self.roles = []
        
        def has_permission(self, permission):
            return True  # 开发模式下给予所有权限
    
    return MockUser()

router = APIRouter(tags=["admin"])

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
            
            if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission(permission_name):
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
    # current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取系统配置列表"""
    # 从数据库查询配置
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

# 系统统计
@router.get("/stats")
async def get_system_stats():
    """获取系统统计信息"""
    return {
        "total_users": 2,
        "active_users": 2,
        "total_roles": 2,
        "total_configs": 2,
        "system_uptime": "24小时",
        "last_backup": "2025-10-05T09:00:00Z"
    }

# 角色管理
@router.get("/roles")
async def get_roles():
    """获取角色列表"""
    return [
        {
            "id": "role-1",
            "name": "admin",
            "description": "系统管理员",
            "permissions": ["user.read", "user.write", "system.config.read", "system.config.write"]
        },
        {
            "id": "role-2", 
            "name": "user",
            "description": "普通用户",
            "permissions": ["user.read"]
        }
    ]

# 系统配置保存
@router.post("/configs")
async def save_system_configs(
    config_data: dict,
    db: Session = Depends(get_db)
):
    """保存系统配置"""
    category = config_data.get('category', 'basic')
    configs = config_data.get('configs', {})
    
    # 开发模式下暂时跳过所有认证检查
    # 对于基础配置（如语言设置），允许已登录用户保存，无需特殊权限
    if category == 'basic':
        # 开发模式下暂时跳过认证检查
        pass
    else:
        # 其他配置在开发模式下也暂时跳过认证检查
        pass
    
    saved_configs = []
    
    try:
        for key, value in configs.items():
            if value is not None:  # 只保存非空值
                # 查找是否已存在
                existing_config = db.query(SystemConfig).filter(
                    SystemConfig.key == key,
                    SystemConfig.category == category
                ).first()
                
                if existing_config:
                    # 更新现有配置
                    existing_config.value = str(value)
                    existing_config.value_type = 'string'
                    existing_config.updated_at = datetime.utcnow()
                else:
                    # 创建新配置
                    new_config = SystemConfig(
                        key=key,
                        value=str(value),
                        value_type='string',
                        category=category,
                        description=f"系统{key}配置",
                        is_public=True
                    )
                    db.add(new_config)
                
                saved_configs.append(key)
        
        db.commit()
        
        return {
            "success": True,
            "message": f"{category}配置保存成功",
            "saved_configs": saved_configs,
            "category": category
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"保存配置失败: {str(e)}"
        )

@router.get("/configs/{config_key}", response_model=SystemConfigResponse)
async def get_system_config(
    config_key: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定系统配置"""
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("system.config.read"):
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
    # current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新系统配置"""
    # 查找配置项
    config = db.query(SystemConfig).filter(SystemConfig.key == config_key).first()
    
    if not config:
        # 如果配置不存在，创建一个新的
        config = SystemConfig(
            key=config_key,
            value=config_update.value,
            value_type="string",
            category="basic",
            description=f"{config_key}配置",
            is_encrypted=False,
            is_public=True
        )
        db.add(config)
    else:
        # 更新现有配置
        config.value = config_update.value
        config.updated_at = datetime.now()
    
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
    # db: Session = Depends(get_db)
):
    """获取用户列表"""
    # 临时简化权限检查
    # if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("user.read"):
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="需要用户查看权限"
    #     )
    
    # 临时返回模拟数据，直到数据库连接正常
    from datetime import datetime
    return [
        UserResponse(
            id="550e8400-e29b-41d4-a716-446655440000",
            email="superadmin@system.com",
            email_verified=True,
            account_status="active",
            failed_login_attempts=0,
            account_locked_until=None,
            registration_timestamp=datetime.now().isoformat(),
            last_login_timestamp=datetime.now().isoformat(),
            roles=["super_admin"],
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat()
        ),
        UserResponse(
            id="550e8400-e29b-41d4-a716-446655440001",
            email="admin@system.com",
            email_verified=True,
            account_status="active",
            failed_login_attempts=0,
            account_locked_until=None,
            registration_timestamp=datetime.now().isoformat(),
            last_login_timestamp=datetime.now().isoformat(),
            roles=["admin"],
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat()
        ),
        UserResponse(
            id="550e8400-e29b-41d4-a716-446655440002",
            email="demo@example.com",
            email_verified=True,
            account_status="active",
            failed_login_attempts=0,
            account_locked_until=None,
            registration_timestamp=datetime.now().isoformat(),
            last_login_timestamp=datetime.now().isoformat(),
            roles=["demo"],
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat()
        )
    ]

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定用户信息"""
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("user.read"):
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
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("user.update"):
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

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除用户"""
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("user.delete"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要用户删除权限"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 软删除：将账户状态设置为deleted
    from src.models.user import AccountStatus
    user.account_status = AccountStatus.DELETED
    user.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "用户删除成功"}

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建新用户"""
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("user.create"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要用户创建权限"
        )
    
    # 检查邮箱是否已存在
    existing_user = db.query(User).filter(User.email == user_data.get('email')).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已存在"
        )
    
    # 创建新用户
    from src.models.user import AccountStatus
    from src.utils.security import hash_password
    
    new_user = User(
        email=user_data.get('email'),
        password_hash=hash_password(user_data.get('password')),
        email_verified=user_data.get('email_verified', False),
        account_status=AccountStatus(user_data.get('account_status', 'active')),
        registration_timestamp=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 分配角色
    if user_data.get('roles'):
        from src.models.role import Role
        for role_name in user_data.get('roles', []):
            role = db.query(Role).filter(Role.name == role_name).first()
            if role:
                new_user.roles.append(role)
        
        db.commit()
        db.refresh(new_user)
    
    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        email_verified=new_user.email_verified,
        account_status=new_user.account_status.value,
        failed_login_attempts=new_user.failed_login_attempts,
        account_locked_until=new_user.account_locked_until.isoformat() if new_user.account_locked_until else None,
        registration_timestamp=new_user.registration_timestamp.isoformat(),
        last_login_timestamp=new_user.last_login_timestamp.isoformat() if new_user.last_login_timestamp else None,
        roles=[role.name for role in new_user.roles],
        created_at=new_user.created_at.isoformat(),
        updated_at=new_user.updated_at.isoformat() if new_user.updated_at else None
    )

# 角色管理
@router.get("/roles", response_model=List[RoleResponse])
async def get_roles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取角色列表"""
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("role.read"):
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
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("role.read"):
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
    if not current_user or not hasattr(current_user, 'has_permission') or not current_user.has_permission("system.config.read"):
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

# 数据备份管理
class BackupRecord(BaseModel):
    id: str
    name: str
    size: str
    type: str
    status: str
    created_at: str
    description: Optional[str] = None

class BackupJob(BaseModel):
    id: str
    name: str
    type: str
    status: str
    next_run: str
    last_run: Optional[str] = None
    schedule: str

@router.get("/backups", response_model=List[BackupRecord])
async def get_backups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取备份记录列表"""
    # 模拟数据，实际应该从数据库查询
    return [
        BackupRecord(
            id="1",
            name="full_backup_20241007",
            size="2.5 GB",
            type="full",
            status="completed",
            created_at="2024-10-07T10:00:00Z",
            description="完整系统备份"
        ),
        BackupRecord(
            id="2",
            name="incremental_backup_20241007",
            size="150 MB",
            type="incremental",
            status="completed",
            created_at="2024-10-07T14:00:00Z",
            description="增量备份"
        )
    ]

@router.get("/backup-jobs", response_model=List[BackupJob])
async def get_backup_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取备份任务列表"""
    # 模拟数据，实际应该从数据库查询
    return [
        BackupJob(
            id="1",
            name="每日完整备份",
            type="full",
            status="active",
            next_run="2024-10-08T02:00:00Z",
            last_run="2024-10-07T02:00:00Z",
            schedule="0 2 * * *"
        ),
        BackupJob(
            id="2",
            name="每小时增量备份",
            type="incremental",
            status="active",
            next_run="2024-10-07T15:00:00Z",
            last_run="2024-10-07T14:00:00Z",
            schedule="0 * * * *"
        )
    ]

# 文件管理
class FileItem(BaseModel):
    id: str
    name: str
    type: str
    size: str
    modified_at: str
    path: str
    is_directory: bool

@router.get("/files", response_model=List[FileItem])
async def get_files(
    path: str = "/",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取文件列表"""
    # 模拟数据，实际应该从文件系统查询
    return [
        FileItem(
            id="1",
            name="documents",
            type="folder",
            size="-",
            modified_at="2024-10-07T10:00:00Z",
            path="/documents",
            is_directory=True
        ),
        FileItem(
            id="2",
            name="report.pdf",
            type="pdf",
            size="2.3 MB",
            modified_at="2024-10-07T09:30:00Z",
            path="/documents/report.pdf",
            is_directory=False
        ),
        FileItem(
            id="3",
            name="images",
            type="folder",
            size="-",
            modified_at="2024-10-07T08:15:00Z",
            path="/images",
            is_directory=True
        )
    ]

# 通知管理
class Notification(BaseModel):
    id: str
    title: str
    content: str
    type: str
    priority: str
    is_read: bool
    created_at: str
    read_at: Optional[str] = None

class NotificationStats(BaseModel):
    total: int
    unread: int
    today: int
    urgent: int

@router.get("/notifications", response_model=List[Notification])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取通知列表"""
    # 模拟数据，实际应该从数据库查询
    return [
        Notification(
            id="1",
            title="系统更新完成",
            content="系统已成功更新到最新版本",
            type="system",
            priority="normal",
            is_read=False,
            created_at="2024-10-07T10:00:00Z"
        ),
        Notification(
            id="2",
            title="备份任务失败",
            content="今日的备份任务执行失败，请检查",
            type="warning",
            priority="urgent",
            is_read=False,
            created_at="2024-10-07T09:30:00Z"
        ),
        Notification(
            id="3",
            title="新用户注册",
            content="用户 admin@example.com 已注册",
            type="user",
            priority="normal",
            is_read=True,
            created_at="2024-10-07T08:15:00Z",
            read_at="2024-10-07T08:20:00Z"
        )
    ]

@router.get("/notifications/stats", response_model=NotificationStats)
async def get_notification_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取通知统计"""
    # 模拟数据，实际应该从数据库计算
    return NotificationStats(
        total=3,
        unread=2,
        today=3,
        urgent=1
    )

# 用户偏好管理
class UserPreferencesResponse(BaseModel):
    id: str
    user_id: str
    theme_preference: str
    layout_preference: str
    follow_system_theme: bool
    remember_preferences: bool
    custom_theme_config: Optional[dict]
    custom_layout_config: Optional[dict]
    created_at: str
    updated_at: str

class UserPreferencesUpdate(BaseModel):
    theme_preference: Optional[str] = None
    layout_preference: Optional[str] = None
    follow_system_theme: Optional[bool] = None
    remember_preferences: Optional[bool] = None
    custom_theme_config: Optional[dict] = None
    custom_layout_config: Optional[dict] = None

@router.get("/users/{user_id}/preferences", response_model=UserPreferencesResponse)
async def get_user_preferences(
    user_id: str,
    db: Session = Depends(get_db)
):
    """获取用户偏好设置"""
    from src.models.user_preferences import UserPreferences
    import uuid
    
    # 转换user_id为UUID
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == user_uuid).first()
    
    if not preferences:
        # 如果不存在，创建默认偏好
        from src.models.user_preferences import ThemePreference, LayoutPreference
        
        preferences = UserPreferences(
            user_id=user_uuid,
            theme_preference=ThemePreference.AUTO,
            layout_preference=LayoutPreference.SIDEBAR,
            follow_system_theme=True,
            remember_preferences=True
        )
        db.add(preferences)
        db.commit()
        db.refresh(preferences)
    
    return UserPreferencesResponse(
        id=str(preferences.id),
        user_id=str(preferences.user_id),
        theme_preference=preferences.theme_preference.value,
        layout_preference=preferences.layout_preference.value,
        follow_system_theme=preferences.follow_system_theme,
        remember_preferences=preferences.remember_preferences,
        custom_theme_config=preferences.to_dict()['custom_theme_config'],
        custom_layout_config=preferences.to_dict()['custom_layout_config'],
        created_at=preferences.created_at.isoformat(),
        updated_at=preferences.updated_at.isoformat()
    )

@router.put("/users/{user_id}/preferences", response_model=UserPreferencesResponse)
async def update_user_preferences(
    user_id: str,
    preferences_update: UserPreferencesUpdate,
    db: Session = Depends(get_db)
):
    """更新用户偏好设置"""
    from src.models.user_preferences import UserPreferences, LayoutPreference, ThemePreference
    import json
    import uuid as uuid_module
    
    # 转换user_id为UUID
    try:
        user_uuid = uuid_module.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    preferences = db.query(UserPreferences).filter(UserPreferences.user_id == user_uuid).first()
    
    if not preferences:
        # 如果不存在，创建新的偏好
        preferences = UserPreferences(
            user_id=user_uuid,
            theme_preference=ThemePreference.AUTO,
            layout_preference=LayoutPreference.SIDEBAR,
            follow_system_theme=True,
            remember_preferences=True
        )
        db.add(preferences)
    
    # 更新字段
    if preferences_update.theme_preference is not None:
        preferences.theme_preference = ThemePreference(preferences_update.theme_preference)
    
    if preferences_update.layout_preference is not None:
        preferences.layout_preference = LayoutPreference(preferences_update.layout_preference)
    
    if preferences_update.follow_system_theme is not None:
        preferences.follow_system_theme = preferences_update.follow_system_theme
    
    if preferences_update.remember_preferences is not None:
        preferences.remember_preferences = preferences_update.remember_preferences
    
    if preferences_update.custom_theme_config is not None:
        preferences.custom_theme_config = json.dumps(preferences_update.custom_theme_config)
    
    if preferences_update.custom_layout_config is not None:
        preferences.custom_layout_config = json.dumps(preferences_update.custom_layout_config)
    
    preferences.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(preferences)
    
    return UserPreferencesResponse(
        id=str(preferences.id),
        user_id=str(preferences.user_id),
        theme_preference=preferences.theme_preference.value,
        layout_preference=preferences.layout_preference.value,
        follow_system_theme=preferences.follow_system_theme,
        remember_preferences=preferences.remember_preferences,
        custom_theme_config=preferences.to_dict()['custom_theme_config'],
        custom_layout_config=preferences.to_dict()['custom_layout_config'],
        created_at=preferences.created_at.isoformat(),
        updated_at=preferences.updated_at.isoformat()
    )
