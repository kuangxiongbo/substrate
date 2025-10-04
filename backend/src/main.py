"""
FastAPI Application Entry Point
User Authentication System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings

# Create FastAPI application
app = FastAPI(
    title="User Authentication API",
    description="Secure JWT-based authentication system with GDPR compliance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "User Authentication API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",  # TODO: Add actual DB check
        "redis": "connected"  # TODO: Add actual Redis check
    }


# Register API routers
from src.api.v1 import auth, user, token, password, admin, captcha

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(token.router, prefix="/api/v1/auth", tags=["Tokens"])
app.include_router(password.router, prefix="/api/v1/auth", tags=["Password Management"])
app.include_router(user.router, prefix="/api/v1/users", tags=["User Management"])
app.include_router(admin.router, prefix="/api/v1", tags=["Admin Management"])
app.include_router(captcha.router, prefix="/api/v1", tags=["Captcha"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )











