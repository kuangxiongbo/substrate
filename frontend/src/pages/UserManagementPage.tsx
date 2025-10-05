/**
 * 用户管理页面 - 使用统一布局组件
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useTheme } from '../contexts/ThemeContext';
import ContentPageLayout, { type ToolbarItem } from '../components/layout/ContentPageLayout';


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
      message.error('加载用户失败');
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
        message.success('用户删除成功');
        loadUsers();
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败');
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
        message.success(editingUser ? '用户更新成功' : '用户创建成功');
        setModalVisible(false);
        loadUsers();
      }
    } catch (error) {
      console.error('保存用户失败:', error);
      message.error('保存用户失败');
    }
  };

  const columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'account_status',
      key: 'account_status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            删除
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
          添加用户
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
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </ContentPageLayout>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Option value="user">用户</Option>
              <Option value="admin">管理员</Option>
              <Option value="super_admin">超级管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="account_status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="active">激活</Option>
              <Option value="inactive">未激活</Option>
              <Option value="suspended">已暂停</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagementPage;
