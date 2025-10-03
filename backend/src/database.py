"""
Database Connection and Session Management
SQLAlchemy configuration for PostgreSQL
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from src.config import settings

# Create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,
    max_overflow=10
)

# Create SessionLocal class
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create Base class for models
Base = declarative_base()


# Dependency for FastAPI
def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session
    Yields a database session and closes it when done
    
    Usage in FastAPI:
        @app.get("/")
        def read_root(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Database initialization function
def init_db() -> None:
    """
    Initialize database tables
    Creates all tables defined by SQLAlchemy models
    """
    # Import all models here to ensure they are registered with Base
    # from src.models import user, jwt_token, verification_token, security_log
    
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")


# Database health check
async def check_db_health() -> bool:
    """
    Check if database connection is healthy
    Returns True if connection is successful, False otherwise
    """
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return True
    except Exception as e:
        print(f"❌ Database health check failed: {e}")
        return False

