/**
 * 系统设置页面 - 统一管理所有系统配置
 */
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Card,
  Typography,
  Space,
  Button,
  theme,
} from 'antd';
import {
  GlobalOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  MailOutlined,
  LayoutOutlined,
  ArrowLeftOutlined,
  MonitorOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../styles/settings-pages.css';

const { Sider, Content } = Layout;
const { Title } = Typography;

const SystemSettingsPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const settingsMenuItems = [
    {
      key: 'basic',
      icon: <GlobalOutlined />,
      label: '基础配置',
      path: '/system-settings/basic',
    },
    {
      key: 'admin',
      icon: <TeamOutlined />,
      label: '管理员管理',
      path: '/system-settings/admin',
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: '安全配置',
      path: '/system-settings/security',
    },
    {
      key: 'email',
      icon: <MailOutlined />,
      label: '邮箱配置',
      path: '/system-settings/email',
    },
    {
      key: 'layout',
      icon: <LayoutOutlined />,
      label: '布局配置',
      path: '/system-settings/layout',
    },
    {
      key: 'monitoring',
      icon: <MonitorOutlined />,
      label: '样式监控',
      path: '/system-settings/monitoring',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = settingsMenuItems.find(item => item.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/basic')) return 'basic';
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/security')) return 'security';
    if (path.includes('/email')) return 'email';
    if (path.includes('/layout')) return 'layout';
    return 'basic';
  };

  return (
    <div className="settings-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面头部 */}
        <Card className="settings-header-card">
          <Space align="center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/overview')}
              className="settings-back-button"
            >
              返回概览
            </Button>
            <Title level={2} className="settings-page-main-title">
              系统设置
            </Title>
          </Space>
        </Card>

        <Layout className="settings-layout">
          {/* 左侧设置菜单 */}
          <Sider
            width={250}
            className="settings-sider"
          >
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              items={settingsMenuItems}
              onClick={handleMenuClick}
              className="settings-menu"
            />
          </Sider>

          {/* 右侧内容区域 */}
          <Content className="settings-content">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </Content>
        </Layout>
      </motion.div>
    </div>
  );
};

export default SystemSettingsPage;







