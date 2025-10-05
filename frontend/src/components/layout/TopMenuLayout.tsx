/**
 * 顶部菜单布局组件
 * 基于Spec-Kit方法重构的顶部菜单布局
 */

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  BellOutlined,
  SkinOutlined,
  HistoryOutlined,
  // MonitorOutlined,
  // DatabaseOutlined,
  // FileTextOutlined,
  // FolderOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../stores/authStore';
import QuickSettingsPanel from '../QuickSettingsPanel';
import './TopMenuLayout.css';
import '../../styles/menu-theme.css';

const { Header, Content } = Layout;
const { Text } = Typography;

interface TopMenuLayoutProps {
  children: React.ReactNode;
}

const TopMenuLayout: React.FC<TopMenuLayoutProps> = ({ children }) => {
  const { currentTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [quickSettingsVisible, setQuickSettingsVisible] = React.useState(false);
  const [systemTitle, setSystemTitle] = React.useState('Spec-Kit');
  const [systemLogo, setSystemLogo] = React.useState<string | null>(null);

  // 加载系统配置
  React.useEffect(() => {
    const loadSystemConfig = async () => {
      // 先从后端数据库加载
      let backendConfigs = {};
      try {
        const response = await fetch('/api/v1/admin/configs?category=basic', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const configs = await response.json();
          backendConfigs = configs.reduce((acc: any, config: any) => {
            acc[config.key] = config.value;
            return acc;
          }, {});
          console.log('TopMenuLayout: 从数据库加载配置', backendConfigs);
        }
      } catch (error) {
        console.warn('TopMenuLayout: 从数据库加载配置失败', error);
      }

      // 从localStorage加载（作为备用）
      const savedTitle = backendConfigs.systemTitle || localStorage.getItem('systemTitle');
      const savedLogo = backendConfigs.logo || localStorage.getItem('systemLogo');
      
      console.log('TopMenuLayout: 加载系统配置', { savedTitle, savedLogo });
      
      if (savedTitle) {
        setSystemTitle(savedTitle);
        document.title = savedTitle;
      }
      if (savedLogo) {
        setSystemLogo(savedLogo);
      }
    };

    loadSystemConfig();

    // 监听系统配置更改事件
    const handleConfigChange = (event: any) => {
      const { systemTitle: title, logo } = event.detail || {};
      console.log('TopMenuLayout: 收到配置更改事件', { title, logo, detail: event.detail });
      if (title) {
        setSystemTitle(title);
        document.title = title;
        console.log('TopMenuLayout: 更新系统标题', title);
      }
      if (logo) {
        setSystemLogo(logo);
        console.log('TopMenuLayout: 更新Logo', logo);
      }
    };

              // 监听localStorage变化
              const handleStorageChange = (event: StorageEvent) => {
                if (event.key === 'systemTitle' && event.newValue) {
                  setSystemTitle(event.newValue);
                  document.title = event.newValue;
                }
                if (event.key === 'systemLogo' && event.newValue) {
                  setSystemLogo(event.newValue);
                }
              };

    window.addEventListener('systemTitleChanged', handleConfigChange);
    window.addEventListener('logoChanged', handleConfigChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('systemTitleChanged', handleConfigChange);
      window.removeEventListener('logoChanged', handleConfigChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 检查是否为超级管理员
  const isSuperAdmin = user?.email === 'superadmin@system.com' || 
                      user?.email === 'demo@example.com' || 
                      user?.email === 'admin@system.com' ||
                      user?.role === 'super_admin';

  // 菜单项配置
    const menuItems = [
      {
        key: 'overview',
        icon: <DashboardOutlined />,
        label: '概览',
        path: '/overview',
        onClick: () => window.location.href = '/overview',
      },
      {
        key: 'users',
        icon: <TeamOutlined />,
        label: '用户管理',
        path: '/users',
        onClick: () => window.location.href = '/users',
      },
    ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => window.location.href = '/profile',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  // 根据当前主题确定菜单主题 - 使用主题包中的menuVariant配置
  const menuTheme = currentTheme?.menuVariant || 'light';
  
  return (
    <Layout className={`top-menu-layout ${currentTheme?.meta.id || 'light'}-theme`}>
      <Header className={`top-header ${currentTheme?.meta.id || 'light'}-theme`}>
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              {systemLogo && systemLogo.length > 0 ? (
                <img 
                  src={systemLogo} 
                  alt="系统Logo" 
                  className="logo-image"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                  }}
                />
              ) : null}
              <div 
                className={`logo-text ${systemLogo && systemLogo.length > 0 ? 'hidden' : 'visible'}`}
              >
                {systemTitle}
              </div>
              {systemLogo && systemLogo.length > 0 && (
                <div className="logo-text-with-image">
                  {systemTitle}
                </div>
              )}
            </div>
          </div>
          
          <div className="header-center">
            <Menu
              theme={menuTheme}
              mode="horizontal"
              defaultSelectedKeys={['overview']}
              items={menuItems}
              className="top-menu menu-theme-unified"
            />
          </div>
          
          <div className="header-right">
            <Space>
              {/* 快速设置按钮 */}
              <Button
                type="text"
                icon={<SkinOutlined />}
                onClick={() => setQuickSettingsVisible(true)}
                className="settings-toggle-btn"
                title="快速设置"
              />
              
              {/* 操作日志按钮 */}
              <Button
                type="text"
                icon={<HistoryOutlined />}
                className="logs-btn"
                title="操作日志"
                onClick={() => window.location.href = '/operation-logs'}
              />
              
              {/* 通知按钮 */}
              <Button
                type="text"
                icon={<BellOutlined />}
                className="notification-btn"
                title="通知"
              />
              
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="user-info">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    src={user?.avatar}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <Text className="user-name">
                      {user?.name || user?.email?.split('@')[0] || '用户'}
                    </Text>
                    <Text className="user-role" type="secondary">
                      {user?.role || 
                       (user?.email?.includes('admin') ? '管理员' : '用户') ||
                       'user'}
                    </Text>
                  </div>
                  
                  {/* 系统设置按钮 - 仅超级管理员可见，位于账号区域右侧 */}
                  {isSuperAdmin && (
                    <Button
                      type="text"
                      icon={<SettingOutlined />}
                      className="system-settings-btn"
                      title="系统设置"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = '/system-settings';
                      }}
                    />
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </div>
      </Header>
      
      <Content className={`top-content ${currentTheme?.meta.id || 'light'}-theme content-full-height`}>
        {children}
      </Content>
      
      {/* 快速设置面板 */}
      <QuickSettingsPanel
        visible={quickSettingsVisible}
        onClose={() => setQuickSettingsVisible(false)}
      />
    </Layout>
  );
};

export default TopMenuLayout;























