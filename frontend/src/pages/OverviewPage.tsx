/**
 * 概览页面 - 系统总览和统计信息
 */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Space,
  Typography,
  Timeline,
  message,
} from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;

interface SystemStats {
  total_users: number;
  active_users: number;
  total_roles: number;
  total_permissions: number;
  total_configs: number;
}

interface RecentActivity {
  time: string;
  user: string;
  action: string;
  status: 'success' | 'error';
}

const OverviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const { user } = useAuthStore();
  const { currentTheme } = useTheme();

  useEffect(() => {
    loadSystemStats();
  }, []);

  const loadSystemStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('加载系统统计失败:', error);
      message.error('加载系统统计失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 基于真实数据构建统计信息
  const systemStats = [
    {
      title: '总用户数',
      value: stats?.total_users || 0,
      icon: <UserOutlined className="overview-stat-icon-blue" />,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: '活跃用户',
      value: stats?.active_users || 0,
      icon: <CheckCircleOutlined className="overview-stat-icon-green" />,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: '系统角色',
      value: stats?.total_roles || 0,
      icon: <SafetyCertificateOutlined className="overview-stat-icon-orange" />,
      trend: '0%',
      trendUp: true,
    },
    {
      title: '系统配置',
      value: stats?.total_configs || 0,
      icon: <FileTextOutlined className="overview-stat-icon-purple" />,
      trend: '+5%',
      trendUp: true,
    },
  ];

  // 模拟最近活动（暂时使用模拟数据，因为需要专门的日志API）
  const recentActivities: RecentActivity[] = [
    {
      time: new Date().toISOString(),
      user: user?.email || 'admin@system.com',
      action: '查看系统概览',
      status: 'success',
    },
    {
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      user: user?.email || 'admin@system.com',
      action: '加载统计信息',
      status: 'success',
    },
    {
      time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      user: user?.email || 'admin@system.com',
      action: '系统初始化',
      status: 'success',
    },
    {
      time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      user: user?.email || 'admin@system.com',
      action: '登录系统',
      status: 'success',
    },
  ];

  const systemHealth = [
    { name: 'CPU使用率', value: 45, status: 'normal' },
    { name: '内存使用率', value: 68, status: 'warning' },
    { name: '磁盘使用率', value: 32, status: 'normal' },
    { name: '网络状态', value: 95, status: 'excellent' },
  ];

  return (
    <div className={`overview-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <Row gutter={[24, 24]}>
          {/* 系统健康状态 */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
            <Card
              title="系统健康状态"
              className="overview-card"
            >
                <Space direction="vertical" size="large" className="overview-health-container">
                  {systemHealth.map((item, index) => (
                    <div key={index}>
                      <div className="overview-health-item">
                        <Text strong>{item.name}</Text>
                        <Text>{item.value}%</Text>
                      </div>
                      <Progress
                        percent={item.value}
                        strokeColor={
                          item.status === 'excellent'
                            ? 'var(--color-success)'
                            : item.status === 'normal'
                            ? 'var(--color-primary)'
                            : 'var(--color-warning)'
                        }
                        showInfo={false}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
            </motion.div>
          </Col>

          {/* 最近活动 */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
            <Card
              title="最近活动"
              className="overview-card"
            >
                <Timeline
                  items={recentActivities.map((activity, index) => ({
                    key: index,
                    color: activity.status === 'success' ? 'green' : 'red',
                    dot: activity.status === 'success' ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ExclamationCircleOutlined />
                    ),
                    children: (
                      <div>
                        <Text strong>{activity.user}</Text>
                        <br />
                        <Text type="secondary">{activity.action}</Text>
                        <br />
                        <Text type="secondary" className="overview-activity-time">
                          {activity.time}
                        </Text>
                      </div>
                    )
                  }))}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default OverviewPage;






















