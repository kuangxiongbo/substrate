/**
 * 用户偏好状态管理
 * 使用 Zustand 管理用户主题和布局偏好
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userPreferencesService } from '../services/userPreferencesService';
import type {
  UserPreferences,
  UserPreferencesUpdate,
  AdminPreferences,
  PreferencesSyncStatus,
  PreferencesPermissionCheck,
  PreferencesChangeHistory,
} from '../types/user-preferences';
import { DEFAULT_USER_PREFERENCES } from '../types/user-preferences';

interface UserPreferencesState {
  // 状态
  preferences: UserPreferences;
  adminPreferences: AdminPreferences | null;
  permissions: PreferencesPermissionCheck | null;
  syncStatus: PreferencesSyncStatus;
  isLoading: boolean;
  error: string | null;
  history: PreferencesChangeHistory[];
}

interface UserPreferencesActions {
  // 偏好管理
  loadPreferences: () => Promise<void>;
  updatePreferences: (update: UserPreferencesUpdate) => Promise<void>;
  resetPreferences: () => Promise<void>;
  
  // 管理员功能
  loadAdminPreferences: () => Promise<void>;
  updateAdminPreferences: (update: Partial<AdminPreferences>) => Promise<void>;
  
  // 权限管理
  loadPermissions: () => Promise<void>;
  
  // 同步功能
  syncPreferences: () => Promise<void>;
  
  // 历史记录
  loadHistory: (userId?: string) => Promise<void>;
  
  // 工具方法
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  
  // 本地存储
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

type UserPreferencesStore = UserPreferencesState & UserPreferencesActions;

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      preferences: DEFAULT_USER_PREFERENCES,
      adminPreferences: null,
      permissions: null,
      syncStatus: { isSyncing: false },
      isLoading: false,
      error: null,
      history: [],

      // 加载用户偏好
      loadPreferences: async () => {
        set({ isLoading: true, error: null });
        try {
          const preferences = await userPreferencesService.getCurrentUserPreferences();
          set({ preferences, isLoading: false });
        } catch (error: any) {
          console.error('Failed to load user preferences:', error);
          set({ 
            error: error.message || 'Failed to load preferences',
            isLoading: false 
          });
        }
      },

      // 更新用户偏好
      updatePreferences: async (update: UserPreferencesUpdate) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPreferences = await userPreferencesService.updateCurrentUserPreferences(update);
          set({ 
            preferences: updatedPreferences,
            isLoading: false 
          });
          
          // 自动同步到服务器
          await get().syncPreferences();
        } catch (error: any) {
          console.error('Failed to update user preferences:', error);
          set({ 
            error: error.message || 'Failed to update preferences',
            isLoading: false 
          });
        }
      },

      // 重置用户偏好
      resetPreferences: async () => {
        set({ isLoading: true, error: null });
        try {
          const resetPreferences = await userPreferencesService.resetCurrentUserPreferences();
          set({ 
            preferences: resetPreferences,
            isLoading: false 
          });
          
          // 自动同步到服务器
          await get().syncPreferences();
        } catch (error: any) {
          console.error('Failed to reset user preferences:', error);
          set({ 
            error: error.message || 'Failed to reset preferences',
            isLoading: false 
          });
        }
      },

      // 加载管理员偏好
      loadAdminPreferences: async () => {
        set({ isLoading: true, error: null });
        try {
          const adminPreferences = await userPreferencesService.getAdminPreferences();
          set({ adminPreferences, isLoading: false });
        } catch (error: any) {
          console.error('Failed to load admin preferences:', error);
          set({ 
            error: error.message || 'Failed to load admin preferences',
            isLoading: false 
          });
        }
      },

      // 更新管理员偏好
      updateAdminPreferences: async (update: Partial<AdminPreferences>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedAdminPreferences = await userPreferencesService.updateAdminPreferences(update);
          set({ 
            adminPreferences: updatedAdminPreferences,
            isLoading: false 
          });
        } catch (error: any) {
          console.error('Failed to update admin preferences:', error);
          set({ 
            error: error.message || 'Failed to update admin preferences',
            isLoading: false 
          });
        }
      },

      // 加载权限信息
      loadPermissions: async () => {
        set({ isLoading: true, error: null });
        try {
          const permissions = await userPreferencesService.getPreferencesPermissions();
          set({ permissions, isLoading: false });
        } catch (error: any) {
          console.error('Failed to load permissions:', error);
          set({ 
            error: error.message || 'Failed to load permissions',
            isLoading: false 
          });
        }
      },

      // 同步偏好设置
      syncPreferences: async () => {
        const { preferences } = get();
        set({ syncStatus: { isSyncing: true } });
        
        try {
          const syncStatus = await userPreferencesService.syncPreferences(preferences);
          set({ 
            syncStatus: {
              ...syncStatus,
              isSyncing: false,
              lastSyncTime: new Date().toISOString(),
            }
          });
        } catch (error: any) {
          console.error('Failed to sync preferences:', error);
          set({ 
            syncStatus: {
              isSyncing: false,
              syncError: error.message || 'Failed to sync preferences',
            }
          });
        }
      },

      // 加载历史记录
      loadHistory: async (userId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const history = await userPreferencesService.getPreferencesHistory(userId);
          set({ history, isLoading: false });
        } catch (error: any) {
          console.error('Failed to load preferences history:', error);
          set({ 
            error: error.message || 'Failed to load history',
            isLoading: false 
          });
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // 保存到本地存储
      saveToLocalStorage: () => {
        const { preferences } = get();
        localStorage.setItem('user-preferences', JSON.stringify(preferences));
      },

      // 从本地存储加载
      loadFromLocalStorage: () => {
        try {
          const stored = localStorage.getItem('user-preferences');
          if (stored) {
            const preferences = JSON.parse(stored);
            set({ preferences });
          }
        } catch (error) {
          console.error('Failed to load preferences from localStorage:', error);
        }
      },
    }),
    {
      name: 'user-preferences-store',
      partialize: (state) => ({
        preferences: state.preferences,
        syncStatus: state.syncStatus,
      }),
    }
  )
);

// 便捷的 Hook 用于获取特定偏好
export const useThemePreference = () => {
  const { preferences, updatePreferences } = useUserPreferencesStore();
  
  return {
    theme: preferences.theme,
    setTheme: (theme: UserPreferences['theme']) => 
      updatePreferences({ theme }),
  };
};

export const useLayoutPreference = () => {
  const { preferences, updatePreferences } = useUserPreferencesStore();
  
  return {
    layout: preferences.layout,
    setLayout: (layout: UserPreferences['layout']) => 
      updatePreferences({ layout }),
  };
};

// 管理员专用 Hook
export const useAdminPreferences = () => {
  const { 
    adminPreferences, 
    permissions, 
    loadAdminPreferences, 
    updateAdminPreferences,
    loadPermissions 
  } = useUserPreferencesStore();
  
  return {
    adminPreferences,
    permissions,
    loadAdminPreferences,
    updateAdminPreferences,
    loadPermissions,
    canManagePreferences: permissions?.canChangeTheme && permissions?.canChangeLayout,
  };
};
