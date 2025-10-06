"""
Contract Tests: User Management Endpoints
Tests user profile, password change, GDPR endpoints
"""
import pytest
from fastapi.testclient import TestClient


class TestGetUserContract:
    """Contract tests for GET /api/v1/users/me"""
    
    def test_get_user_with_valid_token_returns_200(self, client: TestClient, test_db):
        """
        Test: Get user profile with valid token returns 200
        Requires JWT authentication
        """
        # Login to get token
        from tests.conftest import create_test_user
        create_test_user(test_db, "getuser@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "getuser@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        # Get user profile
        response = client.get(
            "/api/v1/users/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert "id" in data
        assert "email" in data
        assert "email_verified" in data
        assert "account_status" in data
        assert data["email"] == "getuser@example.com"
        
        # Password should NOT be in response
        assert "password" not in data
        assert "password_hash" not in data
    
    def test_get_user_without_token_returns_401(self, client: TestClient):
        """
        Test: Get user without authentication returns 401
        """
        response = client.get("/api/v1/users/me")
        
        assert response.status_code == 401


class TestChangePasswordContract:
    """Contract tests for POST /api/v1/users/me/change-password"""
    
    def test_change_password_with_valid_data_returns_200(self, client: TestClient, test_db):
        """
        Test: Change password with correct current password returns 200
        Validates: FR-021, FR-022, FR-023
        """
        from tests.conftest import create_test_user
        create_test_user(test_db, "changepwd@example.com", verified=True)
        
        # Login
        login_response = client.post("/api/v1/auth/login", json={
            "email": "changepwd@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        # Change password
        response = client.post(
            "/api/v1/users/me/change-password",
            json={
                "current_password": "SecurePass123!",
                "new_password": "NewSecurePass456!"
            },
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "invalidated" in data["message"].lower() or "revoked" in data["message"].lower()
    
    def test_change_password_with_wrong_current_password_returns_400(self, client: TestClient, test_db):
        """
        Test: Wrong current password returns 400
        Validates: FR-022 (current password verification)
        """
        from tests.conftest import create_test_user
        create_test_user(test_db, "wrongpwd@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "wrongpwd@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        response = client.post(
            "/api/v1/users/me/change-password",
            json={
                "current_password": "WrongPassword!",
                "new_password": "NewSecurePass456!"
            },
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 400
    
    def test_change_password_with_weak_new_password_returns_400(self, client: TestClient, test_db):
        """
        Test: Weak new password returns 400
        Validates: FR-023 (enforce password policy)
        """
        from tests.conftest import create_test_user
        create_test_user(test_db, "weaknew@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "weaknew@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        response = client.post(
            "/api/v1/users/me/change-password",
            json={
                "current_password": "SecurePass123!",
                "new_password": "weak"
            },
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 400


class TestExportDataContract:
    """Contract tests for GET /api/v1/users/me/data (GDPR)"""
    
    def test_export_data_with_valid_token_returns_200(self, client: TestClient, test_db):
        """
        Test: Export user data returns 200
        Validates: FR-036 (GDPR Right to Access)
        """
        from tests.conftest import create_test_user
        create_test_user(test_db, "export@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "export@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        response = client.get(
            "/api/v1/users/me/data",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate GDPR export structure
        assert "user" in data
        assert "security_logs" in data
        assert "export_timestamp" in data
    
    def test_export_data_without_token_returns_401(self, client: TestClient):
        """
        Test: Export without authentication returns 401
        """
        response = client.get("/api/v1/users/me/data")
        
        assert response.status_code == 401


class TestDeleteAccountContract:
    """Contract tests for DELETE /api/v1/users/me (GDPR)"""
    
    def test_delete_account_with_valid_confirmation_returns_200(self, client: TestClient, test_db):
        """
        Test: Delete account with confirmation returns 200
        Validates: FR-036 (GDPR Right to Deletion)
        """
        from tests.conftest import create_test_user
        create_test_user(test_db, "delete@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "delete@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        response = client.delete(
            "/api/v1/users/me",
            json={
                "password": "SecurePass123!",
                "confirm": True
            },
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "30 days" in data["message"] or "deletion_date" in data
    
    def test_delete_account_without_confirmation_returns_400(self, client: TestClient, test_db):
        """
        Test: Delete without confirmation returns 400
        """
        from tests.conftest import create_test_user
        create_test_user(test_db, "noconfirm@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "noconfirm@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        response = client.delete(
            "/api/v1/users/me",
            json={
                "password": "SecurePass123!",
                "confirm": False
            },
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 400
    
    def test_delete_account_with_wrong_password_returns_400(self, client: TestClient, test_db):
        """
        Test: Delete with wrong password returns 400
        """
        from tests.conftest import create_test_user
        create_test_user(test_db, "wrongdel@example.com", verified=True)
        
        login_response = client.post("/api/v1/auth/login", json={
            "email": "wrongdel@example.com",
            "password": "SecurePass123!"
        })
        access_token = login_response.json()["access_token"]
        
        response = client.delete(
            "/api/v1/users/me",
            json={
                "password": "WrongPassword!",
                "confirm": True
            },
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 400

