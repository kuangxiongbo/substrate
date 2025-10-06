/**
 * 用户偏好配置系统
 * 支持不同管理员切换不同的主题和布局
 */

// 主题类型
export type ThemePreference = 'light' | 'dark' | 'auto';

// 布局类型
export type LayoutPreference = 'sidebar' | 'top' | 'auto';

// 用户偏好配置接口
export interface UserPreferences {
  // 主题偏好
  theme: ThemePreference;
  // 布局偏好
  layout: LayoutPreference;
  // 是否跟随系统主题
  followSystemTheme: boolean;
  // 是否记住用户选择
  rememberPreferences: boolean;
  // 自定义主题配置（可选）
  customTheme?: string;
  // 自定义布局配置（可选）
  customLayout?: Record<string, any>;
  // 最后更新时间
  lastUpdated: string;
}

// 用户偏好更新接口
export interface UserPreferencesUpdate {
  theme?: ThemePreference;
  layout?: LayoutPreference;
  followSystemTheme?: boolean;
  rememberPreferences?: boolean;
  customTheme?: string;
  customLayout?: Record<string, any>;
}

// 用户偏好同步状态
export interface PreferencesSyncStatus {
  isSyncing: boolean;
  lastSyncTime?: string;
  syncError?: string;
}

// 默认用户偏好
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'auto',
  layout: 'sidebar',
  followSystemTheme: true,
  rememberPreferences: true,
  lastUpdated: new Date().toISOString(),
};

// 管理员专用偏好配置
export interface AdminPreferences extends UserPreferences {
  // 是否允许其他用户自定义主题
  allowUserThemeCustomization: boolean;
  // 是否允许其他用户自定义布局
  allowUserLayoutCustomization: boolean;
  // 默认主题（管理员设置的系统默认）
  defaultTheme: ThemePreference;
  // 默认布局（管理员设置的系统默认）
  defaultLayout: LayoutPreference;
  // 主题访问权限控制
  themeAccessControl: {
    allowedThemes: string[];
    restrictedThemes: string[];
  };
  // 布局访问权限控制
  layoutAccessControl: {
    allowedLayouts: string[];
    restrictedLayouts: string[];
  };
}

// 用户偏好验证结果
export interface PreferencesValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// 用户偏好管理器接口
export interface UserPreferencesManager {
  // 获取用户偏好
  getPreferences(userId: string): Promise<UserPreferences>;
  
  // 更新用户偏好
  updatePreferences(userId: string, preferences: UserPreferencesUpdate): Promise<UserPreferences>;
  
  // 重置用户偏好
  resetPreferences(userId: string): Promise<UserPreferences>;
  
  // 验证偏好配置
  validatePreferences(preferences: UserPreferencesUpdate): PreferencesValidationResult;
  
  // 同步偏好到服务器
  syncPreferences(userId: string, preferences: UserPreferences): Promise<PreferencesSyncStatus>;
  
  // 获取管理员偏好
  getAdminPreferences(adminId: string): Promise<AdminPreferences>;
  
  // 更新管理员偏好
  updateAdminPreferences(adminId: string, preferences: Partial<AdminPreferences>): Promise<AdminPreferences>;
}

// 主题切换事件
export interface ThemeChangeEvent {
  userId: string;
  oldTheme: string;
  newTheme: string;
  timestamp: string;
  source: 'user' | 'admin' | 'system';
}

// 布局切换事件
export interface LayoutChangeEvent {
  userId: string;
  oldLayout: string;
  newLayout: string;
  timestamp: string;
  source: 'user' | 'admin' | 'system';
}

// 用户偏好变更历史
export interface PreferencesChangeHistory {
  id: string;
  userId: string;
  changeType: 'theme' | 'layout' | 'preferences';
  oldValue: any;
  newValue: any;
  timestamp: string;
  source: 'user' | 'admin' | 'system';
}

// 偏好权限检查结果
export interface PreferencesPermissionCheck {
  canChangeTheme: boolean;
  canChangeLayout: boolean;
  canUseCustomTheme: boolean;
  canUseCustomLayout: boolean;
  allowedThemes: string[];
  allowedLayouts: string[];
  restrictions: string[];
}
