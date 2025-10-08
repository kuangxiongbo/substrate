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
  Row,
  Col,
  Checkbox,
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
import './RoleManagementPage.css';

const { Text, Title } = Typography;
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
  const [tableData, setTableData] = useState<any[]>([]);
  const { currentTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  useEffect(() => {
    // 初始化表格数据
    setTableData(getPermissionTableData());
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

  // 将权限按细化结构重新分组
  const groupedPermissions = permissions.reduce((acc, permission) => {
    let groupKey = 'other';
    
    // 概览权限
    if (permission.name.startsWith('page.overview')) {
      groupKey = 'overview';
    }
    // 用户管理权限
    else if (permission.name.startsWith('page.users') ||
             permission.name.includes('user.') ||
             permission.name.includes('admin')) {
      groupKey = 'user_management';
    }
    // 系统设置权限 - 需要细化到子菜单
    else if (permission.name.startsWith('page.settings.') || 
             permission.name.includes('settings') ||
             permission.name.includes('role') ||
             permission.name.includes('security') ||
             permission.name.includes('email') ||
             permission.name.includes('basic')) {
      groupKey = 'system_settings';
    }
    // 快捷操作权限
    else if (permission.name.includes('language') ||
             permission.name.includes('theme') ||
             permission.name.includes('log') ||
             permission.name.includes('notification') ||
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
    'overview': '概览',
    'user_management': '用户管理',
    'system_settings': '系统设置',
    'quick_actions': '快捷操作',
    'other': '其他权限'
  };

  // 系统设置子菜单权限分组
  const getSystemSettingsSubGroups = (permissions: Permission[]) => {
    const subGroups: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      let subGroupKey = 'general';
      
      // 基础设置
      if (permission.name.includes('basic') || permission.name.includes('config')) {
        subGroupKey = 'basic_settings';
      }
      // 管理员管理
      else if (permission.name.includes('admin') || permission.name.includes('user')) {
        subGroupKey = 'admin_management';
      }
      // 角色管理
      else if (permission.name.includes('role')) {
        subGroupKey = 'role_management';
      }
      // 安全设置
      else if (permission.name.includes('security')) {
        subGroupKey = 'security_settings';
      }
      // 邮件设置
      else if (permission.name.includes('email')) {
        subGroupKey = 'email_settings';
      }
      
      if (!subGroups[subGroupKey]) {
        subGroups[subGroupKey] = [];
      }
      subGroups[subGroupKey].push(permission);
    });
    
    return subGroups;
  };

  // 子分组名称映射
  const getSubGroupName = (subGroupKey: string): string => {
    const subGroupNames: Record<string, string> = {
      'basic_settings': '基础设置',
      'admin_management': '管理员管理',
      'role_management': '角色管理',
      'security_settings': '安全设置',
      'email_settings': '邮件设置',
      'general': '通用权限'
    };
    
    return subGroupNames[subGroupKey] || subGroupKey;
  };

  // 获取默认勾选的权限（快捷操作默认全部勾选）
  const getDefaultCheckedKeys = () => {
    const quickActionPermissions = groupedPermissions['quick_actions'] || [];
    return quickActionPermissions.map(permission => permission.name);
  };


  // 获取权限表格列配置
  const getPermissionTableColumns = () => {
    return [
      {
        title: '菜单',
        dataIndex: 'menu',
        key: 'menu',
        width: '40%',
      },
      {
        title: (
          <div className="header-checkbox">
            <Checkbox
              indeterminate={getViewIndeterminate()}
              checked={getViewAllChecked()}
              onChange={(e) => handleViewAllChange(e.target.checked)}
            />
            <span className="header-text">查看</span>
          </div>
        ),
        dataIndex: 'view',
        key: 'view',
        width: '30%',
        render: (text: boolean, record: any) => (
          <div className="checkbox-cell">
            <Checkbox
              checked={text}
              onChange={(e) => handlePermissionChange(record, 'view', e.target.checked)}
            />
          </div>
        ),
      },
      {
        title: (
          <div className="header-checkbox">
            <Checkbox
              indeterminate={getManageIndeterminate()}
              checked={getManageAllChecked()}
              onChange={(e) => handleManageAllChange(e.target.checked)}
            />
            <span className="header-text">管理</span>
          </div>
        ),
        dataIndex: 'manage',
        key: 'manage',
        width: '30%',
        render: (text: boolean, record: any) => (
          <div className="checkbox-cell">
            <Checkbox
              checked={text}
              onChange={(e) => handlePermissionChange(record, 'manage', e.target.checked)}
            />
          </div>
        ),
      },
    ];
  };


  // 获取所有菜单项（包括子项）
  const getAllMenuItems = (items: any[]): any[] => {
    const allItems: any[] = [];
    items.forEach(item => {
      allItems.push(item);
      if (item.children && item.children.length > 0) {
        allItems.push(...getAllMenuItems(item.children));
      }
    });
    return allItems;
  };

  // 获取查看权限的全选状态
  const getViewAllChecked = () => {
    const allItems = getAllMenuItems(tableData);
    return allItems.length > 0 && allItems.every(item => item.view);
  };

  // 获取查看权限的半选状态
  const getViewIndeterminate = () => {
    const allItems = getAllMenuItems(tableData);
    const checkedCount = allItems.filter(item => item.view).length;
    return checkedCount > 0 && checkedCount < allItems.length;
  };

  // 获取管理权限的全选状态
  const getManageAllChecked = () => {
    const allItems = getAllMenuItems(tableData);
    return allItems.length > 0 && allItems.every(item => item.manage);
  };

  // 获取管理权限的半选状态
  const getManageIndeterminate = () => {
    const allItems = getAllMenuItems(tableData);
    const checkedCount = allItems.filter(item => item.manage).length;
    return checkedCount > 0 && checkedCount < allItems.length;
  };

  // 处理查看权限全选
  const handleViewAllChange = (checked: boolean) => {
    const allItems = getAllMenuItems(tableData);
    allItems.forEach(item => {
      item.view = checked;
    });
    
    // 更新表格数据状态
    setTableData([...tableData]);
    
    // 更新权限
    updatePermissions();
  };

  // 处理管理权限全选
  const handleManageAllChange = (checked: boolean) => {
    const allItems = getAllMenuItems(tableData);
    allItems.forEach(item => {
      item.manage = checked;
    });
    
    // 更新表格数据状态
    setTableData([...tableData]);
    
    // 更新权限
    updatePermissions();
  };

  // 更新权限到表单
  const updatePermissions = () => {
    const selectedPermissions: string[] = [];
    
    // 递归遍历树状结构收集权限
    const collectPermissions = (items: any[]) => {
      items.forEach(item => {
        if (item.view) {
          selectedPermissions.push(`${item.key}.read`);
        }
        if (item.manage) {
          selectedPermissions.push(`${item.key}.manage`);
          selectedPermissions.push(`${item.key}.create`);
          selectedPermissions.push(`${item.key}.update`);
          selectedPermissions.push(`${item.key}.delete`);
        }
        // 递归处理子项
        if (item.children && item.children.length > 0) {
          collectPermissions(item.children);
        }
      });
    };
    
    collectPermissions(tableData);
    
    // 更新表单值
    form.setFieldsValue({ permissions: selectedPermissions });
  };

  // 处理权限变更
  const handlePermissionChange = (record: any, permissionType: 'view' | 'manage', checked: boolean) => {
    // 更新记录状态
    record[permissionType] = checked;
    
    // 更新表格数据状态
    setTableData([...tableData]);
    
    // 更新权限
    updatePermissions();
  };


  // 生成权限表格数据（树状结构）
  const getPermissionTableData = () => {
    return [
      {
        key: 'overview',
        menu: '概览',
        view: false,
        manage: false,
        children: []
      },
      {
        key: 'users',
        menu: '用户管理',
        view: false,
        manage: false,
        children: []
      },
      {
        key: 'settings',
        menu: '系统设置',
        view: false,
        manage: false,
        children: [
          {
            key: 'basic_settings',
            menu: '基础设置',
            view: false,
            manage: false,
            children: []
          },
          {
            key: 'admin_management',
            menu: '管理员管理',
            view: false,
            manage: false,
            children: []
          },
          {
            key: 'role_management',
            menu: '角色管理',
            view: false,
            manage: false,
            children: []
          },
          {
            key: 'security_settings',
            menu: '安全设置',
            view: false,
            manage: false,
            children: []
          },
          {
            key: 'email_settings',
            menu: '邮件设置',
            view: false,
            manage: false,
            children: []
          }
        ]
      }
    ];
  };

  // 根据菜单键名获取对应的权限
  const getPermissionsForMenu = (menuKey: string): Permission[] => {
    const allPermissions = permissions;
    
    switch (menuKey) {
      case 'overview':
        return allPermissions.filter(p => 
          p.name.startsWith('page.overview') || 
          p.name.includes('stats') ||
          p.name.includes('dashboard') ||
          p.name.includes('profile.read') ||
          p.name.includes('profile.update')
        );
      
      case 'admin_management':
        return allPermissions.filter(p => 
          p.name.includes('admin') || 
          p.name.includes('user.manage') ||
          p.name.includes('user.create') ||
          p.name.includes('user.read') ||
          p.name.includes('user.update') ||
          p.name.includes('user.delete')
        );
      
      case 'business_users':
        return allPermissions.filter(p => 
          p.name.includes('business') ||
          p.name.includes('user.read')
        );
      
      case 'basic_settings':
        return allPermissions.filter(p => 
          p.name.includes('basic') || 
          p.name.includes('config') ||
          p.name.startsWith('system.config')
        );
      
      case 'security_settings':
        return allPermissions.filter(p => 
          p.name.includes('security') ||
          p.name.includes('password') ||
          p.name.includes('login')
        );
      
      case 'email_settings':
        return allPermissions.filter(p => 
          p.name.includes('email')
        );
      
      case 'role_management':
        return allPermissions.filter(p => 
          p.name.includes('role') ||
          p.name.includes('permission')
        );
      
      case 'language_switch':
        return allPermissions.filter(p => 
          p.name.includes('language') ||
          p.name.includes('i18n')
        );
      
      case 'theme_switch':
        return allPermissions.filter(p => 
          p.name.includes('theme') ||
          p.name.includes('ui')
        );
      
      case 'operation_logs':
        return allPermissions.filter(p => 
          p.name.includes('log') ||
          p.name.includes('operation')
        );
      
      case 'notifications':
        return allPermissions.filter(p => 
          p.name.includes('notification') ||
          p.name.includes('message')
        );
      
      default:
        return [];
    }
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
              <div className="permission-table-container">
                <Table
                  dataSource={tableData}
                  columns={getPermissionTableColumns()}
                  pagination={false}
                  size="small"
                  className="permission-table"
                  rowKey="key"
                  defaultExpandAllRows={false}
                  expandable={{
                    defaultExpandAllRows: false,
                    defaultExpandedRowKeys: [],
                    expandRowByClick: false,
                  }}
                />
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
};

export default RoleManagementPage;
