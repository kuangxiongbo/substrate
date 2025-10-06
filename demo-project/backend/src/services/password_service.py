"""
Password Service
Password hashing, validation, and policy management
"""
from typing import Tuple, List, Dict, Any

from src.utils.security import hash_password, verify_password, needs_rehash
from src.utils.validators import (
    validate_password_policy,
    check_password_strength,
    is_common_password,
    contains_email,
    validate_password_security,
    get_password_policy
)
from src.utils.constants import PASSWORD_POLICIES


class PasswordService:
    """
    Service for password-related operations
    
    Responsibilities:
    - Hash and verify passwords (FR-029)
    - Validate password strength (FR-003, FR-038)
    - Enforce password policies (FR-003, FR-004)
    - Provide password requirements (FR-041)
    """
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using Argon2id
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password string
        """
        return hash_password(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash
        
        Args:
            plain_password: Plain text password
            hashed_password: Hashed password from database
            
        Returns:
            True if password matches, False otherwise
        """
        return verify_password(plain_password, hashed_password)
    
    @staticmethod
    def needs_rehash(hashed_password: str) -> bool:
        """
        Check if password hash needs updating
        
        Args:
            hashed_password: Current hashed password
            
        Returns:
            True if should be rehashed
        """
        return needs_rehash(hashed_password)
    
    @staticmethod
    def validate_password(password: str, email: str = None) -> Tuple[bool, List[str]]:
        """
        Validate password against current policy and security checks
        
        Args:
            password: Password to validate
            email: User's email (for additional security checks)
            
        Returns:
            Tuple of (is_valid: bool, errors: List[str])
            
        Example:
            >>> is_valid, errors = PasswordService.validate_password("weak")
            >>> if not is_valid:
            ...     print(f"Errors: {errors}")
        """
        errors = []
        
        # Check policy requirements
        policy_valid, policy_violations = validate_password_policy(password)
        if not policy_valid:
            errors.extend(policy_violations)
        
        # Check security (common passwords, email containment, etc.)
        if email:
            is_secure, warnings = validate_password_security(password, email)
            if not is_secure:
                errors.extend(warnings)
        
        # Check for common passwords
        if is_common_password(password):
            errors.append("This password is too common and easily guessable")
        
        is_valid = len(errors) == 0
        return is_valid, errors
    
    @staticmethod
    def get_password_strength(password: str) -> Dict[str, Any]:
        """
        Analyze password strength
        
        Args:
            password: Password to analyze
            
        Returns:
            Dict with score, strength, feedback, and policy compliance
            
        Example:
            >>> result = PasswordService.get_password_strength("SecurePass123!")
            >>> result["strength"]
            'strong'
            >>> result["score"]
            85
        """
        return check_password_strength(password)
    
    @staticmethod
    def get_policy_requirements(level: str = None) -> Dict[str, Any]:
        """
        Get current password policy requirements (FR-041)
        
        Args:
            level: Policy level ('basic' or 'high'), defaults to settings
            
        Returns:
            Policy configuration dict
            
        Example:
            >>> policy = PasswordService.get_policy_requirements()
            >>> policy["min_length"]
            8
        """
        policy = get_password_policy(level)
        return {
            "level": level or "basic",
            "min_length": policy["min_length"],
            "require_uppercase": policy["require_uppercase"],
            "require_lowercase": policy["require_lowercase"],
            "require_digit": policy["require_digit"],
            "require_special": policy["require_special"],
            "description": policy["description"]
        }
    
    @staticmethod
    def validate_and_hash(password: str, email: str = None) -> Tuple[bool, str, List[str]]:
        """
        Validate password and return hash if valid
        
        Args:
            password: Password to validate and hash
            email: User's email (for validation)
            
        Returns:
            Tuple of (is_valid: bool, password_hash: str, errors: List[str])
            
        Example:
            >>> is_valid, hash_val, errors = PasswordService.validate_and_hash("SecurePass123!")
            >>> if is_valid:
            ...     # Save hash_val to database
        """
        is_valid, errors = PasswordService.validate_password(password, email)
        
        if is_valid:
            password_hash = PasswordService.hash_password(password)
            return True, password_hash, []
        else:
            return False, "", errors

