from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Spec-Kit Demo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Spec-Kit Demo API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/v1/test")
async def test_endpoint():
    return {"message": "Test endpoint working", "data": {"test": True}}

# 模拟配置API
@app.get("/api/v1/admin/configs")
async def get_configs(category: str = None):
    if category == "basic":
        return [
            {"key": "systemLanguage", "value": "zh-CN"},
            {"key": "timezone", "value": "Asia/Shanghai"},
            {"key": "dateFormat", "value": "YYYY-MM-DD"},
            {"key": "timeFormat", "value": "24h"}
        ]
    return []

@app.post("/api/v1/admin/configs")
async def save_configs(configs: dict):
    return {"message": "Configuration saved successfully", "status": "ok"}

# 模拟用户管理API
@app.get("/api/v1/admin/users")
async def get_users():
    return {
        "users": [
            {
                "id": "1",
                "email": "admin@example.com",
                "name": "Administrator",
                "role": "admin",
                "email_verified": True,
                "account_status": "active",
                "last_login_timestamp": "2024-01-01T10:00:00Z"
            },
            {
                "id": "2", 
                "email": "user@example.com",
                "name": "Test User",
                "role": "user",
                "email_verified": True,
                "account_status": "active",
                "last_login_timestamp": "2024-01-01T09:00:00Z"
            }
        ]
    }

@app.get("/api/v1/admin/stats")
async def get_admin_stats():
    return {
        "total_users": 2,
        "active_users": 2,
        "total_roles": 2,
        "total_permissions": 10,
        "total_configs": 4
    }

# 模拟操作日志API
@app.get("/api/v1/operation-logs")
async def get_operation_logs():
    return {
        "logs": [
            {
                "id": "1",
                "timestamp": "2024-01-01 10:00:00",
                "user_name": "admin",
                "action": "LOGIN",
                "resource": "/login",
                "result": "SUCCESS",
                "ip_address": "192.168.1.1",
                "details": "User logged in successfully"
            },
            {
                "id": "2",
                "timestamp": "2024-01-01 09:30:00",
                "user_name": "user",
                "action": "CREATE",
                "resource": "/api/users",
                "result": "SUCCESS",
                "ip_address": "192.168.1.2",
                "details": "Created new user account"
            }
        ]
    }

@app.get("/api/v1/operation-logs/export")
async def export_operation_logs():
    # 返回CSV文件
    csv_content = "时间,用户,操作,资源,结果,IP地址,详情\n2024-01-01 10:00:00,admin,LOGIN,/login,SUCCESS,192.168.1.1,User logged in successfully"
    return {"content": csv_content, "filename": "operation_logs.csv"}

# 模拟监控API
@app.get("/api/v1/admin/monitoring/metrics")
async def get_monitoring_metrics():
    return {
        "cpu_usage": 45.2,
        "memory_usage": 67.8,
        "disk_usage": 23.4,
        "network_in": 12.5,
        "network_out": 8.3,
        "database_connections": 15,
        "active_users": 2,
        "response_time": 120,
        "uptime": "7 days, 12 hours"
    }

@app.get("/api/v1/admin/monitoring/alerts")
async def get_monitoring_alerts():
    return [
        {
            "id": "1",
            "type": "warning",
            "message": "High CPU usage detected",
            "timestamp": "2024-01-01T10:00:00Z",
            "severity": "medium"
        }
    ]

@app.get("/api/v1/admin/monitoring/services")
async def get_monitoring_services():
    return [
        {
            "name": "Web Server",
            "status": "running",
            "health": "healthy",
            "uptime": "7 days, 12 hours"
        },
        {
            "name": "Database",
            "status": "running", 
            "health": "healthy",
            "uptime": "7 days, 12 hours"
        }
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



