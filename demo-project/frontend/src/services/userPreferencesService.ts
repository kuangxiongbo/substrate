/**
 * 用户偏好服务
 * 处理用户主题和布局偏好的API调用
 */

import api from './api';
import type {
  UserPreferences,
  UserPreferencesUpdate,
  AdminPreferences,
  PreferencesSyncStatus,
  PreferencesValidationResult,
  PreferencesPermissionCheck,
  PreferencesChangeHistory,
} from '../types/user-preferences';

class UserPreferencesService {
  private baseUrl = '/api/v1/user-preferences';

  /**
   * 获取当前用户的偏好设置
   */
  async getCurrentUserPreferences(): Promise<UserPreferences> {
    try {
      const response = await api.get(`${this.baseUrl}/current`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw error;
    }
  }

  /**
   * 更新当前用户的偏好设置
   */
  async updateCurrentUserPreferences(update: UserPreferencesUpdate): Promise<UserPreferences> {
    try {
      const response = await api.patch(`${this.baseUrl}/current`, update);
      return response.data;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      throw error;
    }
  }

  /**
   * 重置当前用户的偏好设置
   */
  async resetCurrentUserPreferences(): Promise<UserPreferences> {
    try {
      const response = await api.delete(`${this.baseUrl}/current`);
      return response.data;
    } catch (error) {
      console.error('Failed to reset user preferences:', error);
      throw error;
    }
  }

  /**
   * 获取指定用户的偏好设置（管理员权限）
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get preferences for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * 更新指定用户的偏好设置（管理员权限）
   */
  async updateUserPreferences(userId: string, update: UserPreferencesUpdate): Promise<UserPreferences> {
    try {
      const response = await api.patch(`${this.baseUrl}/${userId}`, update);
      return response.data;
    } catch (error) {
      console.error(`Failed to update preferences for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * 获取管理员偏好设置
   */
  async getAdminPreferences(): Promise<AdminPreferences> {
    try {
      const response = await api.get(`${this.baseUrl}/admin`);
      return response.data;
    } catch (error) {
      console.error('Failed to get admin preferences:', error);
      throw error;
    }
  }

  /**
   * 更新管理员偏好设置
   */
  async updateAdminPreferences(update: Partial<AdminPreferences>): Promise<AdminPreferences> {
    try {
      const response = await api.patch(`${this.baseUrl}/admin`, update);
      return response.data;
    } catch (error) {
      console.error('Failed to update admin preferences:', error);
      throw error;
    }
  }

  /**
   * 验证偏好配置
   */
  async validatePreferences(preferences: UserPreferencesUpdate): Promise<PreferencesValidationResult> {
    try {
      const response = await api.post(`${this.baseUrl}/validate`, preferences);
      return response.data;
    } catch (error) {
      console.error('Failed to validate preferences:', error);
      throw error;
    }
  }

  /**
   * 获取偏好权限检查
   */
  async getPreferencesPermissions(): Promise<PreferencesPermissionCheck> {
    try {
      const response = await api.get(`${this.baseUrl}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Failed to get preferences permissions:', error);
      throw error;
    }
  }

  /**
   * 同步偏好设置到服务器
   */
  async syncPreferences(preferences: UserPreferences): Promise<PreferencesSyncStatus> {
    try {
      const response = await api.post(`${this.baseUrl}/sync`, preferences);
      return response.data;
    } catch (error) {
      console.error('Failed to sync preferences:', error);
      throw error;
    }
  }

  /**
   * 获取偏好变更历史
   */
  async getPreferencesHistory(userId?: string): Promise<PreferencesChangeHistory[]> {
    try {
      const url = userId ? `${this.baseUrl}/history/${userId}` : `${this.baseUrl}/history`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to get preferences history:', error);
      throw error;
    }
  }

  /**
   * 导出用户偏好设置
   */
  async exportPreferences(): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export preferences:', error);
      throw error;
    }
  }

  /**
   * 导入用户偏好设置
   */
  async importPreferences(file: File): Promise<UserPreferences> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      throw error;
    }
  }

  /**
   * 批量更新用户偏好（管理员功能）
   */
  async batchUpdatePreferences(updates: Array<{ userId: string; preferences: UserPreferencesUpdate }>): Promise<UserPreferences[]> {
    try {
      const response = await api.post(`${this.baseUrl}/batch-update`, { updates });
      return response.data;
    } catch (error) {
      console.error('Failed to batch update preferences:', error);
      throw error;
    }
  }

  /**
   * 获取系统默认偏好设置
   */
  async getSystemDefaults(): Promise<UserPreferences> {
    try {
      const response = await api.get(`${this.baseUrl}/system-defaults`);
      return response.data;
    } catch (error) {
      console.error('Failed to get system defaults:', error);
      throw error;
    }
  }

  /**
   * 设置系统默认偏好（管理员功能）
   */
  async setSystemDefaults(defaults: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const response = await api.post(`${this.baseUrl}/system-defaults`, defaults);
      return response.data;
    } catch (error) {
      console.error('Failed to set system defaults:', error);
      throw error;
    }
  }
}

// 创建单例实例
export const userPreferencesService = new UserPreferencesService();
