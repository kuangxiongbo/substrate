"""
Custom Validators
Email validation (RFC 5322) and password policy validation
"""
import re
from typing import Tuple, List, Optional
from email_validator import validate_email, EmailNotValidError

from src.config import settings


# ============================================================================
# Email Validation
# ============================================================================

def validate_email_format(email: str) -> Tuple[bool, str]:
    """
    Validate email address according to RFC 5322
    
    Args:
        email: Email address to validate
        
    Returns:
        Tuple of (is_valid: bool, normalized_email: str)
        
    Example:
        >>> is_valid, normalized = validate_email_format("User@Example.COM")
        >>> is_valid
        True
        >>> normalized
        'user@example.com'
    """
    try:
        # Validate and normalize email
        email_info = validate_email(email, check_deliverability=False)
        normalized_email = email_info.normalized
        return True, normalized_email
    except EmailNotValidError as e:
        return False, str(e)


def is_valid_email(email: str) -> bool:
    """
    Quick check if email is valid
    
    Args:
        email: Email address to check
        
    Returns:
        True if valid, False otherwise
    """
    is_valid, _ = validate_email_format(email)
    return is_valid


# ============================================================================
# Password Policy Validation
# ============================================================================

# Password policy configurations (from FR-003, FR-004)
PASSWORD_POLICIES = {
    "basic": {
        "min_length": 8,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digit": True,
        "require_special": False,
        "description": "Password must be at least 8 characters with uppercase, lowercase, and digit"
    },
    "high": {
        "min_length": 12,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digit": True,
        "require_special": True,
        "description": "Password must be at least 12 characters with uppercase, lowercase, digit, and special character"
    }
}


def get_password_policy(level: Optional[str] = None) -> dict:
    """
    Get password policy configuration
    
    Args:
        level: Policy level ('basic' or 'high'), defaults to settings
        
    Returns:
        Policy configuration dict
    """
    if level is None:
        level = settings.PASSWORD_POLICY_LEVEL
    
    return PASSWORD_POLICIES.get(level, PASSWORD_POLICIES["basic"])


def validate_password_policy(password: str, level: Optional[str] = None) -> Tuple[bool, List[str]]:
    """
    Validate password against current policy
    
    Args:
        password: Password to validate
        level: Policy level to check against (defaults to settings)
        
    Returns:
        Tuple of (is_valid: bool, violations: List[str])
        
    Example:
        >>> is_valid, violations = validate_password_policy("weak")
        >>> is_valid
        False
        >>> violations
        ['Password must be at least 8 characters', 'Must contain uppercase letter']
    """
    policy = get_password_policy(level)
    violations = []
    
    # Check minimum length
    if len(password) < policy["min_length"]:
        violations.append(f"Password must be at least {policy['min_length']} characters long")
    
    # Check uppercase requirement
    if policy["require_uppercase"] and not re.search(r'[A-Z]', password):
        violations.append("Password must contain at least one uppercase letter")
    
    # Check lowercase requirement
    if policy["require_lowercase"] and not re.search(r'[a-z]', password):
        violations.append("Password must contain at least one lowercase letter")
    
    # Check digit requirement
    if policy["require_digit"] and not re.search(r'\d', password):
        violations.append("Password must contain at least one digit")
    
    # Check special character requirement
    if policy["require_special"] and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        violations.append("Password must contain at least one special character (!@#$%^&*...)")
    
    is_valid = len(violations) == 0
    return is_valid, violations


def check_password_strength(password: str) -> dict:
    """
    Check password strength and provide feedback
    
    Args:
        password: Password to analyze
        
    Returns:
        Dict with strength score, rating, and feedback
        
    Example:
        >>> result = check_password_strength("SecurePass123!")
        >>> result["strength"]
        'strong'
        >>> result["score"]
        85
    """
    score = 0
    feedback = []
    
    # Length scoring
    length = len(password)
    if length >= 12:
        score += 25
    elif length >= 10:
        score += 20
    elif length >= 8:
        score += 15
    else:
        feedback.append("Use at least 8 characters")
        score += length * 2
    
    # Character variety scoring
    has_upper = bool(re.search(r'[A-Z]', password))
    has_lower = bool(re.search(r'[a-z]', password))
    has_digit = bool(re.search(r'\d', password))
    has_special = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    
    if has_upper:
        score += 15
    else:
        feedback.append("Add uppercase letters")
    
    if has_lower:
        score += 15
    else:
        feedback.append("Add lowercase letters")
    
    if has_digit:
        score += 15
    else:
        feedback.append("Add numbers")
    
    if has_special:
        score += 20
    else:
        feedback.append("Add special characters (!@#$%...)")
    
    # Bonus for length > 14
    if length > 14:
        score += 10
    
    # Cap score at 100
    score = min(score, 100)
    
    # Determine strength rating
    if score >= 80:
        strength = "strong"
        feedback = ["Password is strong!"] if not feedback else feedback
    elif score >= 60:
        strength = "medium"
    else:
        strength = "weak"
    
    # Check against current policy
    is_valid, violations = validate_password_policy(password)
    
    return {
        "score": score,
        "strength": strength,
        "feedback": feedback,
        "meets_policy": is_valid,
        "policy_violations": violations
    }


# ============================================================================
# Common Password Checks
# ============================================================================

# Common weak passwords to reject
COMMON_WEAK_PASSWORDS = {
    "password", "password123", "123456", "12345678", "qwerty",
    "abc123", "monkey", "1234567", "letmein", "trustno1",
    "dragon", "baseball", "111111", "iloveyou", "master",
    "sunshine", "ashley", "bailey", "passw0rd", "shadow"
}


def is_common_password(password: str) -> bool:
    """
    Check if password is a commonly used weak password
    
    Args:
        password: Password to check
        
    Returns:
        True if password is common/weak, False otherwise
    """
    return password.lower() in COMMON_WEAK_PASSWORDS


def contains_email(password: str, email: str) -> bool:
    """
    Check if password contains parts of the email address
    
    Args:
        password: Password to check
        email: User's email address
        
    Returns:
        True if password contains email parts, False otherwise
        
    Example:
        >>> contains_email("myname123", "myname@example.com")
        True
    """
    email_local = email.split('@')[0].lower()
    password_lower = password.lower()
    
    # Check if email local part (before @) is in password
    if len(email_local) >= 3 and email_local in password_lower:
        return True
    
    return False


def validate_password_security(password: str, email: Optional[str] = None) -> Tuple[bool, List[str]]:
    """
    Comprehensive password security validation
    
    Args:
        password: Password to validate
        email: User's email (optional, for additional checks)
        
    Returns:
        Tuple of (is_secure: bool, warnings: List[str])
    """
    warnings = []
    
    # Check against common passwords
    if is_common_password(password):
        warnings.append("This password is too common and easily guessable")
    
    # Check if password contains email
    if email and contains_email(password, email):
        warnings.append("Password should not contain your email address")
    
    # Check for repeated characters
    if re.search(r'(.)\1{2,}', password):
        warnings.append("Avoid repeating the same character multiple times")
    
    # Check for sequential characters
    if re.search(r'(abc|bcd|cde|def|123|234|345|456|567|678|789)', password.lower()):
        warnings.append("Avoid sequential characters")
    
    is_secure = len(warnings) == 0
    return is_secure, warnings







