/**
 * 用户管理页面 - 使用统一布局组件
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useTheme } from '../contexts/ThemeContext';
import ContentPageLayout, { type ToolbarItem } from '../components/layout/ContentPageLayout';
import { useTranslation } from 'react-i18next';


const { Option } = Select;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  email_verified: boolean;
  account_status: string;
  last_login_timestamp: string;
}

const UserManagementPage: React.FC = () => {
  // const { currentTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('加载用户失败:', error);
      message.error(t('userManagement.loadFailed'));
    } finally {
      setLoading(false);
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
      const response = await fetch(`/api/v1/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        message.success(t('userManagement.deleteSuccess'));
        loadUsers();
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error(t('userManagement.deleteFailed'));
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
      title: t('userManagement.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('userManagement.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('userManagement.role'),
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: t('userManagement.status'),
      dataIndex: 'account_status',
      key: 'account_status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
          >
            {t('common.edit')}
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
