# 🔐 User Authentication System - Spec-Kit Demo Project

**使用 Spec-Kit 构建的规范驱动开发示例项目**

基于 GitHub Spec-Kit 的完整用户认证系统，展示了从需求到实现的完整工作流程。

---

## 📖 项目概述

这是一个功能完整的**JWT认证系统**，包含：
- ✅ 用户注册和邮箱验证
- ✅ 用户登录（JWT双Token策略）
- ✅ Token刷新和轮换
- ✅ 密码管理（修改、重置）
- ✅ 账户安全（锁定机制）
- ✅ GDPR合规（数据导出/删除）
- ✅ 安全审计日志

**技术栈**: Python 3.11 + FastAPI + PostgreSQL + JWT + Argon2

---

## 🎯 项目特点

### 1. 规范驱动开发 (Spec-Driven Development)
- 📝 从41个明确的功能需求开始
- 📋 90个详细任务分解
- 📖 完整的技术文档
- ✅ 需求100%可追溯

### 2. 测试驱动开发 (TDD)
- 🧪 30+合约测试先行
- ✅ Red-Green-Refactor流程
- 📊 测试覆盖所有API
- 🔍 质量保证

### 3. 安全最佳实践
- 🔒 Argon2id密码哈希
- 🎫 JWT双Token认证
- 🛡️ 速率限制和锁定
- 📜 完整审计日志
- 🇪🇺 GDPR合规

---

## 🚀 快速开始

### 前置要求

- Python 3.11+
- PostgreSQL 14+
- (可选) Redis 6+

### 安装步骤

```bash
# 1. 进入项目目录
cd backend

# 2. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 3. 安装依赖
brew install postgresql  # 如果还没安装
pip install -r requirements-dev.txt

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 设置数据库连接等

# 5. 创建数据库
createdb auth_db

# 6. 运行数据库迁移
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head

# 7. (可选) 填充测试数据
python scripts/seed_db.py

# 8. 启动服务器
uvicorn src.main:app --reload --port 8000
```

### 访问应用

- **API 文档**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health

---

## 🔌 API 端点

### 认证 (Authentication)
- `POST /api/v1/auth/register` - 注册新用户
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/logout` - 用户登出
- `POST /api/v1/auth/refresh` - 刷新Token
- `GET /api/v1/auth/verify-email/{token}` - 验证邮箱
- `GET /api/v1/auth/password-requirements` - 获取密码策略

### 密码管理 (Password)
- `POST /api/v1/auth/forgot-password` - 忘记密码
- `POST /api/v1/auth/reset-password` - 重置密码

### 用户管理 (User)
- `GET /api/v1/users/me` - 获取当前用户资料
- `POST /api/v1/users/me/change-password` - 修改密码
- `GET /api/v1/users/me/data` - 导出用户数据（GDPR）
- `DELETE /api/v1/users/me` - 删除账户（GDPR）

---

## 🧪 运行测试

```bash
cd backend
source venv/bin/activate

# 运行所有测试
pytest

# 运行合约测试
pytest tests/contract/ -v

# 带覆盖率报告
pytest --cov=src --cov-report=html

# 查看覆盖率
open htmlcov/index.html
```

---

## 📚 项目文档

### 核心文档
- **SPEC_KIT_LEARNING_SUMMARY.md** - Spec-Kit完整学习指南 ⭐⭐⭐
- **PROJECT_COMPLETION_SUMMARY.md** - 项目完成总结
- **DATABASE_SETUP.md** - 数据库设置指南
- **TDD_STATUS_REPORT.md** - TDD实践报告

### Spec-Kit规范
- `specs/001-/spec.md` - 功能规范（41个需求）
- `specs/001-/plan.md` - 实现计划
- `specs/001-/tasks.md` - 90个详细任务
- `specs/001-/data-model.md` - 数据模型设计
- `specs/001-/quickstart.md` - 快速开始指南

---

## 🏗️ 项目架构

```
backend/
├── src/
│   ├── main.py              # FastAPI应用入口
│   ├── config.py            # 配置管理
│   ├── database.py          # 数据库连接
│   ├── dependencies.py      # FastAPI依赖（JWT认证）
│   │
│   ├── models/              # SQLAlchemy数据模型
│   │   ├── user.py         # 用户模型
│   │   ├── jwt_token.py    # JWT Token模型
│   │   ├── verification_token.py  # 验证Token
│   │   └── security_log.py # 安全日志
│   │
│   ├── schemas/             # Pydantic请求/响应模型
│   │   ├── auth.py         # 认证schemas
│   │   ├── user.py         # 用户schemas
│   │   ├── token.py        # Tokenschemas
│   │   ├── password.py     # 密码schemas
│   │   └── verification.py # 验证schemas
│   │
│   ├── services/            # 业务逻辑层
│   │   ├── auth_service.py      # 认证服务
│   │   ├── user_service.py      # 用户服务
│   │   ├── token_service.py     # Token服务
│   │   ├── password_service.py  # 密码服务
│   │   ├── email_service.py     # 邮件服务
│   │   └── security_service.py  # 安全服务
│   │
│   ├── api/v1/              # API路由
│   │   ├── auth.py         # 认证端点
│   │   ├── user.py         # 用户端点
│   │   ├── token.py        # Token端点
│   │   └── password.py     # 密码端点
│   │
│   └── utils/               # 工具函数
│       ├── security.py      # 密码哈希、JWT
│       ├── validators.py    # 验证器
│       └── constants.py     # 常量配置
│
├── tests/                   # 测试套件
│   ├── conftest.py         # 测试配置
│   ├── contract/           # 合约测试（30+用例）
│   ├── integration/        # 集成测试
│   ├── unit/               # 单元测试
│   └── security/           # 安全测试
│
├── alembic/                 # 数据库迁移
│   ├── versions/           # 迁移版本
│   └── env.py              # 迁移环境
│
├── requirements.txt         # 生产依赖
├── requirements-dev.txt     # 开发依赖
└── .env.example            # 环境变量模板
```

---

## 🔒 安全特性

### 密码安全
- ✅ Argon2id哈希（抗GPU攻击）
- ✅ 可配置策略（Basic: 8字符 / High: 12字符+特殊字符）
- ✅ 常见密码检测
- ✅ 密码强度评分

### 认证安全
- ✅ JWT双Token（Access 1h + Refresh 7d）
- ✅ Token签名和验证
- ✅ Token轮换机制
- ✅ Token撤销支持

### 账户安全
- ✅ 邮箱验证要求
- ✅ 5次失败→30分钟锁定
- ✅ 通用错误消息（防信息泄露）
- ✅ IP地址追踪

### GDPR合规
- ✅ 用户同意管理
- ✅ 数据导出API
- ✅ 账户删除API（30天宽限期）
- ✅ 90天日志保留

---

## 📝 示例使用

### 注册用户

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "consent": true
  }'
```

### 登录

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 访问受保护端点

```bash
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🛠️ 开发指南

### 添加新功能

使用Spec-Kit工作流程：

```bash
# 1. 创建新功能规范
/specify 描述您的新功能

# 2. 生成实现计划
/plan

# 3. 分解任务
/tasks

# 4. 实现代码
/implement
```

### 数据库操作

```bash
# 创建新迁移
alembic revision --autogenerate -m "description"

# 应用迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

---

## 📊 项目统计

- **开发时间**: 约6小时
- **代码行数**: 6,900+ 行
- **测试覆盖**: 30+ 合约测试
- **文档页数**: 5,500+ 行文档
- **功能需求**: 41个全部实现
- **API端点**: 12个REST端点
- **数据模型**: 4个核心实体

---

## 🎓 学习资源

### 必读文档
1. **SPEC_KIT_LEARNING_SUMMARY.md** - 完整的Spec-Kit学习指南
2. **PROJECT_COMPLETION_SUMMARY.md** - 项目完成总结
3. `specs/001-/spec.md` - 功能规范详解

### Spec-Kit资源
- [GitHub Spec-Kit](https://github.com/github/spec-kit)
- `.cursor/commands/*.md` - 7个斜杠命令文档
- `.specify/templates/*.md` - 规范模板

---

## 🤝 贡献

这是一个学习项目，欢迎：
- 🐛 提交Bug报告
- 💡 提出改进建议
- 📖 改进文档
- 🚀 添加新功能

---

## 📄 许可证

本项目作为Spec-Kit学习示例，代码可自由使用和修改。

---

## 🙏 致谢

- **GitHub Spec-Kit** - 规范驱动开发工具
- **FastAPI** - 现代Python Web框架
- **SQLAlchemy** - Python ORM
- **Pydantic** - 数据验证

---

## 📞 联系方式

如有问题，请查阅：
- 项目文档目录
- Spec-Kit官方文档
- FastAPI官方文档

---

**🎉 使用 Spec-Kit 构建，遵循测试驱动开发和最佳实践！**

Created with ❤️ using [Spec-Kit](https://github.com/github/spec-kit)

