"""
创建安全相关数据库表
包括登录尝试记录、IP冻结记录、邮箱验证码限制等
"""
import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.database import engine, Base
from src.models import (
    User, JWTToken, VerificationToken, SecurityLog, Role, Permission, SystemConfig,
    LoginAttempt, IPFreeze, EmailVerificationLimit
)

def create_security_tables():
    print("🚀 开始创建安全相关数据库表...")
    try:
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        print("✅ 安全相关数据库表创建完成")
        print("✅ 表 login_attempts 创建成功")
        print("✅ 表 ip_freezes 创建成功")
        print("✅ 表 email_verification_limits 创建成功")
    except Exception as e:
        print(f"❌ 创建安全相关数据库表失败: {e}")
        sys.exit(1)

def check_tables():
    print("\n2️⃣ 检查表结构...")
    from sqlalchemy import inspect
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    print("数据库中的表:")
    for table_name in existing_tables:
        print(f"  - {table_name}")
    print("\n✅ 安全相关数据库表创建完成")

def add_security_configs():
    print("\n3️⃣ 添加安全相关系统配置...")
    from src.database import SessionLocal
    from src.models import SystemConfig
    
    db = SessionLocal()
    try:
        # 安全策略配置
        security_configs = [
            {
                "key": "security.login.security_level",
                "value": "basic",
                "value_type": "string",
                "description": "登录安全策略级别：basic（基础）或 advanced（高级）",
                "category": "security"
            },
            {
                "key": "security.login.captcha_required_after_failures",
                "value": "1",
                "value_type": "integer",
                "description": "基础策略：失败多少次后需要验证码",
                "category": "security"
            },
            {
                "key": "security.login.advanced_captcha_required_after_failures",
                "value": "3",
                "value_type": "integer",
                "description": "高级策略：失败多少次后需要验证码",
                "category": "security"
            },
            {
                "key": "security.login.ip_freeze_after_failures",
                "value": "5",
                "value_type": "integer",
                "description": "高级策略：失败多少次后冻结IP",
                "category": "security"
            },
            {
                "key": "security.login.ip_freeze_duration_hours",
                "value": "1",
                "value_type": "integer",
                "description": "IP冻结持续时间（小时）",
                "category": "security"
            },
            {
                "key": "security.login.account_lockout_after_failures",
                "value": "5",
                "value_type": "integer",
                "description": "账户锁定失败次数",
                "category": "security"
            },
            {
                "key": "security.login.account_lockout_duration_minutes",
                "value": "30",
                "value_type": "integer",
                "description": "账户锁定持续时间（分钟）",
                "category": "security"
            },
            {
                "key": "security.email.max_requests_per_email_per_hour",
                "value": "1",
                "value_type": "integer",
                "description": "每个邮箱每小时最多请求次数",
                "category": "security"
            },
            {
                "key": "security.email.max_requests_per_ip_per_hour",
                "value": "5",
                "value_type": "integer",
                "description": "每个IP每小时最多请求次数",
                "category": "security"
            },
            {
                "key": "security.email.max_global_requests_per_hour",
                "value": "100",
                "value_type": "integer",
                "description": "全局每小时最多请求次数",
                "category": "security"
            },
            {
                "key": "security.captcha.expire_minutes",
                "value": "5",
                "value_type": "integer",
                "description": "验证码过期时间（分钟）",
                "category": "security"
            },
            {
                "key": "security.captcha.length",
                "value": "4",
                "value_type": "integer",
                "description": "验证码长度",
                "category": "security"
            }
        ]
        
        for config_data in security_configs:
            existing = db.query(SystemConfig).filter(SystemConfig.key == config_data["key"]).first()
            if not existing:
                config = SystemConfig(**config_data)
                db.add(config)
                print(f"✅ 添加配置: {config_data['key']}")
        
        db.commit()
        print("✅ 安全相关系统配置添加完成")
        
    except Exception as e:
        db.rollback()
        print(f"❌ 添加安全相关系统配置失败: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_security_tables()
    check_tables()
    add_security_configs()
    print("\n🎉 安全相关数据库表创建完成！")
