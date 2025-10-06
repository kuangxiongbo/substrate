"""
Contract Test: POST /api/v1/auth/logout
Tests logout endpoint (FR-016)
"""
import pytest
from fastapi.testclient import TestClient


class TestLogoutContract:
    """Contract tests for logout endpoint"""
    
    def test_logout_with_valid_token_returns_200(self, client: TestClient, test_db):
        """
        Test: Valid logout returns 200
        Validates: FR-016 (logout and token revocation)
        """
        # Login first
        from tests.conftest import create_test_user
        create_test_user(test_db, "logout@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "logout@example.com",
            "password": "SecurePass123!"
        })
        
        access_token = login_response.json()["access_token"]
        refresh_token = login_response.json()["refresh_token"]
        
        # Logout
        response = client.post(
            "/api/v1/auth/logout",
            json={"refresh_token": refresh_token},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
    
    def test_logout_without_auth_returns_401(self, client: TestClient):
        """
        Test: Logout without authentication returns 401
        """
        response = client.post("/api/v1/auth/logout", json={
            "refresh_token": "some_token"
        })
        
        assert response.status_code == 401

