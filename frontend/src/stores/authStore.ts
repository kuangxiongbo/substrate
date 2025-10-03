import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, userApi } from '../services/auth';
import { setAuthToken, setRefreshToken, clearAuthTokens } from '../services/api';

// 定义所有需要的类型，避免跨文件导入问题
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
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

interface AuthState {
  user: User | null;
  token: string | null;
  refreshTokenValue: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
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

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
        (set, get) => ({
          // 状态
          user: null,
          token: null,
          refreshTokenValue: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,

      // 登录
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login(credentials);
          const { access_token, refresh_token, user } = response;
          
          // 保存token到localStorage
          setAuthToken(access_token);
          setRefreshToken(refresh_token);
          
          set({
            user,
            token: access_token,
            refreshTokenValue: refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.detail || '登录失败，请检查邮箱和密码',
          });
          throw error;
        }
      },

      // 注册
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          await authApi.register(data);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.detail || '注册失败，请稍后重试',
          });
          throw error;
        }
      },

      // 登出
      logout: async () => {
        set({ isLoading: true });
        
        try {
          const refreshToken = get().refreshTokenValue;
          if (refreshToken) {
            await authApi.logout(refreshToken);
          }
        } catch (error) {
          // 即使API调用失败也要清除本地状态
          console.error('Logout API error:', error);
        } finally {
          // 清除本地存储
          clearAuthTokens();
          
          set({
            user: null,
            token: null,
            refreshTokenValue: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // 刷新token
      refreshToken: async () => {
        const { refreshTokenValue: currentRefreshToken } = get();
        if (!currentRefreshToken) {
          throw new Error('No refresh token available');
        }
        
        try {
          const response = await authApi.refreshToken(currentRefreshToken);
          const { access_token, refresh_token } = response;
          
          // 更新token
          setAuthToken(access_token);
          setRefreshToken(refresh_token);
          
          set({
            token: access_token,
            refreshTokenValue: refresh_token,
          });
        } catch (error) {
          // 刷新失败，清除状态并跳转到登录页
          clearAuthTokens();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: '登录已过期，请重新登录',
          });
          throw error;
        }
      },

      // 忘记密码
      forgotPassword: async (data: ForgotPasswordData) => {
        set({ isLoading: true, error: null });
        
        try {
          await authApi.forgotPassword(data);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.detail || '发送重置邮件失败，请稍后重试',
          });
          throw error;
        }
      },

      // 重置密码
      resetPassword: async (data: ResetPasswordData) => {
        set({ isLoading: true, error: null });
        
        try {
          await authApi.resetPassword(data);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.detail || '密码重置失败，请稍后重试',
          });
          throw error;
        }
      },

      // 修改密码
      changePassword: async (data: ChangePasswordData) => {
        set({ isLoading: true, error: null });
        
        try {
          await userApi.changePassword(data);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.detail || '密码修改失败，请检查当前密码',
          });
          throw error;
        }
      },

      // 验证邮箱
      verifyEmail: async (data: VerifyEmailData) => {
        set({ isLoading: true, error: null });
        
        try {
          await authApi.verifyEmail(data.token);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.detail || '邮箱验证失败，请检查验证链接',
          });
          throw error;
        }
      },

      // 更新用户信息
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
