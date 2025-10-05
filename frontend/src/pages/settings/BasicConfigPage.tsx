/**
 * 基础配置页面 - 系统标题、Logo、主题配置
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Switch,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Space,
  message,
  Avatar,
  Divider,
} from 'antd';
import {
  UploadOutlined,
  SettingOutlined,
  PictureOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  value_type: string;
  category: string;
  description?: string;
  is_encrypted: boolean;
  is_public: boolean;
  created_at: string;
  updated_at?: string;
}

const BasicConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [currentLogo, setCurrentLogo] = useState<string>('/assets/logo.png');
  const [currentFavicon, setCurrentFavicon] = useState<string>('/assets/favicon.ico');
  const { currentTheme } = useTheme();

  useEffect(() => {
    loadConfigs();
    loadGlobalSettings();
  }, []);

  // 加载全局设置
  const loadGlobalSettings = () => {
    try {
      // 从localStorage加载已保存的全局设置
      const systemTitle = localStorage.getItem('systemTitle');
      const language = localStorage.getItem('systemLanguage');
      const dateFormat = localStorage.getItem('dateFormat');
      const timezone = localStorage.getItem('systemTimezone');
      const systemLogo = localStorage.getItem('systemLogo');
      const systemFavicon = localStorage.getItem('systemFavicon');

      // 设置默认值
      const defaultValues: any = {};
      if (systemTitle) defaultValues.systemTitle = systemTitle;
      if (language) defaultValues.language = language;
      if (dateFormat) defaultValues.dateFormat = dateFormat;
      if (timezone) defaultValues.timezone = timezone;
      if (systemLogo) defaultValues.logo = systemLogo;
      if (systemFavicon) defaultValues.favicon = systemFavicon;

      // 更新当前Logo和Favicon状态
      if (systemLogo) setCurrentLogo(systemLogo);
      if (systemFavicon) setCurrentFavicon(systemFavicon);

      // 设置表单默认值
      if (Object.keys(defaultValues).length > 0) {
        form.setFieldsValue(defaultValues);
      }
    } catch (error) {
      console.error('加载全局设置失败:', error);
    }
  };

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/configs?category=basic', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConfigs(data);
      
      // 初始化表单值
      const formValues: any = {};
      data.forEach((config: ConfigItem) => {
        if (config.value_type === 'bool') {
          formValues[config.key] = config.value === 'true';
        } else {
          formValues[config.key] = config.value;
        }
        
        // 更新当前Logo和Favicon状态
        if (config.key === 'logo') {
          setCurrentLogo(config.value);
        }
        if (config.key === 'favicon') {
          setCurrentFavicon(config.value);
        }
      });
      form.setFieldsValue(formValues);
    } catch (error) {
      console.error('加载基础配置失败:', error);
      message.error('加载基础配置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 批量更新配置
      const updatePromises = Object.entries(values).map(async ([key, value]) => {
        const config = configs.find(c => c.key === key);
        if (!config) return;

        let stringValue = '';
        if (config.value_type === 'bool') {
          stringValue = value ? 'true' : 'false';
        } else {
          stringValue = value as string;
        }

        const response = await fetch(`/api/v1/admin/configs/${key}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value: stringValue })
        });

        if (!response.ok) {
          throw new Error(`Failed to update config ${key}`);
        }

        return response.json();
      });

      await Promise.all(updatePromises);
      
      // 重新加载配置
      await loadConfigs();
      
      // 全局生效处理
      await applyGlobalSettings(values);
      
      message.success('基础配置保存成功！全局设置已生效');
    } catch (error) {
      console.error('基础配置保存失败:', error);
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 应用全局设置
  const applyGlobalSettings = async (values: any) => {
    try {
      // 更新页面标题
      if (values.systemTitle) {
        document.title = values.systemTitle;
        // 更新所有页面的标题
        localStorage.setItem('systemTitle', values.systemTitle);
        
        // 触发系统标题更改事件
        window.dispatchEvent(new CustomEvent('systemTitleChanged', { 
          detail: { systemTitle: values.systemTitle } 
        }));
      }

      // 更新语言设置
      if (values.language) {
        localStorage.setItem('systemLanguage', values.language);
        // 触发语言切换事件
        window.dispatchEvent(new CustomEvent('languageChanged', { 
          detail: { language: values.language } 
        }));
      }

      // 更新日期格式
      if (values.dateFormat) {
        localStorage.setItem('dateFormat', values.dateFormat);
        // 触发日期格式切换事件
        window.dispatchEvent(new CustomEvent('dateFormatChanged', { 
          detail: { format: values.dateFormat } 
        }));
      }

      // 更新时区
      if (values.timezone) {
        localStorage.setItem('systemTimezone', values.timezone);
        // 触发时区切换事件
        window.dispatchEvent(new CustomEvent('timezoneChanged', { 
          detail: { timezone: values.timezone } 
        }));
      }

      // 更新Logo和Favicon
      if (values.logo || values.favicon) {
        // 更新本地状态
        if (values.logo) {
          setCurrentLogo(values.logo);
          localStorage.setItem('systemLogo', values.logo);
        }
        if (values.favicon) {
          setCurrentFavicon(values.favicon);
          localStorage.setItem('systemFavicon', values.favicon);
        }
        
        // 触发Logo更新事件
        window.dispatchEvent(new CustomEvent('logoChanged', { 
          detail: { logo: values.logo, favicon: values.favicon } 
        }));
      }

    } catch (error) {
      console.error('应用全局设置失败:', error);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        // 更新Logo状态
        const response = info.file.response;
        if (response && response.url) {
          if (info.file.uid.toString().includes('logo')) {
            setCurrentLogo(response.url);
            form.setFieldValue('logo', response.url);
          } else if (info.file.uid.toString().includes('favicon')) {
            setCurrentFavicon(response.url);
            form.setFieldValue('favicon', response.url);
          }
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{}}
      >
        <Row gutter={[16, 16]}>
          {/* 系统基础配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  系统基础配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="systemTitle"
                label="系统名称"
                rules={[{ required: true, message: '请输入系统名称' }]}
                tooltip="系统名称将显示在页面标题和Logo旁"
              >
                <Input placeholder="请输入系统名称" />
              </Form.Item>

              {/* 当前系统信息显示 */}
              <div className="current-system-info">
                <div className="info-item">
                  <Text strong>当前系统名称：</Text>
                  <Text>{form.getFieldValue('systemTitle') || 'Spec-Kit'}</Text>
                </div>
                <div className="info-item">
                  <Text strong>当前Logo：</Text>
                  <Text type="secondary">{currentLogo}</Text>
                </div>
                <div className="info-item">
                  <Text strong>当前图标：</Text>
                  <Text type="secondary">{currentFavicon}</Text>
                </div>
              </div>

              <Form.Item
                name="logo"
                label="Logo"
                tooltip="系统Logo，建议尺寸 200x60 像素"
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>
                    点击上传Logo
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="favicon"
                label="图标 (Favicon)"
                tooltip="网站图标，建议尺寸 32x32 像素"
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>
                    点击上传Favicon
                  </Button>
                </Upload>
              </Form.Item>
            </Card>
          </Col>

          {/* 语言与格式配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  语言与格式配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="language"
                label="默认语言"
                rules={[{ required: true, message: '请选择默认语言' }]}
                tooltip="系统默认显示语言，全局生效"
              >
                <Select placeholder="请选择默认语言">
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="zh-TW">繁体中文</Option>
                  <Option value="en-US">English</Option>
                  <Option value="ja-JP">日本語</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dateFormat"
                label="默认日期格式"
                rules={[{ required: true, message: '请选择日期格式' }]}
                tooltip="全局日期显示格式，影响所有日期组件"
              >
                <Select placeholder="请选择日期格式">
                  <Option value="YYYY-MM-DD">2024-01-15</Option>
                  <Option value="MM/DD/YYYY">01/15/2024</Option>
                  <Option value="DD/MM/YYYY">15/01/2024</Option>
                  <Option value="YYYY年MM月DD日">2024年01月15日</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timezone"
                label="时区设置"
                tooltip="系统时区，影响时间显示和计算"
              >
                <Select placeholder="请选择时区">
                  <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                  <Option value="UTC">协调世界时 (UTC)</Option>
                  <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                  <Option value="Europe/London">英国时间 (UTC+0)</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* 保存按钮 */}
        <Row justify="center" className="settings-save-section">
          <Space>
            <Button size="large" onClick={() => form.resetFields()}>
              重置
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
            >
              保存配置
            </Button>
          </Space>
        </Row>
      </Form>
      </motion.div>
    </div>
  );
};

export default BasicConfigPage;















