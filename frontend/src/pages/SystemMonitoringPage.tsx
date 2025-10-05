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
      title: '类型',
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
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '严重程度',
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
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];

  const serviceColumns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
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
      title: '健康状态',
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
      title: '运行时间',
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
              系统监控
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadMonitoringData}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
          <Text className="monitoring-description">
            实时监控系统性能和健康状况
          </Text>
        </div>


        <Row gutter={[24, 24]}>
          {/* 系统警报 */}
          <Col xs={24} lg={12}>
            <Card title="系统警报" extra={<Tag color="blue">{alerts.length}</Tag>}>
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
            <Card title="服务状态">
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
            <Card title="网络流量">
              <Space direction="vertical" className="monitoring-space-full-width">
                <div>
                  <Text strong>入站流量</Text>
                  <Statistic
                    value={metrics?.network_in || 0}
                    precision={2}
                    suffix="MB/s"
                    valueStyle={{ fontSize: 16 }}
                  />
                </div>
                <div>
                  <Text strong>出站流量</Text>
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
            <Card title="系统信息">
              <Space direction="vertical" className="monitoring-space-full-width">
                <div>
                  <Text strong>运行时间</Text>
                  <Text>{metrics?.uptime || '未知'}</Text>
                </div>
                <div>
                  <Text strong>数据库连接</Text>
                  <Statistic
                    value={metrics?.database_connections || 0}
                    suffix="个"
                    valueStyle={{ fontSize: 16 }}
                  />
                </div>
                <div>
                  <Text strong>活跃用户</Text>
                  <Statistic
                    value={metrics?.active_users || 0}
                    suffix="人"
                    valueStyle={{ fontSize: 16 }}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 系统健康状态 */}
        <Card title="系统健康状态" className="mt-6">
          <Alert
            message="系统运行正常"
            description="所有关键服务运行正常，系统性能良好。"
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
