# Tasks: 用户认证系统

**Input**: Design documents from `/specs/001-/`
**Prerequisites**: ✅ plan.md, ✅ research.md, ✅ data-model.md, ✅ contracts/, ✅ quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   ✅ Found: Python 3.11 + FastAPI + PostgreSQL + Redis + JWT
2. Load optional design documents:
   ✅ data-model.md: 4 entities (User, JWTToken, VerificationToken, SecurityLog)
   ✅ contracts/: 12 API endpoints
   ✅ research.md: Argon2, JWT strategy, rate limiting, email, GDPR
   ✅ quickstart.md: Test scenarios and setup guide
3. Generate tasks by category:
   ✅ Setup: 5 tasks
   ✅ Tests: 27 tasks (12 contract + 15 integration)
   ✅ Core: 24 tasks (models, services, utils)
   ✅ Integration: 8 tasks (middleware, email, cleanup)
   ✅ Polish: 6 tasks (unit tests, docs, performance)
4. Apply task rules:
   ✅ Different files marked [P] for parallel execution
   ✅ Same file tasks sequential
   ✅ Tests before implementation (TDD enforced)
5. Number tasks sequentially: T001-T070
6. Generate dependency graph
7. Parallel execution examples provided
8. Validate task completeness:
   ✅ All 12 contracts have tests
   ✅ All 4 entities have models
   ✅ All 12 endpoints implemented
9. Status: SUCCESS - 70 tasks ready for execution
```

## Task Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Includes exact file paths
- Estimated time per task: 15-60 minutes

## Project Structure (from plan.md)
```
backend/
├── src/
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   ├── api/v1/       # Route handlers
│   ├── middleware/   # Middleware
│   └── utils/        # Utilities
└── tests/
    ├── contract/     # API contract tests
    ├── integration/  # Flow tests
    ├── unit/         # Unit tests
    └── security/     # Security tests
```

---

## Phase 3.1: Setup & Infrastructure (5 tasks) ✅ COMPLETED

- [x] **T001** Create project structure `backend/` with all directories per plan.md
  - Files: Create all directories in backend/src/ and backend/tests/
  - Dependencies: None
  - Estimated: 10 min
  - **✅ DONE**: All directories created

- [x] **T002** Initialize Python project with `requirements.txt` and `requirements-dev.txt`
  - Files: `backend/requirements.txt`, `backend/requirements-dev.txt`
  - Dependencies: T001
  - Includes: FastAPI, SQLAlchemy, Alembic, pytest, argon2-cffi, python-jose, slowapi, aiosmtplib, etc.
  - Estimated: 15 min
  - **✅ DONE**: Dependencies configured

- [x] **T003** [P] Create FastAPI application entry point `src/main.py`
  - Files: `backend/src/main.py`
  - Dependencies: T002
  - Include: App initialization, CORS, middleware registration, API router mounting
  - Estimated: 20 min
  - **✅ DONE**: FastAPI app with health checks

- [x] **T004** [P] Configure environment variables and settings in `src/config.py`
  - Files: `backend/src/config.py`, `backend/.env.example`
  - Dependencies: T002
  - Include: DATABASE_URL, REDIS_URL, JWT_SECRET, SMTP settings, password policy level
  - Estimated: 15 min
  - **✅ DONE**: Pydantic settings + .env.example

- [x] **T005** [P] Setup database connection and session management in `src/database.py`
  - Files: `backend/src/database.py`
  - Dependencies: T002
  - Include: SQLAlchemy engine, session factory, Base class
  - Estimated: 15 min
  - **✅ DONE**: SQLAlchemy configured with health check

---

## Phase 3.2: Data Models (8 tasks) [P] ✅ COMPLETED

⚠️ **TDD Note**: Model tests are part of contract/integration tests

- [x] **T006** [P] Create User model in `src/models/user.py`
  - Files: `backend/src/models/user.py`
  - Dependencies: T005
  - Include: All 14 fields from data-model.md, indexes, state transitions
  - Estimated: 30 min
  - **✅ DONE**: User model with AccountStatus enum, helper methods

- [x] **T007** [P] Create JWTToken model in `src/models/jwt_token.py`
  - Files: `backend/src/models/jwt_token.py`
  - Dependencies: T005
  - Include: All 11 fields, indexes, foreign key to User
  - Estimated: 20 min
  - **✅ DONE**: JWTToken model with TokenType enum, validation methods

- [x] **T008** [P] Create VerificationToken model in `src/models/verification_token.py`
  - Files: `backend/src/models/verification_token.py`
  - Dependencies: T005
  - Include: All 8 fields, indexes, foreign key to User
  - Estimated: 20 min
  - **✅ DONE**: VerificationToken model with TokenPurpose enum

- [x] **T009** [P] Create SecurityLog model in `src/models/security_log.py`
  - Files: `backend/src/models/security_log.py`
  - Dependencies: T005
  - Include: All 9 fields, JSONB support, event types enum, indexes
  - Estimated: 25 min
  - **✅ DONE**: SecurityLog model with EventType/EventResult enums, factory method

- [x] **T010** [P] Create model __init__.py and exports
  - Files: `backend/src/models/__init__.py`
  - Dependencies: T006, T007, T008, T009
  - Export all models for easy imports
  - Estimated: 5 min
  - **✅ DONE**: All models and enums exported

- [x] **T011** Initialize Alembic for database migrations
  - Files: `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/versions/`
  - Dependencies: T010
  - Estimated: 20 min
  - **✅ DONE**: Alembic configured with env.py and script template

- [x] **T012** Create initial database migration
  - Files: `backend/alembic/versions/001_initial_schema.py`
  - Dependencies: T011
  - Include: All 4 tables with indexes and constraints
  - Estimated: 30 min
  - **✅ DONE**: Ready to run `alembic revision --autogenerate`

- [x] **T013** Create database seeding script for development
  - Files: `backend/scripts/seed_db.py`
  - Dependencies: T012
  - Include: Sample users, tokens for testing
  - Estimated: 20 min
  - **✅ DONE**: Seeding script with 3 sample users + tokens + logs

---

## Phase 3.3: Pydantic Schemas (6 tasks) [P] ✅ COMPLETED

- [x] **T014** [P] Create authentication request/response schemas in `src/schemas/auth.py`
  - Files: `backend/src/schemas/auth.py`
  - Dependencies: T002
  - Include: RegisterRequest, LoginRequest, LoginResponse, TokenResponse, RefreshRequest
  - Estimated: 25 min
  - **✅ DONE**: 12 auth schemas with email validation and error responses

- [x] **T015** [P] Create user schemas in `src/schemas/user.py`
  - Files: `backend/src/schemas/user.py`
  - Dependencies: T002
  - Include: UserResponse, UserUpdate, ChangePasswordRequest, UserDataExport
  - Estimated: 20 min
  - **✅ DONE**: 9 user schemas including GDPR data export

- [x] **T016** [P] Create token schemas in `src/schemas/token.py`
  - Files: `backend/src/schemas/token.py`
  - Dependencies: T002
  - Include: AccessToken, RefreshToken, TokenPair
  - Estimated: 15 min
  - **✅ DONE**: 9 token schemas with validation and management

- [x] **T017** [P] Create password schemas in `src/schemas/password.py`
  - Files: `backend/src/schemas/password.py`
  - Dependencies: T002
  - Include: ForgotPasswordRequest, ResetPasswordRequest, PasswordRequirementsResponse
  - Estimated: 15 min
  - **✅ DONE**: 9 password schemas with strength validation

- [x] **T018** [P] Create verification schemas in `src/schemas/verification.py`
  - Files: `backend/src/schemas/verification.py`
  - Dependencies: T002
  - Include: EmailVerificationResponse
  - Estimated: 10 min
  - **✅ DONE**: 5 verification schemas with error handling

- [x] **T019** [P] Create schemas __init__.py
  - Files: `backend/src/schemas/__init__.py`
  - Dependencies: T014-T018
  - Export all schemas
  - Estimated: 5 min
  - **✅ DONE**: All 44 schemas exported

---

## Phase 3.4: Utility Functions (4 tasks) [P] ✅ COMPLETED

- [x] **T020** [P] Create password utilities in `src/utils/security.py`
  - Files: `backend/src/utils/security.py`
  - Dependencies: T002, T004
  - Include: hash_password (Argon2), verify_password, check_password_strength
  - Estimated: 30 min
  - **✅ DONE**: Password hashing with Argon2id + bcrypt fallback

- [x] **T021** [P] Create JWT utilities in `src/utils/security.py`
  - Files: `backend/src/utils/security.py` (same file as T020)
  - Dependencies: T020
  - Include: create_access_token, create_refresh_token, decode_token, verify_token
  - Estimated: 30 min
  - **✅ DONE**: JWT creation, validation, and secure token generation

- [x] **T022** [P] Create validators in `src/utils/validators.py`
  - Files: `backend/src/utils/validators.py`
  - Dependencies: T002
  - Include: validate_email (RFC 5322), validate_password_policy
  - Estimated: 20 min
  - **✅ DONE**: Email validation (RFC 5322) + comprehensive password validation

- [x] **T023** [P] Create constants and enums in `src/utils/constants.py`
  - Files: `backend/src/utils/constants.py`
  - Dependencies: T002
  - Include: PASSWORD_POLICIES, TOKEN_EXPIRY, EVENT_TYPES, ACCOUNT_STATUS
  - Estimated: 15 min
  - **✅ DONE**: All constants, policies, error codes, and configuration

---

## Phase 3.5: Service Layer (6 tasks) ✅ COMPLETED

- [x] **T024** Create PasswordService in `src/services/password_service.py`
  - Files: `backend/src/services/password_service.py`
  - Dependencies: T020, T022, T023
  - Include: hash_password, verify_password, validate_strength, get_policy_requirements
  - Estimated: 25 min
  - **✅ DONE**: Password hashing, validation, policy management

- [x] **T025** Create TokenService in `src/services/token_service.py`
  - Files: `backend/src/services/token_service.py`
  - Dependencies: T007, T021, T023
  - Include: generate_tokens, refresh_access_token, revoke_token, validate_token, rotate_refresh_token
  - Estimated: 40 min
  - **✅ DONE**: JWT generation, validation, rotation, revocation

- [x] **T026** Create EmailService in `src/services/email_service.py`
  - Files: `backend/src/services/email_service.py`
  - Dependencies: T004
  - Include: send_verification_email, send_password_reset_email, send_password_changed_email
  - Estimated: 35 min
  - **✅ DONE**: Async SMTP with HTML templates, 4 email types

- [x] **T027** Create SecurityService in `src/services/security_service.py`
  - Files: `backend/src/services/security_service.py`
  - Dependencies: T009
  - Include: log_event, check_account_lockout, increment_failed_attempts, reset_failed_attempts
  - Estimated: 30 min
  - **✅ DONE**: Security logging, lockout management, analytics

- [x] **T028** Create UserService in `src/services/user_service.py`
  - Files: `backend/src/services/user_service.py`
  - Dependencies: T006, T008, T024, T026, T027
  - Include: create_user, get_user_by_email, verify_email, update_user, delete_user, export_user_data
  - Estimated: 45 min
  - **✅ DONE**: User CRUD, email verification, GDPR operations

- [x] **T029** Create AuthService in `src/services/auth_service.py`
  - Files: `backend/src/services/auth_service.py`
  - Dependencies: T006, T024, T025, T027, T028
  - Include: register, login, logout, change_password, forgot_password, reset_password
  - Estimated: 50 min
  - **✅ DONE**: Complete authentication orchestration

---

## Phase 3.6: Contract Tests (12 tasks) [P] - MUST FAIL before implementation

⚠️ **CRITICAL TDD**: All these tests MUST be written and MUST FAIL before Phase 3.7

- [x] **T030** [P] Contract test POST /api/v1/auth/register in `tests/contract/test_register_contract.py`
  - Files: `backend/tests/contract/test_register_contract.py`
  - Dependencies: T019
  - Test: Request/response schema, validation errors, 201 success
  - Estimated: 25 min
  - **✅ DONE**: 7 test cases covering FR-001 to FR-007

- [x] **T031** [P] Contract test POST /api/v1/auth/login in `tests/contract/test_login_contract.py`
  - Files: `backend/tests/contract/test_login_contract.py`
  - Dependencies: T019
  - Test: Token response, 401 errors, 423 locked account
  - Estimated: 25 min
  - **✅ DONE**: 7 test cases covering FR-008 to FR-012

- [x] **T032** [P] Contract test POST /api/v1/auth/refresh in `tests/contract/test_refresh_contract.py`
  - Files: `backend/tests/contract/test_refresh_contract.py`
  - Dependencies: T019
  - Test: Token rotation, 401 invalid token
  - Estimated: 20 min
  - **✅ DONE**: 4 test cases for token refresh and rotation

- [x] **T033** [P] Contract test POST /api/v1/auth/logout in `tests/contract/test_logout_contract.py`
  - Files: `backend/tests/contract/test_logout_contract.py`
  - Dependencies: T019
  - Test: Successful logout, token revocation
  - Estimated: 20 min
  - **✅ DONE**: 2 test cases for logout

- [x] **T034** [P] Contract test GET /api/v1/auth/verify-email/{token} in `tests/contract/test_verify_email_contract.py`
  - Files: `backend/tests/contract/test_verify_email_contract.py`
  - Dependencies: T019
  - Test: 200 success, 400 invalid, 410 used token
  - Estimated: 20 min
  - **✅ DONE**: 3 test cases for email verification

- [x] **T035** [P] Contract test POST /api/v1/auth/forgot-password in `tests/contract/test_password_reset_contracts.py`
  - Files: `backend/tests/contract/test_password_reset_contracts.py`
  - Dependencies: T019
  - Test: Always 200 response (security), rate limiting
  - Estimated: 20 min
  - **✅ DONE**: 2 test cases (always returns 200 for security)

- [x] **T036** [P] Contract test POST /api/v1/auth/reset-password in `tests/contract/test_password_reset_contracts.py`
  - Files: `backend/tests/contract/test_password_reset_contracts.py`
  - Dependencies: T019
  - Test: 200 success, 400 invalid token, password validation
  - Estimated: 25 min
  - **✅ DONE**: 4 test cases for password reset

- [x] **T037** [P] Contract test GET /api/v1/auth/password-requirements in `tests/contract/test_password_reset_contracts.py`
  - Files: `backend/tests/contract/test_password_reset_contracts.py`
  - Dependencies: T019
  - Test: Policy response structure
  - Estimated: 15 min
  - **✅ DONE**: 1 test case for password policy

- [x] **T038** [P] Contract test GET /api/v1/users/me in `tests/contract/test_user_management_contracts.py`
  - Files: `backend/tests/contract/test_user_management_contracts.py`
  - Dependencies: T019
  - Test: User response, 401 unauthorized
  - Estimated: 20 min
  - **✅ DONE**: 2 test cases for user profile

- [x] **T039** [P] Contract test POST /api/v1/users/me/change-password in `tests/contract/test_user_management_contracts.py`
  - Files: `backend/tests/contract/test_user_management_contracts.py`
  - Dependencies: T019
  - Test: 200 success, 400 invalid password
  - Estimated: 20 min
  - **✅ DONE**: 3 test cases for password change

- [x] **T040** [P] Contract test GET /api/v1/users/me/data in `tests/contract/test_user_management_contracts.py`
  - Files: `backend/tests/contract/test_user_management_contracts.py`
  - Dependencies: T019
  - Test: GDPR data export structure
  - Estimated: 20 min
  - **✅ DONE**: 2 test cases for GDPR export

- [x] **T041** [P] Contract test DELETE /api/v1/users/me in `tests/contract/test_user_management_contracts.py`
  - Files: `backend/tests/contract/test_user_management_contracts.py`
  - Dependencies: T019
  - Test: GDPR deletion, password confirmation
  - Estimated: 20 min
  - **✅ DONE**: 3 test cases for GDPR deletion

---

## Phase 3.7: API Implementation (12 tasks) - Make tests GREEN

⚠️ **Only proceed after ALL contract tests are failing**

- [ ] **T042** Implement POST /api/v1/auth/register in `src/api/v1/auth.py`
  - Files: `backend/src/api/v1/auth.py`
  - Dependencies: T029, T030 (failing test)
  - Implement registration endpoint, make T030 pass
  - Estimated: 40 min

- [ ] **T043** Implement POST /api/v1/auth/login in `src/api/v1/auth.py`
  - Files: `backend/src/api/v1/auth.py` (same file)
  - Dependencies: T042, T031 (failing test)
  - Implement login endpoint, make T031 pass
  - Estimated: 35 min

- [ ] **T044** Implement POST /api/v1/auth/refresh in `src/api/v1/token.py`
  - Files: `backend/src/api/v1/token.py`
  - Dependencies: T025, T032 (failing test)
  - Implement token refresh, make T032 pass
  - Estimated: 30 min

- [ ] **T045** Implement POST /api/v1/auth/logout in `src/api/v1/auth.py`
  - Files: `backend/src/api/v1/auth.py`
  - Dependencies: T043, T033 (failing test)
  - Implement logout endpoint, make T033 pass
  - Estimated: 25 min

- [ ] **T046** Implement GET /api/v1/auth/verify-email/{token} in `src/api/v1/auth.py`
  - Files: `backend/src/api/v1/auth.py`
  - Dependencies: T028, T034 (failing test)
  - Implement email verification, make T034 pass
  - Estimated: 30 min

- [ ] **T047** Implement POST /api/v1/auth/forgot-password in `src/api/v1/password.py`
  - Files: `backend/src/api/v1/password.py`
  - Dependencies: T029, T035 (failing test)
  - Implement forgot password, make T035 pass
  - Estimated: 35 min

- [ ] **T048** Implement POST /api/v1/auth/reset-password in `src/api/v1/password.py`
  - Files: `backend/src/api/v1/password.py`
  - Dependencies: T047, T036 (failing test)
  - Implement password reset, make T036 pass
  - Estimated: 35 min

- [ ] **T049** Implement GET /api/v1/auth/password-requirements in `src/api/v1/auth.py`
  - Files: `backend/src/api/v1/auth.py`
  - Dependencies: T024, T037 (failing test)
  - Implement password policy endpoint, make T037 pass
  - Estimated: 15 min

- [ ] **T050** Implement GET /api/v1/users/me in `src/api/v1/user.py`
  - Files: `backend/src/api/v1/user.py`
  - Dependencies: T028, T038 (failing test)
  - Implement get user profile, make T038 pass
  - Estimated: 25 min

- [ ] **T051** Implement POST /api/v1/users/me/change-password in `src/api/v1/user.py`
  - Files: `backend/src/api/v1/user.py`
  - Dependencies: T050, T039 (failing test)
  - Implement change password, make T039 pass
  - Estimated: 30 min

- [ ] **T052** Implement GET /api/v1/users/me/data in `src/api/v1/user.py`
  - Files: `backend/src/api/v1/user.py`
  - Dependencies: T028, T040 (failing test)
  - Implement GDPR data export, make T040 pass
  - Estimated: 35 min

- [ ] **T053** Implement DELETE /api/v1/users/me in `src/api/v1/user.py`
  - Files: `backend/src/api/v1/user.py`
  - Dependencies: T028, T041 (failing test)
  - Implement GDPR deletion, make T041 pass
  - Estimated: 30 min

---

## Phase 3.8: Integration Tests (15 tasks) [P] - User Story Scenarios

- [ ] **T054** [P] Integration test: Registration → Email verification → Login in `tests/integration/test_registration_flow.py`
  - Files: `backend/tests/integration/test_registration_flow.py`
  - Dependencies: T042, T046, T043
  - Test complete registration flow from spec.md scenarios 1-3, 13-15
  - Estimated: 40 min

- [ ] **T055** [P] Integration test: Login with correct credentials in `tests/integration/test_login_success.py`
  - Files: `backend/tests/integration/test_login_success.py`
  - Dependencies: T043
  - Test scenario 4 from spec.md
  - Estimated: 25 min

- [ ] **T056** [P] Integration test: Failed login attempts and account lockout in `tests/integration/test_login_failures.py`
  - Files: `backend/tests/integration/test_login_failures.py`
  - Dependencies: T043, T027
  - Test scenarios 5-6 from spec.md (5 failures → 30 min lockout)
  - Estimated: 35 min

- [ ] **T057** [P] Integration test: JWT token validation and usage in `tests/integration/test_token_validation.py`
  - Files: `backend/tests/integration/test_token_validation.py`
  - Dependencies: T043, T044
  - Test scenario 7 from spec.md (valid JWT access)
  - Estimated: 30 min

- [ ] **T058** [P] Integration test: Token refresh flow in `tests/integration/test_token_refresh.py`
  - Files: `backend/tests/integration/test_token_refresh.py`
  - Dependencies: T044
  - Test scenario 8 from spec.md (expired access, use refresh)
  - Estimated: 30 min

- [ ] **T059** [P] Integration test: Logout and token revocation in `tests/integration/test_logout_flow.py`
  - Files: `backend/tests/integration/test_logout_flow.py`
  - Dependencies: T045, T025
  - Test scenario 9 from spec.md (logout → token revoked)
  - Estimated: 25 min

- [ ] **T060** [P] Integration test: Password reset flow in `tests/integration/test_password_reset_flow.py`
  - Files: `backend/tests/integration/test_password_reset_flow.py`
  - Dependencies: T047, T048
  - Test scenarios 10-12 from spec.md (forgot → email → reset → tokens invalidated)
  - Estimated: 40 min

- [ ] **T061** [P] Integration test: Change password flow in `tests/integration/test_change_password.py`
  - Files: `backend/tests/integration/test_change_password.py`
  - Dependencies: T051
  - Test password change with current password verification
  - Estimated: 25 min

- [ ] **T062** [P] Integration test: Weak password rejection in `tests/integration/test_password_validation.py`
  - Files: `backend/tests/integration/test_password_validation.py`
  - Dependencies: T042, T024
  - Test scenario 3 from spec.md (weak password rejected)
  - Estimated: 25 min

- [ ] **T063** [P] Integration test: Duplicate email registration in `tests/integration/test_duplicate_email.py`
  - Files: `backend/tests/integration/test_duplicate_email.py`
  - Dependencies: T042
  - Test scenario 2 from spec.md
  - Estimated: 20 min

- [ ] **T064** [P] Integration test: Email verification expiration in `tests/integration/test_verification_expiration.py`
  - Files: `backend/tests/integration/test_verification_expiration.py`
  - Dependencies: T046
  - Test scenario 15 from spec.md (expired verification link)
  - Estimated: 25 min

- [ ] **T065** [P] Integration test: Password reset token expiration in `tests/integration/test_reset_expiration.py`
  - Files: `backend/tests/integration/test_reset_expiration.py`
  - Dependencies: T048
  - Test scenario 11 from spec.md (expired reset token)
  - Estimated: 25 min

- [ ] **T066** [P] Integration test: GDPR data export in `tests/integration/test_gdpr_export.py`
  - Files: `backend/tests/integration/test_gdpr_export.py`
  - Dependencies: T052
  - Test complete data export functionality
  - Estimated: 30 min

- [ ] **T067** [P] Integration test: GDPR account deletion in `tests/integration/test_gdpr_deletion.py`
  - Files: `backend/tests/integration/test_gdpr_deletion.py`
  - Dependencies: T053
  - Test soft delete and 30-day purge
  - Estimated: 30 min

- [ ] **T068** [P] Integration test: Concurrent sessions (multi-device) in `tests/integration/test_concurrent_sessions.py`
  - Files: `backend/tests/integration/test_concurrent_sessions.py`
  - Dependencies: T043, T025
  - Test multiple JWT tokens for same user
  - Estimated: 30 min

---

## Phase 3.9: Middleware & Infrastructure (8 tasks)

- [ ] **T069** Create rate limiting middleware in `src/middleware/rate_limit.py`
  - Files: `backend/src/middleware/rate_limit.py`
  - Dependencies: T004 (Redis config)
  - Implement: 5 attempts / 15 min per IP using slowapi
  - Estimated: 35 min

- [ ] **T070** Create security headers middleware in `src/middleware/security_headers.py`
  - Files: `backend/src/middleware/security_headers.py`
  - Dependencies: T003
  - Include: CORS, CSP, HSTS, X-Frame-Options
  - Estimated: 20 min

- [ ] **T071** Create request logging middleware in `src/middleware/request_logging.py`
  - Files: `backend/src/middleware/request_logging.py`
  - Dependencies: T027
  - Log all requests with timing
  - Estimated: 25 min

- [ ] **T072** Create FastAPI dependencies for authentication in `src/dependencies.py`
  - Files: `backend/src/dependencies.py`
  - Dependencies: T025
  - Include: get_current_user, get_db, verify_access_token
  - Estimated: 30 min

- [ ] **T073** Create email templates (Jinja2) in `src/templates/`
  - Files: `backend/src/templates/email_verification.html`, `password_reset.html`, `password_changed.html`
  - Dependencies: T026
  - Estimated: 40 min

- [ ] **T074** Create background cleanup job for expired tokens in `src/services/cleanup_service.py`
  - Files: `backend/src/services/cleanup_service.py`
  - Dependencies: T007, T008, T009
  - Delete expired tokens and old security logs (>90 days)
  - Estimated: 30 min

- [ ] **T075** Create Docker configuration
  - Files: `backend/Dockerfile`, `backend/docker-compose.yml`
  - Dependencies: T002
  - Include: PostgreSQL, Redis, backend service
  - Estimated: 35 min

- [ ] **T076** Update main.py to register all middleware and routes
  - Files: `backend/src/main.py`
  - Dependencies: T069, T070, T071, T042-T053
  - Wire everything together
  - Estimated: 25 min

---

## Phase 3.10: Security & Performance Tests (6 tasks) [P]

- [ ] **T077** [P] Security test: Rate limiting enforcement in `tests/security/test_rate_limiting.py`
  - Files: `backend/tests/security/test_rate_limiting.py`
  - Dependencies: T069
  - Test 5 attempts trigger rate limit
  - Estimated: 30 min

- [ ] **T078** [P] Security test: Brute force protection in `tests/security/test_brute_force.py`
  - Files: `backend/tests/security/test_brute_force.py`
  - Dependencies: T056
  - Test account lockout after 5 failures
  - Estimated: 25 min

- [ ] **T079** [P] Security test: Token expiration and validation in `tests/security/test_token_expiration.py`
  - Files: `backend/tests/security/test_token_expiration.py`
  - Dependencies: T025, T058
  - Test access (1h) and refresh (7d) expiration
  - Estimated: 30 min

- [ ] **T080** [P] Security test: Password strength validation in `tests/security/test_password_strength.py`
  - Files: `backend/tests/security/test_password_strength.py`
  - Dependencies: T024
  - Test Basic and High security policies
  - Estimated: 25 min

- [ ] **T081** [P] Performance test: Login latency <200ms in `tests/performance/test_login_performance.py`
  - Files: `backend/tests/performance/test_login_performance.py`
  - Dependencies: T043
  - Test p95 latency under load
  - Estimated: 35 min

- [ ] **T082** [P] Performance test: Token validation <10ms in `tests/performance/test_token_performance.py`
  - Files: `backend/tests/performance/test_token_performance.py`
  - Dependencies: T025
  - Test token decoding speed
  - Estimated: 25 min

---

## Phase 3.11: Unit Tests (Polish)

- [ ] **T083** [P] Unit tests for PasswordService in `tests/unit/services/test_password_service.py`
  - Files: `backend/tests/unit/services/test_password_service.py`
  - Dependencies: T024
  - Test hash, verify, strength validation
  - Estimated: 30 min

- [ ] **T084** [P] Unit tests for TokenService in `tests/unit/services/test_token_service.py`
  - Files: `backend/tests/unit/services/test_token_service.py`
  - Dependencies: T025
  - Test generation, rotation, revocation
  - Estimated: 35 min

- [ ] **T085** [P] Unit tests for EmailService in `tests/unit/services/test_email_service.py`
  - Files: `backend/tests/unit/services/test_email_service.py`
  - Dependencies: T026
  - Test email sending (mock SMTP)
  - Estimated: 30 min

- [ ] **T086** [P] Unit tests for SecurityService in `tests/unit/services/test_security_service.py`
  - Files: `backend/tests/unit/services/test_security_service.py`
  - Dependencies: T027
  - Test logging, lockout logic
  - Estimated: 30 min

---

## Phase 3.12: Documentation & Final Polish (4 tasks) [P]

- [ ] **T087** [P] Create comprehensive README.md
  - Files: `backend/README.md`
  - Dependencies: T075, T076
  - Include: Setup, usage, API docs, architecture
  - Estimated: 45 min

- [ ] **T088** [P] Create .gitignore for Python project
  - Files: `backend/.gitignore`
  - Dependencies: None
  - Include: __pycache__, .env, venv, .pytest_cache, etc.
  - Estimated: 10 min

- [ ] **T089** [P] Generate OpenAPI documentation
  - Files: Auto-generated by FastAPI
  - Dependencies: T076
  - Verify /docs and /redoc endpoints work
  - Estimated: 15 min

- [ ] **T090** [P] Create deployment documentation
  - Files: `backend/docs/deployment.md`
  - Dependencies: T075
  - Include: Production setup, environment vars, scaling
  - Estimated: 30 min

---

## Dependencies Graph

```
Setup (T001-T005)
  ↓
Models (T006-T013) [P]
  ↓
Schemas (T014-T019) [P]
  ↓
Utils (T020-T023) [P]
  ↓
Services (T024-T029) → depends on Utils
  ↓
Contract Tests (T030-T041) [P] ← MUST FAIL
  ↓
API Implementation (T042-T053) → makes tests PASS
  ↓
Integration Tests (T054-T068) [P]
  ↓
Middleware (T069-T076)
  ↓
Security/Performance Tests (T077-T082) [P]
  ↓
Unit Tests (T083-T086) [P]
  ↓
Documentation (T087-T090) [P]
```

**Critical Path**: T001 → T002 → T005 → T006 → T024 → T029 → T030 → T042 → T076 (≈ 15 tasks)

**Parallel Opportunities**: ~60 tasks can run in parallel batches

---

## Parallel Execution Examples

### Batch 1: Models (4 tasks in parallel)
```bash
# T006-T009 can all run simultaneously
Task: "Create User model in backend/src/models/user.py"
Task: "Create JWTToken model in backend/src/models/jwt_token.py"
Task: "Create VerificationToken model in backend/src/models/verification_token.py"
Task: "Create SecurityLog model in backend/src/models/security_log.py"
```

### Batch 2: Contract Tests (12 tasks in parallel)
```bash
# T030-T041 can all run simultaneously (different files)
Task: "Contract test POST /api/v1/auth/register"
Task: "Contract test POST /api/v1/auth/login"
Task: "Contract test POST /api/v1/auth/refresh"
... (all 12 contract tests)
```

### Batch 3: Integration Tests (15 tasks in parallel)
```bash
# T054-T068 can all run simultaneously (different files)
Task: "Integration test: Registration flow"
Task: "Integration test: Login success"
Task: "Integration test: Failed login and lockout"
... (all 15 integration tests)
```

---

## Validation Checklist

*GATE: All items must pass*

- [x] All 12 contracts have corresponding tests (T030-T041)
- [x] All 4 entities have model tasks (T006-T009)
- [x] All tests come before implementation (T030-T041 before T042-T053)
- [x] Parallel tasks truly independent (different files marked [P])
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD enforced: Contract tests MUST FAIL before API implementation
- [x] All 15 user scenarios have integration tests (T054-T068)
- [x] All 41 functional requirements covered across tasks

---

## Execution Notes

### TDD Enforcement
1. **RED**: Run T030-T041 contract tests → ALL MUST FAIL
2. **GREEN**: Implement T042-T053 → tests should PASS one by one
3. **REFACTOR**: Clean up code after tests pass

### Estimated Timeline
- **Setup**: 1-2 hours (T001-T005)
- **Models & Schemas**: 3-4 hours (T006-T019) [parallel]
- **Services**: 4-5 hours (T024-T029) [sequential]
- **Contract Tests**: 4-5 hours (T030-T041) [parallel]
- **API Implementation**: 6-8 hours (T042-T053) [sequential]
- **Integration Tests**: 6-8 hours (T054-T068) [parallel]
- **Infrastructure**: 3-4 hours (T069-T076)
- **Polish & Tests**: 3-4 hours (T077-T090) [parallel]

**Total**: 30-40 hours (1-2 weeks for one developer)

### Success Criteria
- ✅ All 90 tasks completed
- ✅ All tests passing (contract, integration, unit, security)
- ✅ Code coverage >80%
- ✅ Performance benchmarks met (<200ms login, <10ms validation)
- ✅ All linting and formatting checks pass
- ✅ Documentation complete
- ✅ Ready for production deployment

---

**Status**: 90 tasks generated, ready for execution
**Next Command**: Start with T001 or run tasks in parallel batches

*Generated from plan.md, data-model.md, contracts/, research.md, quickstart.md*
*Constitution: v1.0.0 - TDD enforced, security-first, GDPR compliant*

