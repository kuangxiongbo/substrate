# Database Setup Guide

## Prerequisites

1. Install PostgreSQL:
```bash
brew install postgresql
brew services start postgresql
```

2. Create database:
```bash
createdb auth_db
```

3. Install Python dependencies (including database drivers):
```bash
source venv/bin/activate
pip install sqlalchemy alembic psycopg2-binary
```

## Database Models

### 4 Core Models Created:

1. **User** (`src/models/user.py`)
   - Authentication and account management
   - Email verification status
   - Account lockout mechanism
   - GDPR compliance fields

2. **JWTToken** (`src/models/jwt_token.py`)
   - Refresh token tracking
   - Access token blacklist
   - Token rotation support

3. **VerificationToken** (`src/models/verification_token.py`)
   - Email verification tokens (24h expiry)
   - Password reset tokens (1h expiry)
   - One-time use enforcement

4. **SecurityLog** (`src/models/security_log.py`)
   - Audit trail for all security events
   - 90-day retention policy
   - GDPR compliance

## Running Migrations

### Step 1: Configure Environment
```bash
cp .env.example .env
# Edit .env and set DATABASE_URL
```

### Step 2: Create Initial Migration
```bash
# This will auto-generate migration from models
alembic revision --autogenerate -m "Initial schema"
```

### Step 3: Run Migration
```bash
alembic upgrade head
```

### Step 4: Seed Database (Optional)
```bash
python scripts/seed_db.py
```

## Alembic Commands

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current revision
alembic current

# Show migration history
alembic history
```

## Model Usage Examples

### Creating a User
```python
from src.models import User, AccountStatus
from src.database import SessionLocal

db = SessionLocal()

user = User(
    email="user@example.com",
    password_hash="hashed_password_here",
    account_status=AccountStatus.INACTIVE,
    consent_status=True
)

db.add(user)
db.commit()
```

### Checking Account Lockout
```python
if user.is_locked():
    print("Account is locked")
elif user.is_active():
    print("Account is active")
```

### Creating Security Log
```python
from src.models import SecurityLog, EventType, EventResult

log = SecurityLog.create_log(
    event_type=EventType.LOGIN_SUCCESS,
    result=EventResult.SUCCESS,
    user_id=user.id,
    ip_address="127.0.0.1"
)

db.add(log)
db.commit()
```

## Database Schema

```
users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE, INDEX)
├── password_hash (VARCHAR)
├── email_verified (BOOLEAN)
├── account_status (ENUM: active|inactive|locked|deleted, INDEX)
├── failed_login_attempts (INTEGER)
├── account_locked_until (TIMESTAMP)
├── registration_timestamp (TIMESTAMP)
├── last_login_timestamp (TIMESTAMP)
├── last_password_change (TIMESTAMP)
├── consent_timestamp (TIMESTAMP)
├── consent_status (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

jwt_tokens
├── id (UUID, PK)
├── jti (VARCHAR, UNIQUE, INDEX)
├── user_id (UUID, FK → users.id, INDEX)
├── token_type (ENUM: access|refresh)
├── token_value (VARCHAR, nullable)
├── issued_at (TIMESTAMP)
├── expires_at (TIMESTAMP, INDEX)
├── revoked (BOOLEAN, INDEX)
├── revoked_at (TIMESTAMP)
├── device_info (VARCHAR)
└── created_at (TIMESTAMP)

verification_tokens
├── id (UUID, PK)
├── token (VARCHAR, UNIQUE, INDEX)
├── user_id (UUID, FK → users.id, INDEX)
├── token_type (ENUM: email_verification|password_reset)
├── created_at (TIMESTAMP)
├── expires_at (TIMESTAMP, INDEX)
├── used (BOOLEAN)
└── used_at (TIMESTAMP)

security_logs
├── id (UUID, PK)
├── event_type (ENUM, INDEX)
├── user_id (UUID, FK → users.id, INDEX, nullable)
├── timestamp (TIMESTAMP, INDEX)
├── ip_address (VARCHAR)
├── user_agent (VARCHAR)
├── result (ENUM: success|failure)
├── failure_reason (VARCHAR)
└── additional_context (JSON)
```

## Next Steps

After database setup:
1. Continue to Phase 3.3: Pydantic Schemas
2. Implement password hashing utilities
3. Create JWT token services
4. Build API endpoints

## Troubleshooting

### Connection Error
```
Error: could not connect to server
```
Solution: Start PostgreSQL: `brew services start postgresql`

### Database Doesn't Exist
```
FATAL: database "auth_db" does not exist
```
Solution: Create it: `createdb auth_db`

### Migration Conflicts
```
ERROR: Target database is not up to date
```
Solution: Run `alembic upgrade head`
