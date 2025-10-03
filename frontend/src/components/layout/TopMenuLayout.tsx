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
  FileTextOutlined,
  BellOutlined,
  MenuOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { useLayout } from '../../contexts/LayoutContext';
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
  const { layout, toggleLayout } = useLayout();
  const { currentTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [quickSettingsVisible, setQuickSettingsVisible] = React.useState(false);

  // 菜单项配置
  const menuItems = [
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: '概览',
      path: '/overview',
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '用户管理',
      path: '/users',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
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

  // 根据当前主题确定菜单主题
  const menuTheme = currentTheme?.meta.id === 'light' ? 'light' : 'dark';
  
  return (
    <Layout className={`top-menu-layout ${currentTheme?.meta.id || 'light'}-theme`}>
      <Header className={`top-header ${currentTheme?.meta.id || 'light'}-theme`}>
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <div className="logo-text">Spec-Kit</div>
            </div>
          </div>
          
          <div className="header-center">
            <Menu
              theme={menuTheme}
              mode="horizontal"
              defaultSelectedKeys={['dashboard']}
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
                  <div className="user-details">
                    <Text className="user-name">{user?.name || '用户'}</Text>
                    <Text className="user-role" type="secondary">
                      {user?.role || 'user'}
                    </Text>
                  </div>
                </div>
              </Dropdown>
            </Space>
          </div>
        </div>
      </Header>
      
      <Content className="top-content">
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
