"""
初始化角色和权限系统
创建默认的角色、权限和系统配置
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from src.database import get_db
from src.models import Role, Permission, SystemConfig, User
from src.services.password_service import PasswordService
import uuid

def create_default_permissions(db: Session):
    """创建默认权限"""
    permissions = [
        # 系统管理权限
        {"name": "system.manage", "display_name": "系统管理", "description": "管理系统配置", "resource": "system", "action": "manage"},
        {"name": "system.config.read", "display_name": "查看系统配置", "description": "查看系统配置信息", "resource": "system", "action": "read"},
        {"name": "system.config.update", "display_name": "修改系统配置", "description": "修改系统配置", "resource": "system", "action": "update"},
        
        # 用户管理权限
        {"name": "user.manage", "display_name": "用户管理", "description": "管理所有用户", "resource": "user", "action": "manage"},
        {"name": "user.create", "display_name": "创建用户", "description": "创建新用户", "resource": "user", "action": "create"},
        {"name": "user.read", "display_name": "查看用户", "description": "查看用户信息", "resource": "user", "action": "read"},
        {"name": "user.update", "display_name": "修改用户", "description": "修改用户信息", "resource": "user", "action": "update"},
        {"name": "user.delete", "display_name": "删除用户", "description": "删除用户", "resource": "user", "action": "delete"},
        
        # 角色管理权限
        {"name": "role.manage", "display_name": "角色管理", "description": "管理角色和权限", "resource": "role", "action": "manage"},
        {"name": "role.create", "display_name": "创建角色", "description": "创建新角色", "resource": "role", "action": "create"},
        {"name": "role.read", "display_name": "查看角色", "description": "查看角色信息", "resource": "role", "action": "read"},
        {"name": "role.update", "display_name": "修改角色", "description": "修改角色信息", "resource": "role", "action": "update"},
        {"name": "role.delete", "display_name": "删除角色", "description": "删除角色", "resource": "role", "action": "delete"},
        
        # 安全管理权限
        {"name": "security.manage", "display_name": "安全管理", "description": "管理安全设置", "resource": "security", "action": "manage"},
        {"name": "security.logs.read", "display_name": "查看安全日志", "description": "查看安全日志", "resource": "security", "action": "read"},
        
        # 邮箱服务权限
        {"name": "email.manage", "display_name": "邮箱管理", "description": "管理邮箱服务配置", "resource": "email", "action": "manage"},
        
        # 个人数据权限
        {"name": "profile.read", "display_name": "查看个人资料", "description": "查看个人资料", "resource": "profile", "action": "read"},
        {"name": "profile.update", "display_name": "修改个人资料", "description": "修改个人资料", "resource": "profile", "action": "update"},
    ]
    
    for perm_data in permissions:
        existing = db.query(Permission).filter(Permission.name == perm_data["name"]).first()
        if not existing:
            permission = Permission(**perm_data, is_system=True)
            db.add(permission)
    
    db.commit()
    print("✅ 默认权限创建完成")

def create_default_roles(db: Session):
    """创建默认角色"""
    # 获取权限
    permissions = db.query(Permission).all()
    perm_dict = {p.name: p for p in permissions}
    
    roles = [
        {
            "name": "super_admin",
            "display_name": "超级管理员",
            "description": "系统超级管理员，拥有所有权限",
            "permissions": list(perm_dict.keys())  # 所有权限
        },
        {
            "name": "admin",
            "display_name": "管理员",
            "description": "系统管理员，拥有大部分管理权限",
            "permissions": [
                "system.config.read", "system.config.update",
                "user.manage", "user.create", "user.read", "user.update", "user.delete",
                "role.read", "security.logs.read",
                "email.manage", "profile.read", "profile.update"
            ]
        },
        {
            "name": "user",
            "display_name": "普通用户",
            "description": "普通用户，只能管理自己的数据",
            "permissions": [
                "profile.read", "profile.update"
            ]
        }
    ]
    
    for role_data in roles:
        existing = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not existing:
            role = Role(
                name=role_data["name"],
                display_name=role_data["display_name"],
                description=role_data["description"],
                is_system=True
            )
            db.add(role)
            db.flush()  # 获取ID
            
            # 添加权限
            for perm_name in role_data["permissions"]:
                if perm_name in perm_dict:
                    role.permissions.append(perm_dict[perm_name])
    
    db.commit()
    print("✅ 默认角色创建完成")

def create_default_system_configs(db: Session):
    """创建默认系统配置"""
    configs = [
        # 安全配置
        {"key": "password.min_length", "value": "8", "value_type": "int", "category": "security", "description": "密码最小长度"},
        {"key": "password.require_uppercase", "value": "true", "value_type": "bool", "category": "security", "description": "密码需要大写字母"},
        {"key": "password.require_lowercase", "value": "true", "value_type": "bool", "category": "security", "description": "密码需要小写字母"},
        {"key": "password.require_digit", "value": "true", "value_type": "bool", "category": "security", "description": "密码需要数字"},
        {"key": "password.require_special", "value": "false", "value_type": "bool", "category": "security", "description": "密码需要特殊字符"},
        {"key": "login.max_attempts", "value": "5", "value_type": "int", "category": "security", "description": "最大登录尝试次数"},
        {"key": "login.lockout_duration", "value": "30", "value_type": "int", "category": "security", "description": "账户锁定时间(分钟)"},
        
        # 邮箱配置
        {"key": "email.smtp_host", "value": "localhost", "value_type": "string", "category": "email", "description": "SMTP服务器地址"},
        {"key": "email.smtp_port", "value": "1025", "value_type": "int", "category": "email", "description": "SMTP服务器端口"},
        {"key": "email.smtp_username", "value": "", "value_type": "string", "category": "email", "description": "SMTP用户名"},
        {"key": "email.smtp_password", "value": "", "value_type": "string", "category": "email", "description": "SMTP密码", "is_encrypted": True},
        {"key": "email.from_address", "value": "noreply@example.com", "value_type": "string", "category": "email", "description": "发件人邮箱"},
        {"key": "email.from_name", "value": "系统通知", "value_type": "string", "category": "email", "description": "发件人名称"},
        
        # 系统配置
        {"key": "system.name", "value": "多用户管理系统", "value_type": "string", "category": "system", "description": "系统名称", "is_public": True},
        {"key": "system.version", "value": "1.0.0", "value_type": "string", "category": "system", "description": "系统版本", "is_public": True},
        {"key": "system.maintenance_mode", "value": "false", "value_type": "bool", "category": "system", "description": "维护模式"},
        
        # UI配置
        {"key": "ui.theme", "value": "light", "value_type": "string", "category": "ui", "description": "默认主题", "is_public": True},
        {"key": "ui.language", "value": "zh-CN", "value_type": "string", "category": "ui", "description": "默认语言", "is_public": True},
    ]
    
    for config_data in configs:
        existing = db.query(SystemConfig).filter(SystemConfig.key == config_data["key"]).first()
        if not existing:
            config = SystemConfig(**config_data)
            db.add(config)
    
    db.commit()
    print("✅ 默认系统配置创建完成")

def assign_super_admin_role(db: Session):
    """为超级管理员用户分配角色"""
    # 查找超级管理员用户
    super_admin_users = db.query(User).filter(User.email.in_([
        "superadmin@system.com",
        "demo@example.com"
    ])).all()
    
    # 获取超级管理员角色
    super_admin_role = db.query(Role).filter(Role.name == "super_admin").first()
    
    if super_admin_role:
        for user in super_admin_users:
            if super_admin_role not in user.roles:
                user.roles.append(super_admin_role)
                print(f"✅ 为用户 {user.email} 分配超级管理员角色")
    
    db.commit()

def main():
    """主函数"""
    print("🚀 开始初始化角色和权限系统...")
    
    db = next(get_db())
    try:
        create_default_permissions(db)
        create_default_roles(db)
        create_default_system_configs(db)
        assign_super_admin_role(db)
        
        print("🎉 角色和权限系统初始化完成！")
        
    except Exception as e:
        print(f"❌ 初始化失败: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
