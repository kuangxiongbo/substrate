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
  const { t } = useTranslation();
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
      message.error(t('admin.loadFailed'));
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
        message.success(t('admin.updateSuccess'));
      } else {
        // 新增
        const newUser: AdminUser = {
          id: Date.now().toString(),
          ...values,
          lastLogin: t('admin.neverLoggedIn'),
          createdAt: new Date().toLocaleString(),
        };
        setAdminUsers([...adminUsers, newUser]);
        message.success(t('admin.addSuccess'));
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
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
            onClick={() => setModalVisible(true)}
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
            status: 'active',
            role: 'admin',
          }}
        >
          <Form.Item
            name="email_verified"
            label={t('admin.emailVerificationStatus')}
            valuePropName="checked"
          >
            <Switch checkedChildren={t('admin.verified')} unCheckedChildren={t('admin.unverified')} />
          </Form.Item>

          <Form.Item
            name="account_status"
            label={t('admin.accountStatus')}
          >
            <Select>
              <Option value="active">{t('admin.active')}</Option>
              <Option value="inactive">{t('admin.inactive')}</Option>
              <Option value="locked">{t('admin.locked')}</Option>
            </Select>
          </Form.Item>


        </Form>
      </Modal>
    </motion.div>
    </div>
  );
};

export default AdminManagementPage;
