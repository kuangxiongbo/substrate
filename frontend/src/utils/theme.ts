/**
 * 主题系统工具函数
 * 基于Spec-Kit方法实现的主题配置和验证功能
 */

// 颜色调色板接口
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

// 字体配置接口
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

// 间距配置接口
export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

// 圆角配置接口
export interface BorderRadiusConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// 阴影配置接口
export interface ShadowConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// 主题配置接口
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

// 主题验证结果
export interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 颜色格式验证正则表达式
const COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const RGB_REGEX = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
const RGBA_REGEX = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
const HSL_REGEX = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
const HSLA_REGEX = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/;

/**
 * 验证颜色格式
 */
export const validateColor = (color: string): boolean => {
  if (!color || typeof color !== 'string') {
    return false;
  }
  
  return COLOR_REGEX.test(color) || 
         RGB_REGEX.test(color) || 
         RGBA_REGEX.test(color) ||
         HSL_REGEX.test(color) || 
         HSLA_REGEX.test(color);
};

/**
 * 验证颜色调色板
 */
export const validateColorPalette = (colors: ColorPalette): string[] => {
  const errors: string[] = [];
  
  Object.entries(colors).forEach(([key, value]) => {
    if (!validateColor(value)) {
      errors.push(`Invalid color format for ${key}: ${value}`);
    }
  });
  
  return errors;
};

/**
 * 验证主题配置
 */
export const validateThemeConfig = (theme: Partial<ThemeConfig>): ThemeValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 验证必需字段
  if (!theme.name || typeof theme.name !== 'string') {
    errors.push('Theme name is required and must be a string');
  }
  
  if (!theme.displayName || typeof theme.displayName !== 'string') {
    errors.push('Theme display name is required and must be a string');
  }
  
  // 验证颜色配置
  if (theme.colors) {
    const colorErrors = validateColorPalette(theme.colors as ColorPalette);
    errors.push(...colorErrors);
  } else {
    errors.push('Theme colors are required');
  }
  
  // 验证字体配置
  if (theme.typography) {
    const { fontSize, fontWeight } = theme.typography;
    
    if (fontSize) {
      Object.entries(fontSize).forEach(([key, value]) => {
        if (!value || typeof value !== 'string') {
          errors.push(`Invalid font size for ${key}: ${value}`);
        } else if (!value.endsWith('px') && !value.endsWith('rem') && !value.endsWith('em')) {
          warnings.push(`Font size for ${key} should include unit (px, rem, em): ${value}`);
        }
      });
    }
    
    if (fontWeight) {
      Object.entries(fontWeight).forEach(([key, value]) => {
        if (typeof value !== 'number' || value < 100 || value > 900) {
          errors.push(`Invalid font weight for ${key}: ${value}. Must be between 100 and 900`);
        }
      });
    }
  }
  
  // 验证间距配置
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      if (!value || typeof value !== 'string') {
        errors.push(`Invalid spacing for ${key}: ${value}`);
      } else if (!value.endsWith('px') && !value.endsWith('rem') && !value.endsWith('em')) {
        warnings.push(`Spacing for ${key} should include unit (px, rem, em): ${value}`);
      }
    });
  }
  
  // 验证圆角配置
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      if (!value || typeof value !== 'string') {
        errors.push(`Invalid border radius for ${key}: ${value}`);
      } else if (!value.endsWith('px') && !value.endsWith('rem') && !value.endsWith('em')) {
        warnings.push(`Border radius for ${key} should include unit (px, rem, em): ${value}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * 应用主题到CSS变量
 */
export const applyTheme = (theme: ThemeConfig): void => {
  const root = document.documentElement;
  
  try {
    // 应用颜色变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // 应用字体变量
    if (theme.typography) {
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
      
      Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
        root.style.setProperty(`--font-weight-${key}`, value.toString());
      });
      
      Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
        root.style.setProperty(`--line-height-${key}`, value.toString());
      });
      
      root.style.setProperty('--font-family', theme.typography.fontFamily);
    }
    
    // 应用间距变量
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
    }
    
    // 应用圆角变量
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });
    }
    
    // 应用阴影变量
    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }
    
    // 设置主题类名
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${theme.name}`);
    
  } catch (error) {
    console.error('Failed to apply theme:', error);
  }
};

/**
 * 获取当前CSS变量值
 */
export const getCSSVariable = (variableName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};

/**
 * 获取所有主题相关的CSS变量
 */
export const getThemeVariables = (): Record<string, string> => {
  const variables: Record<string, string> = {};
  const computedStyle = getComputedStyle(document.documentElement);
  
  // 获取所有CSS变量
  for (let i = 0; i < computedStyle.length; i++) {
    const property = computedStyle[i];
    if (property.startsWith('--')) {
      variables[property] = computedStyle.getPropertyValue(property).trim();
    }
  }
  
  return variables;
};

/**
 * 生成主题CSS变量字符串
 */
export const generateThemeCSS = (theme: ThemeConfig): string => {
  let css = `:root {\n`;
  
  // 颜色变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    css += `  --color-${key}: ${value};\n`;
  });
  
  // 字体变量
  if (theme.typography) {
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`;
    });
    
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      css += `  --font-weight-${key}: ${value};\n`;
    });
    
    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      css += `  --line-height-${key}: ${value};\n`;
    });
    
    css += `  --font-family: ${theme.typography.fontFamily};\n`;
  }
  
  // 间距变量
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`;
    });
  }
  
  // 圆角变量
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      css += `  --border-radius-${key}: ${value};\n`;
    });
  }
  
  // 阴影变量
  if (theme.shadows) {
    Object.entries(theme.shadows).forEach(([key, value]) => {
      css += `  --shadow-${key}: ${value};\n`;
    });
  }
  
  css += `}\n`;
  
  return css;
};

/**
 * 从CSS变量创建主题配置
 */
export const createThemeFromCSS = (name: string, displayName: string): Partial<ThemeConfig> => {
  const variables = getThemeVariables();
  
  const theme: Partial<ThemeConfig> = {
    name,
    displayName,
    colors: {} as ColorPalette,
    typography: {
      fontFamily: variables['--font-family'] || "'Inter', sans-serif",
      fontSize: {
        xs: variables['--font-size-xs'] || '12px',
        sm: variables['--font-size-sm'] || '14px',
        base: variables['--font-size-base'] || '16px',
        lg: variables['--font-size-lg'] || '18px',
        xl: variables['--font-size-xl'] || '20px',
        xxl: variables['--font-size-xxl'] || '24px',
      },
      fontWeight: {
        normal: parseInt(variables['--font-weight-normal']) || 400,
        medium: parseInt(variables['--font-weight-medium']) || 500,
        semibold: parseInt(variables['--font-weight-semibold']) || 600,
        bold: parseInt(variables['--font-weight-bold']) || 700,
      },
      lineHeight: {
        tight: parseFloat(variables['--line-height-tight']) || 1.25,
        normal: parseFloat(variables['--line-height-normal']) || 1.5,
        relaxed: parseFloat(variables['--line-height-relaxed']) || 1.75,
      },
    },
    spacing: {
      xs: variables['--spacing-xs'] || '4px',
      sm: variables['--spacing-sm'] || '8px',
      md: variables['--spacing-md'] || '16px',
      lg: variables['--spacing-lg'] || '24px',
      xl: variables['--spacing-xl'] || '32px',
      xxl: variables['--spacing-xxl'] || '48px',
    },
    borderRadius: {
      sm: variables['--border-radius-sm'] || '4px',
      md: variables['--border-radius-md'] || '8px',
      lg: variables['--border-radius-lg'] || '12px',
      xl: variables['--border-radius-xl'] || '16px',
    },
    shadows: {
      sm: variables['--shadow-sm'] || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: variables['--shadow-md'] || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: variables['--shadow-lg'] || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: variables['--shadow-xl'] || '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
  };
  
  // 提取颜色变量
  Object.keys(variables).forEach(variable => {
    if (variable.startsWith('--color-')) {
      const colorKey = variable.replace('--color-', '') as keyof ColorPalette;
      if (theme.colors) {
        theme.colors[colorKey] = variables[variable];
      }
    }
  });
  
  return theme;
};
