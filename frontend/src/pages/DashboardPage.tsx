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
  Tag,
  Timeline,
  Table,
  Badge,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
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
import '../styles/settings-pages.css';

// 获取统计图标背景色CSS类名
const getStatIconClass = (color: string): string => {
  switch (color) {
    case '#1890ff':
      return 'stat-icon-blue';
    case '#52c41a':
      return 'stat-icon-green';
    case '#faad14':
      return 'stat-icon-orange';
    case '#f5222d':
      return 'stat-icon-red';
    case '#722ed1':
      return 'stat-icon-purple';
    default:
      return 'stat-icon-default';
  }
};

const { Title, Text } = Typography;

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

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="stat-card">
      <Statistic
        title={title}
        value={value}
        prefix={
          <Avatar
            size={40}
            icon={icon}
            className={`stat-icon ${getStatIconClass(color)}`}
          />
        }
        loading={false}
        valueStyle={{ color: color, fontSize: 24, fontWeight: 600 }}
      />
      {trend && (
        <div className="mt-2">
          <Space>
            {trend.isPositive ? (
              <ArrowUpOutlined className="stat-trend-up" />
            ) : (
              <ArrowDownOutlined className="stat-trend-down" />
            )}
            <Text
              className={`stat-trend-text ${trend.isPositive ? 'stat-trend-up' : 'stat-trend-down'}`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
            <Text type="secondary" className="stat-trend-label">
              较上月
            </Text>
          </Space>
        </div>
      )}
    </Card>
  </motion.div>
  );
};

interface DashboardStats {
  total_users: number;
  active_users: number;
  total_roles: number;
  total_permissions: number;
  total_configs: number;
}

interface RecentUser {
  id: string;
  email: string;
  email_verified: boolean;
  account_status: string;
  failed_login_attempts: number;
  account_locked_until?: string;
  registration_timestamp: string; // Added for sorting
  last_login_timestamp?: string;
  roles: string[];
}

interface SystemLog {
  time: string;
  action: string;
  user: string;
  status: 'success' | 'error';
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [, setLoading] = useState(true);
  const [, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // setLoading(true);
    try {
      // 并行加载多个API
      const [statsResponse, usersResponse] = await Promise.all([
        fetch('/api/v1/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/v1/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        // 取最近注册的5个用户
        const sortedUsers = usersData
          .sort((a: RecentUser, b: RecentUser) => 
            new Date(b.registration_timestamp).getTime() - new Date(a.registration_timestamp).getTime()
          )
          .slice(0, 5);
        setRecentUsers(sortedUsers);
      }

      // 模拟系统日志（暂时使用模拟数据，因为需要专门的日志API）
      const mockLogs: SystemLog[] = [
        {
          time: new Date().toISOString(),
          action: '用户登录',
          user: user?.email || '当前用户',
          status: 'success',
        },
        {
          time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          action: '查看仪表板',
          user: user?.email || '当前用户',
          status: 'success',
        },
        {
          time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          action: '系统配置更新',
          user: user?.email || '当前用户',
          status: 'success',
        },
      ];
      setSystemLogs(mockLogs);

    } catch (error) {
      console.error('加载仪表板数据失败:', error);
    } finally {
      // setLoading(false);
    }
  };

  const userColumns = [
    {
      title: '用户',
      dataIndex: 'email',
      key: 'email',
      render: (email: string, record: RecentUser) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <Text strong>{email}</Text>
            <br />
            <Text type="secondary" className="user-list-text">
              {record.email_verified ? '已验证' : '未验证'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space>
          {roles.map(role => (
            <Tag key={role} color={role === 'admin' ? 'blue' : 'green'}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'account_status',
      key: 'account_status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status === 'active' ? '活跃' : status === 'inactive' ? '非活跃' : '锁定'}
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login_timestamp',
      key: 'last_login_timestamp',
      render: (timestamp: string) => timestamp ? 
        new Date(timestamp).toLocaleString('zh-CN') : '从未登录',
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
        <Title level={2} className="dashboard-page-title">
          仪表板
        </Title>
        <Text type="secondary">
          欢迎回来，{user?.email}！这里是您的系统概览。
        </Text>
      </motion.div>


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
              className="dashboard-card"
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
              className="dashboard-card"
            >
              <Timeline
                items={systemLogs.map((log) => ({
                  dot: log.status === 'success' ? (
                    <CheckCircleOutlined className="dashboard-timeline-success" />
                  ) : (
                    <ExclamationCircleOutlined className="dashboard-timeline-error" />
                  ),
                  children: (
                    <div>
                      <Text strong>{log.action}</Text>
                      <br />
                      <Text type="secondary" className="dashboard-timeline-text">
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
          className="dashboard-table-card"
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





















