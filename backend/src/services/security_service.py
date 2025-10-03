"""
安全策略服务
实现登录安全策略、IP冻结、频率限制等功能
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from src.models import (
    User, LoginAttempt, IPFreeze, EmailVerificationLimit, 
    LoginAttemptResult, SecurityLevel, SystemConfig
)
from src.utils.security import hash_password, verify_password

class SecurityService:
    """安全策略服务类"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def record_login_attempt(
        self,
        email: str,
        ip_address: str,
        user_agent: str,
        result: LoginAttemptResult,
        user_id: Optional[str] = None,
        failure_reason: Optional[str] = None,
        captcha_required: bool = False,
        captcha_verified: bool = False
    ) -> LoginAttempt:
        """记录登录尝试"""
        
        login_attempt = LoginAttempt(
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            result=result.value,
            failure_reason=failure_reason,
            captcha_required=captcha_required,
            captcha_verified=captcha_verified
        )
        
        self.db.add(login_attempt)
        self.db.commit()
        self.db.refresh(login_attempt)
        
        return login_attempt
    
    def check_ip_freeze(self, ip_address: str) -> bool:
        """检查IP是否被冻结"""
        freeze_record = self.db.query(IPFreeze).filter(
            and_(
                IPFreeze.ip_address == ip_address,
                IPFreeze.manually_unfrozen == False,
                IPFreeze.unfreeze_at > datetime.utcnow()
            )
        ).first()
        
        return freeze_record is not None
    
    def get_failed_attempts_count(
        self, 
        identifier: str, 
        identifier_type: str = "email",
        time_window: timedelta = timedelta(minutes=15)
    ) -> int:
        """获取指定时间窗口内的失败尝试次数"""
        
        since_time = datetime.utcnow() - time_window
        
        if identifier_type == "email":
            count = self.db.query(LoginAttempt).filter(
                and_(
                    LoginAttempt.email == identifier,
                    LoginAttempt.attempt_time >= since_time,
                    LoginAttempt.result.in_([
                        LoginAttemptResult.FAILED_PASSWORD.value,
                        LoginAttemptResult.FAILED_CAPTCHA.value
                    ])
                )
            ).count()
        elif identifier_type == "ip":
            count = self.db.query(LoginAttempt).filter(
                and_(
                    LoginAttempt.ip_address == identifier,
                    LoginAttempt.attempt_time >= since_time,
                    LoginAttempt.result.in_([
                        LoginAttemptResult.FAILED_PASSWORD.value,
                        LoginAttemptResult.FAILED_CAPTCHA.value
                    ])
                )
            ).count()
        else:
            count = 0
        
        return count
    
    def should_require_captcha(
        self, 
        email: str, 
        ip_address: str,
        security_level: SecurityLevel = SecurityLevel.BASIC
    ) -> bool:
        """判断是否需要验证码"""
        
        if security_level == SecurityLevel.BASIC:
            # 基础策略：失败1次后需要验证码
            email_failures = self.get_failed_attempts_count(email, "email", timedelta(minutes=15))
            ip_failures = self.get_failed_attempts_count(ip_address, "ip", timedelta(minutes=15))
            
            return email_failures >= 1 or ip_failures >= 1
        
        elif security_level == SecurityLevel.ADVANCED:
            # 高级策略：失败3次后需要验证码
            email_failures = self.get_failed_attempts_count(email, "email", timedelta(minutes=15))
            ip_failures = self.get_failed_attempts_count(ip_address, "ip", timedelta(minutes=15))
            
            return email_failures >= 3 or ip_failures >= 3
        
        return False
    
    def should_freeze_ip(
        self, 
        ip_address: str,
        security_level: SecurityLevel = SecurityLevel.ADVANCED
    ) -> bool:
        """判断是否应该冻结IP"""
        
        if security_level != SecurityLevel.ADVANCED:
            return False
        
        # 高级策略：失败5次后冻结IP
        ip_failures = self.get_failed_attempts_count(ip_address, "ip", timedelta(minutes=15))
        
        return ip_failures >= 5
    
    def freeze_ip(
        self, 
        ip_address: str, 
        reason: str = "多次登录失败",
        freeze_duration: timedelta = timedelta(hours=1)
    ) -> IPFreeze:
        """冻结IP地址"""
        
        # 检查是否已经冻结
        existing_freeze = self.db.query(IPFreeze).filter(
            and_(
                IPFreeze.ip_address == ip_address,
                IPFreeze.manually_unfrozen == False,
                IPFreeze.unfreeze_at > datetime.utcnow()
            )
        ).first()
        
        if existing_freeze:
            return existing_freeze
        
        # 获取失败尝试次数
        failed_attempts = self.get_failed_attempts_count(ip_address, "ip", timedelta(minutes=15))
        
        # 创建冻结记录
        ip_freeze = IPFreeze(
            ip_address=ip_address,
            reason=reason,
            unfreeze_at=datetime.utcnow() + freeze_duration,
            failed_attempts=failed_attempts
        )
        
        self.db.add(ip_freeze)
        self.db.commit()
        self.db.refresh(ip_freeze)
        
        return ip_freeze
    
    def unfreeze_ip(self, ip_address: str, unfrozen_by: str) -> bool:
        """手动解冻IP地址"""
        
        freeze_record = self.db.query(IPFreeze).filter(
            and_(
                IPFreeze.ip_address == ip_address,
                IPFreeze.manually_unfrozen == False
            )
        ).first()
        
        if not freeze_record:
            return False
        
        freeze_record.manually_unfrozen = True
        freeze_record.unfrozen_by = unfrozen_by
        freeze_record.unfrozen_at = datetime.utcnow()
        
        self.db.commit()
        
        return True
    
    def get_frozen_ips(self, limit: int = 100) -> List[IPFreeze]:
        """获取冻结的IP列表"""
        
        return self.db.query(IPFreeze).filter(
            and_(
                IPFreeze.manually_unfrozen == False,
                IPFreeze.unfreeze_at > datetime.utcnow()
            )
        ).order_by(IPFreeze.frozen_at.desc()).limit(limit).all()
    
    def check_email_verification_limit(
        self, 
        email: str, 
        ip_address: str,
        max_per_email: int = 1,
        max_per_ip: int = 5,
        max_global: int = 100,
        time_window: timedelta = timedelta(hours=1)
    ) -> Dict[str, Any]:
        """检查邮箱验证码频率限制"""
        
        now = datetime.utcnow()
        window_start = now - time_window
        
        # 检查邮箱限制
        email_limit = self.db.query(EmailVerificationLimit).filter(
            and_(
                EmailVerificationLimit.limit_type == "email",
                EmailVerificationLimit.identifier == email,
                EmailVerificationLimit.window_start >= window_start
            )
        ).first()
        
        if email_limit and email_limit.request_count >= max_per_email:
            return {
                "allowed": False,
                "reason": "email_limit_exceeded",
                "message": f"邮箱 {email} 在 {time_window.total_seconds()//60} 分钟内请求次数过多"
            }
        
        # 检查IP限制
        ip_limit = self.db.query(EmailVerificationLimit).filter(
            and_(
                EmailVerificationLimit.limit_type == "ip",
                EmailVerificationLimit.identifier == ip_address,
                EmailVerificationLimit.window_start >= window_start
            )
        ).first()
        
        if ip_limit and ip_limit.request_count >= max_per_ip:
            return {
                "allowed": False,
                "reason": "ip_limit_exceeded",
                "message": f"IP {ip_address} 在 {time_window.total_seconds()//60} 分钟内请求次数过多"
            }
        
        # 检查全局限制
        global_limit = self.db.query(EmailVerificationLimit).filter(
            and_(
                EmailVerificationLimit.limit_type == "global",
                EmailVerificationLimit.identifier == "global",
                EmailVerificationLimit.window_start >= window_start
            )
        ).first()
        
        if global_limit and global_limit.request_count >= max_global:
            return {
                "allowed": False,
                "reason": "global_limit_exceeded",
                "message": "系统请求次数过多，请稍后再试"
            }
        
        return {"allowed": True}
    
    def record_email_verification_request(
        self, 
        email: str, 
        ip_address: str,
        time_window: timedelta = timedelta(hours=1)
    ) -> None:
        """记录邮箱验证码请求"""
        
        now = datetime.utcnow()
        window_start = now - time_window
        window_end = now + time_window
        
        # 更新或创建邮箱限制记录
        email_limit = self.db.query(EmailVerificationLimit).filter(
            and_(
                EmailVerificationLimit.limit_type == "email",
                EmailVerificationLimit.identifier == email,
                EmailVerificationLimit.window_start >= window_start
            )
        ).first()
        
        if email_limit:
            email_limit.request_count += 1
            email_limit.last_request = now
        else:
            email_limit = EmailVerificationLimit(
                limit_type="email",
                identifier=email,
                request_count=1,
                window_start=now,
                window_end=window_end,
                last_request=now
            )
            self.db.add(email_limit)
        
        # 更新或创建IP限制记录
        ip_limit = self.db.query(EmailVerificationLimit).filter(
            and_(
                EmailVerificationLimit.limit_type == "ip",
                EmailVerificationLimit.identifier == ip_address,
                EmailVerificationLimit.window_start >= window_start
            )
        ).first()
        
        if ip_limit:
            ip_limit.request_count += 1
            ip_limit.last_request = now
        else:
            ip_limit = EmailVerificationLimit(
                limit_type="ip",
                identifier=ip_address,
                request_count=1,
                window_start=now,
                window_end=window_end,
                last_request=now
            )
            self.db.add(ip_limit)
        
        # 更新或创建全局限制记录
        global_limit = self.db.query(EmailVerificationLimit).filter(
            and_(
                EmailVerificationLimit.limit_type == "global",
                EmailVerificationLimit.identifier == "global",
                EmailVerificationLimit.window_start >= window_start
            )
        ).first()
        
        if global_limit:
            global_limit.request_count += 1
            global_limit.last_request = now
        else:
            global_limit = EmailVerificationLimit(
                limit_type="global",
                identifier="global",
                request_count=1,
                window_start=now,
                window_end=window_end,
                last_request=now
            )
            self.db.add(global_limit)
        
        self.db.commit()
    
    def get_security_level(self) -> SecurityLevel:
        """获取当前安全策略级别"""
        
        config = self.db.query(SystemConfig).filter(
            SystemConfig.key == "security.login.security_level"
        ).first()
        
        if config and config.value:
            try:
                return SecurityLevel(config.value)
            except ValueError:
                pass
        
        return SecurityLevel.BASIC
    
    def check_account_lockout(self, user) -> tuple[bool, Optional[datetime]]:
        """检查账户是否被锁定"""
        if not user:
            return False, None
        
        # 检查账户状态
        if user.account_status.value == 'locked':
            return True, user.account_locked_until
        
        # 检查临时锁定
        if user.account_locked_until and datetime.utcnow() < user.account_locked_until:
            return True, user.account_locked_until
        
        return False, None
    
    def increment_failed_attempts(self, user, ip_address: str) -> int:
        """增加失败尝试次数"""
        if not user:
            return 0
        
        user.failed_login_attempts += 1
        
        # 如果达到锁定阈值，锁定账户
        if user.failed_login_attempts >= 5:
            user.account_status = 'locked'
            user.account_locked_until = datetime.utcnow() + timedelta(minutes=30)
        
        self.db.commit()
        return user.failed_login_attempts
    
    def reset_failed_attempts(self, user):
        """重置失败尝试次数"""
        if not user:
            return
        
        user.failed_login_attempts = 0
        user.account_locked_until = None
        if user.account_status == 'locked':
            user.account_status = 'active'
        
        self.db.commit()
    
    def log_event(self, event_type: str, result: str, user_id=None, ip_address=None, details=None, user_agent=None):
        """记录安全事件日志"""
        # 简化版本，实际应该记录到SecurityLog表
        print(f"Security Event: {event_type} - {result} - User: {user_id} - IP: {ip_address} - Details: {details} - UserAgent: {user_agent}")
    
    def get_security_statistics(self) -> Dict[str, Any]:
        """获取安全统计信息"""
        
        now = datetime.utcnow()
        last_24h = now - timedelta(hours=24)
        last_7d = now - timedelta(days=7)
        
        # 登录尝试统计
        total_attempts_24h = self.db.query(LoginAttempt).filter(
            LoginAttempt.attempt_time >= last_24h
        ).count()
        
        failed_attempts_24h = self.db.query(LoginAttempt).filter(
            and_(
                LoginAttempt.attempt_time >= last_24h,
                LoginAttempt.result.in_([
                    LoginAttemptResult.FAILED_PASSWORD.value,
                    LoginAttemptResult.FAILED_CAPTCHA.value
                ])
            )
        ).count()
        
        # IP冻结统计
        active_frozen_ips = self.db.query(IPFreeze).filter(
            and_(
                IPFreeze.manually_unfrozen == False,
                IPFreeze.unfreeze_at > now
            )
        ).count()
        
        # 邮箱验证码统计
        email_requests_24h = self.db.query(EmailVerificationLimit).filter(
            and_(
                EmailVerificationLimit.limit_type == "email",
                EmailVerificationLimit.last_request >= last_24h
            )
        ).count()
        
        return {
            "login_attempts_24h": total_attempts_24h,
            "failed_attempts_24h": failed_attempts_24h,
            "success_rate_24h": (total_attempts_24h - failed_attempts_24h) / max(total_attempts_24h, 1) * 100,
            "active_frozen_ips": active_frozen_ips,
            "email_requests_24h": email_requests_24h,
            "security_level": self.get_security_level().value
        }

