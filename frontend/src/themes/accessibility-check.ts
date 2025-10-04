/**
 * 主题可访问性检查工具
 * 检查文本、图标、颜色与背景的适配性
 */

import { checkThemeAccessibility, generateAccessibilityReport } from './core/accessibility';
import lightTheme from './packages/light';
import darkTheme from './packages/dark';

/**
 * 检查所有主题的可访问性
 */
export function checkAllThemesAccessibility() {
  console.log('🔍 开始检查主题可访问性...\n');

  // 检查浅色主题
  console.log('📋 检查浅色主题可访问性');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const lightAccessibility = checkThemeAccessibility(lightTheme);
  console.log(`可访问性分数: ${lightAccessibility.score}/100`);
  
  if (lightAccessibility.issues.length > 0) {
    console.log('\n🚨 发现的问题:');
    lightAccessibility.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.component} - ${issue.property}`);
      console.log(`   问题: ${issue.issue}`);
      console.log(`   建议: ${issue.suggestion}\n`);
    });
  }

  if (lightAccessibility.recommendations.length > 0) {
    console.log('💡 改进建议:');
    lightAccessibility.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 检查深色主题
  console.log('📋 检查深色主题可访问性');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const darkAccessibility = checkThemeAccessibility(darkTheme);
  console.log(`可访问性分数: ${darkAccessibility.score}/100`);
  
  if (darkAccessibility.issues.length > 0) {
    console.log('\n🚨 发现的问题:');
    darkAccessibility.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.component} - ${issue.property}`);
      console.log(`   问题: ${issue.issue}`);
      console.log(`   建议: ${issue.suggestion}\n`);
    });
  }

  if (darkAccessibility.recommendations.length > 0) {
    console.log('💡 改进建议:');
    darkAccessibility.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  // 生成详细报告
  console.log('\n' + '='.repeat(50) + '\n');
  console.log('📊 生成详细可访问性报告...');
  
  const lightReport = generateAccessibilityReport(lightTheme);
  const darkReport = generateAccessibilityReport(darkTheme);
  
  console.log('\n📄 浅色主题可访问性报告:');
  console.log(lightReport);
  
  console.log('\n📄 深色主题可访问性报告:');
  console.log(darkReport);

  return {
    light: lightAccessibility,
    dark: darkAccessibility,
    lightReport,
    darkReport
  };
}

/**
 * 生成可访问性优化建议
 */
export function generateAccessibilityOptimizations() {
  const optimizations = {
    light: {
      textContrast: {
        current: '#1f1f1f',
        optimized: '#000000',
        reason: '使用纯黑色文本可提供最佳对比度'
      },
      secondaryText: {
        current: '#595959',
        optimized: '#404040',
        reason: '提高次要文本对比度，确保可读性'
      },
      placeholder: {
        current: '#8c8c8c',
        optimized: '#666666',
        reason: '提高占位符文本对比度'
      },
      menuText: {
        current: 'rgba(255, 255, 255, 0.95)',
        optimized: '#ffffff',
        reason: '菜单文本使用纯白色确保最佳对比度'
      }
    },
    dark: {
      textContrast: {
        current: '#ffffff',
        optimized: '#ffffff',
        reason: '深色主题中纯白色文本已提供最佳对比度'
      },
      secondaryText: {
        current: '#d9d9d9',
        optimized: '#e6e6e6',
        reason: '进一步提高次要文本对比度'
      },
      placeholder: {
        current: '#a6a6a6',
        optimized: '#bfbfbf',
        reason: '提高占位符文本对比度'
      },
      menuText: {
        current: 'rgba(255, 255, 255, 0.95)',
        optimized: '#ffffff',
        reason: '菜单文本使用纯白色确保最佳对比度'
      }
    }
  };

  console.log('🎯 可访问性优化建议');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('\n📋 浅色主题优化建议:');
  Object.entries(optimizations.light).forEach(([key, value]) => {
    console.log(`• ${key}: ${value.current} → ${value.optimized}`);
    console.log(`  原因: ${value.reason}\n`);
  });

  console.log('\n📋 深色主题优化建议:');
  Object.entries(optimizations.dark).forEach(([key, value]) => {
    console.log(`• ${key}: ${value.current} → ${value.optimized}`);
    console.log(`  原因: ${value.reason}\n`);
  });

  return optimizations;
}

/**
 * 检查特定颜色组合的对比度
 */
export function checkColorContrast(foreground: string, background: string, component: string = 'Unknown') {
  const { getContrastRatio, checkContrastRatio } = require('./core/accessibility');
  
  const ratio = getContrastRatio(foreground, background);
  const contrast = checkContrastRatio(foreground, background);
  
  console.log(`🔍 检查 ${component} 颜色对比度:`);
  console.log(`前景色: ${foreground}`);
  console.log(`背景色: ${background}`);
  console.log(`对比度: ${ratio.toFixed(2)}:1`);
  console.log(`WCAG AA: ${contrast.aa ? '✅ 通过' : '❌ 未通过'}`);
  console.log(`WCAG AAA: ${contrast.aaa ? '✅ 通过' : '❌ 未通过'}`);
  console.log(`等级: ${contrast.level.toUpperCase()}\n`);
  
  return { ratio, contrast };
}

// 导出检查函数
export { checkThemeAccessibility, generateAccessibilityReport } from './core/accessibility';










