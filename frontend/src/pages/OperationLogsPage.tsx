/**
 * 操作日志页面 - 展示用户操作日志
 */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
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
// import { motion } from 'framer-motion';
// import { useAuthStore } from '../stores/authStore';
// import { useTheme } from '../contexts/ThemeContext';
import ContentPageLayout, { type ToolbarItem } from '../components/layout/ContentPageLayout';
import '../styles/settings-pages.css';
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
  // const { currentTheme } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  // const { user } = useAuthStore();

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
      message.success('操作日志加载成功');
    } catch (error) {
      console.error('加载操作日志失败:', error);
      message.error('加载操作日志失败，请检查网络连接或联系管理员');
      setLogs([]);
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
          <span>{timestamp}</span>
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
          <span>{name}</span>
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
          <code>{ip}</code>
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

  // 定义工具栏
  const toolbar: ToolbarItem[] = [
    {
      key: 'search',
      type: 'search',
      content: (
        <Input
          placeholder="搜索操作、资源或详情"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="operation-logs-search-input"
        />
      ),
    },
    {
      key: 'action-filter',
      type: 'filter',
      content: (
        <Select
          placeholder="操作类型"
          value={actionFilter}
          onChange={setActionFilter}
          className="operation-logs-filter-select"
        >
          <Option value="all">全部操作</Option>
          <Option value="LOGIN">登录</Option>
          <Option value="CREATE">创建</Option>
          <Option value="UPDATE">更新</Option>
          <Option value="DELETE">删除</Option>
          <Option value="VIEW">查看</Option>
        </Select>
      ),
    },
    {
      key: 'result-filter',
      type: 'filter',
      content: (
        <Select
          placeholder="操作结果"
          value={resultFilter}
          onChange={setResultFilter}
          className="operation-logs-filter-select"
        >
          <Option value="all">全部结果</Option>
          <Option value="SUCCESS">成功</Option>
          <Option value="FAILED">失败</Option>
        </Select>
      ),
    },
    {
      key: 'date-range',
      type: 'filter',
      content: (
        <RangePicker
          placeholder={['开始日期', '结束日期']}
          value={dateRange}
          onChange={setDateRange}
          className="operation-logs-date-picker"
        />
      ),
    },
    {
      key: 'reset',
      type: 'button',
      content: (
        <Button
          icon={<FilterOutlined />}
          onClick={() => {
            setSearchText('');
            setActionFilter('all');
            setResultFilter('all');
            setDateRange(null);
          }}
        >
          重置过滤
        </Button>
      ),
    },
    {
      key: 'refresh',
      type: 'button',
      content: (
        <Button
          icon={<ReloadOutlined />}
          onClick={loadOperationLogs}
          loading={loading}
        >
          刷新
        </Button>
      ),
    },
    {
      key: 'export',
      type: 'button',
      content: (
        <Button
          icon={<DownloadOutlined />}
          onClick={exportLogs}
          disabled={filteredLogs.length === 0}
        >
          导出
        </Button>
      ),
    },
  ];

  return (
    <ContentPageLayout
      mode="simple"
      toolbar={toolbar}
      helpCenterUrl="/help/operation-logs"
    >
      <div className="operation-logs-count">
        共 {filteredLogs.length} 条记录
      </div>
      
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
    </ContentPageLayout>
  );
};

export default OperationLogsPage;
