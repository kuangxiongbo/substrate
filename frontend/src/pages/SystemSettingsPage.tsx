/**
 * 系统设置页面 - 使用统一布局组件
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GlobalOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  MailOutlined,
  LayoutOutlined,
  MonitorOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FolderOutlined,
  BellOutlined,
} from '@ant-design/icons';
// import { useTheme } from '../contexts/ThemeContext';
import ContentPageLayout, { type TabItem } from '../components/layout/ContentPageLayout';
import BasicConfigPage from './settings/BasicConfigPage';
import AdminManagementPage from './settings/AdminManagementPage';
import SecurityConfigPage from './settings/SecurityConfigPage';
import EmailConfigPage from './settings/EmailConfigPage';
import LayoutConfigPage from './settings/LayoutConfigPage';
import MonitoringPage from './settings/MonitoringPage';
import SystemMonitoringPage from './SystemMonitoringPage';
import DataBackupPage from './DataBackupPage';
import SystemLogsPage from './SystemLogsPage';
import FileManagerPage from './FileManagerPage';
import NotificationCenterPage from './NotificationCenterPage';

const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const navigate = useNavigate();
  const location = useLocation();
  // const { currentTheme } = useTheme();

  // 定义Tab配置
  const settingsTabs: TabItem[] = [
    {
      key: 'basic',
      icon: <GlobalOutlined />,
      label: '基础配置',
      content: <BasicConfigPage />,
    },
    {
      key: 'admin',
      icon: <TeamOutlined />,
      label: '管理员管理',
      content: <AdminManagementPage />,
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: '安全配置',
      content: <SecurityConfigPage />,
    },
    {
      key: 'email',
      icon: <MailOutlined />,
      label: '邮箱配置',
      content: <EmailConfigPage />,
    },
    {
      key: 'layout',
      icon: <LayoutOutlined />,
      label: '布局配置',
      content: <LayoutConfigPage />,
    },
    {
      key: 'monitoring',
      icon: <MonitorOutlined />,
      label: '样式监控',
      content: <MonitoringPage />,
    },
    {
      key: 'system-monitoring',
      icon: <MonitorOutlined />,
      label: '系统监控',
      content: <SystemMonitoringPage />,
    },
    {
      key: 'data-backup',
      icon: <DatabaseOutlined />,
      label: '数据备份',
      content: <DataBackupPage />,
    },
    {
      key: 'system-logs',
      icon: <FileTextOutlined />,
      label: '系统日志',
      content: <SystemLogsPage />,
    },
    {
      key: 'file-manager',
      icon: <FolderOutlined />,
      label: '文件管理',
      content: <FileManagerPage />,
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: '通知中心',
      content: <NotificationCenterPage />,
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
      else if (path.includes('/system-monitoring')) setActiveTab('system-monitoring');
      else if (path.includes('/data-backup')) setActiveTab('data-backup');
      else if (path.includes('/system-logs')) setActiveTab('system-logs');
      else if (path.includes('/file-manager')) setActiveTab('file-manager');
      else if (path.includes('/notifications')) setActiveTab('notifications');
      else setActiveTab('basic');
    }
  }, [location]);

  return (
    <ContentPageLayout
      mode="tabs"
      tabs={settingsTabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      helpCenterUrl="/help/system-settings"
      helpCenterVisible={true}
    >
      {/* Tab内容由tabs配置提供 */}
    </ContentPageLayout>
  );
};

export default SystemSettingsPage;
