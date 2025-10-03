"""
User Preferences Schemas
Pydantic schemas for user preferences API
"""
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, validator
from enum import Enum


class ThemePreferenceEnum(str, Enum):
    """Theme preference enum"""
    LIGHT = "light"
    DARK = "dark"
    AUTO = "auto"


class LayoutPreferenceEnum(str, Enum):
    """Layout preference enum"""
    SIDEBAR = "sidebar"
    TOP = "top"
    AUTO = "auto"


class UserPreferencesBase(BaseModel):
    """Base user preferences schema"""
    theme_preference: ThemePreferenceEnum = Field(
        default=ThemePreferenceEnum.AUTO,
        description="User theme preference"
    )
    layout_preference: LayoutPreferenceEnum = Field(
        default=LayoutPreferenceEnum.SIDEBAR,
        description="User layout preference"
    )
    follow_system_theme: bool = Field(
        default=True,
        description="Whether to follow system theme preference"
    )
    remember_preferences: bool = Field(
        default=True,
        description="Whether to remember user preferences"
    )
    custom_theme_config: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Custom theme configuration"
    )
    custom_layout_config: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Custom layout configuration"
    )


class UserPreferencesCreate(UserPreferencesBase):
    """Schema for creating user preferences"""
    pass


class UserPreferencesUpdate(BaseModel):
    """Schema for updating user preferences"""
    theme_preference: Optional[ThemePreferenceEnum] = Field(
        default=None,
        description="User theme preference"
    )
    layout_preference: Optional[LayoutPreferenceEnum] = Field(
        default=None,
        description="User layout preference"
    )
    follow_system_theme: Optional[bool] = Field(
        default=None,
        description="Whether to follow system theme preference"
    )
    remember_preferences: Optional[bool] = Field(
        default=None,
        description="Whether to remember user preferences"
    )
    custom_theme_config: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Custom theme configuration"
    )
    custom_layout_config: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Custom layout configuration"
    )


class UserPreferencesResponse(UserPreferencesBase):
    """Schema for user preferences response"""
    id: str = Field(description="Preferences ID")
    user_id: str = Field(description="User ID")
    created_at: datetime = Field(description="Creation timestamp")
    updated_at: datetime = Field(description="Last update timestamp")

    class Config:
        from_attributes = True


class AdminPreferencesBase(BaseModel):
    """Base admin preferences schema"""
    default_theme: ThemePreferenceEnum = Field(
        default=ThemePreferenceEnum.LIGHT,
        description="System default theme"
    )
    default_layout: LayoutPreferenceEnum = Field(
        default=LayoutPreferenceEnum.SIDEBAR,
        description="System default layout"
    )
    allow_user_theme_customization: bool = Field(
        default=True,
        description="Allow users to customize themes"
    )
    allow_user_layout_customization: bool = Field(
        default=True,
        description="Allow users to customize layouts"
    )
    allowed_themes: List[str] = Field(
        default=["light", "dark", "auto"],
        description="Allowed themes for users"
    )
    restricted_themes: List[str] = Field(
        default=[],
        description="Restricted themes for users"
    )
    allowed_layouts: List[str] = Field(
        default=["sidebar", "top", "auto"],
        description="Allowed layouts for users"
    )
    restricted_layouts: List[str] = Field(
        default=[],
        description="Restricted layouts for users"
    )


class AdminPreferencesUpdate(BaseModel):
    """Schema for updating admin preferences"""
    default_theme: Optional[ThemePreferenceEnum] = Field(
        default=None,
        description="System default theme"
    )
    default_layout: Optional[LayoutPreferenceEnum] = Field(
        default=None,
        description="System default layout"
    )
    allow_user_theme_customization: Optional[bool] = Field(
        default=None,
        description="Allow users to customize themes"
    )
    allow_user_layout_customization: Optional[bool] = Field(
        default=None,
        description="Allow users to customize layouts"
    )
    allowed_themes: Optional[List[str]] = Field(
        default=None,
        description="Allowed themes for users"
    )
    restricted_themes: Optional[List[str]] = Field(
        default=None,
        description="Restricted themes for users"
    )
    allowed_layouts: Optional[List[str]] = Field(
        default=None,
        description="Allowed layouts for users"
    )
    restricted_layouts: Optional[List[str]] = Field(
        default=None,
        description="Restricted layouts for users"
    )


class AdminPreferencesResponse(AdminPreferencesBase):
    """Schema for admin preferences response"""
    id: str = Field(description="Admin preferences ID")
    admin_id: str = Field(description="Admin user ID")
    created_at: datetime = Field(description="Creation timestamp")
    updated_at: datetime = Field(description="Last update timestamp")

    class Config:
        from_attributes = True


class PreferencesValidationRequest(BaseModel):
    """Schema for preferences validation request"""
    theme_preference: Optional[ThemePreferenceEnum] = None
    layout_preference: Optional[LayoutPreferenceEnum] = None
    custom_theme_config: Optional[Dict[str, Any]] = None
    custom_layout_config: Optional[Dict[str, Any]] = None


class PreferencesValidationResponse(BaseModel):
    """Schema for preferences validation response"""
    valid: bool = Field(description="Whether preferences are valid")
    errors: List[str] = Field(default=[], description="Validation errors")
    warnings: List[str] = Field(default=[], description="Validation warnings")


class PreferencesPermissionCheck(BaseModel):
    """Schema for preferences permission check"""
    can_change_theme: bool = Field(description="Can change theme")
    can_change_layout: bool = Field(description="Can change layout")
    can_use_custom_theme: bool = Field(description="Can use custom theme")
    can_use_custom_layout: bool = Field(description="Can use custom layout")
    allowed_themes: List[str] = Field(description="Allowed themes")
    allowed_layouts: List[str] = Field(description="Allowed layouts")
    restrictions: List[str] = Field(default=[], description="Restrictions")


class PreferencesSyncRequest(BaseModel):
    """Schema for preferences sync request"""
    preferences: UserPreferencesBase = Field(description="Preferences to sync")


class PreferencesSyncResponse(BaseModel):
    """Schema for preferences sync response"""
    is_syncing: bool = Field(description="Whether sync is in progress")
    last_sync_time: Optional[datetime] = Field(description="Last sync time")
    sync_error: Optional[str] = Field(description="Sync error if any")


class PreferencesChangeHistoryResponse(BaseModel):
    """Schema for preferences change history response"""
    id: str = Field(description="History record ID")
    user_id: str = Field(description="User ID")
    change_type: str = Field(description="Type of change")
    old_value: Optional[Dict[str, Any]] = Field(description="Previous value")
    new_value: Dict[str, Any] = Field(description="New value")
    source: str = Field(description="Change source")
    created_at: datetime = Field(description="Change timestamp")

    class Config:
        from_attributes = True


class BatchPreferencesUpdateRequest(BaseModel):
    """Schema for batch preferences update request"""
    updates: List[Dict[str, Any]] = Field(description="Batch updates")


class BatchPreferencesUpdateResponse(BaseModel):
    """Schema for batch preferences update response"""
    updated_count: int = Field(description="Number of updated preferences")
    failed_updates: List[Dict[str, Any]] = Field(description="Failed updates")
    success: bool = Field(description="Overall success status")


class SystemDefaultsRequest(BaseModel):
    """Schema for system defaults request"""
    default_theme: ThemePreferenceEnum = Field(description="Default theme")
    default_layout: LayoutPreferenceEnum = Field(description="Default layout")
    allow_customization: bool = Field(default=True, description="Allow customization")


class SystemDefaultsResponse(BaseModel):
    """Schema for system defaults response"""
    default_theme: str = Field(description="Default theme")
    default_layout: str = Field(description="Default layout")
    allow_customization: bool = Field(description="Allow customization")
    updated_at: datetime = Field(description="Last update time")


class PreferencesExportResponse(BaseModel):
    """Schema for preferences export response"""
    filename: str = Field(description="Export filename")
    download_url: str = Field(description="Download URL")
    expires_at: datetime = Field(description="Download expiration time")


class PreferencesImportRequest(BaseModel):
    """Schema for preferences import request"""
    file_content: str = Field(description="File content as base64")
    file_name: str = Field(description="File name")
    overwrite_existing: bool = Field(default=False, description="Overwrite existing preferences")


class PreferencesImportResponse(BaseModel):
    """Schema for preferences import response"""
    imported_count: int = Field(description="Number of imported preferences")
    errors: List[str] = Field(default=[], description="Import errors")
    success: bool = Field(description="Import success status")
