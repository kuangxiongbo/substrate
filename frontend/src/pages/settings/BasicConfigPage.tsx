/**
 * 基础配置页面 - 系统标题、Logo、主题配置
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Space,
  message,
} from 'antd';
import {
  UploadOutlined,
  SettingOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { validateImageFile, validateImageDimensions } from '../../utils/imageProcessor';
import ImageCropper from '../../components/ImageCropper';
import '../../styles/settings-pages.css';

const { Text } = Typography;
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
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    loadConfigs();
    loadGlobalSettings();
  }, []);

  // 加载全局设置
  const loadGlobalSettings = async () => {
    try {
      // 先从后端数据库加载
      let backendConfigs = {};
      try {
        const response = await fetch('/api/v1/admin/configs?category=basic', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const configs = await response.json();
          backendConfigs = configs.reduce((acc: any, config: any) => {
            acc[config.key] = config.value;
            return acc;
          }, {});
          console.log('从数据库加载配置:', backendConfigs);
        }
      } catch (error) {
        console.warn('从数据库加载配置失败:', error);
      }

      // 从localStorage加载已保存的全局设置（作为备用）
      const systemTitle = backendConfigs.systemTitle || localStorage.getItem('systemTitle');
      const language = backendConfigs.systemLanguage || localStorage.getItem('systemLanguage');
      const dateFormat = backendConfigs.dateFormat || localStorage.getItem('dateFormat');
      const timezone = backendConfigs.systemTimezone || localStorage.getItem('systemTimezone');
      const systemLogo = backendConfigs.logo || localStorage.getItem('systemLogo');
      // 设置默认值
      const defaultValues: any = {};
      if (systemTitle) defaultValues.systemTitle = systemTitle;
      if (language) defaultValues.language = language;
      if (dateFormat) defaultValues.dateFormat = dateFormat;
      if (timezone) defaultValues.timezone = timezone;
      if (systemLogo) defaultValues.logo = systemLogo;

      // 更新当前Logo状态
      if (systemLogo) setCurrentLogo(systemLogo);

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
        
        // 更新当前Logo状态
        if (config.key === 'logo') {
          setCurrentLogo(config.value);
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
      // 保存到后端数据库
      const configData = {
        category: 'basic',
        configs: {
          systemTitle: values.systemTitle,
          systemLogo: values.logo,
          systemLanguage: values.language,
          dateFormat: values.dateFormat,
          systemTimezone: values.timezone
        }
      };
      
      try {
        const response = await fetch('/api/v1/admin/configs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(configData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('系统配置已保存到数据库:', result);
        } else {
          console.warn('保存到数据库失败，使用localStorage存储');
        }
      } catch (error) {
        console.warn('后端保存失败，使用localStorage存储:', error);
      }

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

      // 更新Logo
      if (values.logo) {
        // 更新本地状态
        setCurrentLogo(values.logo);
        localStorage.setItem('systemLogo', values.logo);
        
        // 触发Logo更新事件
        window.dispatchEvent(new CustomEvent('logoChanged', { 
          detail: { logo: values.logo } 
        }));
      }

    } catch (error) {
      console.error('应用全局设置失败:', error);
    }
  };

  // 处理Logo上传 - 256×256规格处理
  const handleLogoUpload = async (file: File) => {
    try {
      // 验证文件
      const validation = validateImageFile(file);
      if (!validation.valid) {
        message.error(validation.message);
        return false;
      }

      // 检查图片尺寸
      const dimensionValidation = await validateImageDimensions(file);
      if (!dimensionValidation.valid) {
        message.warning(dimensionValidation.message || '图片尺寸不符合要求');
      }

      // 设置上传文件并打开裁剪器
      setUploadedFile(file);
      setCropperVisible(true);
      
      return false; // 阻止默认上传，等待用户裁剪
    } catch (error) {
      console.error('Logo上传失败:', error);
      message.error('Logo上传失败');
      return false;
    }
  };

  // 处理裁剪确认
  const handleCropConfirm = async (croppedImage: string) => {
    try {
      // 更新状态
      setCurrentLogo(croppedImage);
      form.setFieldValue('logo', croppedImage);
      
      // 保存到数据库
      try {
        const configData = {
          category: 'basic',
          configs: {
            systemLogo: croppedImage
          }
        };
        
        const response = await fetch('/api/v1/admin/configs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(configData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Logo已保存到数据库:', result);
        } else {
          console.warn('Logo保存到数据库失败，使用localStorage存储');
        }
      } catch (error) {
        console.warn('Logo后端保存失败，使用localStorage存储:', error);
      }
      
      // 保存到localStorage（作为备用）
      localStorage.setItem('systemLogo', croppedImage);
      
      // 触发Logo更新事件
      window.dispatchEvent(new CustomEvent('logoChanged', { 
        detail: { logo: croppedImage } 
      }));

      message.success('Logo裁剪并上传成功');
      setCropperVisible(false);
      setUploadedFile(null);
    } catch (error) {
      console.error('Logo保存失败:', error);
      message.error('Logo保存失败');
    }
  };

  // 处理裁剪取消
  const handleCropCancel = () => {
    setCropperVisible(false);
    setUploadedFile(null);
  };


  // Logo上传配置
  const logoUploadProps = {
    name: 'logo',
    accept: 'image/*',
    fileList: [],
    showUploadList: false,
    beforeUpload: (file: File) => {
      handleLogoUpload(file);
      return false; // 阻止默认上传
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


            {/* Logo预览区 */}
            <div className="logo-preview-section">
              <Text strong>Logo预览：</Text>
              
              {/* Logo预览 */}
              <div className="logo-preview-item">
                <Text>256×256 像素 (统一规格)</Text>
                <div className="logo-preview-container xlarge">
                  {currentLogo && currentLogo.length > 0 ? (
                    <img 
                      src={currentLogo} 
                      alt="Logo" 
                      className="logo-preview-image xlarge"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`logo-preview-placeholder ${currentLogo && currentLogo.length > 0 ? 'hidden' : 'visible'}`}
                  >
                    <PictureOutlined />
                  </div>
                </div>
              </div>
            </div>

              <Form.Item
                name="logo"
                label="Logo 256×256"
                tooltip="系统Logo，支持在线裁剪编辑器，建议上传256×256像素以上的图片"
              >
                <Upload {...logoUploadProps}>
                  <Button icon={<UploadOutlined />}>
                    上传Logo (建议256×256以上)
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
      
      {/* 图片裁剪器 */}
      <ImageCropper
        visible={cropperVisible}
        imageFile={uploadedFile}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />
    </div>
  );
};

export default BasicConfigPage;
























