/**
 * 系统设置页面 - 多Tab页面统一管理所有系统配置
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Tabs,
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
import BasicConfigPage from './settings/BasicConfigPage';
import AdminManagementPage from './settings/AdminManagementPage';
import SecurityConfigPage from './settings/SecurityConfigPage';
import EmailConfigPage from './settings/EmailConfigPage';
import LayoutConfigPage from './settings/LayoutConfigPage';
import MonitoringPage from './settings/MonitoringPage';
import '../styles/settings-pages.css';

const { TabPane } = Tabs;
const { Title } = Typography;

const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const settingsTabs = [
    {
      key: 'basic',
      icon: <GlobalOutlined />,
      label: '基础配置',
      component: <BasicConfigPage />,
    },
    {
      key: 'admin',
      icon: <TeamOutlined />,
      label: '管理员管理',
      component: <AdminManagementPage />,
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: '安全配置',
      component: <SecurityConfigPage />,
    },
    {
      key: 'email',
      icon: <MailOutlined />,
      label: '邮箱配置',
      component: <EmailConfigPage />,
    },
    {
      key: 'layout',
      icon: <LayoutOutlined />,
      label: '布局配置',
      component: <LayoutConfigPage />,
    },
    {
      key: 'monitoring',
      icon: <MonitorOutlined />,
      label: '样式监控',
      component: <MonitoringPage />,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // 更新URL但不导航
    navigate(`/system-settings?tab=${key}`, { replace: true });
  };

  // 从URL参数或路径获取当前Tab
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab');
    
    if (tabFromUrl && settingsTabs.find(tab => tab.key === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      // 根据路径判断
      const path = location.pathname;
      if (path.includes('/admin')) setActiveTab('admin');
      else if (path.includes('/security')) setActiveTab('security');
      else if (path.includes('/email')) setActiveTab('email');
      else if (path.includes('/layout')) setActiveTab('layout');
      else if (path.includes('/monitoring')) setActiveTab('monitoring');
      else setActiveTab('basic');
    }
  }, [location]);

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

        {/* Tab页面内容 */}
        <Card className="settings-content">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            size="large"
            tabBarStyle={{ marginBottom: 24 }}
          >
            {settingsTabs.map(tab => (
              <TabPane
                tab={
                  <span>
                    {tab.icon}
                    {tab.label}
                  </span>
                }
                key={tab.key}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.component}
                </motion.div>
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemSettingsPage;
