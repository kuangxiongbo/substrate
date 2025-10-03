/**
 * 主题可访问性和对比度检查工具
 * 确保文本、图标、颜色与背景的适配性
 */

/**
 * 计算颜色的相对亮度
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 计算两个颜色之间的对比度
 */
export function getContrastRatio(color1: string, color2: string): number {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * 检查对比度是否符合WCAG标准
 */
export function checkContrastRatio(foreground: string, background: string): {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  level: 'fail' | 'aa' | 'aaa';
} {
  const ratio = getContrastRatio(foreground, background);
  const aa = ratio >= 4.5; // WCAG AA标准
  const aaa = ratio >= 7; // WCAG AAA标准

  let level: 'fail' | 'aa' | 'aaa' = 'fail';
  if (aaa) level = 'aaa';
  else if (aa) level = 'aa';

  return { ratio, aa, aaa, level };
}

/**
 * 获取最佳文本颜色（基于背景色）
 */
export function getOptimalTextColor(backgroundColor: string): string {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(backgroundColor);
  if (!rgb) return '#000000';

  const r = parseInt(rgb[1], 16);
  const g = parseInt(rgb[2], 16);
  const b = parseInt(rgb[3], 16);

  const luminance = getLuminance(r, g, b);
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * 获取最佳图标颜色（基于背景色和对比度要求）
 */
export function getOptimalIconColor(backgroundColor: string, minContrast: number = 4.5): string {
  const lightIcon = '#ffffff';
  const darkIcon = '#000000';
  const mediumIcon = '#666666';

  const lightContrast = getContrastRatio(lightIcon, backgroundColor);
  const darkContrast = getContrastRatio(darkIcon, backgroundColor);
  const mediumContrast = getContrastRatio(mediumIcon, backgroundColor);

  if (lightContrast >= minContrast) return lightIcon;
  if (darkContrast >= minContrast) return darkIcon;
  if (mediumContrast >= minContrast) return mediumIcon;

  // 如果都不满足，返回对比度最高的
  if (lightContrast > darkContrast && lightContrast > mediumContrast) return lightIcon;
  if (darkContrast > mediumContrast) return darkIcon;
  return mediumIcon;
}

/**
 * 生成可访问的颜色调色板
 */
export function generateAccessiblePalette(baseColor: string): {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  background: string;
  surface: string;
  border: string;
} {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(baseColor);
  if (!rgb) {
    return {
      primary: '#1890ff',
      secondary: '#722ed1',
      accent: '#52c41a',
      text: '#262626',
      textSecondary: '#8c8c8c',
      background: '#ffffff',
      surface: '#fafafa',
      border: '#d9d9d9'
    };
  }

  const r = parseInt(rgb[1], 16);
  const g = parseInt(rgb[2], 16);
  const b = parseInt(rgb[3], 16);

  const luminance = getLuminance(r, g, b);
  const isLight = luminance > 0.5;

  if (isLight) {
    // 浅色主题
    return {
      primary: baseColor,
      secondary: adjustBrightness(baseColor, -20),
      accent: adjustSaturation(baseColor, 20),
      text: '#262626',
      textSecondary: '#8c8c8c',
      background: '#ffffff',
      surface: '#fafafa',
      border: '#d9d9d9'
    };
  } else {
    // 深色主题
    return {
      primary: baseColor,
      secondary: adjustBrightness(baseColor, 20),
      accent: adjustSaturation(baseColor, -20),
      text: '#ffffff',
      textSecondary: '#a6a6a6',
      background: '#141414',
      surface: '#1f1f1f',
      border: '#434343'
    };
  }
}

/**
 * 调整颜色亮度
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.min(255, parseInt(rgb[1], 16) + percent));
  const g = Math.max(0, Math.min(255, parseInt(rgb[2], 16) + percent));
  const b = Math.max(0, Math.min(255, parseInt(rgb[3], 16) + percent));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 调整颜色饱和度
 */
export function adjustSaturation(hex: string, percent: number): string {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb) return hex;

  const r = parseInt(rgb[1], 16) / 255;
  const g = parseInt(rgb[2], 16) / 255;
  const b = parseInt(rgb[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return hex;

  const saturation = delta / max;
  const newSaturation = Math.max(0, Math.min(1, saturation + (percent / 100)));

  const factor = newSaturation / saturation;
  const newR = Math.max(0, Math.min(1, r + (r - min) * (factor - 1)));
  const newG = Math.max(0, Math.min(1, g + (g - min) * (factor - 1)));
  const newB = Math.max(0, Math.min(1, b + (b - min) * (factor - 1)));

  const finalR = Math.round(newR * 255);
  const finalG = Math.round(newG * 255);
  const finalB = Math.round(newB * 255);

  return `#${finalR.toString(16).padStart(2, '0')}${finalG.toString(16).padStart(2, '0')}${finalB.toString(16).padStart(2, '0')}`;
}

/**
 * 检查主题的可访问性
 */
export function checkThemeAccessibility(theme: any): {
  score: number;
  issues: Array<{
    component: string;
    property: string;
    issue: string;
    suggestion: string;
  }>;
  recommendations: string[];
} {
  const issues: Array<{
    component: string;
    property: string;
    issue: string;
    suggestion: string;
  }> = [];
  const recommendations: string[] = [];

  // 检查主要文本对比度
  if (theme.token?.colorText && theme.token?.colorBgContainer) {
    const contrast = checkContrastRatio(theme.token.colorText, theme.token.colorBgContainer);
    if (!contrast.aa) {
      issues.push({
        component: 'Text',
        property: 'colorText',
        issue: `文本对比度不足 (${contrast.ratio.toFixed(2)}:1)`,
        suggestion: `建议使用对比度更高的文本颜色，目标对比度 ≥ 4.5:1`
      });
    }
  }

  // 检查链接对比度
  if (theme.token?.colorLink && theme.token?.colorBgContainer) {
    const contrast = checkContrastRatio(theme.token.colorLink, theme.token.colorBgContainer);
    if (!contrast.aa) {
      issues.push({
        component: 'Link',
        property: 'colorLink',
        issue: `链接对比度不足 (${contrast.ratio.toFixed(2)}:1)`,
        suggestion: `建议使用对比度更高的链接颜色，目标对比度 ≥ 4.5:1`
      });
    }
  }

  // 检查按钮对比度
  if (theme.components?.Button) {
    const button = theme.components.Button;
    if (button.defaultColor && button.defaultBg) {
      const contrast = checkContrastRatio(button.defaultColor, button.defaultBg);
      if (!contrast.aa) {
        issues.push({
          component: 'Button',
          property: 'defaultColor',
          issue: `按钮文本对比度不足 (${contrast.ratio.toFixed(2)}:1)`,
          suggestion: `建议调整按钮文本颜色或背景色以提高对比度`
        });
      }
    }
  }

  // 检查菜单对比度
  if (theme.components?.Menu) {
    const menu = theme.components.Menu;
    if (menu.itemColor && menu.itemBg) {
      const contrast = checkContrastRatio(menu.itemColor, menu.itemBg);
      if (!contrast.aa) {
        issues.push({
          component: 'Menu',
          property: 'itemColor',
          issue: `菜单项对比度不足 (${contrast.ratio.toFixed(2)}:1)`,
          suggestion: `建议调整菜单项文本颜色或背景色以提高对比度`
        });
      }
    }
  }

  // 计算可访问性分数
  const totalChecks = 4; // 主要检查项数量
  const passedChecks = totalChecks - issues.length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  // 生成建议
  if (score < 80) {
    recommendations.push('建议全面检查颜色对比度，确保符合WCAG AA标准');
  }
  if (issues.some(issue => issue.component === 'Text')) {
    recommendations.push('建议使用对比度检查工具验证文本可读性');
  }
  if (issues.some(issue => issue.component === 'Link')) {
    recommendations.push('建议为链接提供足够的视觉区分度');
  }
  if (issues.some(issue => issue.component === 'Button')) {
    recommendations.push('建议确保按钮在各种状态下都有足够的对比度');
  }

  return { score, issues, recommendations };
}

/**
 * 生成可访问性报告
 */
export function generateAccessibilityReport(theme: any): string {
  const accessibility = checkThemeAccessibility(theme);
  
  let report = `# 主题可访问性报告\n\n`;
  report += `## 📊 可访问性分数: ${accessibility.score}/100\n\n`;
  
  if (accessibility.score >= 90) {
    report += `✅ **优秀** - 主题具有良好的可访问性\n\n`;
  } else if (accessibility.score >= 80) {
    report += `⚠️ **良好** - 主题基本符合可访问性要求，但还有改进空间\n\n`;
  } else if (accessibility.score >= 60) {
    report += `❌ **需要改进** - 主题存在可访问性问题，建议进行优化\n\n`;
  } else {
    report += `🚫 **不合格** - 主题存在严重的可访问性问题，必须进行修复\n\n`;
  }

  if (accessibility.issues.length > 0) {
    report += `## 🚨 发现的问题\n\n`;
    accessibility.issues.forEach((issue, index) => {
      report += `${index + 1}. **${issue.component}** - ${issue.property}\n`;
      report += `   - 问题: ${issue.issue}\n`;
      report += `   - 建议: ${issue.suggestion}\n\n`;
    });
  }

  if (accessibility.recommendations.length > 0) {
    report += `## 💡 改进建议\n\n`;
    accessibility.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;
  }

  report += `## 📋 检查标准\n\n`;
  report += `- **WCAG AA**: 对比度 ≥ 4.5:1 (正常文本)\n`;
  report += `- **WCAG AAA**: 对比度 ≥ 7:1 (增强可访问性)\n`;
  report += `- **大文本**: 对比度 ≥ 3:1 (18pt+ 或 14pt+ 粗体)\n\n`;

  return report;
}
