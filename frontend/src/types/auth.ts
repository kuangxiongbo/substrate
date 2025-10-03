// 用户相关类型
export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  account_status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  failed_login_attempts: number;
  account_locked_until?: string;
  registration_timestamp: string;
  last_login_timestamp?: string;
  last_password_change?: string;
  consent_timestamp?: string;
  consent_status: boolean;
  created_at: string;
  updated_at: string;
}

// 认证相关类型
export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  consent: boolean;
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

// 密码相关类型
export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

// 验证相关类型
export interface VerifyEmailData {
  token: string;
}

// 密码策略类型
export interface PasswordPolicy {
  level: 'basic' | 'high';
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_digit: boolean;
  require_special: boolean;
  description: string;
}

// 错误类型
export interface ApiError {
  detail: string | string[];
  code?: string;
  field?: string;
}

// 表单状态类型
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// 认证状态类型
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 认证操作类型
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

// 完整的认证Store类型
export type AuthStore = AuthState & AuthActions;
