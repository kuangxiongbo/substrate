/**
 * 系统日志查看器页面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Typography,
  Space,
  message,
  Input,
  Select,
  DatePicker,
  Tag,
  Tooltip,
  Modal,
  // Alert,
  // Tabs,
} from 'antd';
import {
  FileTextOutlined,
  ReloadOutlined,
  // SearchOutlined,
  DownloadOutlined,
  ClearOutlined,
  EyeOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  // CheckCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
// const { TabPane } = Tabs;

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  source: string;
  message: string;
  details?: string;
  user_id?: string;
  ip_address?: string;
  request_id?: string;
}

interface LogStats {
  total_logs: number;
  error_count: number;
  warning_count: number;
  info_count: number;
  debug_count: number;
}

const SystemLogsPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    loadLogs();
    // 每30秒刷新一次日志
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'INFO',
          source: 'auth.service',
          message: '用户登录成功',
          user_id: 'user_123',
          ip_address: '192.168.1.100',
          request_id: 'req_456',
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'WARN',
          source: 'database.connection',
          message: '数据库连接池使用率超过80%',
          details: '当前连接数: 45, 最大连接数: 50',
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'ERROR',
          source: 'email.service',
          message: '邮件发送失败',
          details: 'SMTP服务器连接超时',
          user_id: 'user_789',
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          level: 'DEBUG',
          source: 'cache.service',
          message: '缓存命中率统计',
          details: '命中率: 85.6%, 总请求: 1000',
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          level: 'FATAL',
          source: 'system.crash',
          message: '系统崩溃',
          details: '内存不足导致系统崩溃',
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 1500000).toISOString(),
          level: 'INFO',
          source: 'backup.service',
          message: '数据备份完成',
          details: '备份大小: 2.5GB, 耗时: 15分钟',
        },
      ];

      const mockStats: LogStats = {
        total_logs: mockLogs.length,
        error_count: mockLogs.filter(l => l.level === 'ERROR').length,
        warning_count: mockLogs.filter(l => l.level === 'WARN').length,
        info_count: mockLogs.filter(l => l.level === 'INFO').length,
        debug_count: mockLogs.filter(l => l.level === 'DEBUG').length,
      };

      setLogs(mockLogs);
      setStats(mockStats);
    } catch (error) {
      console.error('加载日志失败:', error);
      message.error('加载日志失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLogs = () => {
    message.info('导出日志功能开发中');
  };

  const handleClearLogs = () => {
    Modal.confirm({
      title: '确认清空日志',
      content: '确定要清空所有日志吗？此操作不可恢复。',
      icon: <WarningOutlined />,
      onOk: () => {
        setLogs([]);
        message.success('日志已清空');
      },
    });
  };

  const getLevelColor = (level: string) => {
    const colorMap = {
      DEBUG: 'default',
      INFO: 'blue',
      WARN: 'orange',
      ERROR: 'red',
      FATAL: 'red',
    };
    return colorMap[level as keyof typeof colorMap] || 'default';
  };

  const getLevelIcon = (level: string) => {
    const iconMap = {
      DEBUG: <InfoCircleOutlined />,
      INFO: <InfoCircleOutlined />,
      WARN: <ExclamationCircleOutlined />,
      ERROR: <ExclamationCircleOutlined />,
      FATAL: <WarningOutlined />,
    };
    return iconMap[level as keyof typeof iconMap];
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchText || 
      log.message.toLowerCase().includes(searchText.toLowerCase()) ||
      log.source.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesLevel = !levelFilter || log.level === levelFilter;
    
    const matchesDate = !dateRange || (
      new Date(log.timestamp) >= dateRange[0] &&
      new Date(log.timestamp) <= dateRange[1]
    );

    return matchesSearch && matchesLevel && matchesDate;
  });

  const logColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
      sorter: (a: LogEntry, b: LogEntry) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={getLevelColor(level)} icon={getLevelIcon(level)}>
          {level}
        </Tag>
      ),
      filters: [
        { text: 'DEBUG', value: 'DEBUG' },
        { text: 'INFO', value: 'INFO' },
        { text: 'WARN', value: 'WARN' },
        { text: 'ERROR', value: 'ERROR' },
        { text: 'FATAL', value: 'FATAL' },
      ],
      onFilter: (value: any, record: LogEntry) => record.level === value,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      ellipsis: true,
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (_message: string, _record: LogEntry) => (
        <Tooltip title={_message}>
          <Text>{_message}</Text>
        </Tooltip>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
      render: (userId: string) => userId || '-',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 120,
      render: (ip: string) => ip || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, _record: LogEntry) => (
        <Tooltip title="查看详情">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedLog(_record);
              setLogModalVisible(true);
            }}
          />
        </Tooltip>
      ),
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
            <FileTextOutlined className="monitoring-header-icon" />
            <Title level={2} className="monitoring-title">
              系统日志
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadLogs}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
          <Text className="monitoring-description">
            查看和管理系统日志
          </Text>
        </div>

        {/* 日志统计 */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">总日志数</Text>
                  <div className="text-2xl font-bold">{stats?.total_logs || 0}</div>
                </div>
                <FileTextOutlined className="text-2xl text-blue-500" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">错误</Text>
                  <div className="text-2xl font-bold text-red-500">{stats?.error_count || 0}</div>
                </div>
                <ExclamationCircleOutlined className="text-2xl text-red-500" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">警告</Text>
                  <div className="text-2xl font-bold text-orange-500">{stats?.warning_count || 0}</div>
                </div>
                <WarningOutlined className="text-2xl text-orange-500" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">信息</Text>
                  <div className="text-2xl font-bold text-blue-500">{stats?.info_count || 0}</div>
                </div>
                <InfoCircleOutlined className="text-2xl text-blue-500" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* 日志过滤器 */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder="搜索日志..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder="日志级别"
                value={levelFilter}
                onChange={setLevelFilter}
                allowClear
                className="logs-filter-full-width"
              >
                <Option value="DEBUG">DEBUG</Option>
                <Option value="INFO">INFO</Option>
                <Option value="WARN">WARN</Option>
                <Option value="ERROR">ERROR</Option>
                <Option value="FATAL">FATAL</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                showTime
                className="logs-filter-full-width"
              />
            </Col>
            <Col xs={24} sm={6}>
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadLogs}
                >
                  导出
                </Button>
                <Button
                  icon={<ClearOutlined />}
                  danger
                  onClick={handleClearLogs}
                >
                  清空
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 日志表格 */}
        <Card title={`日志列表 (${filteredLogs.length})`}>
          <Table
            columns={logColumns}
            dataSource={filteredLogs}
            rowKey="id"
            loading={loading}
            pagination={{ 
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
            scroll={{ x: 1200 }}
            size="small"
          />
        </Card>

        {/* 日志详情模态框 */}
        <Modal
          title="日志详情"
          open={logModalVisible}
          onCancel={() => setLogModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setLogModalVisible(false)}>
              关闭
            </Button>,
          ]}
          width={800}
        >
          {selectedLog && (
            <div className="space-y-4">
              <div>
                <Text strong>时间: </Text>
                <Text>{new Date(selectedLog.timestamp).toLocaleString()}</Text>
              </div>
              <div>
                <Text strong>级别: </Text>
                <Tag color={getLevelColor(selectedLog.level)} icon={getLevelIcon(selectedLog.level)}>
                  {selectedLog.level}
                </Tag>
              </div>
              <div>
                <Text strong>来源: </Text>
                <Text code>{selectedLog.source}</Text>
              </div>
              <div>
                <Text strong>消息: </Text>
                <Text>{selectedLog.message}</Text>
              </div>
              {selectedLog.details && (
                <div>
                  <Text strong>详情: </Text>
                  <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
                    {selectedLog.details}
                  </pre>
                </div>
              )}
              {selectedLog.user_id && (
                <div>
                  <Text strong>用户ID: </Text>
                  <Text code>{selectedLog.user_id}</Text>
                </div>
              )}
              {selectedLog.ip_address && (
                <div>
                  <Text strong>IP地址: </Text>
                  <Text code>{selectedLog.ip_address}</Text>
                </div>
              )}
              {selectedLog.request_id && (
                <div>
                  <Text strong>请求ID: </Text>
                  <Text code>{selectedLog.request_id}</Text>
                </div>
              )}
            </div>
          )}
        </Modal>
      </motion.div>
    </div>
  );
};

export default SystemLogsPage;
