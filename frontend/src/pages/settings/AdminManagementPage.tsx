/**
 * 管理员管理页面 - 管理系统管理员账户
 */
import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

const AdminManagementPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // 模拟数据
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: '1',
      email: 'superadmin@system.com',
      name: '超级管理员',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30:00',
      createdAt: '2024-01-01 00:00:00',
      permissions: ['all'],
    },
    {
      id: '2',
      email: 'admin@system.com',
      name: '系统管理员',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 12:15:00',
      createdAt: '2024-01-05 10:30:00',
      permissions: ['user_management', 'system_config'],
    },
    {
      id: '3',
      email: 'moderator@system.com',
      name: '内容管理员',
      role: 'moderator',
      status: 'inactive',
      lastLogin: '2024-01-10 16:45:00',
      createdAt: '2024-01-08 14:20:00',
      permissions: ['content_management'],
    },
  ]);

  const columns = [
    {
      title: '用户信息',
      key: 'user',
      render: (record: AdminUser) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="admin-name">{record.name}</div>
            <Text type="secondary" className="admin-email">
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
      render: (role: string) => {
        const roleConfig = {
          super_admin: { color: 'red', text: '超级管理员' },
          admin: { color: 'blue', text: '管理员' },
          moderator: { color: 'green', text: '内容管理员' },
        };
        const config = roleConfig[role as keyof typeof roleConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '活跃' },
          inactive: { color: 'orange', text: '非活跃' },
          suspended: { color: 'red', text: '已暂停' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: AdminUser) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个管理员吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setAdminUsers(adminUsers.filter(user => user.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingUser) {
        // 编辑
        setAdminUsers(adminUsers.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('更新成功');
      } else {
        // 新增
        const newUser: AdminUser = {
          id: Date.now().toString(),
          ...values,
          lastLogin: '从未登录',
          createdAt: new Date().toLocaleString(),
        };
        setAdminUsers([...adminUsers, newUser]);
        message.success('添加成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: '总管理员',
      value: adminUsers.length,
      icon: <TeamOutlined className="admin-stat-icon-blue" />,
    },
    {
      title: '活跃管理员',
      value: adminUsers.filter(u => u.status === 'active').length,
      icon: <SafetyCertificateOutlined className="admin-stat-icon-green" />,
    },
    {
      title: '超级管理员',
      value: adminUsers.filter(u => u.role === 'super_admin').length,
      icon: <UserOutlined className="admin-stat-icon-red" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title level={3} className="settings-page-title">
        <TeamOutlined className="settings-page-title-icon" />
        管理员管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="settings-stats-section">
        {stats.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* 管理员列表 */}
      <Card
        title="管理员列表"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加管理员
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={adminUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 添加/编辑模态框 */}
      <Modal
        title={editingUser ? '编辑管理员' : '添加管理员'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            role: 'admin',
          }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="super_admin">超级管理员</Option>
              <Option value="admin">管理员</Option>
              <Option value="moderator">内容管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">活跃</Option>
              <Option value="inactive">非活跃</Option>
              <Option value="suspended">已暂停</Option>
            </Select>
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[
                { required: true, message: '请输入初始密码' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AdminManagementPage;
