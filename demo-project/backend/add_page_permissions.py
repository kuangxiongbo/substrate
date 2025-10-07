#!/usr/bin/env python3
"""
添加页面级权限到数据库
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database import get_db
from src.models.role import Permission
from sqlalchemy.orm import Session

def add_page_permissions():
    """添加页面级权限"""
    db = next(get_db())
    
    # 定义页面权限
    page_permissions = [
        # 概览页面
        {"name": "page.overview.read", "display_name": "查看概览页面", "description": "访问系统概览页面", "resource": "page", "action": "overview.read"},
        
        # 用户管理页面
        {"name": "page.users.read", "display_name": "查看用户管理页面", "description": "访问用户管理页面", "resource": "page", "action": "users.read"},
        {"name": "page.users.write", "display_name": "管理用户", "description": "创建、编辑、删除用户", "resource": "page", "action": "users.write"},
        
        # 系统设置页面
        {"name": "page.settings.read", "display_name": "查看系统设置", "description": "访问系统设置页面", "resource": "page", "action": "settings.read"},
        {"name": "page.settings.write", "display_name": "修改系统设置", "description": "修改系统配置", "resource": "page", "action": "settings.write"},
        
        # 基础配置
        {"name": "page.settings.basic.read", "display_name": "查看基础配置", "description": "查看系统基础配置", "resource": "page", "action": "settings.basic.read"},
        {"name": "page.settings.basic.write", "display_name": "修改基础配置", "description": "修改系统基础配置", "resource": "page", "action": "settings.basic.write"},
        
        # 管理员管理
        {"name": "page.settings.admin.read", "display_name": "查看管理员", "description": "查看管理员列表", "resource": "page", "action": "settings.admin.read"},
        {"name": "page.settings.admin.write", "display_name": "管理管理员", "description": "创建、编辑、删除管理员", "resource": "page", "action": "settings.admin.write"},
        
        # 角色管理
        {"name": "page.settings.roles.read", "display_name": "查看角色管理", "description": "查看角色和权限", "resource": "page", "action": "settings.roles.read"},
        {"name": "page.settings.roles.write", "display_name": "管理角色", "description": "创建、编辑、删除角色和权限", "resource": "page", "action": "settings.roles.write"},
        
        # 安全配置
        {"name": "page.settings.security.read", "display_name": "查看安全配置", "description": "查看系统安全设置", "resource": "page", "action": "settings.security.read"},
        {"name": "page.settings.security.write", "display_name": "修改安全配置", "description": "修改系统安全设置", "resource": "page", "action": "settings.security.write"},
        
        # 邮件配置
        {"name": "page.settings.email.read", "display_name": "查看邮件配置", "description": "查看邮件服务配置", "resource": "page", "action": "settings.email.read"},
        {"name": "page.settings.email.write", "display_name": "修改邮件配置", "description": "修改邮件服务配置", "resource": "page", "action": "settings.email.write"},
        
        # 监控页面
        {"name": "page.monitoring.read", "display_name": "查看监控页面", "description": "访问系统监控页面", "resource": "page", "action": "monitoring.read"},
        {"name": "page.monitoring.system.read", "display_name": "查看系统监控", "description": "查看系统监控数据", "resource": "page", "action": "monitoring.system.read"},
        
        # 数据备份
        {"name": "page.backup.read", "display_name": "查看数据备份", "description": "查看备份记录和任务", "resource": "page", "action": "backup.read"},
        {"name": "page.backup.write", "display_name": "管理数据备份", "description": "创建、管理备份任务", "resource": "page", "action": "backup.write"},
        
        # 系统日志
        {"name": "page.logs.read", "display_name": "查看系统日志", "description": "查看系统操作日志", "resource": "page", "action": "logs.read"},
        {"name": "page.logs.export", "display_name": "导出系统日志", "description": "导出系统日志", "resource": "page", "action": "logs.export"},
        
        # 文件管理
        {"name": "page.files.read", "display_name": "查看文件管理", "description": "查看文件列表", "resource": "page", "action": "files.read"},
        {"name": "page.files.write", "display_name": "管理文件", "description": "上传、下载、删除文件", "resource": "page", "action": "files.write"},
        
        # 通知中心
        {"name": "page.notifications.read", "display_name": "查看通知", "description": "查看系统通知", "resource": "page", "action": "notifications.read"},
        {"name": "page.notifications.write", "display_name": "管理通知", "description": "发送、管理通知", "resource": "page", "action": "notifications.write"},
        
        # 个人资料
        {"name": "page.profile.read", "display_name": "查看个人资料", "description": "查看个人资料页面", "resource": "page", "action": "profile.read"},
        {"name": "page.profile.write", "display_name": "修改个人资料", "description": "修改个人资料信息", "resource": "page", "action": "profile.write"},
    ]
    
    # 添加权限到数据库
    for perm_data in page_permissions:
        # 检查权限是否已存在
        existing_perm = db.query(Permission).filter(Permission.name == perm_data["name"]).first()
        if not existing_perm:
            permission = Permission(
                name=perm_data["name"],
                display_name=perm_data["display_name"],
                description=perm_data["description"],
                resource=perm_data["resource"],
                action=perm_data["action"],
                is_system=True,
                is_active=True
            )
            db.add(permission)
            print(f"添加权限: {perm_data['name']}")
        else:
            print(f"权限已存在: {perm_data['name']}")
    
    db.commit()
    print("页面权限添加完成！")

if __name__ == "__main__":
    add_page_permissions()
