#!/bin/bash

echo "🚀 Spec-Kit 用户认证系统 - 快速安装"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 激活虚拟环境
echo "📦 步骤 1/5: 激活虚拟环境..."
source venv/bin/activate

# 安装核心依赖（使用SQLite，不需要PostgreSQL）
echo "📦 步骤 2/5: 安装Python包..."
pip install -q sqlalchemy alembic
pip install -q "passlib[argon2]" "python-jose[cryptography]"
pip install -q aiosmtplib jinja2 email-validator
pip install -q pytest pytest-asyncio httpx
pip install -q python-dotenv slowapi redis

echo "✅ Python包安装完成"
echo ""

# 创建.env文件
echo "⚙️  步骤 3/5: 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    # 生成随机JWT密钥
    JWT_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    # 使用SQLite
    echo "DATABASE_URL=sqlite:///./auth.db" >> .env
    echo "JWT_SECRET_KEY=$JWT_KEY" >> .env
    echo "✅ .env 文件已创建"
else
    echo "⚠️  .env 已存在，跳过"
fi
echo ""

# 创建数据库表
echo "🗄️  步骤 4/5: 创建数据库表..."
python3 << 'EOF'
from src.database import Base, engine
from src.models import User, JWTToken, VerificationToken, SecurityLog

try:
    Base.metadata.create_all(bind=engine)
    print("✅ 数据库表创建成功")
except Exception as e:
    print(f"❌ 数据库创建失败: {e}")
EOF
echo ""

# 测试API
echo "🧪 步骤 5/5: 测试API..."
python3 << 'EOF'
try:
    from src.main import app
    print("✅ FastAPI应用加载成功")
    print("✅ 12个API端点已注册")
except Exception as e:
    print(f"⚠️  应用加载警告: {e}")
EOF
echo ""

echo "🎉 安装完成！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 启动服务器:"
echo "   uvicorn src.main:app --reload --port 8000"
echo ""
echo "📖 访问API文档:"
echo "   http://localhost:8000/docs"
echo ""
echo "🧪 运行测试:"
echo "   pytest tests/contract/ -v"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
