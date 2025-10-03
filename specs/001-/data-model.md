# Data Model

## Entity: User

**Purpose**: Registered account holder

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Email address (lowercase) |
| password_hash | VARCHAR(255) | NOT NULL | Argon2id hash |
| email_verified | BOOLEAN | DEFAULT FALSE | Verification status |
| account_status | ENUM | DEFAULT 'inactive' | active\|inactive\|locked\|deleted |
| failed_login_attempts | INTEGER | DEFAULT 0 | Consecutive failures |
| account_locked_until | TIMESTAMP | NULL | Lockout expiration |
| registration_timestamp | TIMESTAMP | NOT NULL | Creation time |
| last_login_timestamp | TIMESTAMP | NULL | Last successful login |
| last_password_change | TIMESTAMP | NOT NULL | Password update time |
| consent_timestamp | TIMESTAMP | NOT NULL | GDPR consent time |
| consent_status | BOOLEAN | NOT NULL | Data processing consent |
| created_at | TIMESTAMP | NOT NULL | Record creation |
| updated_at | TIMESTAMP | NOT NULL | Last update |

**Indexes**:
- `idx_user_email` UNIQUE on `email`
- `idx_user_status` on `account_status`

**State Transitions**:
- inactive → active (email verification)
- active → locked (5 failed logins)
- locked → active (lockout expires)
- * → deleted (user deletion)

---

## Entity: JWTToken

**Purpose**: Refresh tokens and revoked access tokens

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Token record ID |
| jti | VARCHAR(36) | UNIQUE, INDEX | JWT ID claim |
| user_id | UUID | FK → User, INDEX | Associated user |
| token_type | ENUM | NOT NULL | access\|refresh |
| token_value | VARCHAR(512) | NULL | Refresh token value |
| issued_at | TIMESTAMP | NOT NULL | Issue time |
| expires_at | TIMESTAMP | NOT NULL, INDEX | Expiration |
| revoked | BOOLEAN | DEFAULT FALSE, INDEX | Revocation status |
| revoked_at | TIMESTAMP | NULL | Revocation time |
| device_info | VARCHAR(255) | NULL | User-agent |
| created_at | TIMESTAMP | NOT NULL | Record creation |

**Indexes**:
- `idx_token_jti` UNIQUE on `jti`
- `idx_token_user_revoked` on `(user_id, revoked)`
- `idx_token_expires` on `expires_at`

**Cleanup**: Daily job deletes expired+revoked tokens >24h old

---

## Entity: VerificationToken

**Purpose**: Email verification and password reset tokens

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Token record ID |
| token | VARCHAR(64) | UNIQUE, INDEX | Secure random token |
| user_id | UUID | FK → User, INDEX | Associated user |
| token_type | ENUM | NOT NULL | email_verification\|password_reset |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| expires_at | TIMESTAMP | NOT NULL, INDEX | Expiration |
| used | BOOLEAN | DEFAULT FALSE | One-time flag |
| used_at | TIMESTAMP | NULL | Usage time |

**Indexes**:
- `idx_verification_token` UNIQUE on `token`
- `idx_verification_user` on `user_id`
- `idx_verification_expires` on `expires_at`

**Expiration**:
- Email verification: 24 hours
- Password reset: 1 hour

---

## Entity: SecurityLog

**Purpose**: Security audit trail

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Log entry ID |
| event_type | VARCHAR(50) | NOT NULL, INDEX | Event type |
| user_id | UUID | FK → User, NULL, INDEX | User (if applicable) |
| timestamp | TIMESTAMP | NOT NULL, INDEX | Event time |
| ip_address | VARCHAR(45) | NULL | Source IP |
| user_agent | VARCHAR(512) | NULL | Client info |
| result | ENUM | NOT NULL | success\|failure |
| failure_reason | VARCHAR(255) | NULL | Error details |
| additional_context | JSONB | NULL | Extra data |

**Event Types**:
- login_success, login_failed, logout
- registration, email_verification
- password_change, password_reset_requested, password_reset_completed
- account_locked, account_unlocked
- token_refresh, invalid_token
- rate_limit_exceeded
- data_export_request, data_deletion_request

**Indexes**:
- `idx_log_timestamp` on `timestamp`
- `idx_log_user_timestamp` on `(user_id, timestamp)`
- `idx_log_event_type` on `event_type`

**Partitioning**: By month for 90-day retention cleanup

---

## Relationships

```
User (1) ──< (N) JWTToken
User (1) ──< (N) VerificationToken
User (1) ──< (N) SecurityLog
```

All foreign keys use ON DELETE CASCADE
