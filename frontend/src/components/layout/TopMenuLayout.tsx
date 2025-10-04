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
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '用户管理',
      path: '/users',
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
              <div className="logo-text">Spec-Kit</div>
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










