/**
 * 管理员管理页面 - 管理系统管理员账户
 */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Switch,
  message,
  Typography,
  Card,
  Avatar,
} from 'antd';
import {
  EditOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/settings-pages.css';

const { Text } = Typography;
const { Option } = Select;

interface AdminUser {
  id: string;
  email: string;
  email_verified: boolean;
  account_status: string;
  failed_login_attempts: number;
  account_locked_until?: string;
  registration_timestamp: string;
  last_login_timestamp?: string;
  roles: string[];
  created_at: string;
  updated_at?: string;
}

// interface AdminStats {
//   total_users: number;
//   active_users: number;
//   total_roles: number;
//   total_permissions: number;
//   total_configs: number;
// }

const AdminManagementPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const { currentTheme } = useTheme();
  // const [adminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadAdminUsers();
    loadStats();
  }, []);

  const loadAdminUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/users', {
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
      // 过滤出管理员用户（包括超级管理员、管理员、演示账号）
      const admins = data.filter((user: AdminUser) => 
        user.roles.some(role => ['admin', 'super_admin', 'moderator', 'demo'].includes(role))
      );
      setAdminUsers(admins);
    } catch (error) {
      console.error('加载管理员列表失败:', error);
      message.error('加载管理员列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/v1/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const data = await response.json();
      // setAdminStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  // 模拟数据 - 作为降级方案（已移除，使用真实API）

  const columns = [
    {
      title: '用户信息',
      key: 'user',
      render: (record: AdminUser) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="admin-name">{record.email}</div>
            <Text type="secondary" className="admin-email">
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
          {roles.map(role => {
            const roleConfig = {
              super_admin: { color: 'red', text: '超级管理员' },
              admin: { color: 'blue', text: '管理员' },
              moderator: { color: 'green', text: '内容管理员' },
              demo: { color: 'purple', text: '演示账号' },
            };
            const config = roleConfig[role as keyof typeof roleConfig] || { color: 'default', text: role };
            return <Tag key={role} color={config.color}>{config.text}</Tag>;
          })}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'account_status',
      key: 'account_status',
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
      dataIndex: 'last_login_timestamp',
      key: 'last_login_timestamp',
      render: (timestamp: string) => timestamp ? 
        new Date(timestamp).toLocaleString('zh-CN') : '从未登录',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (timestamp: string) => new Date(timestamp).toLocaleString('zh-CN'),
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
        </Space>
      ),
    },
  ];

  // const handleAdd = () => {
  //   setEditingUser(null);
  //   form.resetFields();
  //   setModalVisible(true);
  // };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 真实API调用
      const response = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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
      value: adminUsers.filter(u => u.account_status === 'active').length,
      icon: <SafetyCertificateOutlined className="admin-stat-icon-green" />,
    },
    {
      title: '超级管理员',
      value: adminUsers.filter(u => u.roles.includes('super_admin')).length,
      icon: <UserOutlined className="admin-stat-icon-red" />,
    },
  ];

  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

      {/* 管理员列表 */}
      <Card
        title="管理员列表"
        extra={
          <Button
            type="primary"
            onClick={() => setModalVisible(true)}
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
            name="email_verified"
            label="邮箱验证状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="已验证" unCheckedChildren="未验证" />
          </Form.Item>

          <Form.Item
            name="account_status"
            label="账户状态"
          >
            <Select>
              <Option value="active">活跃</Option>
              <Option value="inactive">非活跃</Option>
              <Option value="locked">锁定</Option>
            </Select>
          </Form.Item>


        </Form>
      </Modal>
    </motion.div>
    </div>
  );
};

export default AdminManagementPage;
