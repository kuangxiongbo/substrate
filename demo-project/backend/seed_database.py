#!/usr/bin/env python3
"""
Database Seeding Script
Create initial data for the authentication system
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).resolve().parent / "src"))

from sqlalchemy.orm import Session
from src.database import SessionLocal, init_db
from src.models.user import User, AccountStatus
from src.models.role import Role, Permission, SystemConfig
from src.models.operation_log import OperationLog, OperationResult
from src.utils.security import hash_password
from datetime import datetime
import uuid

def create_initial_data():
    """Create initial roles, permissions, users, and configurations"""
    db = SessionLocal()
    
    try:
        print("🌱 Seeding database with initial data...")
        
        # 1. Create Permissions
        permissions = [
            Permission(
                name="user.read",
                display_name="查看用户",
                description="查看用户信息",
                resource="user",
                action="read",
                is_system=True
            ),
            Permission(
                name="user.write",
                display_name="管理用户",
                description="创建、编辑、删除用户",
                resource="user",
                action="write",
                is_system=True
            ),
            Permission(
                name="system.config.read",
                display_name="查看系统配置",
                description="查看系统配置信息",
                resource="system",
                action="config.read",
                is_system=True
            ),
            Permission(
                name="system.config.write",
                display_name="修改系统配置",
                description="修改系统配置",
                resource="system",
                action="config.write",
                is_system=True
            ),
            Permission(
                name="operation.logs.read",
                display_name="查看操作日志",
                description="查看系统操作日志",
                resource="logs",
                action="read",
                is_system=True
            ),
        ]
        
        for perm in permissions:
            existing = db.query(Permission).filter(Permission.name == perm.name).first()
            if not existing:
                db.add(perm)
        
        db.commit()
        print("✅ Permissions created")
        
        # 2. Create Roles
        roles = [
            Role(
                name="super_admin",
                display_name="超级管理员",
                description="拥有所有权限的超级管理员",
                is_system=True
            ),
            Role(
                name="admin",
                display_name="管理员",
                description="系统管理员",
                is_system=True
            ),
            Role(
                name="user",
                display_name="普通用户",
                description="普通用户角色",
                is_system=True
            ),
            Role(
                name="demo",
                display_name="演示账户",
                description="演示用途的账户",
                is_system=True
            ),
        ]
        
        for role in roles:
            existing = db.query(Role).filter(Role.name == role.name).first()
            if not existing:
                db.add(role)
        
        db.commit()
        print("✅ Roles created")
        
        # 3. Assign permissions to roles
        super_admin_role = db.query(Role).filter(Role.name == "super_admin").first()
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        user_role = db.query(Role).filter(Role.name == "user").first()
        
        all_permissions = db.query(Permission).all()
        
        if super_admin_role:
            super_admin_role.permissions = all_permissions
        
        if admin_role:
            admin_perms = [p for p in all_permissions if p.name in ["user.read", "user.write", "system.config.read", "operation.logs.read"]]
            admin_role.permissions = admin_perms
        
        if user_role:
            user_perms = [p for p in all_permissions if p.name == "user.read"]
            user_role.permissions = user_perms
        
        db.commit()
        print("✅ Role permissions assigned")
        
        # 4. Create System Configurations
        configs = [
            SystemConfig(
                key="systemLanguage",
                value="zh-CN",
                value_type="string",
                category="basic",
                description="系统默认语言",
                is_public=True
            ),
            SystemConfig(
                key="timezone",
                value="Asia/Shanghai",
                value_type="string",
                category="basic",
                description="系统时区",
                is_public=True
            ),
            SystemConfig(
                key="dateFormat",
                value="YYYY-MM-DD",
                value_type="string",
                category="basic",
                description="日期格式",
                is_public=True
            ),
            SystemConfig(
                key="timeFormat",
                value="24h",
                value_type="string",
                category="basic",
                description="时间格式",
                is_public=True
            ),
        ]
        
        for config in configs:
            existing = db.query(SystemConfig).filter(SystemConfig.key == config.key).first()
            if not existing:
                db.add(config)
        
        db.commit()
        print("✅ System configurations created")
        
        # 5. Create Users
        users = [
            {
                "email": "superadmin@system.com",
                "name": "Super Administrator",
                "password": "SuperAdmin123!",
                "role": "super_admin",
                "email_verified": True,
                "account_status": AccountStatus.ACTIVE
            },
            {
                "email": "admin@system.com",
                "name": "Administrator",
                "password": "Admin123!",
                "role": "admin",
                "email_verified": True,
                "account_status": AccountStatus.ACTIVE
            },
            {
                "email": "demo@example.com",
                "name": "Demo User",
                "password": "Demo123!",
                "role": "demo",
                "email_verified": True,
                "account_status": AccountStatus.ACTIVE
            },
        ]
        
        for user_data in users:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                user = User(
                    email=user_data["email"],
                    password_hash=hash_password(user_data["password"]),
                    email_verified=user_data["email_verified"],
                    account_status=user_data["account_status"]
                )
                db.add(user)
                db.flush()  # Get the user ID
                
                # Assign role
                role = db.query(Role).filter(Role.name == user_data["role"]).first()
                if role:
                    user.roles.append(role)
        
        db.commit()
        print("✅ Users created")
        
        # 6. Create sample operation logs
        demo_user = db.query(User).filter(User.email == "demo@example.com").first()
        if demo_user:
            logs = [
                OperationLog(
                    user_id=demo_user.id,
                    action="LOGIN",
                    resource="/api/auth/login",
                    result=OperationResult.SUCCESS,
                    details="User logged in successfully",
                    ip_address="127.0.0.1",
                    user_agent="Mozilla/5.0 (Demo Browser)"
                ),
                OperationLog(
                    user_id=demo_user.id,
                    action="VIEW_PROFILE",
                    resource="/api/user/profile",
                    result=OperationResult.SUCCESS,
                    details="User viewed profile",
                    ip_address="127.0.0.1",
                    user_agent="Mozilla/5.0 (Demo Browser)"
                ),
            ]
            
            for log in logs:
                db.add(log)
            
            db.commit()
            print("✅ Sample operation logs created")
        
        print("🎉 Database seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_data()

