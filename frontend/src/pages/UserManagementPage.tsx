/**
 * 用户管理页面
 * 基于Ant Design的用户管理界面
 */
import React from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  DatePicker,
  Form,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserManagementPage: React.FC = () => {
  // 模拟用户数据
  const mockUsers = [
    {
      key: '1',
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: '普通用户',
      status: 'active',
      lastLogin: '2024-01-15 10:30:00',
      registrationDate: '2024-01-01',
      avatar: null,
    },
    {
      key: '2',
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      role: '管理员',
      status: 'active',
      lastLogin: '2024-01-14 15:45:00',
      registrationDate: '2024-01-02',
      avatar: null,
    },
    {
      key: '3',
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      role: '普通用户',
      status: 'inactive',
      lastLogin: '2024-01-10 09:20:00',
      registrationDate: '2024-01-03',
      avatar: null,
    },
  ];

  const columns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{text}</div>
            <Text type="secondary">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === '管理员' ? 'blue' : 'default'}>
          {role}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '注册时间',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>用户管理</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={856}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={23}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线用户"
              value={45}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Search
                placeholder="搜索用户"
                allowClear
                style={{ width: 200 }}
              />
              <Select placeholder="角色筛选" style={{ width: 120 }} allowClear>
                <Option value="admin">管理员</Option>
                <Option value="user">普通用户</Option>
              </Select>
              <Select placeholder="状态筛选" style={{ width: 120 }} allowClear>
                <Option value="active">活跃</Option>
                <Option value="inactive">非活跃</Option>
              </Select>
              <RangePicker placeholder={['开始日期', '结束日期']} />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
                新增用户
              </Button>
              <Button icon={<ImportOutlined />}>
                导入
              </Button>
              <Button icon={<ExportOutlined />}>
                导出
              </Button>
              <Button icon={<ReloadOutlined />}>
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 用户表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockUsers}
          pagination={{
            total: mockUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default UserManagementPage;





