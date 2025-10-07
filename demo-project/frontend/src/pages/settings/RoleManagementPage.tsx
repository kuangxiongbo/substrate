/**
 * 角色管理页面 - 管理系统角色和权限
 */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Card,
  Popconfirm,
  Select,
  Tree,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../../styles/settings-pages.css';

const { Text } = Typography;
const { TextArea } = Input;

interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  is_system_role: boolean;
  permissions: string[];
  created_at: string;
  updated_at?: string;
}

interface Permission {
  id: string;
  name: string;
  display_name: string;
  description: string;
  resource: string;
  action: string;
}

const RoleManagementPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { currentTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/roles', {
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
      setRoles(data);
    } catch (error) {
      console.error('加载角色列表失败:', error);
      message.error(t('roles.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/permissions', {
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
      setPermissions(data);
    } catch (error) {
      console.error('加载权限列表失败:', error);
    }
  };

  const columns = [
    {
      title: t('roles.roleName'),
      dataIndex: 'display_name',
      key: 'display_name',
      render: (text: string, record: Role) => (
        <Space>
          <SafetyOutlined />
          <div>
            <div className="role-name">{text}</div>
            <Text type="secondary" className="role-code">
              {record.name}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('roles.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('roles.type'),
      dataIndex: 'is_system_role',
      key: 'is_system_role',
      render: (isSystem: boolean) => (
        <Tag color={isSystem ? 'blue' : 'green'}>
          {isSystem ? t('roles.systemRole') : t('roles.customRole')}
        </Tag>
      ),
    },
    {
      title: t('roles.permissions'),
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Text>{permissions.length} {t('roles.permissionCount')}</Text>
      ),
    },
    {
      title: t('roles.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (timestamp: string) => new Date(timestamp).toLocaleString('zh-CN'),
    },
    {
      title: t('roles.actions'),
      key: 'action',
      render: (record: Role) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.is_system_role}
          >
            {t('roles.edit')}
          </Button>
          <Popconfirm
            title={t('roles.deleteConfirm')}
            description={t('roles.deleteConfirmMessage')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.ok')}
            cancelText={t('common.cancel')}
            disabled={record.is_system_role}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={record.is_system_role}
            >
              {t('roles.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      ...role,
      permissions: role.permissions,
    });
    setModalVisible(true);
  };

  const handleDelete = async (roleId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setRoles(roles.filter(r => r.id !== roleId));
      message.success(t('roles.deleteSuccess'));
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error(t('roles.deleteFailed'));
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingRole) {
        // 编辑角色
        const response = await fetch(`http://localhost:8000/api/v1/admin/roles/${editingRole.id}`, {
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

        const updatedRole = await response.json();
        setRoles(roles.map(role => 
          role.id === editingRole.id ? updatedRole : role
        ));
        message.success(t('roles.updateSuccess'));
      } else {
        // 新增角色
        const response = await fetch('http://localhost:8000/api/v1/admin/roles', {
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

        const newRole = await response.json();
        setRoles([...roles, newRole]);
        message.success(t('roles.addSuccess'));
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('操作失败:', error);
      message.error(editingRole ? t('roles.updateFailed') : t('roles.addFailed'));
    } finally {
      setLoading(false);
    }
  };

  // 将权限按资源分组
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 角色列表 */}
        <Card
          title={t('roles.roleList')}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              {t('roles.addRole')}
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => t('roles.totalRecords', { total }),
            }}
          />
        </Card>

        {/* 添加/编辑模态框 */}
        <Modal
          title={editingRole ? t('roles.editRole') : t('roles.addRole')}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          confirmLoading={loading}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              is_system_role: false,
              permissions: [],
            }}
          >
            <Form.Item
              name="name"
              label={t('roles.roleCode')}
              rules={[
                { required: true, message: t('roles.roleCodeRequired') },
                { pattern: /^[a-z_]+$/, message: t('roles.roleCodePattern') }
              ]}
            >
              <Input 
                placeholder={t('roles.roleCodePlaceholder')} 
                disabled={!!editingRole}
              />
            </Form.Item>

            <Form.Item
              name="display_name"
              label={t('roles.roleDisplayName')}
              rules={[{ required: true, message: t('roles.roleDisplayNameRequired') }]}
            >
              <Input placeholder={t('roles.roleDisplayNamePlaceholder')} />
            </Form.Item>

            <Form.Item
              name="description"
              label={t('roles.roleDescription')}
            >
              <TextArea 
                rows={3} 
                placeholder={t('roles.roleDescriptionPlaceholder')} 
              />
            </Form.Item>

            <Form.Item
              name="permissions"
              label={t('roles.rolePermissions')}
            >
              <Select
                mode="multiple"
                placeholder={t('roles.rolePermissionsPlaceholder')}
                options={permissions.map(p => ({
                  label: `${p.display_name} (${p.name})`,
                  value: p.name,
                }))}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
};

export default RoleManagementPage;
