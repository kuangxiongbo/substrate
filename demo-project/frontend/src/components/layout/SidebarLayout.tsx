/**
 * 侧边栏布局组件
 * 基于Spec-Kit方法重构的侧边栏布局
 */

import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
import { useLayout } from './LayoutProvider';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext'; // Added theme context
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import QuickSettingsPanel from '../QuickSettingsPanel';
import './SidebarLayout.css';
import '../../styles/menu-theme.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { layout, toggleCollapse, isCollapsed } = useLayout();
  const { user, logout } = useAuthStore();
  const { currentTheme } = useTheme(); // Added theme context
  const { t } = useTranslation();
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
          backendConfigs = configs.reduce((acc: Record<string, any>, config: any) => {
            acc[config.key] = config.value;
            return acc;
          }, {});
          console.log('SidebarLayout: 从数据库加载配置', backendConfigs);
        }
      } catch (error) {
        console.warn('SidebarLayout: 从数据库加载配置失败', error);
      }

      // 从localStorage加载（作为备用）
      const savedTitle = (backendConfigs as any).systemTitle || localStorage.getItem('systemTitle');
      const savedLogo = (backendConfigs as any).systemLogo || localStorage.getItem('systemLogo');
      
      console.log('SidebarLayout: 加载系统配置', { savedTitle, savedLogo });
      
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
      console.log('SidebarLayout: 收到配置更改事件', { title, logo, detail: event.detail });
      if (title) {
        setSystemTitle(title);
        document.title = title;
        console.log('SidebarLayout: 更新系统标题', title);
      }
      if (logo) {
        setSystemLogo(logo);
        console.log('SidebarLayout: 更新Logo', logo);
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
        label: t('navigation.overview'),
        path: '/overview',
        onClick: () => window.location.href = '/overview',
      },
      {
        key: 'users',
        icon: <TeamOutlined />,
        label: t('navigation.userManagement'),
        path: '/users',
        onClick: () => window.location.href = '/users',
      },
    ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('navigation.profile'),
      onClick: () => window.location.href = '/profile',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('navigation.logout'),
      onClick: logout,
    },
  ];

  return (
    <Layout className={`sidebar-layout ${currentTheme?.meta.id || 'light'}-theme`}>
      <Sider
        trigger={null}
        collapsible
        collapsed={isCollapsed}
        width={layout.sidebarWidth || 240}
        collapsedWidth={80}
        className={`sidebar ${currentTheme?.meta.id || 'light'}-theme`}
      >
        <div className="sidebar-header">
          <div className="logo">
            {isCollapsed ? (
              systemLogo && systemLogo.length > 0 ? (
                <img 
                  src={systemLogo} 
                  alt="系统Logo" 
                  className="logo-image-collapsed"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : null
            ) : (
              <>
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
              </>
            )}
            {/* 折叠时的后备显示 */}
            {isCollapsed && (!systemLogo || systemLogo === '/assets/logo.png') && (
              <div className="logo-icon">{systemTitle.charAt(0).toUpperCase()}</div>
            )}
          </div>
        </div>
        
        <Menu
          theme={currentTheme?.menuVariant || 'light'}
          mode="inline"
          defaultSelectedKeys={['overview']}
          items={menuItems}
          className="sidebar-menu menu-theme-unified"
        />
      </Sider>
      
      <Layout className={`main-layout ${currentTheme?.meta.id || 'light'}-theme`}>
        <Header className={`main-header ${currentTheme?.meta.id || 'light'}-theme`}>
          <div className="header-content">
            <div className="header-left">
              <Button
                type="text"
                icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapse}
                className="collapse-btn"
              />
            </div>
            
            <div className="header-center">
              {/* 左侧布局的中间区域为空，保持结构一致 */}
            </div>
            
            <div className="header-right">
            <Space>
              {/* 语言切换器 */}
              <LanguageSwitcher />
              
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
                  {!isCollapsed && (
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
                  )}
                  
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
        
        <Content className={`main-content ${currentTheme?.meta.id || 'light'}-theme content-full-height`}>
          {children}
        </Content>
      </Layout>
      
      {/* 快速设置面板 */}
      <QuickSettingsPanel
        visible={quickSettingsVisible}
        onClose={() => setQuickSettingsVisible(false)}
      />
    </Layout>
  );
};

export default SidebarLayout;































