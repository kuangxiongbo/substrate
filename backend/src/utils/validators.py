"""
验证工具模块
"""
import re
from typing import Dict, List, Any

def validate_email_format(email: str) -> bool:
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def is_valid_email(email: str) -> bool:
    """检查邮箱是否有效"""
    return validate_email_format(email)

def get_password_policy() -> Dict[str, Any]:
    """获取密码策略"""
    return {
        "min_length": 8,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digits": True,
        "require_special_chars": False,
        "max_length": 128
    }

def validate_password_policy(password: str, policy: Dict[str, Any] = None) -> Dict[str, Any]:
    """验证密码是否符合策略"""
    if policy is None:
        policy = get_password_policy()
    
    result = {
        "valid": True,
        "errors": []
    }
    
    if len(password) < policy["min_length"]:
        result["valid"] = False
        result["errors"].append(f"密码长度至少{policy['min_length']}位")
    
    if len(password) > policy["max_length"]:
        result["valid"] = False
        result["errors"].append(f"密码长度不能超过{policy['max_length']}位")
    
    if policy["require_uppercase"] and not re.search(r'[A-Z]', password):
        result["valid"] = False
        result["errors"].append("密码必须包含大写字母")
    
    if policy["require_lowercase"] and not re.search(r'[a-z]', password):
        result["valid"] = False
        result["errors"].append("密码必须包含小写字母")
    
    if policy["require_digits"] and not re.search(r'\d', password):
        result["valid"] = False
        result["errors"].append("密码必须包含数字")
    
    if policy["require_special_chars"] and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        result["valid"] = False
        result["errors"].append("密码必须包含特殊字符")
    
    return result

def check_password_strength(password: str) -> Dict[str, Any]:
    """检查密码强度"""
    score = 0
    feedback = []
    
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("密码长度至少8位")
    
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("包含小写字母")
    
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("包含大写字母")
    
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("包含数字")
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("包含特殊字符")
    
    strength_levels = ["很弱", "弱", "中等", "强", "很强"]
    strength = strength_levels[min(score, 4)]
    
    return {
        "score": score,
        "strength": strength,
        "feedback": feedback
    }

def is_common_password(password: str) -> bool:
    """检查是否为常见密码"""
    common_passwords = [
        "password", "123456", "123456789", "qwerty", "abc123",
        "password123", "admin", "letmein", "welcome", "monkey"
    ]
    return password.lower() in common_passwords

def contains_email(password: str, email: str = None) -> bool:
    """检查密码是否包含邮箱信息"""
    if not email:
        return False
    
    email_parts = email.split('@')[0]
    return email_parts.lower() in password.lower()

def validate_password_security(password: str, email: str = None) -> Dict[str, Any]:
    """综合密码安全检查"""
    result = {
        "secure": True,
        "issues": []
    }
    
    if is_common_password(password):
        result["secure"] = False
        result["issues"].append("密码过于常见")
    
    if email and contains_email(password, email):
        result["secure"] = False
        result["issues"].append("密码不应包含邮箱信息")
    
    strength = check_password_strength(password)
    if strength["score"] < 3:
        result["secure"] = False
        result["issues"].append("密码强度不足")
    
    return result
