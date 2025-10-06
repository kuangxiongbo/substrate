/**
 * 语言切换组件
 * 提供中英文切换功能
 */
import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../hooks/useLanguage';
import type { MenuProps } from 'antd';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, currentLanguageInfo, languages, changeLanguage } = useLanguage();

  // 下拉菜单选项
  const menuItems: MenuProps['items'] = languages.map(lang => ({
    key: lang.code,
    label: (
      <Space>
        <span>{lang.nativeName}</span>
        {currentLanguage === lang.code && <span>✓</span>}
      </Space>
    ),
    onClick: () => changeLanguage(lang.code)
  }));

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button 
        type="text" 
        icon={<GlobalOutlined />}
        className="language-switcher-btn"
      >
        <Space>
          <span>{currentLanguageInfo.nativeName}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
