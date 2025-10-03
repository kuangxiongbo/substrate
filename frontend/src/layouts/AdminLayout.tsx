/**
 * 管理面板布局 - 专业UI设计师设计
 * 基于Ant Design的管理界面布局
 */
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Space,
  Typography,
  Badge,
  Drawer,
  theme,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Tag,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  MailOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  FileTextOutlined,
  GlobalOutlined,
  MenuOutlined,
  BgColorsOutlined,
  AppstoreOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { useLayout } from '../contexts/LayoutContext';
import QuickSettingsPanel from '../components/QuickSettingsPanel';
import '../styles/components/admin-layout.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [quickSettingsVisible, setQuickSettingsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { token } = theme.useToken();
  const { currentTheme, toggleTheme } = useTheme();
  const { layout, toggleLayout } = useLayout();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const menuItems: MenuItem[] = [
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: '概览',
      path: '/overview',
    },
    {
      key: 'system-settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        {
          key: 'basic-config',
          icon: <GlobalOutlined />,
          label: '基础配置',
          path: '/system-settings/basic',
        },
        {
          key: 'admin-management',
          icon: <TeamOutlined />,
          label: '管理员管理',
          path: '/system-settings/admin',
        },
        {
          key: 'security-config',
          icon: <SecurityScanOutlined />,
          label: '安全配置',
          path: '/system-settings/security',
        },
        {
          key: 'email-config',
          icon: <MailOutlined />,
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

  const handleMenuClick = ({ key }: { key: string }) => {
    const findPath = (items: MenuItem[], targetKey: string): string | null => {
      for (const item of items) {
        if (item.key === targetKey && item.path) {
          return item.path;
        }
        if (item.children) {
          const childPath = findPath(item.children, targetKey);
          if (childPath) return childPath;
        }
      }
      return null;
    };

    const path = findPath(menuItems, key);
    if (path) {
      navigate(path);
      setMobileMenuVisible(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuperAdmin = user?.is_super_admin?.() || false;

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    ...(isSuperAdmin ? [{
      key: 'system-settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => navigate('/system-settings'),
    }] : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'theme',
      icon: <SettingOutlined />,
      label: '主题设置',
      children: [
        {
          key: 'theme-switcher',
          label: <ThemeSwitcher size="small" showLabel={false} />,
        },
      ],
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/overview')) return ['overview'];
    if (path.startsWith('/system-settings/basic')) return ['basic-config'];
    if (path.startsWith('/system-settings/admin')) return ['admin-management'];
    if (path.startsWith('/system-settings/security')) return ['security-config'];
    if (path.startsWith('/system-settings/email')) return ['email-config'];
    if (path.startsWith('/logs')) return ['logs'];
    return [];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/system-settings')) return ['system-settings'];
    return [];
  };

  const renderMenuItems = (items: MenuItem[]): any[] => {
    return items.map(item => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? renderMenuItems(item.children) : undefined,
    }));
  };

  return (
    <Layout className="admin-layout">
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="admin-sider"
        breakpoint="lg"
        collapsedWidth={80}
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
      >
               <div className="admin-logo">
                 <motion.div
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 0.5, delay: 0.1 }}
                   className="admin-logo-content"
                   style={{ gap: collapsed ? 0 : 12 }}
                 >
                   <Avatar
                     size={collapsed ? 32 : 40}
                     icon={<SafetyCertificateOutlined />}
                     className="admin-logo-avatar"
                   />
                   {!collapsed && (
                     <motion.div
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.3, delay: 0.2 }}
                     >
                       <Title level={5} className="admin-logo-text">
                         管理系统
                       </Title>
                     </motion.div>
                   )}
                 </motion.div>
               </div>

        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={renderMenuItems(menuItems)}
          onClick={handleMenuClick}
          className="admin-menu"
          theme="light"
        />
      </Sider>

      <Layout>
        {/* 顶部导航 */}
        <Header className="admin-header">
          <div className="admin-header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="admin-menu-toggle"
            />
            
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className="mobile-menu-btn"
            />
          </div>

          <div className="admin-header-right">
            {/* 快速设置按钮 */}
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => setQuickSettingsVisible(true)}
              className="admin-settings-toggle"
              title="快速设置"
            />

            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="admin-notification-btn"
              />
            </Badge>

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space className="admin-user-info">
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  className="admin-user-avatar"
                  style={{ 
                    backgroundColor: isSuperAdmin ? '#ff4d4f' : 'var(--color-primary)'
                  }}
                />
                <div className="admin-user-details">
                  <Text strong className="admin-user-email">
                    {user?.email}
                  </Text>
                  <Tag 
                    color={isSuperAdmin ? 'red' : 'blue'} 
                    size="small"
                    className="admin-user-role"
                  >
                    {isSuperAdmin ? '超级管理员' : '管理员'}
                  </Tag>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* 主要内容区域 */}
        <Content className="admin-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="admin-content-inner"
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>

      {/* 移动端菜单抽屉 */}
      <Drawer
        title="导航菜单"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        className="admin-mobile-drawer"
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={renderMenuItems(menuItems)}
          onClick={handleMenuClick}
          className="admin-mobile-menu"
        />
      </Drawer>

      {/* 快速设置面板 */}
      <QuickSettingsPanel
        visible={quickSettingsVisible}
        onClose={() => setQuickSettingsVisible(false)}
      />
    </Layout>
  );
};

export default AdminLayout;


