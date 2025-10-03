"""
Pytest Configuration and Fixtures
Shared test fixtures for all test suites
"""
import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient
import asyncio

from src.main import app
from src.database import Base, get_db
from src.config import settings


# ============================================================================
# Database Fixtures
# ============================================================================

@pytest.fixture(scope="session")
def test_engine():
    """Create test database engine"""
    # Use in-memory SQLite for tests (or separate test PostgreSQL)
    engine = create_engine(
        "sqlite:///./test.db",
        connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_db(test_engine) -> Generator[Session, None, None]:
    """Create test database session"""
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine
    )
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client(test_db) -> Generator[TestClient, None, None]:
    """Create test client with database override"""
    
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


# ============================================================================
# Event Loop Fixture (for async tests)
# ============================================================================

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ============================================================================
# Sample Data Fixtures
# ============================================================================

@pytest.fixture
def sample_user_data():
    """Sample user registration data"""
    return {
        "email": "test@example.com",
        "password": "SecurePass123!",
        "consent": True
    }


@pytest.fixture
def sample_login_data():
    """Sample login credentials"""
    return {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }


@pytest.fixture
def weak_password_data():
    """Sample weak password data"""
    return {
        "email": "weak@example.com",
        "password": "weak",
        "consent": True
    }


# ============================================================================
# Test Helpers
# ============================================================================

def create_test_user(db: Session, email: str = "test@example.com", verified: bool = True):
    """Helper to create a test user"""
    from src.models import User, AccountStatus
    from src.services import PasswordService
    import uuid
    
    password_service = PasswordService()
    password_hash = password_service.hash_password("SecurePass123!")
    
    user = User(
        id=uuid.uuid4(),
        email=email,
        password_hash=password_hash,
        email_verified=verified,
        account_status=AccountStatus.ACTIVE if verified else AccountStatus.INACTIVE,
        consent_status=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

