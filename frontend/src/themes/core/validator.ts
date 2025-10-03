/**
 * 主题包验证器
 * 基于 Spec-Kit 方法的主题包验证系统
 */

import type {
  ThemePackageConfig,
  ThemePackageMeta,
  ThemeToken,
  ThemeComponents,
  ThemePackageValidator,
  ValidationResult,
} from './types';

export class ThemePackageValidatorImpl implements ThemePackageValidator {
  /**
   * 验证完整的主题包配置
   */
  validate(config: ThemePackageConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证元数据
    const metaResult = this.validateMeta(config.meta);
    errors.push(...metaResult.errors);
    warnings.push(...metaResult.warnings);

    // 验证令牌
    const tokenResult = this.validateToken(config.token);
    errors.push(...tokenResult.errors);
    warnings.push(...tokenResult.warnings);

    // 验证组件配置
    const componentsResult = this.validateComponents(config.components);
    errors.push(...componentsResult.errors);
    warnings.push(...componentsResult.warnings);

    // 验证算法
    if (!config.algorithm) {
      errors.push('Theme algorithm is required');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证主题包元数据
   */
  validateMeta(meta: ThemePackageMeta): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 必需字段验证
    if (!meta.id || typeof meta.id !== 'string') {
      errors.push('Theme package ID is required and must be a string');
    } else if (!/^[a-zA-Z0-9-_]+$/.test(meta.id)) {
      errors.push('Theme package ID must contain only alphanumeric characters, hyphens, and underscores');
    }

    if (!meta.name || typeof meta.name !== 'string') {
      errors.push('Theme package name is required and must be a string');
    }

    if (!meta.displayName || typeof meta.displayName !== 'string') {
      errors.push('Theme package display name is required and must be a string');
    }

    if (!meta.description || typeof meta.description !== 'string') {
      errors.push('Theme package description is required and must be a string');
    }

    if (!meta.version || typeof meta.version !== 'string') {
      errors.push('Theme package version is required and must be a string');
    } else if (!/^\d+\.\d+\.\d+$/.test(meta.version)) {
      warnings.push('Theme package version should follow semantic versioning (e.g., 1.0.0)');
    }

    if (!meta.author || typeof meta.author !== 'string') {
      errors.push('Theme package author is required and must be a string');
    }

    // 数组字段验证
    if (!Array.isArray(meta.tags)) {
      errors.push('Theme package tags must be an array');
    } else {
      meta.tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
          errors.push(`Theme package tag at index ${index} must be a string`);
        }
      });
    }

    // 分类验证
    const validCategories = ['light', 'dark', 'colorful', 'minimal', 'professional'];
    if (!validCategories.includes(meta.category)) {
      errors.push(`Theme package category must be one of: ${validCategories.join(', ')}`);
    }

    // 日期验证
    if (!meta.createdAt || typeof meta.createdAt !== 'string') {
      errors.push('Theme package createdAt is required and must be a string');
    } else if (isNaN(Date.parse(meta.createdAt))) {
      errors.push('Theme package createdAt must be a valid ISO date string');
    }

    if (!meta.updatedAt || typeof meta.updatedAt !== 'string') {
      errors.push('Theme package updatedAt is required and must be a string');
    } else if (isNaN(Date.parse(meta.updatedAt))) {
      errors.push('Theme package updatedAt must be a valid ISO date string');
    }

    // 预览图片验证
    if (meta.preview && typeof meta.preview !== 'string') {
      errors.push('Theme package preview must be a string (URL or base64)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证主题令牌
   */
  validateToken(token: ThemeToken): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 颜色验证
    const colorFields = [
      'colorPrimary', 'colorSuccess', 'colorWarning', 'colorError', 'colorInfo',
      'colorBgBase', 'colorBgContainer', 'colorBgElevated', 'colorBgLayout',
      'colorBgSpotlight', 'colorBgMask', 'colorText', 'colorTextSecondary',
      'colorTextTertiary', 'colorTextQuaternary', 'colorTextDisabled',
      'colorTextHeading', 'colorTextDescription', 'colorTextPlaceholder',
      'colorBorder', 'colorBorderSecondary', 'colorSplit', 'colorFill',
      'colorFillSecondary', 'colorFillTertiary', 'colorFillQuaternary',
      'colorLink', 'colorLinkHover', 'colorLinkActive',
    ];

    colorFields.forEach(field => {
      const value = (token as any)[field];
      if (!value || typeof value !== 'string') {
        errors.push(`Token ${field} is required and must be a string`);
      } else if (!this.isValidColor(value)) {
        errors.push(`Token ${field} must be a valid color value`);
      }
    });

    // 数值验证
    const numberFields = [
      'borderRadius', 'borderRadiusLG', 'borderRadiusSM', 'borderRadiusXS',
      'fontSize', 'fontSizeLG', 'fontSizeSM', 'fontSizeXL',
      'fontSizeHeading1', 'fontSizeHeading2', 'fontSizeHeading3',
      'fontSizeHeading4', 'fontSizeHeading5', 'lineHeight', 'lineHeightLG',
      'lineHeightSM', 'padding', 'paddingLG', 'paddingSM', 'paddingXS',
      'margin', 'marginLG', 'marginSM', 'marginXS', 'controlHeight',
      'controlHeightLG', 'controlHeightSM',
    ];

    numberFields.forEach(field => {
      const value = (token as any)[field];
      if (typeof value !== 'number' || value < 0) {
        errors.push(`Token ${field} must be a non-negative number`);
      }
    });

    // 字符串验证
    const stringFields = [
      'fontFamily', 'motionDurationFast', 'motionDurationMid', 'motionDurationSlow',
      'motionEaseInOut', 'motionEaseOut', 'motionEaseIn',
    ];

    stringFields.forEach(field => {
      const value = (token as any)[field];
      if (!value || typeof value !== 'string') {
        errors.push(`Token ${field} is required and must be a string`);
      }
    });

    // 阴影验证
    const shadowFields = ['boxShadow', 'boxShadowSecondary', 'boxShadowTertiary'];
    shadowFields.forEach(field => {
      const value = (token as any)[field];
      if (!value || typeof value !== 'string') {
        errors.push(`Token ${field} is required and must be a string`);
      }
    });

    // 布尔值验证
    if (typeof token.wireframe !== 'boolean') {
      errors.push('Token wireframe must be a boolean');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证组件配置
   */
  validateComponents(components: ThemeComponents): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查是否有组件配置
    if (!components || typeof components !== 'object') {
      errors.push('Components configuration is required and must be an object');
      return { valid: false, errors, warnings };
    }

    // 验证每个组件配置
    Object.entries(components).forEach(([componentName, config]) => {
      if (config && typeof config === 'object') {
        // 验证组件配置中的值
        Object.entries(config).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            warnings.push(`Component ${componentName}.${key} has null/undefined value`);
          }
        });
      } else if (config !== undefined) {
        errors.push(`Component ${componentName} configuration must be an object or undefined`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证颜色值
   */
  private isValidColor(color: string): boolean {
    // 支持的颜色格式：
    // - #rgb, #rrggbb, #rrggbbaa
    // - rgb(r, g, b), rgba(r, g, b, a)
    // - hsl(h, s%, l%), hsla(h, s%, l%, a)
    // - 命名颜色 (red, blue, etc.)
    // - transparent, currentColor
    const colorRegex = /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)|transparent|currentColor|[a-zA-Z]+)$/;
    
    return colorRegex.test(color);
  }

  /**
   * 验证主题包ID的唯一性
   */
  validateUniqueId(packageId: string, existingPackages: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (existingPackages.includes(packageId)) {
      errors.push(`Theme package ID '${packageId}' already exists`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证主题包兼容性
   */
  validateCompatibility(config: ThemePackageConfig, targetVersion: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 这里可以添加版本兼容性检查
    // 例如检查主题包是否与当前系统版本兼容
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// 创建默认验证器实例
export const themePackageValidator = new ThemePackageValidatorImpl();
