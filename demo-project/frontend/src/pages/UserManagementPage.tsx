/**
 * 业务用户管理页面 - 管理业务用户，支持第三方平台对接
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Select, Tag, Card, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, LinkOutlined, SyncOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import ContentPageLayout, { type ToolbarItem } from '../components/layout/ContentPageLayout';
import { useTranslation } from 'react-i18next';
import './UserManagementPage.css';

const { Option } = Select;

interface BusinessUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  source: 'local' | 'oauth_google' | 'oauth_github' | 'oauth_wechat' | 'oauth_qq';
  source_id?: string;
  email_verified: boolean;
  account_status: 'active' | 'inactive' | 'suspended';
  last_login_timestamp?: string;
  created_at: string;
  updated_at?: string;
  profile_data?: any;
}

const UserManagementPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const [users, setUsers] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<BusinessUser | null>(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
    oauth: 0
  });
  const { t } = useTranslation();

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/business-users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('加载业务用户列表失败:', error);
      message.error(t('userManagement.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/business-users/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('加载用户统计失败:', error);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/business-users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        message.success(t('userManagement.deleteSuccess'));
        loadUsers();
        loadStats();
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error(t('userManagement.deleteFailed'));
    }
  };

  const handleSyncUser = async (user: BusinessUser) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/business-users/${user.id}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        message.success('用户信息同步成功');
        loadUsers();
      }
    } catch (error) {
      console.error('同步用户失败:', error);
      message.error('同步用户失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const response = await fetch(
        editingUser ? `/api/v1/admin/users/${editingUser.id}` : '/api/v1/admin/users',
        {
          method: editingUser ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        }
      );
      
      if (response.ok) {
        message.success(editingUser ? t('userManagement.updateSuccess') : t('userManagement.createSuccess'));
        setModalVisible(false);
        loadUsers();
      }
    } catch (error) {
      console.error('保存用户失败:', error);
      message.error(t('userManagement.saveFailed'));
    }
  };

  const columns = [
    {
      title: t('userManagement.userInfo'),
      key: 'user',
      render: (record: BusinessUser) => (
        <Space>
          <UserOutlined />
          <div>
            <div className="user-name">{record.name}</div>
            <div className="user-email">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: t('userManagement.source'),
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => {
        const sourceConfig = {
          'local': { color: 'blue', text: '本地注册' },
          'oauth_google': { color: 'red', text: 'Google' },
          'oauth_github': { color: 'black', text: 'GitHub' },
          'oauth_wechat': { color: 'green', text: '微信' },
          'oauth_qq': { color: 'purple', text: 'QQ' },
        };
        const config = sourceConfig[source as keyof typeof sourceConfig] || { color: 'default', text: source };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('userManagement.status'),
      dataIndex: 'account_status',
      key: 'account_status',
      render: (status: string) => {
        const statusConfig = {
          'active': { color: 'green', text: '活跃' },
          'inactive': { color: 'orange', text: '未激活' },
          'suspended': { color: 'red', text: '已暂停' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('userManagement.verified'),
      dataIndex: 'email_verified',
      key: 'email_verified',
      render: (verified: boolean) => (
        <Tag color={verified ? 'green' : 'red'}>
          {verified ? '已验证' : '未验证'}
        </Tag>
      ),
    },
    {
      title: t('userManagement.lastLogin'),
      dataIndex: 'last_login_timestamp',
      key: 'last_login_timestamp',
      render: (timestamp: string) => timestamp ? new Date(timestamp).toLocaleString() : '从未登录',
    },
    {
      title: t('common.actions'),
      key: 'action',
      render: (_: any, record: BusinessUser) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
          >
            {t('common.edit')}
          </Button>
          <Button
            icon={<LinkOutlined />}
            size="small"
            onClick={() => handleSyncUser(record)}
          >
            同步
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  // 定义工具栏
  const toolbar: ToolbarItem[] = [
    {
      key: 'add-user',
      type: 'button',
      content: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
        >
          {t('userManagement.addUser')}
        </Button>
      ),
    },
  ];

  return (
    <>
      <ContentPageLayout
        mode="simple"
        toolbar={toolbar}
        helpCenterUrl="/help/user-management"
      >
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} className="user-stats-row">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总用户数"
                value={stats.total}
                prefix={<UserOutlined />}
                className="statistic-total"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="活跃用户"
                value={stats.active}
                prefix={<UserOutlined />}
                className="statistic-active"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="已验证用户"
                value={stats.verified}
                prefix={<UserOutlined />}
                className="statistic-verified"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="第三方用户"
                value={stats.oauth}
                prefix={<LinkOutlined />}
                className="statistic-oauth"
              />
            </Card>
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              t('common.paginationTotal', { start: range[0], end: range[1], total }),
          }}
        />
      </ContentPageLayout>

      <Modal
        title={editingUser ? t('userManagement.editUser') : t('userManagement.addUser')}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label={t('userManagement.email')}
            rules={[{ required: true, type: 'email', message: t('userManagement.emailRequired') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('userManagement.name')}
            rules={[{ required: true, message: t('userManagement.nameRequired') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label={t('userManagement.role')}
            rules={[{ required: true, message: t('userManagement.roleRequired') }]}
          >
            <Select>
              <Option value="user">{t('userManagement.user')}</Option>
              <Option value="admin">{t('userManagement.admin')}</Option>
              <Option value="super_admin">{t('userManagement.superAdmin')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="account_status"
            label={t('userManagement.status')}
            rules={[{ required: true, message: t('userManagement.statusRequired') }]}
          >
            <Select>
              <Option value="active">{t('userManagement.active')}</Option>
              <Option value="inactive">{t('userManagement.inactive')}</Option>
              <Option value="suspended">{t('userManagement.suspended')}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagementPage;
