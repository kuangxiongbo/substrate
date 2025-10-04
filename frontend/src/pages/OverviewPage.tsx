/**
 * 概览页面 - 系统总览和统计信息
 */
import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Space,
  Typography,
  Avatar,
  List,
  Timeline,
} from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;

const OverviewPage: React.FC = () => {
  // 模拟数据
  const systemStats = [
    {
      title: '总用户数',
      value: 1234,
      icon: <UserOutlined className="overview-stat-icon-blue" />,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: '活跃用户',
      value: 856,
      icon: <CheckCircleOutlined className="overview-stat-icon-green" />,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: '安全事件',
      value: 23,
      icon: <SafetyCertificateOutlined className="overview-stat-icon-orange" />,
      trend: '-15%',
      trendUp: false,
    },
    {
      title: '系统日志',
      value: 15420,
      icon: <FileTextOutlined className="overview-stat-icon-purple" />,
      trend: '+5%',
      trendUp: true,
    },
  ];

  const recentActivities = [
    {
      time: '2024-01-15 14:30',
      user: 'admin@system.com',
      action: '修改系统配置',
      status: 'success',
    },
    {
      time: '2024-01-15 14:25',
      user: 'user@example.com',
      action: '登录系统',
      status: 'success',
    },
    {
      time: '2024-01-15 14:20',
      user: 'test@example.com',
      action: '登录失败',
      status: 'error',
    },
    {
      time: '2024-01-15 14:15',
      user: 'admin@system.com',
      action: '创建新用户',
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
    <div className="overview-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} className="overview-page-title">
          系统概览
        </Title>

        {/* 统计卡片 */}
        <Row gutter={[24, 24]} className="overview-stats-section">
          {systemStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  className="overview-card"
                >
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    suffix={
                      <Space>
                        {stat.trendUp ? (
                          <ArrowUpOutlined className="overview-trend-up" />
                        ) : (
                          <ArrowDownOutlined className="overview-trend-down" />
                        )}
                        <Text
                          type={stat.trendUp ? 'success' : 'danger'}
                          className="overview-trend-text"
                        >
                          {stat.trend}
                        </Text>
                      </Space>
                    }
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

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
                            ? '#52c41a'
                            : item.status === 'normal'
                            ? '#1890ff'
                            : '#faad14'
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
















