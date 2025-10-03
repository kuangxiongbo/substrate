import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
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
  ClockCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

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
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="24小时登录尝试"
                      value={systemStats?.login_attempts_24h || 0}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="失败尝试"
                      value={systemStats?.failed_attempts_24h || 0}
                      valueStyle={{ color: '#cf1322' }}
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="成功率"
                      value={systemStats?.success_rate_24h || 0}
                      suffix="%"
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="冻结IP数"
                      value={systemStats?.active_frozen_ips || 0}
                      valueStyle={{ color: '#cf1322' }}
                      prefix={<SecurityScanOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="系统状态" extra={<Button icon={<ReloadOutlined />} onClick={loadSystemData} />}>
                    <Space direction="vertical" className="w-full">
                      <div className="flex justify-between items-center">
                        <Text>安全策略级别</Text>
                        <Tag color={systemStats?.security_level === 'advanced' ? 'red' : 'blue'}>
                          {systemStats?.security_level === 'advanced' ? '高级' : '基础'}
                        </Tag>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>邮箱验证码请求</Text>
                        <Text strong>{systemStats?.email_requests_24h || 0} 次/24h</Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text>系统运行状态</Text>
                        <Tag color="green" icon={<CheckCircleOutlined />}>正常</Tag>
                      </div>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="安全概览">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text>登录成功率</Text>
                        <Text strong>{systemStats?.success_rate_24h || 0}%</Text>
                      </div>
                      <Progress 
                        percent={systemStats?.success_rate_24h || 0} 
                        strokeColor="#52c41a"
                        showInfo={false}
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text>安全威胁</Text>
                        <Text strong style={{ color: '#cf1322' }}>
                          {systemStats?.active_frozen_ips || 0} 个IP被冻结
                        </Text>
                      </div>
                      <Progress 
                        percent={Math.min((systemStats?.active_frozen_ips || 0) * 10, 100)} 
                        strokeColor="#cf1322"
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
                邮箱服务
              </span>
            } 
            key="email"
          >
            <Card title="邮箱服务配置">
              <Alert
                message="邮箱服务配置功能开发中"
                description="此功能正在开发中，将包括SMTP配置、邮件模板管理、发送频率限制等功能。"
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
                用户管理
              </span>
            } 
            key="users"
          >
            <Card title="用户管理">
              <Alert
                message="用户管理功能开发中"
                description="此功能正在开发中，将包括用户列表、角色分配、权限管理等功能。"
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
                系统配置
              </span>
            } 
            key="config"
          >
            <Card title="系统配置">
              <Alert
                message="系统配置功能开发中"
                description="此功能正在开发中，将包括基础配置、参数设置、配置验证等功能。"
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


