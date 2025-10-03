/**
 * 主题上下文
 * 基于Spec-Kit方法实现的主题状态管理
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { 
  themeManager,
  loadAllThemes,
  getTheme,
  getAllThemes,
  initializeThemes,
  getGlobalStyleManager
} from '../themes';
import type { ThemePackageConfig } from '../themes';
import { useAuthStore } from '../stores/authStore';

// 类型定义已移动到 antd-themes.ts 文件中

// 主题上下文类型
export interface ThemeContextType {
  currentTheme: ThemePackageConfig;
  availableThemes: ThemePackageConfig[];
  setTheme: (themeName: string) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isLoading: boolean;
}

// 主题存储键
export const THEME_STORAGE_KEYS = {
  SELECTED_THEME: 'selectedTheme',
  THEME_CONFIG: 'themeConfig',
  THEME_HISTORY: 'themeHistory',
  USER_THEME_PREFIX: 'user_theme_', // 用户主题偏好前缀
} as const;

// 主题应用函数已由 ConfigProvider 处理

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | null>(null);

// 旧主题定义已移动到 antd-themes.ts 文件中

// 深色主题定义已移动到 antd-themes.ts 文件中

// 高对比度主题定义已移动到 antd-themes.ts 文件中

// 使用从 antd-themes.ts 导入的主题列表

// 主题提供者组件
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemePackageConfig | null>(null);
  const [availableThemes, setAvailableThemes] = useState<ThemePackageConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();

  // 初始化主题
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // 初始化主题包系统（这会加载所有主题包）
        await initializeThemes();
        
        // 获取所有已加载的主题包
        const themes = getAllThemes();
        setAvailableThemes(themes);
        
        let themeToSet;
        
        if (isAuthenticated && user) {
          // 登录状态：获取用户特定的主题偏好
          const userThemeKey = `${THEME_STORAGE_KEYS.USER_THEME_PREFIX}${user.id}`;
          const userThemeName = localStorage.getItem(userThemeKey);
          
          if (userThemeName) {
            const userTheme = getTheme(userThemeName);
            if (userTheme) {
              themeToSet = userTheme;
            }
          }
          
          // 如果用户没有设置主题偏好，使用浅色主题作为默认
          if (!themeToSet) {
            themeToSet = getTheme('light') || themes[0];
            // 保存用户的默认主题偏好
            localStorage.setItem(userThemeKey, 'light');
          }
        } else {
          // 未登录状态：使用浅色主题作为系统默认
          themeToSet = getTheme('light') || themes[0];
        }
        
        setCurrentTheme(themeToSet);
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        // 使用默认浅色主题
        const defaultTheme = getTheme('light');
        if (defaultTheme) {
          setCurrentTheme(defaultTheme);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, [isAuthenticated, user]);

  // 设置主题 - 简化版本，只更换样式类名
  const setTheme = useCallback((themeName: string) => {
    try {
      const theme = getTheme(themeName);
      if (theme) {
        console.log('Setting theme:', themeName);
        setCurrentTheme(theme);
        
        // 简单切换主题类名
        const root = document.documentElement;
        const body = document.body;
        
        // 移除所有主题类名
        root.className = root.className.replace(/theme-\w+/g, '');
        body.className = body.className.replace(/theme-\w+/g, '');
        
        // 添加新主题类名
        const themeClass = `theme-${theme.meta.id}`;
        root.classList.add(themeClass);
        body.classList.add(themeClass);
        
        // 保存主题偏好
        if (isAuthenticated && user) {
          // 登录用户：保存到用户特定的存储键
          const userThemeKey = `${THEME_STORAGE_KEYS.USER_THEME_PREFIX}${user.id}`;
          localStorage.setItem(userThemeKey, themeName);
          console.log('User theme preference saved:', themeName);
        } else {
          // 未登录用户：保存到通用存储键（临时）
          localStorage.setItem(THEME_STORAGE_KEYS.SELECTED_THEME, themeName);
          console.log('Temporary theme saved:', themeName);
        }
        
        console.log('Theme switched to:', themeName);
      } else {
        console.error('Theme not found:', themeName);
      }
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }, [isAuthenticated, user]);

  // 监听用户登录状态变化，应用用户主题偏好
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      // 用户登录后，立即应用其主题偏好
      const userThemeKey = `${THEME_STORAGE_KEYS.USER_THEME_PREFIX}${user.id}`;
      const userThemeName = localStorage.getItem(userThemeKey);
      
      if (userThemeName && userThemeName !== currentTheme?.meta.id) {
        console.log('Applying user theme preference:', userThemeName);
        setTheme(userThemeName);
      } else if (!userThemeName) {
        // 如果用户没有主题偏好，设置默认浅色主题
        console.log('Setting default light theme for new user');
        setTheme('light');
      }
    } else if (!isAuthenticated && !isLoading) {
      // 用户登出后，切换到系统默认浅色主题
      console.log('User logged out, switching to default light theme');
      setTheme('light');
    }
  }, [isAuthenticated, user, isLoading, currentTheme, setTheme]);

  // 切换主题（在浅色和深色之间切换）
  const toggleTheme = useCallback(() => {
    if (!currentTheme) return;
    const newTheme = currentTheme.meta.id === 'dark' ? getTheme('light') : getTheme('dark');
    if (newTheme) {
      setTheme(newTheme.meta.id);
    }
  }, [currentTheme, setTheme]);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有手动设置主题时才跟随系统
      const savedThemeName = localStorage.getItem(THEME_STORAGE_KEYS.SELECTED_THEME);
      if (!savedThemeName) {
        const systemTheme = e.matches ? getTheme('dark') : getTheme('light');
        if (systemTheme) {
          setCurrentTheme(systemTheme);
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const contextValue: ThemeContextType = {
    currentTheme: currentTheme!,
    availableThemes,
    setTheme,
    toggleTheme,
    isDarkMode: currentTheme?.meta.id === 'dark',
    isLoading,
  };

  // 如果主题还未加载完成，显示加载状态
  if (!currentTheme) {
    return (
      <ThemeContext.Provider value={contextValue}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '16px',
          color: '#666'
        }}>
          正在加载主题...
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// 使用主题的Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 主题配置已从 antd-themes.ts 导出



