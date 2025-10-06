/**
 * 语言切换Hook
 * 管理语言状态和切换功能
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文' },
  { code: 'en-US', name: 'English', nativeName: 'English' }
];

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // 获取当前语言信息
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  // 切换语言
  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      
      // 保存到localStorage (双重保存确保持久化)
      localStorage.setItem('systemLanguage', languageCode);
      localStorage.setItem('i18nextLng', languageCode);
      
      // 保存到系统配置
      try {
        await fetch('/api/v1/admin/configs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            category: 'basic',
            configs: {
              systemLanguage: languageCode
            }
          })
        });
      } catch (error) {
        console.warn('保存语言设置到数据库失败:', error);
      }

      // 触发语言更改事件
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: languageCode }
      }));

      return true;
    } catch (error) {
      console.error('切换语言失败:', error);
      return false;
    }
  };

  // 从系统配置加载语言设置
  const loadLanguageFromConfig = async () => {
    try {
      const response = await fetch('/api/v1/admin/configs?category=basic');
      if (response.ok) {
        const configs = await response.json();
        const languageConfig = configs.find((config: any) => config.key === 'systemLanguage');
        if (languageConfig && languageConfig.value !== currentLanguage) {
          await changeLanguage(languageConfig.value);
        }
      }
    } catch (error) {
      console.warn('从数据库加载语言设置失败:', error);
    }
  };

  return {
    currentLanguage,
    currentLanguageInfo: getCurrentLanguage(),
    languages,
    changeLanguage,
    loadLanguageFromConfig,
    t
  };
};
