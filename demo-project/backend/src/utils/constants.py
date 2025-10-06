"""
常量定义模块
"""

# 密码策略
PASSWORD_POLICIES = {
    "default": {
        "min_length": 8,
        "max_length": 128,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digits": True,
        "require_special_chars": False,
        "max_attempts": 5,
        "lockout_duration": 300  # 5分钟
    },
    "strict": {
        "min_length": 12,
        "max_length": 128,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digits": True,
        "require_special_chars": True,
        "max_attempts": 3,
        "lockout_duration": 900  # 15分钟
    }
}

# 令牌过期时间（秒）
TOKEN_EXPIRY = {
    "access_token": 3600,  # 1小时
    "refresh_token": 2592000,  # 30天
    "email_verification": 86400,  # 24小时
    "password_reset": 3600,  # 1小时
    "api_key": 31536000  # 1年
}

# 速率限制
RATE_LIMIT = {
    "login": {"requests": 5, "window": 300},  # 5次/5分钟
    "register": {"requests": 3, "window": 3600},  # 3次/小时
    "password_reset": {"requests": 3, "window": 3600},  # 3次/小时
    "api": {"requests": 100, "window": 3600},  # 100次/小时
    "upload": {"requests": 10, "window": 3600}  # 10次/小时
}

# GDPR设置
GDPR_SETTINGS = {
    "data_retention_days": 365,
    "auto_delete_inactive_users": True,
    "inactive_threshold_days": 730,  # 2年
    "require_consent": True,
    "allow_data_export": True,
    "allow_data_deletion": True
}

# 事件类型
EVENT_TYPES = {
    "USER_LOGIN": "user_login",
    "USER_LOGOUT": "user_logout",
    "USER_REGISTER": "user_register",
    "USER_UPDATE": "user_update",
    "USER_DELETE": "user_delete",
    "PASSWORD_CHANGE": "password_change",
    "PASSWORD_RESET": "password_reset",
    "EMAIL_VERIFICATION": "email_verification",
    "LOGIN_FAILED": "login_failed",
    "API_ACCESS": "api_access",
    "ADMIN_ACTION": "admin_action",
    "SECURITY_VIOLATION": "security_violation"
}

# HTTP状态码
HTTP_STATUS = {
    "OK": 200,
    "CREATED": 201,
    "NO_CONTENT": 204,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "METHOD_NOT_ALLOWED": 405,
    "CONFLICT": 409,
    "UNPROCESSABLE_ENTITY": 422,
    "TOO_MANY_REQUESTS": 429,
    "INTERNAL_SERVER_ERROR": 500,
    "BAD_GATEWAY": 502,
    "SERVICE_UNAVAILABLE": 503
}

# 错误代码
ERROR_CODES = {
    "VALIDATION_ERROR": "VALIDATION_ERROR",
    "AUTHENTICATION_FAILED": "AUTHENTICATION_FAILED",
    "AUTHORIZATION_DENIED": "AUTHORIZATION_DENIED",
    "USER_NOT_FOUND": "USER_NOT_FOUND",
    "EMAIL_ALREADY_EXISTS": "EMAIL_ALREADY_EXISTS",
    "INVALID_TOKEN": "INVALID_TOKEN",
    "TOKEN_EXPIRED": "TOKEN_EXPIRED",
    "PASSWORD_TOO_WEAK": "PASSWORD_TOO_WEAK",
    "RATE_LIMIT_EXCEEDED": "RATE_LIMIT_EXCEEDED",
    "ACCOUNT_LOCKED": "ACCOUNT_LOCKED",
    "EMAIL_NOT_VERIFIED": "EMAIL_NOT_VERIFIED",
    "INTERNAL_ERROR": "INTERNAL_ERROR"
}

# 成功消息
SUCCESS_MESSAGES = {
    "USER_CREATED": "用户创建成功",
    "USER_UPDATED": "用户信息更新成功",
    "USER_DELETED": "用户删除成功",
    "PASSWORD_CHANGED": "密码修改成功",
    "PASSWORD_RESET_SENT": "密码重置邮件已发送",
    "EMAIL_VERIFICATION_SENT": "邮箱验证邮件已发送",
    "EMAIL_VERIFIED": "邮箱验证成功",
    "LOGIN_SUCCESS": "登录成功",
    "LOGOUT_SUCCESS": "登出成功",
    "DATA_EXPORTED": "数据导出成功",
    "DATA_DELETED": "数据删除成功"
}

# 安全头
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'"
}

# 默认CORS源
DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
]

# API配置
API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"

# 邮件模板
EMAIL_TEMPLATES = {
    "welcome": {
        "subject": "欢迎注册",
        "template": "welcome.html"
    },
    "password_reset": {
        "subject": "密码重置",
        "template": "password_reset.html"
    },
    "email_verification": {
        "subject": "邮箱验证",
        "template": "email_verification.html"
    },
    "notification": {
        "subject": "系统通知",
        "template": "notification.html"
    }
}