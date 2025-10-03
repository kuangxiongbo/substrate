# Contract Tests Guide

## 🧪 TDD Phase: Contract Tests (Phase 3.6)

### 目的
验证所有API端点的请求/响应格式符合OpenAPI规范

### ⚠️ TDD 要求
1. **先写测试** - 在实现API之前编写所有合约测试
2. **测试必须失败** - 运行测试，确认全部失败（因为API未实现）
3. **然后实现** - Phase 3.7 实现API端点
4. **测试通过** - 实现后重新运行，确认全部通过

---

## ✅ 已创建的合约测试 (2/12)

### T030: ✅ test_register_contract.py
测试端点: `POST /api/v1/auth/register`

**测试用例** (7个):
- ✅ 有效注册返回201
- ✅ 无效邮箱返回400
- ✅ 弱密码返回400
- ✅ 重复邮箱返回400
- ✅ 缺少同意返回400
- ✅ 缺少字段返回422
- ✅ 响应不包含密码（安全）

**覆盖需求**: FR-001, FR-002, FR-003, FR-004, FR-005

---

### T031: ✅ test_login_contract.py
测试端点: `POST /api/v1/auth/login`

**测试用例** (7个):
- ✅ 有效登录返回200 + JWT tokens
- ✅ 错误密码返回401（通用错误）
- ✅ 不存在的邮箱返回401
- ✅ 未验证邮箱返回401
- ✅ 锁定账户返回423
- ✅ 速率限制返回429
- ✅ 缺少字段返回422

**覆盖需求**: FR-008, FR-009, FR-010, FR-011, FR-012

---

## ⏳ 待创建的合约测试 (10/12)

### T032: test_refresh_contract.py
```python
# POST /api/v1/auth/refresh
# 测试 Token 刷新和轮换 (FR-018, FR-020)
```

### T033: test_logout_contract.py
```python
# POST /api/v1/auth/logout
# 测试登出和Token撤销 (FR-016)
```

### T034: test_verify_email_contract.py
```python
# GET /api/v1/auth/verify-email/{token}
# 测试邮箱验证 (FR-006)
```

### T035: test_forgot_password_contract.py
```python
# POST /api/v1/auth/forgot-password
# 测试密码重置请求 (FR-024, FR-025)
```

### T036: test_reset_password_contract.py
```python
# POST /api/v1/auth/reset-password
# 测试密码重置 (FR-027, FR-028)
```

### T037: test_password_requirements_contract.py
```python
# GET /api/v1/auth/password-requirements
# 测试密码策略查询 (FR-041)
```

### T038: test_get_user_contract.py
```python
# GET /api/v1/users/me
# 测试获取用户资料（需要JWT认证）
```

### T039: test_change_password_contract.py
```python
# POST /api/v1/users/me/change-password
# 测试修改密码 (FR-021, FR-022, FR-023)
```

### T040: test_export_data_contract.py
```python
# GET /api/v1/users/me/data
# 测试GDPR数据导出 (FR-036)
```

### T041: test_delete_user_contract.py
```python
# DELETE /api/v1/users/me
# 测试GDPR账户删除 (FR-036)
```

---

## 🚀 如何运行测试

### 安装测试依赖
```bash
cd backend
source venv/bin/activate
pip install pytest pytest-asyncio httpx
```

### 运行所有合约测试
```bash
pytest tests/contract/ -v
```

### 运行特定测试文件
```bash
pytest tests/contract/test_register_contract.py -v
```

### 预期结果（当前）
❌ **所有测试应该失败**，因为API端点还未实现！

示例输出:
```
tests/contract/test_register_contract.py::test_register_with_valid_data_returns_201 FAILED
tests/contract/test_login_contract.py::test_login_with_valid_credentials_returns_200 FAILED
...
```

错误类型:
```
E   AssertionError: assert 404 == 201
E   404 Not Found (endpoint不存在)
```

**这是正常的！** 这就是TDD的Red阶段。

---

## 📝 编写合约测试的模板

```python
"""
Contract Test: [METHOD] [ENDPOINT]
Tests [endpoint] request/response contract (FR-XXX)
"""
import pytest
from fastapi.testclient import TestClient


class Test[EndpointName]Contract:
    """Contract tests for [endpoint description]"""
    
    def test_[scenario]_returns_[status_code](self, client: TestClient):
        """
        Test: [描述测试场景]
        Validates: FR-XXX ([功能需求])
        """
        response = client.[method]("[endpoint]", json={...})
        
        assert response.status_code == [expected_status]
        data = response.json()
        
        # Validate response structure
        assert "expected_field" in data
        assert isinstance(data["expected_field"], expected_type)
```

---

## 📋 合约测试检查清单

每个端点的合约测试应包括:

- [ ] **成功场景** - 返回正确状态码和数据结构
- [ ] **验证错误** - 无效输入返回400/422
- [ ] **认证错误** - 未授权返回401（如需认证）
- [ ] **业务错误** - 业务规则违反返回适当错误
- [ ] **边缘案例** - 空值、极值、特殊字符
- [ ] **响应格式** - JSON结构符合schema定义
- [ ] **HTTP头** - Content-Type等正确
- [ ] **安全性** - 敏感信息不泄漏

---

## 🎯 下一步

1. **完成剩余10个合约测试** (T032-T041)
   - 可以参考已创建的test_register_contract.py和test_login_contract.py
   - 每个测试5-10分钟

2. **运行测试确认失败**
   ```bash
   pytest tests/contract/ -v
   ```
   预期: 全部失败 ❌ (RED阶段)

3. **进入Phase 3.7: 实现API端点**
   - 创建12个API路由文件
   - 实现业务逻辑
   - 让测试通过 ✅ (GREEN阶段)

4. **重构和优化**
   - 代码重构
   - 性能优化
   - 文档完善

---

## 💡 TDD 工作流程图

```
📝 Phase 3.6: 写测试
    ↓
❌ 运行测试 → 全部失败 (RED)
    ↓
💻 Phase 3.7: 实现API
    ↓
✅ 运行测试 → 全部通过 (GREEN)
    ↓
♻️  重构优化 (REFACTOR)
    ↓
🎉 功能完成
```

---

**当前状态**: 
- ✅ 2个合约测试已创建
- ⏳ 10个合约测试待创建
- ⏳ API端点待实现

**准备继续编写剩余测试或直接进入实现阶段？**

