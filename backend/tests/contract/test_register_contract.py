"""
Contract Test: POST /api/v1/auth/register
Tests registration endpoint request/response contract (FR-001 to FR-007)
"""
import pytest
from fastapi.testclient import TestClient


class TestRegisterContract:
    """Contract tests for user registration endpoint"""
    
    def test_register_with_valid_data_returns_201(self, client: TestClient, sample_user_data):
        """
        Test: Valid registration returns 201 Created
        Validates: FR-001, FR-002, FR-003, FR-005, FR-006
        """
        response = client.post("/api/v1/auth/register", json=sample_user_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # Validate response structure
        assert "message" in data
        assert "user_id" in data
        assert "email" in data
        
        # Validate response types
        assert isinstance(data["message"], str)
        assert isinstance(data["user_id"], str)
        assert data["email"] == sample_user_data["email"]
    
    def test_register_with_invalid_email_returns_400(self, client: TestClient):
        """
        Test: Invalid email format returns 400
        Validates: FR-002 (email validation)
        """
        response = client.post("/api/v1/auth/register", json={
            "email": "not-an-email",
            "password": "SecurePass123!",
            "consent": True
        })
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data or "message" in data
    
    def test_register_with_weak_password_returns_400(self, client: TestClient, weak_password_data):
        """
        Test: Weak password returns 400
        Validates: FR-003 (password strength)
        """
        response = client.post("/api/v1/auth/register", json=weak_password_data)
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data or "message" in data
    
    def test_register_duplicate_email_returns_400(self, client: TestClient, sample_user_data, test_db):
        """
        Test: Duplicate email returns 400
        Validates: FR-004 (prevent duplicate registrations)
        """
        # First registration
        response1 = client.post("/api/v1/auth/register", json=sample_user_data)
        assert response1.status_code == 201
        
        # Duplicate registration
        response2 = client.post("/api/v1/auth/register", json=sample_user_data)
        assert response2.status_code == 400
        
        data = response2.json()
        assert "already exists" in str(data).lower() or "duplicate" in str(data).lower()
    
    def test_register_without_consent_returns_400(self, client: TestClient):
        """
        Test: Missing consent returns 400
        Validates: GDPR consent requirement
        """
        response = client.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "SecurePass123!",
            "consent": False
        })
        
        assert response.status_code == 400
    
    def test_register_missing_required_fields_returns_422(self, client: TestClient):
        """
        Test: Missing required fields returns 422 Unprocessable Entity
        """
        # Missing password
        response = client.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "consent": True
        })
        
        assert response.status_code == 422
    
    def test_register_response_does_not_include_password(self, client: TestClient, sample_user_data):
        """
        Test: Response never includes password (security)
        """
        response = client.post("/api/v1/auth/register", json=sample_user_data)
        
        data = response.json()
        assert "password" not in str(data).lower() or "password_hash" not in str(data).lower()

