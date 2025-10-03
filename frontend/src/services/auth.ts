import { request } from './api';

// 定义所有需要的类型，避免跨文件导入问题
interface User {
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

interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  consent: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

interface VerifyEmailData {
  token: string;
}

interface PasswordPolicy {
  level: 'basic' | 'high';
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_digit: boolean;
  require_special: boolean;
  description: string;
}

// 认证相关API
export const authApi = {
  // 用户登录
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    request.post('/v1/auth/login', credentials),

  // 用户注册
  register: (data: RegisterData): Promise<{ message: string }> =>
    request.post('/v1/auth/register', data),

  // 用户登出
  logout: (): Promise<{ message: string }> =>
    request.post('/v1/auth/logout'),

  // 刷新token
  refreshToken: (refreshToken: string): Promise<RefreshTokenResponse> =>
    request.post('/v1/auth/refresh', { refresh_token: refreshToken }),

  // 忘记密码
  forgotPassword: (data: ForgotPasswordData): Promise<{ message: string }> =>
    request.post('/v1/auth/forgot-password', data),

  // 重置密码
  resetPassword: (data: ResetPasswordData): Promise<{ message: string }> =>
    request.post('/v1/auth/reset-password', data),

  // 验证邮箱
  verifyEmail: (token: string): Promise<{ message: string }> =>
    request.get(`/v1/auth/verify-email/${token}`),

  // 获取密码策略
  getPasswordRequirements: (): Promise<PasswordPolicy> =>
    request.get('/v1/auth/password-requirements'),
};

// 用户相关API
export const userApi = {
  // 获取当前用户信息
  getCurrentUser: (): Promise<User> =>
    request.get('/v1/users/me'),

  // 修改密码
  changePassword: (data: ChangePasswordData): Promise<{ message: string }> =>
    request.post('/v1/users/me/change-password', data),

  // 导出用户数据
  exportData: (): Promise<Blob> =>
    request.get('/v1/users/me/data', { responseType: 'blob' }),

  // 删除账户
  deleteAccount: (): Promise<{ message: string }> =>
    request.delete('/v1/users/me'),
};

// 健康检查API
export const healthApi = {
  // 健康检查
  check: (): Promise<{ status: string; timestamp: string }> =>
    request.get('/health'),
};


