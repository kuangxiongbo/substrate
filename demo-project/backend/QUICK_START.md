# 🚀 快速启动指南

## 当前状态检查

### ✅ 已就绪
- Python 3.13.3
- 虚拟环境
- FastAPI, Uvicorn, Pydantic
- 完整的源代码（6,900+行）

### ⏳ 需要安装
- PostgreSQL 14+
- SQLAlchemy, Alembic
- 认证和安全包（passlib, python-jose）
- 邮件包（aiosmtplib）

---

## 🔧 完整安装步骤

### 方法 A: 完整安装（推荐）

```bash
cd /Users/kuangxb/Desktop/spec-kit/demo-project/backend

# 1. 激活虚拟环境
source venv/bin/activate

# 2. 安装PostgreSQL
brew install postgresql@14

# 3. 启动PostgreSQL
brew services start postgresql@14

# 4. 安装Python包（重要：先安装PostgreSQL）
pip install sqlalchemy alembic psycopg2-binary
pip install passlib[argon2] python-jose[cryptography]
pip install aiosmtplib jinja2 email-validator
pip install pytest pytest-asyncio httpx
pip install slowapi redis python-dotenv

# 5. 创建数据库
createdb auth_db

# 6. 配置环境变量
cp .env.example .env
# 生成JWT密钥
python3 -c "import secrets; print(f'JWT_SECRET_KEY={secrets.token_hex(32)}')" >> .env

# 7. 运行数据库迁移
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head

# 8. （可选）填充测试数据
python scripts/seed_db.py

# 9. 启动服务器
uvicorn src.main:app --reload --port 8000
```

---

### 方法 B: 快速测试（使用SQLite）

如果不想安装PostgreSQL，可以使用SQLite进行测试：

```bash
cd /Users/kuangxb/Desktop/spec-kit/demo-project/backend
source venv/bin/activate

# 安装核心包（不包括PostgreSQL驱动）
pip install sqlalchemy alembic
pip install passlib[argon2] python-jose[cryptography]
pip install aiosmtplib jinja2 email-validator
pip install pytest pytest-asyncio httpx

# 修改config.py中的DATABASE_URL为：
# DATABASE_URL: str = "sqlite:///./auth.db"

# 创建数据库表
python -c "
from src.database import Base, engine
from src.models import User, JWTToken, VerificationToken, SecurityLog
Base.metadata.create_all(bind=engine)
print('✅ Database tables created')
"

# 启动服务器
uvicorn src.main:app --reload --port 8000
```

---

### 方法 C: 一键安装脚本

创建自动化安装脚本：

```bash
cd /Users/kuangxb/Desktop/spec-kit/demo-project/backend

# 运行安装脚本（即将创建）
chmod +x install.sh
./install.sh
```

---

## 🧪 运行测试

### 前提：已安装测试依赖

```bash
source venv/bin/activate
pip install pytest pytest-asyncio httpx sqlalchemy
```

### 运行合约测试

```bash
# 所有合约测试
pytest tests/contract/ -v

# 特定测试文件
pytest tests/contract/test_register_contract.py -v

# 带详细输出
pytest tests/contract/ -v -s

# 只运行失败的测试
pytest tests/contract/ --lf
```

### 预期结果

#### 如果API已实现
```
✅ test_register_with_valid_data_returns_201 PASSED
✅ test_login_with_valid_credentials_returns_200 PASSED
✅ test_refresh_with_valid_token_returns_200 PASSED
...
======================== 30 passed ========================
```

#### 如果API未连接
```
❌ test_register_with_valid_data_returns_201 FAILED
E   AssertionError: assert 404 == 201
E   (端点未注册到路由)
```

---

## 📖 测试API

### 使用Swagger UI（推荐）

1. 启动服务器：`uvicorn src.main:app --reload`
2. 访问：http://localhost:8000/docs
3. 在Web界面测试所有端点

### 使用curl

```bash
# 1. 注册用户
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "consent": true
  }'

# 2. 登录获取Token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# 3. 获取用户资料（使用Token）
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. 查看密码策略
curl http://localhost:8000/api/v1/auth/password-requirements
```

---

## 🐛 常见问题

### 问题1: PostgreSQL未安装

**错误**: `command not found: createdb`

**解决**:
```bash
brew install postgresql@14
brew services start postgresql@14
```

### 问题2: 数据库连接失败

**错误**: `could not connect to server`

**解决**:
```bash
# 启动PostgreSQL
brew services start postgresql@14

# 检查状态
brew services list | grep postgresql
```

### 问题3: 包安装失败

**错误**: `pg_config executable not found`

**解决**: 先安装PostgreSQL，再安装Python包

### 问题4: 端口被占用

**错误**: `Address already in use`

**解决**:
```bash
# 使用不同端口
uvicorn src.main:app --reload --port 8001

# 或查找占用进程
lsof -i:8000
kill -9 PID
```

---

## ✅ 验证清单

安装完成后，验证以下功能：

### API可访问性
- [ ] http://localhost:8000/ 返回健康检查
- [ ] http://localhost:8000/docs 显示Swagger UI
- [ ] http://localhost:8000/redoc 显示ReDoc

### 数据库连接
- [ ] 数据库表已创建（users, jwt_tokens等）
- [ ] 可以运行迁移
- [ ] 种子数据可以导入

### API功能
- [ ] POST /auth/register 创建用户
- [ ] POST /auth/login 返回JWT token
- [ ] GET /users/me 需要认证
- [ ] GET /auth/password-requirements 返回策略

### 测试通过
- [ ] 合约测试运行成功
- [ ] 没有500错误
- [ ] 验证错误返回正确状态码

---

## 🎯 成功标志

当看到以下内容时，说明成功：

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

访问 http://localhost:8000/docs 看到：
```
User Authentication API
Version: 1.0.0
12 API endpoints listed
```

---

## 💡 下一步

成功运行后：

1. **测试注册流程** - 在Swagger UI创建用户
2. **测试登录** - 获取JWT token
3. **测试受保护端点** - 使用token访问/users/me
4. **运行自动化测试** - pytest tests/contract/
5. **查看安全日志** - 数据库中的security_logs表

---

**准备开始安装吗？** 

选择一个方法：
- **方法A**: 完整PostgreSQL安装（生产级）
- **方法B**: SQLite快速测试（开发用）
- **方法C**: 使用安装脚本（自动化）

我推荐**方法B（SQLite）**用于快速测试！

