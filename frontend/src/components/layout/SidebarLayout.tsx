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
  FileTextOutlined,
  BellOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { useLayout } from '../../contexts/LayoutContext';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext'; // Added theme context
import QuickSettingsPanel from '../QuickSettingsPanel';
import './SidebarLayout.css';
import '../../styles/menu-theme.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { layout, toggleCollapse, isCollapsed, toggleLayout } = useLayout();
  const { user, logout } = useAuthStore();
  const { currentTheme } = useTheme(); // Added theme context
  const [quickSettingsVisible, setQuickSettingsVisible] = React.useState(false);

  // 菜单项配置
  const menuItems = [
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '用户管理',
      path: '/users',
    },
    {
      key: 'theme-demo',
      icon: <AppstoreOutlined />,
      label: '主题演示',
      path: '/theme-demo',
    },
    {
      key: 'settings',
      icon: <BgColorsOutlined />,
      label: '系统设置',
      children: [
        {
          key: 'basic',
          label: '基础配置',
          path: '/system-settings/basic',
        },
        {
          key: 'admin',
          label: '管理员管理',
          path: '/system-settings/admin',
        },
        {
          key: 'security',
          label: '安全配置',
          path: '/system-settings/security',
        },
        {
          key: 'email',
          label: '邮箱配置',
          path: '/system-settings/email',
        },
      ],
    },
    {
      key: 'logs',
      icon: <FileTextOutlined />,
      label: '系统日志',
      path: '/logs',
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
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

  return (
    <Layout className="sidebar-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={isCollapsed}
        width={layout.width || 240}
        collapsedWidth={80}
        className={`sidebar ${currentTheme?.meta.id === 'dark' ? 'dark-theme' : 'light-theme'}`}
      >
        <div className="sidebar-header">
          <div className="logo">
            {isCollapsed ? (
              <div className="logo-icon">S</div>
            ) : (
              <div className="logo-text">Spec-Kit</div>
            )}
          </div>
        </div>
        
        <Menu
          theme={currentTheme?.meta.id === 'dark' ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          className="sidebar-menu menu-theme-unified"
        />
      </Sider>
      
      <Layout className="main-layout">
        <Header className="main-header">
          <div className="header-left">
            <Space>
              <Button
                type="text"
                icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapse}
                className="collapse-btn"
              />
              <Button
                type="text"
                icon={<AppstoreOutlined />}
                onClick={toggleLayout}
                className="layout-switch-btn"
                title="切换到顶部菜单布局"
              />
            </Space>
          </div>
          
          <div className="header-right">
            <Space>
              {/* 快速设置按钮 */}
              <Button
                type="text"
                icon={<SettingOutlined />}
                onClick={() => setQuickSettingsVisible(true)}
                className="settings-toggle-btn"
                title="快速设置"
              />
              
              <Button
                type="text"
                icon={<BellOutlined />}
                className="notification-btn"
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
                      <Text className="user-name">{user?.name || '用户'}</Text>
                      <Text className="user-role" type="secondary">
                        {user?.role || 'user'}
                      </Text>
                    </div>
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        
        <Content className="main-content">
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