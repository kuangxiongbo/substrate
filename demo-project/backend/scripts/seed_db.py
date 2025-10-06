"""
Database Seeding Script
Creates sample data for development and testing

Usage:
    python scripts/seed_db.py
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import uuid

from src.database import SessionLocal, Base, engine
from src.models import (
    User, JWTToken, VerificationToken, SecurityLog,
    AccountStatus, TokenType, TokenPurpose, EventType, EventResult
)


def create_sample_users(db: Session):
    """Create sample users for testing"""
    
    # Sample user 1: Active verified user
    user1 = User(
        id=uuid.uuid4(),
        email="admin@example.com",
        password_hash="$argon2id$v=19$m=65536,t=3,p=4$placeholder",  # Replace with actual hash
        email_verified=True,
        account_status=AccountStatus.ACTIVE,
        failed_login_attempts=0,
        registration_timestamp=datetime.utcnow() - timedelta(days=30),
        consent_status=True
    )
    
    # Sample user 2: Unverified user
    user2 = User(
        id=uuid.uuid4(),
        email="user@example.com",
        password_hash="$argon2id$v=19$m=65536,t=3,p=4$placeholder",
        email_verified=False,
        account_status=AccountStatus.INACTIVE,
        failed_login_attempts=0,
        consent_status=True
    )
    
    # Sample user 3: Locked user
    user3 = User(
        id=uuid.uuid4(),
        email="locked@example.com",
        password_hash="$argon2id$v=19$m=65536,t=3,p=4$placeholder",
        email_verified=True,
        account_status=AccountStatus.LOCKED,
        failed_login_attempts=5,
        account_locked_until=datetime.utcnow() + timedelta(minutes=30),
        consent_status=True
    )
    
    db.add_all([user1, user2, user3])
    db.commit()
    
    print(f"✅ Created 3 sample users:")
    print(f"   - {user1.email} (active, verified)")
    print(f"   - {user2.email} (inactive, unverified)")
    print(f"   - {user3.email} (locked)")
    
    return user1, user2, user3


def create_sample_tokens(db: Session, user: User):
    """Create sample JWT tokens"""
    
    # Refresh token
    refresh_token = JWTToken(
        id=uuid.uuid4(),
        jti=str(uuid.uuid4()),
        user_id=user.id,
        token_type=TokenType.REFRESH,
        token_value=str(uuid.uuid4()),
        issued_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=7),
        revoked=False,
        device_info="Mozilla/5.0 (Sample Browser)"
    )
    
    db.add(refresh_token)
    db.commit()
    
    print(f"✅ Created sample refresh token for {user.email}")
    
    return refresh_token


def create_sample_verification_token(db: Session, user: User):
    """Create sample verification token"""
    
    token = VerificationToken(
        id=uuid.uuid4(),
        token=str(uuid.uuid4()),
        user_id=user.id,
        token_type=TokenPurpose.EMAIL_VERIFICATION,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(hours=24),
        used=False
    )
    
    db.add(token)
    db.commit()
    
    print(f"✅ Created email verification token for {user.email}")
    print(f"   Token: {token.token}")
    
    return token


def create_sample_security_logs(db: Session, user: User):
    """Create sample security logs"""
    
    logs = [
        SecurityLog.create_log(
            event_type=EventType.REGISTRATION,
            result=EventResult.SUCCESS,
            user_id=user.id,
            ip_address="127.0.0.1",
            user_agent="Mozilla/5.0"
        ),
        SecurityLog.create_log(
            event_type=EventType.LOGIN_SUCCESS,
            result=EventResult.SUCCESS,
            user_id=user.id,
            ip_address="127.0.0.1"
        ),
        SecurityLog.create_log(
            event_type=EventType.LOGIN_FAILED,
            result=EventResult.FAILURE,
            user_id=user.id,
            ip_address="127.0.0.1",
            failure_reason="Invalid password"
        ),
    ]
    
    db.add_all(logs)
    db.commit()
    
    print(f"✅ Created {len(logs)} sample security logs")


def seed_database():
    """Main seeding function"""
    
    print("\n🌱 Starting database seeding...\n")
    
    # Create tables if they don't exist
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created\n")
    
    # Create session
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"⚠️  Database already contains {existing_users} users")
            response = input("Do you want to continue and add more sample data? (y/n): ")
            if response.lower() != 'y':
                print("❌ Seeding cancelled")
                return
        
        # Create sample data
        user1, user2, user3 = create_sample_users(db)
        print()
        
        create_sample_tokens(db, user1)
        print()
        
        create_sample_verification_token(db, user2)
        print()
        
        create_sample_security_logs(db, user1)
        print()
        
        print("🎉 Database seeding completed successfully!\n")
        print("📝 Sample credentials (passwords are hashed - need to implement password service):")
        print("   Email: admin@example.com")
        print("   Email: user@example.com (unverified)")
        print("   Email: locked@example.com (locked account)")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

