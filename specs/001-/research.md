# Research & Technology Decisions

## Password Hashing

**Question**: Choose between bcrypt, Argon2, or PBKDF2?

**Decision**: **Argon2id** (with bcrypt as fallback)

**Rationale**:
- Winner of Password Hashing Competition (2015)
- Memory-hard (resistant to GPU/ASIC attacks)
- Side-channel attack resistant
- Python: `argon2-cffi` library

**Configuration**:
- time_cost=2, memory_cost=65536 (64MB), parallelism=4
- Unique salt per password (automatic)
- Optional pepper in environment variable

**Alternatives**: bcrypt (good), PBKDF2 (weaker against GPU)

---

## JWT Token Strategy

**Question**: Stateless JWT vs. stateful sessions vs. hybrid?

**Decision**: **Hybrid** - Stateless access + tracked refresh tokens

**Rationale**:
- Access tokens (1h): Stateless for performance  
- Refresh tokens (7d): Database-tracked for revocation
- Enables token rotation (FR-020)
- Can invalidate all tokens on password change

**Implementation**:
- Access: JWT with (user_id, exp, iat, jti)
- Refresh: Random string in JWTToken table
- Library: `python-jose[cryptography]`

---

## Rate Limiting

**Question**: How to implement 5 attempts / 15 min / IP?

**Decision**: **Redis-based sliding window** via slowapi

**Rationale**:
- Sliding window > fixed window (more accurate)
- Redis atomic operations (thread-safe)
- Fast (<1ms), scalable across instances
- Shared state for horizontal scaling

**Implementation**:
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)
@limiter.limit("5/15minutes")
```

---

## Email Service

**Decision**: **Async SMTP** with aiosmtplib + Jinja2 templates

**Rationale**:
- Non-blocking email sending
- Template engine for maintainability
- Configurable SMTP provider

**Templates**:
- email_verification.html
- password_reset.html  
- password_changed_confirmation.html

**Providers**: SendGrid / AWS SES / Mailhog (dev)

---

## Database Indexes

**Key Indexes**:
- `users.email` (unique, btree)
- `jwt_tokens.jti` (unique)
- `jwt_tokens.user_id + revoked` (composite)
- `verification_tokens.token` (unique)
- `security_logs.timestamp` (for cleanup)
- `security_logs.user_id + timestamp` (audit queries)

**Partitioning**: SecurityLog by month for 90-day retention

---

## GDPR Compliance

**Implementation**:
- Right to Access: GET /users/me/data (JSON export)
- Right to Deletion: DELETE /users/me (soft delete → 30-day purge)
- Consent: `consent_timestamp`, `consent_status` in User model
- Data Minimization: Only email + password hash
