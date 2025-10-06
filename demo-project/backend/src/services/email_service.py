"""
Email Service
Async email sending for verification and notifications
"""
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader, select_autoescape
from pathlib import Path
from typing import Optional
import logging

from src.config import settings
from src.utils.constants import EMAIL_TEMPLATES

logger = logging.getLogger(__name__)


class EmailService:
    """
    Service for sending emails
    
    Responsibilities:
    - Send verification emails (FR-006)
    - Send password reset emails (FR-025)
    - Send password change confirmation (FR-040)
    - Async email sending (non-blocking)
    - Template-based email generation
    """
    
    def __init__(self):
        """Initialize email service with Jinja2 template engine"""
        # Setup Jinja2 template environment
        template_dir = Path(__file__).parent.parent / "templates"
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(template_dir)),
            autoescape=select_autoescape(['html', 'xml'])
        )
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        plain_content: Optional[str] = None
    ) -> bool:
        """
        Send an email via SMTP
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email content
            plain_content: Plain text fallback (optional)
            
        Returns:
            True if sent successfully, False otherwise
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            message["To"] = to_email
            message["Subject"] = subject
            
            # Add plain text part (if provided)
            if plain_content:
                plain_part = MIMEText(plain_content, "plain")
                message.attach(plain_part)
            
            # Add HTML part
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # Send email
            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER if settings.SMTP_USER else None,
                password=settings.SMTP_PASSWORD if settings.SMTP_PASSWORD else None,
                use_tls=settings.SMTP_TLS,
            )
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    async def send_verification_email(
        self,
        to_email: str,
        verification_token: str,
        user_name: Optional[str] = None
    ) -> bool:
        """
        Send email verification link (FR-006)
        
        Args:
            to_email: User's email address
            verification_token: Verification token (24h expiry)
            user_name: Optional user name for personalization
            
        Returns:
            True if sent successfully
        """
        # Build verification URL
        # TODO: Get base URL from settings
        verification_url = f"http://localhost:8000/api/v1/auth/verify-email/{verification_token}"
        
        # Render template (when template exists)
        # For now, use simple HTML
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to User Authentication System!</h2>
                <p>Hello {user_name or 'there'},</p>
                <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                <p style="margin: 30px 0;">
                    <a href="{verification_url}" 
                       style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                              text-decoration: none; border-radius: 4px;">
                        Verify Email Address
                    </a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <p style="color: #666; word-break: break-all;">{verification_url}</p>
                <p style="margin-top: 30px; color: #999; font-size: 12px;">
                    This link will expire in 24 hours.<br>
                    If you didn't register for an account, please ignore this email.
                </p>
            </body>
        </html>
        """
        
        plain_content = f"""
        Welcome to User Authentication System!
        
        Thank you for registering. Please verify your email address by visiting:
        {verification_url}
        
        This link will expire in 24 hours.
        If you didn't register for an account, please ignore this email.
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Please verify your email address",
            html_content=html_content,
            plain_content=plain_content
        )
    
    async def send_password_reset_email(
        self,
        to_email: str,
        reset_token: str,
        user_name: Optional[str] = None
    ) -> bool:
        """
        Send password reset link (FR-025)
        
        Args:
            to_email: User's email address
            reset_token: Password reset token (1h expiry)
            user_name: Optional user name
            
        Returns:
            True if sent successfully
        """
        # Build reset URL
        reset_url = f"http://localhost:8000/api/v1/auth/reset-password?token={reset_token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Hello {user_name or 'there'},</p>
                <p>We received a request to reset your password. Click the link below to create a new password:</p>
                <p style="margin: 30px 0;">
                    <a href="{reset_url}" 
                       style="background-color: #2196F3; color: white; padding: 14px 28px; 
                              text-decoration: none; border-radius: 4px;">
                        Reset Password
                    </a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <p style="color: #666; word-break: break-all;">{reset_url}</p>
                <p style="margin-top: 30px; color: #999; font-size: 12px;">
                    <strong>Important:</strong> This link will expire in 1 hour for security reasons.<br>
                    If you didn't request a password reset, please ignore this email or contact support if you're concerned.
                </p>
            </body>
        </html>
        """
        
        plain_content = f"""
        Password Reset Request
        
        We received a request to reset your password. Visit the link below:
        {reset_url}
        
        This link will expire in 1 hour.
        If you didn't request a password reset, please ignore this email.
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Password Reset Request",
            html_content=html_content,
            plain_content=plain_content
        )
    
    async def send_password_changed_email(
        self,
        to_email: str,
        user_name: Optional[str] = None
    ) -> bool:
        """
        Send password change confirmation (FR-040)
        
        Args:
            to_email: User's email address
            user_name: Optional user name
            
        Returns:
            True if sent successfully
        """
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Changed Successfully</h2>
                <p>Hello {user_name or 'there'},</p>
                <p>Your password has been changed successfully.</p>
                <p style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107;">
                    <strong>Security Notice:</strong> All active sessions have been invalidated. 
                    You'll need to log in again with your new password.
                </p>
                <p style="margin-top: 30px; color: #999; font-size: 12px;">
                    If you didn't make this change, please contact support immediately 
                    as your account may be compromised.
                </p>
            </body>
        </html>
        """
        
        plain_content = f"""
        Password Changed Successfully
        
        Your password has been changed successfully.
        
        Security Notice: All active sessions have been invalidated.
        You'll need to log in again with your new password.
        
        If you didn't make this change, please contact support immediately.
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Password Changed - Security Notice",
            html_content=html_content,
            plain_content=plain_content
        )
    
    async def send_account_locked_email(
        self,
        to_email: str,
        unlock_time: str,
        user_name: Optional[str] = None
    ) -> bool:
        """
        Send account locked notification
        
        Args:
            to_email: User's email address
            unlock_time: When account will be unlocked
            user_name: Optional user name
            
        Returns:
            True if sent successfully
        """
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Account Temporarily Locked</h2>
                <p>Hello {user_name or 'there'},</p>
                <p style="background-color: #f8d7da; padding: 15px; border-left: 4px solid #dc3545;">
                    <strong>Security Alert:</strong> Your account has been temporarily locked 
                    due to multiple failed login attempts.
                </p>
                <p>Your account will be automatically unlocked at: <strong>{unlock_time}</strong></p>
                <p>If you believe this is unauthorized activity, please reset your password immediately 
                   or contact support.</p>
            </body>
        </html>
        """
        
        plain_content = f"""
        Account Temporarily Locked
        
        Your account has been temporarily locked due to multiple failed login attempts.
        
        Your account will be unlocked at: {unlock_time}
        
        If you believe this is unauthorized activity, please reset your password 
        or contact support.
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Account Locked - Security Alert",
            html_content=html_content,
            plain_content=plain_content
        )

