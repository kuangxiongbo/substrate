# Quickstart Guide

## Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Redis 6+

## Setup

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env:
DATABASE_URL=postgresql://user:pass@localhost/auth_db
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=<generate-random-key>
SMTP_HOST=localhost
SMTP_PORT=1025
```

### 3. Database Setup
```bash
alembic upgrade head
```

### 4. Run Server
```bash
uvicorn src.main:app --reload --port 8000
```

Visit: http://localhost:8000/docs

## Quick Test

### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "consent": true
  }'
```

### Verify Email (get token from logs)
```bash
curl http://localhost:8000/api/v1/auth/verify-email/{TOKEN}
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Access Protected Route
```bash
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

## Run Tests
```bash
# All tests
pytest

# Contract tests
pytest tests/contract/

# With coverage
pytest --cov=src --cov-report=html
```

## Architecture
- **FastAPI**: Async web framework
- **PostgreSQL**: Data store
- **Redis**: Rate limiting
- **Argon2**: Password hashing
- **JWT**: Authentication
- **SQLAlchemy**: ORM
- **Pytest**: Testing

## Key Files
- `src/main.py` - App entry
- `src/api/v1/auth.py` - Auth endpoints
- `src/services/auth_service.py` - Business logic
- `src/models/user.py` - User model
