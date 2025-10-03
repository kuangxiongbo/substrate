/**
 * 用户管理页面 - 专业UI设计师设计
 * 基于Ant Design的用户管理界面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Modal,
  Form,
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Badge,
  Dropdown,
  Divider,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface User {
  id: string;
  email: string;
  email_verified: boolean;
  account_status: 'active' | 'inactive' | 'locked';
  failed_login_attempts: number;
  account_locked_until?: string;
  registration_timestamp: string;
  last_login_timestamp?: string;
  roles: string[];
  created_at: string;
  updated_at?: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 模拟用户数据
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'demo@example.com',
      email_verified: true,
      account_status: 'active',
      failed_login_attempts: 0,
      registration_timestamp: '2024-01-01T10:00:00Z',
      last_login_timestamp: '2024-01-15T10:30:00Z',
      roles: ['super_admin'],
      created_at: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      email: 'superadmin@system.com',
      email_verified: true,
      account_status: 'active',
      failed_login_attempts: 0,
      registration_timestamp: '2024-01-01T10:00:00Z',
      last_login_timestamp: '2024-01-15T09:15:00Z',
      roles: ['super_admin'],
      created_at: '2024-01-01T10:00:00Z',
    },
    {
      id: '3',
      email: 'user1@example.com',
      email_verified: true,
      account_status: 'active',
      failed_login_attempts: 0,
      registration_timestamp: '2024-01-10T14:20:00Z',
      last_login_timestamp: '2024-01-15T08:45:00Z',
      roles: ['user'],
      created_at: '2024-01-10T14:20:00Z',
    },
    {
      id: '4',
      email: 'user2@example.com',
      email_verified: false,
      account_status: 'inactive',
      failed_login_attempts: 3,
      registration_timestamp: '2024-01-12T16:30:00Z',
      last_login_timestamp: '2024-01-14T11:20:00Z',
      roles: ['user'],
      created_at: '2024-01-12T16:30:00Z',
    },
    {
      id: '5',
      email: 'admin@example.com',
      email_verified: true,
      account_status: 'active',
      failed_login_attempts: 0,
      registration_timestamp: '2024-01-05T09:15:00Z',
      last_login_timestamp: '2024-01-15T07:30:00Z',
      roles: ['admin'],
      created_at: '2024-01-05T09:15:00Z',
    },
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'locked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '非活跃';
      case 'locked':
        return '已锁定';
      default:
        return '未知';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'red';
      case 'admin':
        return 'blue';
      case 'user':
        return 'green';
      default:
        return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'super_admin':
        return '超级管理员';
      case 'admin':
        return '管理员';
      case 'user':
        return '普通用户';
      default:
        return role;
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      email_verified: user.email_verified,
      account_status: user.account_status,
    });
    setModalVisible(true);
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('用户删除成功');
  };

  const handleBatchDelete = () => {
    setUsers(users.filter(user => !selectedRowKeys.includes(user.id)));
    setSelectedRowKeys([]);
    message.success(`已删除 ${selectedRowKeys.length} 个用户`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 更新用户
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values }
            : user
        ));
        message.success('用户信息更新成功');
      }
      
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const columns: ColumnsType<User> = [
    {
      title: '用户信息',
      dataIndex: 'email',
      key: 'email',
      render: (email: string, record: User) => (
        <Space>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <Text strong>{email}</Text>
            <br />
            <Space size="small">
              <Badge
                status={record.email_verified ? 'success' : 'error'}
                text={record.email_verified ? '已验证' : '未验证'}
              />
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space wrap>
          {roles.map(role => (
            <Tag key={role} color={getRoleColor(role)}>
              {getRoleText(role)}
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
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '登录次数',
      dataIndex: 'failed_login_attempts',
      key: 'failed_login_attempts',
      render: (attempts: number) => (
        <Text type={attempts > 0 ? 'danger' : 'success'}>
          {attempts}
        </Text>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'registration_timestamp',
      key: 'registration_timestamp',
      render: (timestamp: string) => (
        <Space>
          <CalendarOutlined />
          {new Date(timestamp).toLocaleDateString()}
        </Space>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login_timestamp',
      key: 'last_login_timestamp',
      render: (timestamp?: string) => (
        timestamp ? (
          <Space>
            <CalendarOutlined />
            {new Date(timestamp).toLocaleDateString()}
          </Space>
        ) : (
          <Text type="secondary">从未登录</Text>
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: User) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="编辑用户">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个用户吗？此操作不可撤销。"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Tooltip title="删除用户">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

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
          用户管理
        </Title>
        <Text type="secondary">
          管理系统用户，包括用户信息、角色分配和状态管理。
        </Text>
      </motion.div>

      {/* 操作栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <Card style={{ borderRadius: 12 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索用户邮箱"
                allowClear
                style={{ width: '100%' }}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="选择状态"
                allowClear
                style={{ width: '100%' }}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="active">活跃</Option>
                <Option value="inactive">非活跃</Option>
                <Option value="locked">已锁定</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="选择角色"
                allowClear
                style={{ width: '100%' }}
                suffixIcon={<TeamOutlined />}
              >
                <Option value="super_admin">超级管理员</Option>
                <Option value="admin">管理员</Option>
                <Option value="user">普通用户</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                block
              >
                添加用户
              </Button>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* 用户表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card
          title={
            <Space>
              <TeamOutlined />
              用户列表
              <Tag color="blue">{users.length}</Tag>
            </Space>
          }
          extra={
            selectedRowKeys.length > 0 && (
              <Popconfirm
                title="批量删除"
                description={`确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`}
                onConfirm={handleBatchDelete}
                okText="确认"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            )
          }
          style={{ borderRadius: 12 }}
        >
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            rowSelection={rowSelection}
            loading={loading}
            pagination={{
              total: users.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </motion.div>

      {/* 编辑用户模态框 */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            {editingUser ? '编辑用户' : '添加用户'}
          </Space>
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item
            name="email_verified"
            label="邮箱验证状态"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="已验证"
              unCheckedChildren="未验证"
            />
          </Form.Item>

          <Form.Item
            name="account_status"
            label="账户状态"
            rules={[{ required: true, message: '请选择账户状态' }]}
          >
            <Select placeholder="请选择账户状态">
              <Option value="active">活跃</Option>
              <Option value="inactive">非活跃</Option>
              <Option value="locked">已锁定</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
