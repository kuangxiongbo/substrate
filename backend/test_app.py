"""
简化版 FastAPI 应用 - 用于测试基础设置
"""
from fastapi import FastAPI

app = FastAPI(
    title="User Authentication API - Test",
    description="Testing basic setup",
    version="1.0.0-test"
)

@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "✅ FastAPI is working!",
        "service": "User Authentication API",
        "version": "1.0.0-test"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "checks": {
            "fastapi": "✅ Running",
            "database": "⏳ Not configured yet",
            "redis": "⏳ Not configured yet"
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting FastAPI test server...")
    print("📖 API Documentation: http://127.0.0.1:8000/docs")
    print("📖 ReDoc: http://127.0.0.1:8000/redoc\n")
    uvicorn.run(app, host="127.0.0.1", port=8000)
