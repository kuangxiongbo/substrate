/**
 * 操作日志页面 - 展示用户操作日志
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Tag,
  Typography,
  Row,
  Col,
  message,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface OperationLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'FAILED';
  ip_address: string;
  user_agent: string;
  details: string;
}

const OperationLogsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<OperationLog[]>([]);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadOperationLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchText, actionFilter, resultFilter, dateRange]);

  const loadOperationLogs = async () => {
    setLoading(true);
    try {
      // 实际API调用
      const response = await fetch('/api/v1/operation-logs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('加载操作日志失败:', error);
      // 降级到模拟数据
      const mockLogs: OperationLog[] = [
        {
          id: '1',
          timestamp: '2024-01-15 14:30:25',
          user_id: user?.id || '1',
          user_name: user?.name || '当前用户',
          action: 'LOGIN',
          resource: 'auth/login',
          result: 'SUCCESS',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          details: '用户登录成功'
        },
        {
          id: '2',
          timestamp: '2024-01-15 14:25:10',
          user_id: user?.id || '1',
          user_name: user?.name || '当前用户',
          action: 'VIEW_USER',
          resource: 'user/profile',
          result: 'SUCCESS',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          details: '查看用户资料'
        },
        {
          id: '3',
          timestamp: '2024-01-15 14:20:05',
          user_id: user?.id || '1',
          user_name: user?.name || '当前用户',
          action: 'UPDATE_SETTINGS',
          resource: 'settings/theme',
          result: 'SUCCESS',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          details: '更新主题设置'
        },
        {
          id: '4',
          timestamp: '2024-01-15 14:15:30',
          user_id: user?.id || '1',
          user_name: user?.name || '当前用户',
          action: 'CREATE_USER',
          resource: 'user/create',
          result: 'FAILED',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          details: '创建用户失败：邮箱已存在'
        },
        {
          id: '5',
          timestamp: '2024-01-15 14:10:15',
          user_id: user?.id || '1',
          user_name: user?.name || '当前用户',
          action: 'DELETE_LOG',
          resource: 'logs/delete',
          result: 'SUCCESS',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          details: '删除操作日志'
        }
      ];
      setLogs(mockLogs);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchText.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchText.toLowerCase()) ||
        log.details.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 操作类型过滤
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // 结果过滤
    if (resultFilter !== 'all') {
      filtered = filtered.filter(log => log.result === resultFilter);
    }

    // 日期范围过滤
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= start.toDate() && logDate <= end.toDate();
      });
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = async () => {
    try {
      // 尝试调用后端导出API
      const response = await fetch('/api/v1/operation-logs/export', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // 后端返回文件流
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `operation_logs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        message.success('日志导出成功');
      } else {
        throw new Error('导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      // 降级到前端导出
      const csvContent = [
        ['时间', '用户', '操作', '资源', '结果', 'IP地址', '详情'].join(','),
        ...filteredLogs.map(log => [
          log.timestamp,
          log.user_name,
          log.action,
          log.resource,
          log.result,
          log.ip_address,
          log.details
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `operation_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      message.success('日志导出成功（本地生成）');
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{timestamp}</Text>
        </Space>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 120,
      render: (name: string) => (
        <Space>
          <UserOutlined />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (action: string) => {
        const color = action.includes('LOGIN') ? 'blue' : 
                     action.includes('CREATE') ? 'green' :
                     action.includes('UPDATE') ? 'orange' :
                     action.includes('DELETE') ? 'red' : 'default';
        return <Tag color={color}>{action}</Tag>;
      },
    },
    {
      title: '资源',
      dataIndex: 'resource',
      key: 'resource',
      width: 150,
      ellipsis: true,
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => (
        <Tag color={result === 'SUCCESS' ? 'success' : 'error'}>
          {result === 'SUCCESS' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 130,
      render: (ip: string) => (
        <Space>
          <EnvironmentOutlined />
          <Text code>{ip}</Text>
        </Space>
      ),
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
  ];

  return (
    <div className="operation-logs-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="logs-header-card">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} className="logs-page-title">
                操作日志
              </Title>
              <Text type="secondary">
                查看您的操作历史记录，共 {filteredLogs.length} 条记录
              </Text>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadOperationLogs}
                  loading={loading}
                >
                  刷新
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportLogs}
                  disabled={filteredLogs.length === 0}
                >
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="logs-filter-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={6}>
              <Input
                placeholder="搜索操作、资源或详情"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder="操作类型"
                value={actionFilter}
                onChange={setActionFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">全部操作</Option>
                <Option value="LOGIN">登录</Option>
                <Option value="CREATE">创建</Option>
                <Option value="UPDATE">更新</Option>
                <Option value="DELETE">删除</Option>
                <Option value="VIEW">查看</Option>
              </Select>
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder="操作结果"
                value={resultFilter}
                onChange={setResultFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">全部结果</Option>
                <Option value="SUCCESS">成功</Option>
                <Option value="FAILED">失败</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={4}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  setSearchText('');
                  setActionFilter('all');
                  setResultFilter('all');
                  setDateRange(null);
                }}
                style={{ width: '100%' }}
              >
                重置过滤
              </Button>
            </Col>
          </Row>
        </Card>

        <Card className="logs-table-card">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredLogs}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
              }}
              scroll={{ x: 1000 }}
              size="middle"
            />
          </Spin>
        </Card>
      </motion.div>
    </div>
  );
};

export default OperationLogsPage;
