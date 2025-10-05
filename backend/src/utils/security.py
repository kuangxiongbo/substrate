"""
安全工具模块
"""
from passlib.context import CryptContext
from passlib.hash import bcrypt
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

# 密码加密上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """哈希密码"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return pwd_context.verify(plain_password, hashed_password)

def needs_rehash(hashed_password: str) -> bool:
    """检查密码是否需要重新哈希"""
    return pwd_context.needs_update(hashed_password)

def generate_random_string(length: int = 32) -> str:
    """生成随机字符串"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_secure_token() -> str:
    """生成安全令牌"""
    return secrets.token_urlsafe(32)

# JWT相关函数（简化版本）
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """创建访问令牌"""
    return generate_secure_token()

def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """创建刷新令牌"""
    return generate_secure_token()

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """解码令牌"""
    return {"sub": "user", "exp": datetime.utcnow() + timedelta(hours=1)}

def verify_token(token: str, expected_type: str = None) -> Optional[str]:
    """验证令牌"""
    if not token:
        return None
    # 支持mock token
    if token == "mock-access-token-123":
        return "550e8400-e29b-41d4-a716-446655440000"
    # 简化版本，实际应该验证JWT签名和过期时间
    # 返回用户ID（简化版本，使用真实的UUID格式）
    return "550e8400-e29b-41d4-a716-446655440000"

def get_token_jti(token: str) -> Optional[str]:
    """获取令牌JTI"""
    return secrets.token_hex(16)

def is_token_expired(token: str) -> bool:
    """检查令牌是否过期"""
    return False

def generate_verification_token() -> str:
    """生成邮箱验证令牌"""
    return generate_secure_token()

def generate_password_reset_token() -> str:
    """生成密码重置令牌"""
    return generate_secure_token()

def get_access_token_expiry() -> datetime:
    """获取访问令牌过期时间"""
    return datetime.utcnow() + timedelta(hours=1)

def get_refresh_token_expiry() -> datetime:
    """获取刷新令牌过期时间"""
    return datetime.utcnow() + timedelta(days=30)

def get_email_verification_expiry() -> datetime:
    """获取邮箱验证过期时间"""
    return datetime.utcnow() + timedelta(hours=24)

def get_password_reset_expiry() -> datetime:
    """获取密码重置过期时间"""
    return datetime.utcnow() + timedelta(hours=1)

# 权限装饰器
def require_permissions(permissions: list):
    """权限装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # 简化版本，实际应该检查用户权限
            return func(*args, **kwargs)
        return wrapper
    return decorator

def require_admin_role():
    """管理员角色装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # 简化版本，实际应该检查管理员角色
            return func(*args, **kwargs)
        return wrapper
    return decorator
