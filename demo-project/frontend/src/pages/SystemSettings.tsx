import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  Tabs, 
  Typography, 
  Row, 
  Col, 
  Progress, 
  Table, 
  Tag, 
  Button, 
  Space,
  Alert,
  Spin,
  message
} from 'antd';
import {
  DashboardOutlined,
  SecurityScanOutlined,
  MailOutlined,
  TeamOutlined,
  SettingOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from 'react-i18next';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface SystemStats {
  login_attempts_24h: number;
  failed_attempts_24h: number;
  success_rate_24h: number;
  active_frozen_ips: number;
  email_requests_24h: number;
  security_level: string;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  event_type: string;
  user_email: string;
  ip_address: string;
  result: string;
  details: string;
}

const SystemSettings: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);

  // 检查是否为超级管理员
  const isSuperAdmin = user?.email === 'superadmin@system.com' || user?.email === 'demo@example.com';

  useEffect(() => {
    if (isSuperAdmin) {
      loadSystemData();
    }
  }, [isSuperAdmin]);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      // 模拟加载系统数据
      setTimeout(() => {
        setSystemStats({
          login_attempts_24h: 156,
          failed_attempts_24h: 23,
          success_rate_24h: 85.3,
          active_frozen_ips: 2,
          email_requests_24h: 45,
          security_level: 'basic'
        });

        setSecurityLogs([
          {
            id: '1',
            timestamp: '2024-01-15 14:30:25',
            event_type: 'LOGIN_ATTEMPT',
            user_email: 'user@example.com',
            ip_address: '192.168.1.100',
            result: 'SUCCESS',
            details: '正常登录'
          },
          {
            id: '2',
            timestamp: '2024-01-15 14:25:10',
            event_type: 'LOGIN_ATTEMPT',
            user_email: 'hacker@evil.com',
            ip_address: '192.168.1.200',
            result: 'FAILED',
            details: '密码错误，IP已冻结'
          },
          {
            id: '3',
            timestamp: '2024-01-15 14:20:05',
            event_type: 'REGISTRATION',
            user_email: 'newuser@example.com',
            ip_address: '192.168.1.150',
            result: 'SUCCESS',
            details: '新用户注册'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('加载系统数据失败');
      setLoading(false);
    }
  };

  const securityLogColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '事件类型',
      dataIndex: 'event_type',
      key: 'event_type',
      width: 120,
      render: (type: string) => {
        const typeMap: { [key: string]: { color: string; text: string } } = {
          'LOGIN_ATTEMPT': { color: 'blue', text: '登录尝试' },
          'REGISTRATION': { color: 'green', text: '用户注册' },
          'PASSWORD_RESET': { color: 'orange', text: '密码重置' },
          'ACCOUNT_LOCK': { color: 'red', text: '账户锁定' },
          'IP_FREEZE': { color: 'purple', text: 'IP冻结' }
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '用户邮箱',
      dataIndex: 'user_email',
      key: 'user_email',
      width: 200,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 120,
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => {
        const isSuccess = result === 'SUCCESS';
        return (
          <Tag color={isSuccess ? 'green' : 'red'} icon={isSuccess ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}>
            {isSuccess ? '成功' : '失败'}
          </Tag>
        );
      }
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
    }
  ];

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <Alert
          message="访问被拒绝"
          description="只有超级管理员才能访问系统设置页面。"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <Title level={2} className="mb-2">
            <SettingOutlined className="mr-2" />
            系统设置
          </Title>
          <Text type="secondary">
            管理系统配置、安全策略和监控信息
          </Text>
        </div>

        <Tabs defaultActiveKey="overview" size="large">
          {/* 概览页面 */}
          <TabPane 
            tab={
              <span>
                <DashboardOutlined />
                概览
              </span>
            } 
            key="overview"
          >
            <Spin spinning={loading}>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="系统状态" extra={<Button icon={<ReloadOutlined />} onClick={loadSystemData} />}>
                    <Space direction="vertical" className="w-full">
                      <div className="flex justify-between items-center">
                        <Text>{t('system.securityLevel')}</Text>
                        <Tag color={systemStats?.security_level === 'advanced' ? 'red' : 'blue'}>
                          {systemStats?.security_level === 'advanced' ? t('system.advanced') : t('system.basic')}
                        </Tag>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>{t('system.emailRequests')}</Text>
                        <Text strong>{systemStats?.email_requests_24h || 0} {t('system.perDay')}</Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>{t('system.runningStatus')}</Text>
                        <Tag color="green" icon={<CheckCircleOutlined />}>{t('system.normal')}</Tag>
                      </div>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="安全概览">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text>{t('system.loginSuccessRate')}</Text>
                        <Text strong>{systemStats?.success_rate_24h || 0}%</Text>
                      </div>
                      <Progress 
                        percent={systemStats?.success_rate_24h || 0} 
                        strokeColor="var(--color-success)"
                        showInfo={false}
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text>{t('system.securityThreats')}</Text>
                        <Text strong className="system-threat-text">
                          {systemStats?.active_frozen_ips || 0} {t('system.frozenIPs')}
                        </Text>
                      </div>
                      <Progress 
                        percent={Math.min((systemStats?.active_frozen_ips || 0) * 10, 100)} 
                        strokeColor="var(--color-error)"
                        showInfo={false}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </Spin>
          </TabPane>

          {/* 安全设置 */}
          <TabPane 
            tab={
              <span>
                <SecurityScanOutlined />
                安全设置
              </span>
            } 
            key="security"
          >
            <Card title="安全策略配置">
              <Alert
                message="安全设置功能开发中"
                description="此功能正在开发中，将包括验证码配置、登录策略设置、IP白名单管理等功能。"
                type="info"
                showIcon
              />
            </Card>
          </TabPane>

          {/* 邮箱服务 */}
          <TabPane 
            tab={
              <span>
                <MailOutlined />
                {t('systemSettings.emailService')}
              </span>
            } 
            key="email"
          >
            <Card title={t('systemSettings.emailServiceConfig')}>
              <Alert
                message={t('systemSettings.emailServiceInDevelopment')}
                description={t('systemSettings.emailServiceDescription')}
                type="info"
                showIcon
              />
            </Card>
          </TabPane>

          {/* 用户管理 */}
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                {t('systemSettings.userManagement')}
              </span>
            } 
            key="users"
          >
            <Card title={t('systemSettings.userManagement')}>
              <Alert
                message={t('systemSettings.userManagementInDevelopment')}
                description={t('systemSettings.userManagementDescription')}
                type="info"
                showIcon
              />
            </Card>
          </TabPane>

          {/* 系统配置 */}
          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                {t('systemSettings.systemConfig')}
              </span>
            } 
            key="config"
          >
            <Card title={t('systemSettings.systemConfig')}>
              <Alert
                message={t('systemSettings.systemConfigInDevelopment')}
                description={t('systemSettings.systemConfigDescription')}
                type="info"
                showIcon
              />
            </Card>
          </TabPane>

          {/* 日志监控 */}
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                日志监控
              </span>
            } 
            key="logs"
          >
            <Card 
              title="安全日志" 
              extra={<Button icon={<ReloadOutlined />} onClick={loadSystemData} />}
            >
              <Table
                columns={securityLogColumns}
                dataSource={securityLogs}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="small"
                scroll={{ x: 800 }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SystemSettings;



























