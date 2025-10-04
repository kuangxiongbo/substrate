/**
 * 系统配置管理页面 - 专业UI设计师设计
 * 基于Ant Design的系统配置界面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  InputNumber,
  Typography,
  Space,
  Row,
  Col,
  Tabs,
  message,
  Divider,
  Tag,
  Tooltip,
  Modal,
  Alert,
} from 'antd';
import {
  SettingOutlined,
  SecurityScanOutlined,
  MailOutlined,
  GlobalOutlined,
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../styles/settings-pages.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface ConfigItem {
  key: string;
  value: string;
  value_type: string;
  category: string;
  description: string;
  is_encrypted: boolean;
  is_public: boolean;
}

const SystemConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [activeTab, setActiveTab] = useState('security');

  // 模拟配置数据
  const mockConfigs: ConfigItem[] = [
    // 安全配置
    {
      key: 'password.min_length',
      value: '8',
      value_type: 'int',
      category: 'security',
      description: '密码最小长度',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'password.require_uppercase',
      value: 'true',
      value_type: 'bool',
      category: 'security',
      description: '密码需要大写字母',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'password.require_lowercase',
      value: 'true',
      value_type: 'bool',
      category: 'security',
      description: '密码需要小写字母',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'password.require_digit',
      value: 'true',
      value_type: 'bool',
      category: 'security',
      description: '密码需要数字',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'password.require_special',
      value: 'false',
      value_type: 'bool',
      category: 'security',
      description: '密码需要特殊字符',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'login.max_attempts',
      value: '5',
      value_type: 'int',
      category: 'security',
      description: '最大登录尝试次数',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'login.lockout_duration',
      value: '30',
      value_type: 'int',
      category: 'security',
      description: '账户锁定时间(分钟)',
      is_encrypted: false,
      is_public: false,
    },
    
    // 邮箱配置
    {
      key: 'email.smtp_host',
      value: 'localhost',
      value_type: 'string',
      category: 'email',
      description: 'SMTP服务器地址',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'email.smtp_port',
      value: '1025',
      value_type: 'int',
      category: 'email',
      description: 'SMTP服务器端口',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'email.smtp_username',
      value: '',
      value_type: 'string',
      category: 'email',
      description: 'SMTP用户名',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'email.smtp_password',
      value: '',
      value_type: 'string',
      category: 'email',
      description: 'SMTP密码',
      is_encrypted: true,
      is_public: false,
    },
    {
      key: 'email.from_address',
      value: 'noreply@example.com',
      value_type: 'string',
      category: 'email',
      description: '发件人邮箱',
      is_encrypted: false,
      is_public: false,
    },
    {
      key: 'email.from_name',
      value: '系统通知',
      value_type: 'string',
      category: 'email',
      description: '发件人名称',
      is_encrypted: false,
      is_public: false,
    },
    
    // 系统配置
    {
      key: 'system.name',
      value: '多用户管理系统',
      value_type: 'string',
      category: 'system',
      description: '系统名称',
      is_encrypted: false,
      is_public: true,
    },
    {
      key: 'system.version',
      value: '1.0.0',
      value_type: 'string',
      category: 'system',
      description: '系统版本',
      is_encrypted: false,
      is_public: true,
    },
    {
      key: 'system.maintenance_mode',
      value: 'false',
      value_type: 'bool',
      category: 'system',
      description: '维护模式',
      is_encrypted: false,
      is_public: false,
    },
    
    // UI配置
    {
      key: 'ui.theme',
      value: 'light',
      value_type: 'string',
      category: 'ui',
      description: '默认主题',
      is_encrypted: false,
      is_public: true,
    },
    {
      key: 'ui.language',
      value: 'zh-CN',
      value_type: 'string',
      category: 'ui',
      description: '默认语言',
      is_encrypted: false,
      is_public: true,
    },
  ];

  useEffect(() => {
    setConfigs(mockConfigs);
    // 初始化表单值
    const formValues: any = {};
    mockConfigs.forEach(config => {
      if (config.value_type === 'bool') {
        formValues[config.key] = config.value === 'true';
      } else if (config.value_type === 'int') {
        formValues[config.key] = parseInt(config.value);
      } else {
        formValues[config.key] = config.value;
      }
    });
    form.setFieldsValue(formValues);
  }, [form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新配置
      const updatedConfigs = configs.map(config => {
        const newValue = values[config.key];
        let stringValue = '';
        
        if (config.value_type === 'bool') {
          stringValue = newValue ? 'true' : 'false';
        } else if (config.value_type === 'int') {
          stringValue = newValue.toString();
        } else {
          stringValue = newValue;
        }
        
        return { ...config, value: stringValue };
      });
      
      setConfigs(updatedConfigs);
      message.success('配置保存成功！');
    } catch (error) {
      message.error('配置保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Modal.confirm({
      title: '确认重置',
      content: '确定要重置所有配置到默认值吗？此操作不可撤销。',
      onOk: () => {
        form.resetFields();
        message.success('配置已重置');
      },
    });
  };

  const getConfigsByCategory = (category: string) => {
    return configs.filter(config => config.category === category);
  };

  const renderConfigField = (config: ConfigItem) => {
    const { key, value_type, description, is_encrypted, is_public } = config;
    
    const label = (
      <Space>
        <span>{description}</span>
        {is_encrypted && (
          <Tooltip title="加密存储">
            <SecurityScanOutlined className="config-encrypted-icon" />
          </Tooltip>
        )}
        {is_public && (
          <Tooltip title="公开配置">
            <GlobalOutlined className="config-public-icon" />
          </Tooltip>
        )}
      </Space>
    );

    switch (value_type) {
      case 'bool':
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        );
      
      case 'int':
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            rules={[{ required: true, message: '请输入数值' }]}
          >
            <InputNumber
              className="config-input-full-width"
              min={0}
              placeholder="请输入数值"
            />
          </Form.Item>
        );
      
      case 'string':
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            rules={[{ required: true, message: '请输入值' }]}
          >
            {is_encrypted ? (
              <Input.Password placeholder="请输入密码" />
            ) : (
              <Input placeholder="请输入值" />
            )}
          </Form.Item>
        );
      
      default:
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
          >
            <Input placeholder="请输入值" />
          </Form.Item>
        );
    }
  };

  const renderConfigTab = (category: string, title: string, icon: React.ReactNode) => {
    const categoryConfigs = getConfigsByCategory(category);
    
    return (
      <TabPane
        tab={
          <Space>
            {icon}
            {title}
            <Tag color="blue">{categoryConfigs.length}</Tag>
          </Space>
        }
        key={category}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Row gutter={[24, 24]}>
            {categoryConfigs.map(config => (
              <Col xs={24} lg={12} key={config.key}>
                <Card
                  size="small"
                  className="config-card-spacing"
                  styles={{ body: { padding: '16px' } }}
                >
                  {renderConfigField(config)}
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>
      </TabPane>
    );
  };

  return (
    <div className="page-content">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Title level={2} className="config-page-title">
          系统配置
        </Title>
        <Text type="secondary">
          管理系统配置参数，包括安全设置、邮箱配置等。
        </Text>
      </motion.div>

      {/* 配置表单 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card
          title={
            <Space>
              <SettingOutlined />
              配置管理
            </Space>
          }
          extra={
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => form.submit()}
              >
                保存配置
              </Button>
            </Space>
          }
          className="config-main-card"
        >
          <Alert
            message="配置说明"
            description="修改配置后需要保存才能生效。加密配置会以安全方式存储，公开配置对普通用户可见。"
            type="info"
            showIcon
            className="config-alert"
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            size="large"
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              size="large"
            >
              {renderConfigTab('security', '安全设置', <SecurityScanOutlined />)}
              {renderConfigTab('email', '邮箱配置', <MailOutlined />)}
              {renderConfigTab('system', '系统设置', <SettingOutlined />)}
              {renderConfigTab('ui', '界面配置', <GlobalOutlined />)}
            </Tabs>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemConfigPage;










