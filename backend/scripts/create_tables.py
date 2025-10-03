"""
创建新的数据库表
为角色权限系统创建必要的表
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.database import engine, Base
from src.models import *

def create_tables():
    """创建新的数据库表"""
    print("🚀 开始创建数据库表...")
    
    try:
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        print("✅ 数据库表创建完成")
        
        # 检查创建的表
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        new_tables = ['roles', 'permissions', 'role_permissions', 'user_roles', 'system_configs']
        for table in new_tables:
            if table in tables:
                print(f"✅ 表 {table} 创建成功")
            else:
                print(f"❌ 表 {table} 创建失败")
                
    except Exception as e:
        print(f"❌ 创建表失败: {e}")
        raise

if __name__ == "__main__":
    create_tables()
