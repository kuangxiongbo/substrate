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
  Input,
  Popconfirm,
  Divider,
} from 'antd';
import {
  EditOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
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

interface AdminUserCreate {
  email: string;
  password: string;
  roles: string[];
  account_status: string;
  email_verified: boolean;
}

interface AdminUserUpdate {
  email?: string;
  roles?: string[];
  account_status?: string;
  email_verified?: boolean;
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
  const [availableRoles, setAvailableRoles] = useState([
    { value: 'super_admin', label: '超级管理员' },
    { value: 'admin', label: '管理员' },
    { value: 'moderator', label: '内容管理员' },
    { value: 'demo', label: '演示账号' },
  ]);
  const { currentTheme } = useTheme();
  const { t } = useTranslation();
  // const [adminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadAdminUsers();
    loadStats();
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/roles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const rolesData = await response.json();
        setAvailableRoles(rolesData.map((role: any) => ({
          value: role.name,
          label: role.display_name
        })));
      }
    } catch (error) {
      console.error('加载角色列表失败:', error);
      // 使用默认角色作为降级方案
      setAvailableRoles([
        { value: 'super_admin', label: t('admin.superAdmin') },
        { value: 'admin', label: t('admin.admin') },
        { value: 'moderator', label: t('admin.moderator') },
        { value: 'demo', label: t('admin.demoAccount') },
      ]);
    }
  };

  const loadAdminUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/users', {
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
      message.error(t('admin.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/stats', {
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
      title: t('admin.userInfo'),
      key: 'user',
      render: (record: AdminUser) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="admin-name">{record.email}</div>
            <Text type="secondary" className="admin-email">
              {record.email_verified ? t('admin.verified') : t('admin.unverified')}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('admin.role'),
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space>
          {roles.map(role => {
            const roleConfig = {
              super_admin: { color: 'red', text: t('admin.superAdmin') },
              admin: { color: 'blue', text: t('admin.admin') },
              moderator: { color: 'green', text: t('admin.moderator') },
              demo: { color: 'purple', text: t('admin.demoAccount') },
            };
            const config = roleConfig[role as keyof typeof roleConfig] || { color: 'default', text: role };
            return <Tag key={role} color={config.color}>{config.text}</Tag>;
          })}
        </Space>
      ),
    },
    {
      title: t('admin.status'),
      dataIndex: 'account_status',
      key: 'account_status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: t('admin.active') },
          inactive: { color: 'orange', text: t('admin.inactive') },
          suspended: { color: 'red', text: t('admin.suspended') },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('admin.lastLogin'),
      dataIndex: 'last_login_timestamp',
      key: 'last_login_timestamp',
      render: (timestamp: string) => timestamp ? 
        new Date(timestamp).toLocaleString('zh-CN') : t('admin.neverLoggedIn'),
    },
    {
      title: t('admin.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (timestamp: string) => new Date(timestamp).toLocaleString('zh-CN'),
    },
    {
      title: t('admin.actions'),
      key: 'action',
      render: (record: AdminUser) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('admin.edit')}
          </Button>
          <Button
            type="link"
            icon={record.account_status === 'locked' ? <UnlockOutlined /> : <LockOutlined />}
            onClick={() => handleToggleLock(record)}
          >
            {record.account_status === 'locked' ? t('admin.unlock') : t('admin.lock')}
          </Button>
          <Popconfirm
            title={t('admin.deleteConfirm')}
            description={t('admin.deleteConfirmMessage')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.ok')}
            cancelText={t('common.cancel')}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              {t('admin.delete')}
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
    form.setFieldsValue({
      ...user,
      roles: user.roles,
    });
    setModalVisible(true);
  };

  const handleToggleLock = async (user: AdminUser) => {
    try {
      const newStatus = user.account_status === 'locked' ? 'active' : 'locked';
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account_status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAdminUsers(adminUsers.map(u => 
        u.id === user.id ? { ...u, account_status: newStatus } : u
      ));
      message.success(newStatus === 'locked' ? t('admin.lockSuccess') : t('admin.unlockSuccess'));
    } catch (error) {
      console.error('切换锁定状态失败:', error);
      message.error(t('admin.toggleLockFailed'));
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAdminUsers(adminUsers.filter(u => u.id !== userId));
      message.success(t('admin.deleteSuccess'));
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error(t('admin.deleteFailed'));
    }
  };


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingUser) {
        // 编辑用户
        const response = await fetch(`http://localhost:8000/api/v1/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedUser = await response.json();
        setAdminUsers(adminUsers.map(user => 
          user.id === editingUser.id ? updatedUser : user
        ));
        message.success(t('admin.updateSuccess'));
      } else {
        // 新增用户
        const response = await fetch('http://localhost:8000/api/v1/admin/users', {
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

        const newUser = await response.json();
        setAdminUsers([...adminUsers, newUser]);
        message.success(t('admin.addSuccess'));
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('操作失败:', error);
      message.error(editingUser ? t('admin.updateFailed') : t('admin.addFailed'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

      {/* 管理员列表 */}
      <Card
        title={t('admin.adminList')}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            {t('admin.addAdmin')}
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
            showTotal: (total) => t('admin.totalRecords', { total }),
          }}
        />
      </Card>

      {/* 添加/编辑模态框 */}
      <Modal
        title={editingUser ? t('admin.editAdmin') : t('admin.addAdmin')}
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
            account_status: 'active',
            roles: ['admin'],
            email_verified: false,
          }}
        >
          <Form.Item
            name="email"
            label={t('admin.email')}
            rules={[
              { required: true, message: t('admin.emailRequired') },
              { type: 'email', message: t('admin.emailInvalid') }
            ]}
          >
            <Input placeholder={t('admin.emailPlaceholder')} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label={t('admin.password')}
              rules={[
                { required: true, message: t('admin.passwordRequired') },
                { min: 6, message: t('admin.passwordMinLength') }
              ]}
            >
              <Input.Password placeholder={t('admin.passwordPlaceholder')} />
            </Form.Item>
          )}

          <Form.Item
            name="roles"
            label={t('admin.roles')}
            rules={[{ required: true, message: t('admin.rolesRequired') }]}
          >
            <Select
              mode="multiple"
              placeholder={t('admin.rolesPlaceholder')}
              options={availableRoles}
            />
          </Form.Item>

          <Form.Item
            name="account_status"
            label={t('admin.accountStatus')}
            rules={[{ required: true, message: t('admin.statusRequired') }]}
          >
            <Select>
              <Option value="active">{t('admin.active')}</Option>
              <Option value="inactive">{t('admin.inactive')}</Option>
              <Option value="locked">{t('admin.locked')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email_verified"
            label={t('admin.emailVerificationStatus')}
            valuePropName="checked"
          >
            <Switch checkedChildren={t('admin.verified')} unCheckedChildren={t('admin.unverified')} />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
    </div>
  );
};

export default AdminManagementPage;
