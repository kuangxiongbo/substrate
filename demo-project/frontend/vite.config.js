import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// 国际化验证插件
import { i18nValidator } from './src/i18n/plugins/vite-plugin-i18n-validator.js';

// 主题包样式验证插件
function themeStyleValidator(options = {}) {
  const {
    enforceThemePackage = true,
    forbidInlineStyles = true,
    validateStyleSource = true,
    failOnError = true
  } = options;

  return {
    name: 'theme-style-validator',
    enforce: 'pre',
    
    buildStart() {
      console.log('🎨 主题包样式验证器已启动');
    },

    transform(code, id) {
      // 只处理 React 组件文件
      if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) {
        return null;
      }

      // 检查内联样式
      if (forbidInlineStyles && /style\s*=\s*\{[^}]*\}/.test(code)) {
        const error = new Error(`文件 ${id} 包含内联样式，违反主题包强制规范`);
        if (failOnError) {
          throw error;
        } else {
          console.warn(`⚠️  ${error.message}`);
        }
      }

      // 检查硬编码颜色值
      if (enforceThemePackage && /#[0-9a-fA-F]{3,6}/.test(code)) {
        const error = new Error(`文件 ${id} 包含硬编码颜色值，请使用主题包变量`);
        if (failOnError) {
          throw error;
        } else {
          console.warn(`⚠️  ${error.message}`);
        }
      }

      // 检查主题包使用
      if (enforceThemePackage && !/useTheme|ThemeContext/.test(code)) {
        console.warn(`⚠️  文件 ${id} 未使用主题包，建议添加主题包支持`);
      }

      return null;
    },

    generateBundle() {
      console.log('✅ 主题包样式验证完成');
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    themeStyleValidator({
      enforceThemePackage: true,
      forbidInlineStyles: true,
      validateStyleSource: true,
      failOnError: process.env.NODE_ENV === 'production' // 生产环境严格验证
    }),
    i18nValidator({
      enabled: true,
      failOnError: process.env.NODE_ENV === 'production', // 生产环境严格验证
      failOnWarning: false,
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['node_modules/**', 'dist/**', 'build/**'],
      languagePacks: ['src/i18n/locales/**/*.json'],
      reportViolations: true,
      autoFix: false,
    })
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@themes': path.resolve(__dirname, './src/themes'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 主题包变量
          'primary-color': '#1890ff',
          'link-color': '#1890ff',
          'success-color': '#52c41a',
          'warning-color': '#faad14',
          'error-color': '#f5222d',
          'font-size-base': '14px',
          'heading-color': 'rgba(0, 0, 0, 0.85)',
          'text-color': 'rgba(0, 0, 0, 0.65)',
          'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
          'disabled-color': 'rgba(0, 0, 0, 0.25)',
          'border-radius-base': '6px',
          'box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        },
        javascriptEnabled: true,
      },
    },
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          themes: ['@/themes'],
        },
      },
    },
  },

  define: {
    // 主题包强制规范标识
    __THEME_PACKAGE_ENFORCED__: JSON.stringify(true),
    __INLINE_STYLES_FORBIDDEN__: JSON.stringify(true),
    // 国际化强制规范标识
    __I18N_ENFORCED__: JSON.stringify(true),
    __HARDCODED_TEXT_FORBIDDEN__: JSON.stringify(true),
  },
})
