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

  // 将权限按UI结构重新分组
  const groupedPermissions = permissions.reduce((acc, permission) => {
    let groupKey = 'other';
    
    // 系统设置相关权限
    if (permission.name.startsWith('page.settings.') || 
        permission.name.includes('settings') ||
        permission.name.includes('admin') ||
        permission.name.includes('role')) {
      groupKey = 'system_settings';
    }
    // 菜单权限
    else if (permission.name.startsWith('page.overview') ||
             permission.name.startsWith('page.users') ||
             permission.name.startsWith('page.monitoring') ||
             permission.name.startsWith('page.backup') ||
             permission.name.startsWith('page.logs') ||
             permission.name.startsWith('page.files') ||
             permission.name.startsWith('page.notifications') ||
             permission.name.startsWith('page.profile')) {
      groupKey = 'menu_permissions';
    }
    // 快捷操作权限
    else if (permission.name.includes('user.') ||
             permission.name.includes('system.') ||
             permission.name.includes('quick')) {
      groupKey = 'quick_actions';
    }
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // 权限分组的中文名称映射
  const pageGroupNames: Record<string, string> = {
    'system_settings': '系统设置',
    'menu_permissions': '菜单权限',
    'quick_actions': '快捷操作权限',
    'other': '其他权限'
  };

  // 子分组名称映射
  const getSubGroupName = (subGroupKey: string): string => {
    const subGroupNames: Record<string, string> = {
      // 系统设置子分组
      'admin_management': '管理员管理',
      'role_management': '角色管理',
      'basic_settings': '基础设置',
      'security_settings': '安全设置',
      'email_settings': '邮件设置',
      
      // 菜单权限子分组
      'overview': '概览页面',
      'user_management': '用户管理',
      'system_monitoring': '系统监控',
      'data_backup': '数据备份',
      'system_logs': '系统日志',
      'file_management': '文件管理',
      'notification_center': '通知中心',
      'personal_profile': '个人资料',
      
      // 快捷操作子分组
      'user_operations': '用户操作',
      'system_operations': '系统操作',
      
      // 默认
      'general': '通用权限'
    };
    
    return subGroupNames[subGroupKey] || subGroupKey;
  };

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
              <Tree
                checkable
                checkStrictly
                defaultExpandAll
                treeData={Object.entries(groupedPermissions).map(([groupKey, groupPermissions]) => {
                  // 为每个分组创建子分类
                  const subGroups: Record<string, Permission[]> = {};
                  
                  groupPermissions.forEach(permission => {
                    let subGroupKey = 'general';
                    
                    if (groupKey === 'system_settings') {
                      if (permission.name.includes('admin')) subGroupKey = 'admin_management';
                      else if (permission.name.includes('role')) subGroupKey = 'role_management';
                      else if (permission.name.includes('basic')) subGroupKey = 'basic_settings';
                      else if (permission.name.includes('security')) subGroupKey = 'security_settings';
                      else if (permission.name.includes('email')) subGroupKey = 'email_settings';
                    } else if (groupKey === 'menu_permissions') {
                      if (permission.name.includes('overview')) subGroupKey = 'overview';
                      else if (permission.name.includes('users')) subGroupKey = 'user_management';
                      else if (permission.name.includes('monitoring')) subGroupKey = 'system_monitoring';
                      else if (permission.name.includes('backup')) subGroupKey = 'data_backup';
                      else if (permission.name.includes('logs')) subGroupKey = 'system_logs';
                      else if (permission.name.includes('files')) subGroupKey = 'file_management';
                      else if (permission.name.includes('notifications')) subGroupKey = 'notification_center';
                      else if (permission.name.includes('profile')) subGroupKey = 'personal_profile';
                    } else if (groupKey === 'quick_actions') {
                      if (permission.name.includes('user.')) subGroupKey = 'user_operations';
                      else if (permission.name.includes('system.')) subGroupKey = 'system_operations';
                    }
                    
                    if (!subGroups[subGroupKey]) {
                      subGroups[subGroupKey] = [];
                    }
                    subGroups[subGroupKey].push(permission);
                  });
                  
                  return {
                    title: pageGroupNames[groupKey] || groupKey,
                    key: groupKey,
                    children: Object.entries(subGroups).map(([subGroupKey, subPermissions]) => ({
                      title: getSubGroupName(subGroupKey),
                      key: `${groupKey}_${subGroupKey}`,
                      children: subPermissions.map(permission => ({
                        title: permission.display_name,
                        key: permission.name,
                        value: permission.name,
                      }))
                    }))
                  };
                })}
                onCheck={(checkedKeys) => {
                  // 处理树形选择的权限
                  const selectedPermissions = Array.isArray(checkedKeys) 
                    ? checkedKeys.filter(key => typeof key === 'string' && key.includes('.'))
                    : [];
                  form.setFieldsValue({ permissions: selectedPermissions });
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
};

export default RoleManagementPage;
