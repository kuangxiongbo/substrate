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

  // 初始化主题
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // 初始化主题包系统（这会加载所有主题包）
        await initializeThemes();
        
        // 获取所有已加载的主题包
        const themes = getAllThemes();
        setAvailableThemes(themes);
        
        // 从本地存储获取保存的主题
        const savedThemeName = localStorage.getItem(THEME_STORAGE_KEYS.SELECTED_THEME);
        
        if (savedThemeName) {
          // 查找保存的主题
          const savedTheme = getTheme(savedThemeName);
          if (savedTheme) {
            setCurrentTheme(savedTheme);
          } else {
            // 如果保存的主题不存在，使用默认主题
            const defaultTheme = getTheme('light') || themes[0];
            setCurrentTheme(defaultTheme);
          }
        } else {
          // 检查系统主题偏好
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const initialTheme = prefersDark ? getTheme('dark') : getTheme('light');
          setCurrentTheme(initialTheme || themes[0]);
        }
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        // 使用默认主题
        const defaultTheme = getTheme('light');
        if (defaultTheme) {
          setCurrentTheme(defaultTheme);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // 设置主题
  const setTheme = useCallback((themeName: string) => {
    try {
      const theme = getTheme(themeName);
      if (theme) {
        console.log('Setting theme:', themeName, theme);
        setCurrentTheme(theme);
        
        // 应用主题样式到DOM
        const styleManager = getGlobalStyleManager();
        styleManager.applyTheme(theme, {
          targetSelector: 'body',
          insertPosition: 'head',
          replaceExisting: true,
          minify: false
        });
        
        // 确保主题类名正确应用到DOM
        console.log(`Applying theme: ${theme.meta.id} (${theme.meta.displayName})`);
        
        // 保存到本地存储
        localStorage.setItem(THEME_STORAGE_KEYS.SELECTED_THEME, themeName);
        console.log('Theme set successfully:', themeName);
        
        // 保存主题历史
        const history = JSON.parse(localStorage.getItem(THEME_STORAGE_KEYS.THEME_HISTORY) || '[]');
        const newHistory = [themeName, ...history.filter((name: string) => name !== themeName)].slice(0, 10);
        localStorage.setItem(THEME_STORAGE_KEYS.THEME_HISTORY, JSON.stringify(newHistory));
      } else {
        console.error('Theme not found:', themeName);
      }
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }, []);

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
