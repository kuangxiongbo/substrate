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
  MonitorOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  FolderOutlined,
  BellOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
// import { useTheme } from '../contexts/ThemeContext';
import ContentPageLayout, { type TabItem } from '../components/layout/ContentPageLayout';
import { useTranslation } from 'react-i18next';
import BasicConfigPage from './settings/BasicConfigPage';
import AdminManagementPage from './settings/AdminManagementPage';
import RoleManagementPage from './settings/RoleManagementPage';
import SecurityConfigPage from './settings/SecurityConfigPage';
import EmailConfigPage from './settings/EmailConfigPage';
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
  const { t } = useTranslation();
  // const { currentTheme } = useTheme();

  // 定义Tab配置
  const settingsTabs: TabItem[] = [
    {
      key: 'basic',
      icon: <GlobalOutlined />,
      label: t('settings.basicConfig'),
      content: <BasicConfigPage />,
    },
    {
      key: 'admin',
      icon: <TeamOutlined />,
      label: t('settings.adminManagement'),
      content: <AdminManagementPage />,
    },
    {
      key: 'roles',
      icon: <SafetyOutlined />,
      label: t('settings.roleManagement'),
      content: <RoleManagementPage />,
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: t('settings.securityConfig'),
      content: <SecurityConfigPage />,
    },
    {
      key: 'email',
      icon: <MailOutlined />,
      label: t('settings.emailConfig'),
      content: <EmailConfigPage />,
    },
    {
      key: 'monitoring',
      icon: <MonitorOutlined />,
      label: t('settings.styleMonitoring'),
      content: <MonitoringPage />,
    },
    {
      key: 'system-monitoring',
      icon: <MonitorOutlined />,
      label: t('settings.systemMonitoring'),
      content: <SystemMonitoringPage />,
    },
    {
      key: 'data-backup',
      icon: <DatabaseOutlined />,
      label: t('settings.dataBackup'),
      content: <DataBackupPage />,
    },
    {
      key: 'system-logs',
      icon: <FileTextOutlined />,
      label: t('settings.systemLogs'),
      content: <SystemLogsPage />,
    },
    {
      key: 'file-manager',
      icon: <FolderOutlined />,
      label: t('settings.fileManager'),
      content: <FileManagerPage />,
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: t('settings.notificationCenter'),
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
      else if (path.includes('/roles')) setActiveTab('roles');
      else if (path.includes('/security')) setActiveTab('security');
      else if (path.includes('/email')) setActiveTab('email');
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
