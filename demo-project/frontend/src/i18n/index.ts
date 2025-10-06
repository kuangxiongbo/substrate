/**
 * 国际化配置文件
 * 支持中文和英文语言切换
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言包
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// 语言资源
const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  }
};


// 配置i18n
i18n
  .use(LanguageDetector) // 自动检测语言
  .use(initReactI18next) // 初始化react-i18next
  .init({
    resources,
    fallbackLng: 'zh-CN', // 默认语言
    debug: false, // 开发环境开启调试
    
    detection: {
      // 语言检测配置 - 优先从数据库设置加载
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'systemLanguage',
    },

    interpolation: {
      escapeValue: false, // React已经转义了
    },

    // 语言切换事件
    saveMissing: false,
    missingKeyHandler: (lngs: readonly string[], _ns: string, key: string, _fallbackValue: string) => {
      console.warn(`Missing translation for key: ${key} in language: ${lngs.join(', ')}`);
    }
  });

export default i18n;
