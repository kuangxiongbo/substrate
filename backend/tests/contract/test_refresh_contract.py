"""
Contract Test: POST /api/v1/auth/refresh
Tests token refresh endpoint (FR-018, FR-020)
"""
import pytest
from fastapi.testclient import TestClient


class TestRefreshContract:
    """Contract tests for token refresh endpoint"""
    
    def test_refresh_with_valid_token_returns_200(self, client: TestClient, test_db):
        """
        Test: Valid refresh token returns 200 with new tokens
        Validates: FR-018 (token refresh), FR-020 (token rotation)
        """
        # First login to get tokens
        from tests.conftest import create_test_user
        create_test_user(test_db, "refresh@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "refresh@example.com",
            "password": "SecurePass123!"
        })
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh token
        response = client.post("/api/v1/auth/refresh", json={
            "refresh_token": refresh_token
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Should return new token pair
        assert "access_token" in data
        assert "refresh_token" in data
        assert "token_type" in data
        assert "expires_in" in data
        
        # New refresh token should be different (rotation)
        assert data["refresh_token"] != refresh_token
    
    def test_refresh_with_invalid_token_returns_401(self, client: TestClient):
        """
        Test: Invalid refresh token returns 401
        """
        response = client.post("/api/v1/auth/refresh", json={
            "refresh_token": "invalid_token"
        })
        
        assert response.status_code == 401
    
    def test_refresh_with_expired_token_returns_401(self, client: TestClient):
        """
        Test: Expired refresh token returns 401
        """
        # Use a clearly expired token
        expired_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDAwMDAwMDB9.xxx"
        
        response = client.post("/api/v1/auth/refresh", json={
            "refresh_token": expired_token
        })
        
        assert response.status_code == 401
    
    def test_refresh_with_revoked_token_returns_401(self, client: TestClient, test_db):
        """
        Test: Revoked refresh token returns 401
        Validates: Token revocation after logout
        """
        # Login
        from tests.conftest import create_test_user
        create_test_user(test_db, "revoke@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "revoke@example.com",
            "password": "SecurePass123!"
        })
        refresh_token = login_response.json()["refresh_token"]
        
        # Logout (revokes token)
        client.post("/api/v1/auth/logout", json={
            "refresh_token": refresh_token
        })
        
        # Try to use revoked token
        response = client.post("/api/v1/auth/refresh", json={
            "refresh_token": refresh_token
        })
        
        assert response.status_code == 401

