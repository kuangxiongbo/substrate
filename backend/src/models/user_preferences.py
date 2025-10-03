"""
User Preferences Model
Manages user-specific theme and layout preferences
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
import json

from src.database import Base


class ThemePreference(enum.Enum):
    """Theme preference enum"""
    LIGHT = "light"
    DARK = "dark"
    AUTO = "auto"


class LayoutPreference(enum.Enum):
    """Layout preference enum"""
    SIDEBAR = "sidebar"
    TOP = "top"
    AUTO = "auto"


class UserPreferences(Base):
    """
    User preferences model for theme and layout settings
    """
    __tablename__ = "user_preferences"
    
    # Primary Key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Unique preferences identifier"
    )
    
    # User Reference
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        comment="Reference to user"
    )
    
    # Theme Preferences
    theme_preference = Column(
        SQLEnum(ThemePreference),
        default=ThemePreference.AUTO,
        nullable=False,
        comment="User theme preference"
    )
    
    # Layout Preferences
    layout_preference = Column(
        SQLEnum(LayoutPreference),
        default=LayoutPreference.SIDEBAR,
        nullable=False,
        comment="User layout preference"
    )
    
    # System Integration
    follow_system_theme = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether to follow system theme preference"
    )
    
    remember_preferences = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether to remember user preferences"
    )
    
    # Custom Configurations
    custom_theme_config = Column(
        Text,
        nullable=True,
        comment="Custom theme configuration (JSON)"
    )
    
    custom_layout_config = Column(
        Text,
        nullable=True,
        comment="Custom layout configuration (JSON)"
    )
    
    # Timestamps
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Preferences creation time"
    )
    
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
        comment="Last preferences update time"
    )
    
    # Relationships
    user = relationship("User", back_populates="preferences")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "theme_preference": self.theme_preference.value,
            "layout_preference": self.layout_preference.value,
            "follow_system_theme": self.follow_system_theme,
            "remember_preferences": self.remember_preferences,
            "custom_theme_config": json.loads(self.custom_theme_config) if self.custom_theme_config else None,
            "custom_layout_config": json.loads(self.custom_layout_config) if self.custom_layout_config else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create from dictionary"""
        preferences = cls()
        preferences.user_id = data.get("user_id")
        preferences.theme_preference = ThemePreference(data.get("theme_preference", "auto"))
        preferences.layout_preference = LayoutPreference(data.get("layout_preference", "sidebar"))
        preferences.follow_system_theme = data.get("follow_system_theme", True)
        preferences.remember_preferences = data.get("remember_preferences", True)
        
        if data.get("custom_theme_config"):
            preferences.custom_theme_config = json.dumps(data["custom_theme_config"])
        
        if data.get("custom_layout_config"):
            preferences.custom_layout_config = json.dumps(data["custom_layout_config"])
        
        return preferences


class AdminPreferences(Base):
    """
    Admin preferences model for system-wide theme and layout settings
    """
    __tablename__ = "admin_preferences"
    
    # Primary Key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Unique admin preferences identifier"
    )
    
    # Admin User Reference
    admin_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        comment="Reference to admin user"
    )
    
    # System Defaults
    default_theme = Column(
        SQLEnum(ThemePreference),
        default=ThemePreference.LIGHT,
        nullable=False,
        comment="System default theme"
    )
    
    default_layout = Column(
        SQLEnum(LayoutPreference),
        default=LayoutPreference.SIDEBAR,
        nullable=False,
        comment="System default layout"
    )
    
    # User Permissions
    allow_user_theme_customization = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Allow users to customize themes"
    )
    
    allow_user_layout_customization = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Allow users to customize layouts"
    )
    
    # Access Control
    allowed_themes = Column(
        Text,
        nullable=True,
        comment="Comma-separated list of allowed themes"
    )
    
    restricted_themes = Column(
        Text,
        nullable=True,
        comment="Comma-separated list of restricted themes"
    )
    
    allowed_layouts = Column(
        Text,
        nullable=True,
        comment="Comma-separated list of allowed layouts"
    )
    
    restricted_layouts = Column(
        Text,
        nullable=True,
        comment="Comma-separated list of restricted layouts"
    )
    
    # Timestamps
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Admin preferences creation time"
    )
    
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
        comment="Last admin preferences update time"
    )
    
    # Relationships
    admin = relationship("User", foreign_keys=[admin_id])
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": str(self.id),
            "admin_id": str(self.admin_id),
            "default_theme": self.default_theme.value,
            "default_layout": self.default_layout.value,
            "allow_user_theme_customization": self.allow_user_theme_customization,
            "allow_user_layout_customization": self.allow_user_layout_customization,
            "allowed_themes": self.allowed_themes.split(",") if self.allowed_themes else [],
            "restricted_themes": self.restricted_themes.split(",") if self.restricted_themes else [],
            "allowed_layouts": self.allowed_layouts.split(",") if self.allowed_layouts else [],
            "restricted_layouts": self.restricted_layouts.split(",") if self.restricted_layouts else [],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class PreferencesChangeHistory(Base):
    """
    Preferences change history model for audit trail
    """
    __tablename__ = "preferences_change_history"
    
    # Primary Key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        comment="Unique history record identifier"
    )
    
    # User Reference
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        comment="Reference to user"
    )
    
    # Change Details
    change_type = Column(
        String(50),
        nullable=False,
        comment="Type of change: theme, layout, preferences"
    )
    
    old_value = Column(
        Text,
        nullable=True,
        comment="Previous value (JSON)"
    )
    
    new_value = Column(
        Text,
        nullable=False,
        comment="New value (JSON)"
    )
    
    source = Column(
        String(20),
        nullable=False,
        default="user",
        comment="Change source: user, admin, system"
    )
    
    # Timestamp
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Change timestamp"
    )
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "change_type": self.change_type,
            "old_value": json.loads(self.old_value) if self.old_value else None,
            "new_value": json.loads(self.new_value) if self.new_value else None,
            "source": self.source,
            "created_at": self.created_at.isoformat(),
        }
