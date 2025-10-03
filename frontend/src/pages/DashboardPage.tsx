/**
 * 仪表板页面 - 专业UI设计师设计
 * 基于Ant Design的管理仪表板
 */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  Space,
  Button,
  Avatar,
  List,
  Tag,
  Timeline,
  Table,
  Badge,
  Tooltip,
  Divider,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

const { Title, Text, Paragraph } = Typography;

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card
      className="stat-card"
      style={{
        borderRadius: 12,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        border: 'none',
      }}
    >
      <Statistic
        title={title}
        value={value}
        prefix={
          <Avatar
            size={40}
            icon={icon}
            style={{ backgroundColor: color }}
          />
        }
        loading={loading}
        valueStyle={{ color: color, fontSize: 24, fontWeight: 600 }}
      />
      {trend && (
        <div className="mt-2">
          <Space>
            {trend.isPositive ? (
              <ArrowUpOutlined style={{ color: '#52c41a' }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
            )}
            <Text
              style={{
                color: trend.isPositive ? '#52c41a' : '#ff4d4f',
                fontSize: 12,
              }}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              较上月
            </Text>
          </Space>
        </div>
      )}
    </Card>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const recentUsers = [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: 'active',
      lastLogin: '2024-01-15 10:30',
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: '用户',
      status: 'active',
      lastLogin: '2024-01-15 09:15',
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      role: '用户',
      status: 'inactive',
      lastLogin: '2024-01-14 16:45',
    },
  ];

  const systemLogs = [
    {
      time: '2024-01-15 10:30:00',
      action: '用户登录',
      user: '张三',
      status: 'success',
    },
    {
      time: '2024-01-15 10:25:00',
      action: '密码修改',
      user: '李四',
      status: 'success',
    },
    {
      time: '2024-01-15 10:20:00',
      action: '登录失败',
      user: '未知用户',
      status: 'error',
    },
    {
      time: '2024-01-15 10:15:00',
      action: '系统配置更新',
      user: '超级管理员',
      status: 'success',
    },
  ];

  const userColumns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === '管理员' ? 'blue' : 'green'}>
          {role}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status === 'active' ? '活跃' : '非活跃'}
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="查看">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-content">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Title level={2} style={{ marginBottom: 8 }}>
          仪表板
        </Title>
        <Text type="secondary">
          欢迎回来，{user?.email}！这里是您的系统概览。
        </Text>
      </motion.div>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总用户数"
            value={1248}
            icon={<UserOutlined />}
            color="#1890ff"
            trend={{ value: 12.5, isPositive: true }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="活跃用户"
            value={892}
            icon={<TeamOutlined />}
            color="#52c41a"
            trend={{ value: 8.2, isPositive: true }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="系统角色"
            value={3}
            icon={<SafetyCertificateOutlined />}
            color="#faad14"
            trend={{ value: 0, isPositive: true }}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="邮件发送"
            value={156}
            icon={<MailOutlined />}
            color="#722ed1"
            trend={{ value: -2.1, isPositive: false }}
            loading={loading}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* 系统状态 */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card
              title={
                <Space>
                  <BarChartOutlined />
                  系统状态
                </Space>
              }
              style={{ borderRadius: 12, height: '100%' }}
            >
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text>CPU 使用率</Text>
                    <Text strong>45%</Text>
                  </div>
                  <Progress percent={45} strokeColor="#1890ff" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text>内存使用率</Text>
                    <Text strong>68%</Text>
                  </div>
                  <Progress percent={68} strokeColor="#52c41a" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text>磁盘使用率</Text>
                    <Text strong>32%</Text>
                  </div>
                  <Progress percent={32} strokeColor="#faad14" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Text>网络带宽</Text>
                    <Text strong>78%</Text>
                  </div>
                  <Progress percent={78} strokeColor="#722ed1" />
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card
              title={
                <Space>
                  <ClockCircleOutlined />
                  最近活动
                </Space>
              }
              style={{ borderRadius: 12, height: '100%' }}
            >
              <Timeline
                items={systemLogs.map((log, index) => ({
                  dot: log.status === 'success' ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                  ),
                  children: (
                    <div>
                      <Text strong>{log.action}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {log.user} • {log.time}
                      </Text>
                    </div>
                  ),
                }))}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 用户管理 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-6"
      >
        <Card
          title={
            <Space>
              <TeamOutlined />
              最近用户
            </Space>
          }
          extra={
            <Button type="primary" icon={<EyeOutlined />}>
              查看全部
            </Button>
          }
          style={{ borderRadius: 12 }}
        >
          <Table
            columns={userColumns}
            dataSource={recentUsers}
            pagination={false}
            size="small"
            rowKey="id"
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;


