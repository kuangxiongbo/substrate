/**
 * 系统监控页面 - 实时系统状态监控
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Space,
  Button,
  Alert,
  Tag,
  // Tooltip,
  // Timeline,
} from 'antd';
import {
  MonitorOutlined,
  // DatabaseOutlined,
  // CpuOutlined,
  // MemoryOutlined,
  // NetworkOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  database_connections: number;
  active_users: number;
  response_time: number;
  uptime: string;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  health: 'healthy' | 'degraded' | 'unhealthy';
}

const SystemMonitoringPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);

  useEffect(() => {
    loadMonitoringData();
    // 每30秒刷新一次数据
    const interval = setInterval(loadMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      // 调用真实的后端API
      const response = await fetch('/api/v1/admin/monitoring/metrics', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const mockMetrics: SystemMetrics = await response.json();

      // 获取系统告警
      const alertsResponse = await fetch('/api/v1/admin/monitoring/alerts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const mockAlerts: SystemAlert[] = alertsResponse.ok ? await alertsResponse.json() : [];

      // 获取服务状态
      const servicesResponse = await fetch('/api/v1/admin/monitoring/services', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const mockServices: ServiceStatus[] = servicesResponse.ok ? await servicesResponse.json() : [];

      setMetrics(mockMetrics);
      setAlerts(mockAlerts);
      setServices(mockServices);
    } catch (error) {
      console.error('加载监控数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const alertColumns = [
    {
      title: t('monitoring.type'),
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => {
        const colorMap = {
          warning: 'orange',
          error: 'red',
          info: 'blue',
        };
        const iconMap = {
          warning: <WarningOutlined />,
          error: <ExclamationCircleOutlined />,
          info: <CheckCircleOutlined />,
        };
        return (
          <Tag color={colorMap[type as keyof typeof colorMap]}>
            {iconMap[type as keyof typeof iconMap]} {type}
          </Tag>
        );
      },
    },
    {
      title: t('monitoring.message'),
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: t('monitoring.severity'),
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const colorMap = {
          low: 'green',
          medium: 'orange',
          high: 'red',
          critical: 'red',
        };
        return <Tag color={colorMap[severity as keyof typeof colorMap]}>{severity}</Tag>;
      },
    },
    {
      title: t('common.time'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];

  const serviceColumns = [
    {
      title: t('monitoring.serviceName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap = {
          running: 'green',
          stopped: 'red',
          error: 'red',
        };
        return <Tag color={colorMap[status as keyof typeof colorMap]}>{status}</Tag>;
      },
    },
    {
      title: t('monitoring.healthStatus'),
      dataIndex: 'health',
      key: 'health',
      width: 100,
      render: (health: string) => {
        const colorMap = {
          healthy: 'green',
          degraded: 'orange',
          unhealthy: 'red',
        };
        return <Tag color={colorMap[health as keyof typeof colorMap]}>{health}</Tag>;
      },
    },
    {
      title: t('monitoring.uptime'),
      dataIndex: 'uptime',
      key: 'uptime',
    },
  ];

  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="settings-header-card">
          <Space align="center">
            <MonitorOutlined className="monitoring-header-icon" />
            <Title level={2} className="monitoring-title">
              {t('monitoring.systemMonitoring')}
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadMonitoringData}
              loading={loading}
            >
              {t('common.refresh')}
            </Button>
          </Space>
          <Text className="monitoring-description">
            {t('monitoring.description')}
          </Text>
        </div>


        <Row gutter={[24, 24]}>
          {/* 系统警报 */}
          <Col xs={24} lg={12}>
            <Card title={t('monitoring.systemAlerts')} extra={<Tag color="blue">{alerts.length}</Tag>}>
              <Table
                columns={alertColumns}
                dataSource={alerts}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
                loading={loading}
              />
            </Card>
          </Col>

          {/* 服务状态 */}
          <Col xs={24} lg={12}>
            <Card title={t('monitoring.serviceStatus')}>
              <Table
                columns={serviceColumns}
                dataSource={services}
                rowKey="name"
                pagination={false}
                size="small"
                loading={loading}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="mt-6">
          {/* 网络流量 */}
          <Col xs={24} lg={12}>
            <Card title={t('monitoring.networkTraffic')}>
              <Space direction="vertical" className="monitoring-space-full-width">
                <div>
                  <Text strong>{t('monitoring.inboundTraffic')}</Text>
                  <Statistic
                    value={metrics?.network_in || 0}
                    precision={2}
                    suffix="MB/s"
                    valueStyle={{ fontSize: 16 }}
                  />
                </div>
                <div>
                  <Text strong>{t('monitoring.outboundTraffic')}</Text>
                  <Statistic
                    value={metrics?.network_out || 0}
                    precision={2}
                    suffix="MB/s"
                    valueStyle={{ fontSize: 16 }}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          {/* 系统信息 */}
          <Col xs={24} lg={12}>
            <Card title={t('monitoring.systemInfo')}>
              <Space direction="vertical" className="monitoring-space-full-width">
                <div>
                  <Text strong>{t('monitoring.uptime')}</Text>
                  <Text>{metrics?.uptime || t('common.unknown')}</Text>
                </div>
                <div>
                  <Text strong>{t('monitoring.databaseConnections')}</Text>
                  <Statistic
                    value={metrics?.database_connections || 0}
                    suffix={t('monitoring.connections')}
                    valueStyle={{ fontSize: 16 }}
                  />
                </div>
                <div>
                  <Text strong>{t('monitoring.activeUsers')}</Text>
                  <Statistic
                    value={metrics?.active_users || 0}
                    suffix={t('monitoring.users')}
                    valueStyle={{ fontSize: 16 }}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 系统健康状态 */}
        <Card title={t('monitoring.systemHealth')} className="mt-6">
          <Alert
            message={t('monitoring.systemNormal')}
            description={t('monitoring.systemNormalDesc')}
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemMonitoringPage;
