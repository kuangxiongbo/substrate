# API Contracts

This directory contains OpenAPI 3.0 specifications for all authentication endpoints.

## Endpoints

### Authentication
- POST /api/v1/auth/register - Register new user
- POST /api/v1/auth/login - Authenticate and get tokens
- POST /api/v1/auth/refresh - Refresh access token
- POST /api/v1/auth/logout - Revoke tokens
- GET /api/v1/auth/verify-email/{token} - Verify email
- POST /api/v1/auth/forgot-password - Request password reset
- POST /api/v1/auth/reset-password - Reset password with token
- GET /api/v1/auth/password-requirements - Get password policy

### User Management
- GET /api/v1/users/me - Get current user profile
- POST /api/v1/users/me/change-password - Change password
- GET /api/v1/users/me/data - Export user data (GDPR)
- DELETE /api/v1/users/me - Delete account (GDPR)

## Contract Testing

All endpoints have corresponding contract tests in `tests/contract/`:
- Validate request/response schemas
- Test error cases
- Verify HTTP status codes
- Ensure OpenAPI compliance

## Generation

OpenAPI specs are auto-generated from FastAPI route definitions.
View interactive docs at: http://localhost:8000/docs
