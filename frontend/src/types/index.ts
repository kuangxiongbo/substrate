/**
 * 类型定义入口文件
 * 基于Spec-Kit方法重构的类型系统
 */

// ===== 布局相关类型 =====
export interface LayoutConfig {
  type: 'sidebar' | 'top';
  collapsed?: boolean;
  theme?: 'light' | 'dark';
  fixed?: boolean;
  width?: number;
  height?: number;
}

export interface LayoutContextType {
  layout: LayoutConfig;
  setLayout: (layout: LayoutConfig) => void;
  toggleLayout: () => void;
  toggleCollapse: () => void;
  isSidebar: boolean;
  isTop: boolean;
  isCollapsed: boolean;
  isLoading: boolean;
}

// ===== 主题相关类型 =====
export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface BorderRadiusConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ShadowConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  description?: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  borderRadius: BorderRadiusConfig;
  shadows: ShadowConfig;
  isDark?: boolean;
}

export interface ThemeContextType {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  setTheme: (themeName: string) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isLoading: boolean;
}

// ===== 用户相关类型 =====
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: string;
  layout: string;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
}

// ===== 认证相关类型 =====
export interface LoginCredentials {
  email: string;
  password: string;
  captcha?: string;
  captcha_id?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  captcha?: string;
  captcha_id?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ForgotPasswordData {
  email: string;
  captcha?: string;
  captcha_id?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshTokenValue: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  currentRefreshToken: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  clearError: () => void;
}

export interface AuthStore extends AuthState, AuthActions {}

// ===== API 相关类型 =====
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// ===== 表单相关类型 =====
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormConfig {
  fields: FormField[];
  submitText: string;
  resetText?: string;
  onSubmit: (data: any) => void;
  onReset?: () => void;
}

// ===== 组件相关类型 =====
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface ButtonProps extends ComponentProps {
  type?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export interface CardProps extends ComponentProps {
  title?: string;
  extra?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
}

// ===== 常量定义 =====
export const LAYOUT_TYPES = {
  SIDEBAR: 'sidebar' as const,
  TOP: 'top' as const,
} as const;

export const THEME_NAMES = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
  HIGH_CONTRAST: 'high-contrast' as const,
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin' as const,
  ADMIN: 'admin' as const,
  USER: 'user' as const,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LAYOUT: 'layout',
  PREFERENCES: 'preferences',
} as const;

// ===== 工具类型 =====
export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES];
export type ThemeName = typeof THEME_NAMES[keyof typeof THEME_NAMES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
