#!/usr/bin/env python3
"""
Setup environment configuration for the backend
"""
import os

def create_env_file():
    """Create .env file with default configuration"""
    env_content = """# Application Configuration
APP_NAME=Spec-Kit Demo API
DEBUG=true

# Database Configuration
DATABASE_URL=postgresql://kuangxb@localhost:5432/auth_db
DB_ECHO=false

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-in-production-please-use-a-strong-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Password Policy
PASSWORD_POLICY_LEVEL=basic

# Email Configuration (for development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME=Spec-Kit Demo
SMTP_TLS=false

# Security
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]
RATE_LIMIT_PER_MINUTE=5
ACCOUNT_LOCKOUT_DURATION_MINUTES=30
MAX_FAILED_LOGIN_ATTEMPTS=5

# Token Expiration
EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS=24
PASSWORD_RESET_TOKEN_EXPIRE_HOURS=1

# GDPR
DATA_RETENTION_DAYS=90
ACCOUNT_DELETION_GRACE_PERIOD_DAYS=30
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env file with default configuration")

if __name__ == "__main__":
    create_env_file()

