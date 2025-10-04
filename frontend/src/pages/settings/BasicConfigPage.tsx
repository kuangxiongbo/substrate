/**
 * 基础配置页面 - 系统标题、Logo、主题配置
 */
import React, { useState } from 'react';
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
import '../../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Option } = Select;

const BasicConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('基础配置保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
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
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title level={3} className="settings-page-title">
        <SettingOutlined className="settings-page-title-icon" />
        基础配置
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          systemTitle: '管理系统',
          systemDescription: '现代化管理系统',
          theme: 'light',
          language: 'zh-CN',
          enableDarkMode: false,
        }}
      >
        <Row gutter={[24, 24]}>
          {/* 系统信息配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  系统信息
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="systemTitle"
                label="系统标题"
                rules={[{ required: true, message: '请输入系统标题' }]}
              >
                <Input placeholder="请输入系统标题" />
              </Form.Item>

              <Form.Item
                name="systemDescription"
                label="系统描述"
                rules={[{ required: true, message: '请输入系统描述' }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="请输入系统描述"
                />
              </Form.Item>

              <Form.Item
                name="systemVersion"
                label="系统版本"
              >
                <Input placeholder="请输入系统版本" />
              </Form.Item>

              <Form.Item
                name="copyright"
                label="版权信息"
              >
                <Input placeholder="请输入版权信息" />
              </Form.Item>
            </Card>
          </Col>

          {/* Logo配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <PictureOutlined />
                  Logo配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item label="当前Logo">
                <Space direction="vertical" align="center" className="settings-status-container">
                  <Avatar
                    size={80}
                    icon={<SettingOutlined />}
                    className="settings-avatar-primary"
                  />
                  <Text type="secondary">当前系统Logo</Text>
                </Space>
              </Form.Item>

              <Divider />

              <Form.Item
                name="logo"
                label="上传新Logo"
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>
                    点击上传Logo
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="favicon"
                label="网站图标 (Favicon)"
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>
                    点击上传Favicon
                  </Button>
                </Upload>
              </Form.Item>
            </Card>
          </Col>

          {/* 主题配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <BgColorsOutlined />
                  主题配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="theme"
                label="默认主题"
                rules={[{ required: true, message: '请选择默认主题' }]}
              >
                <Select placeholder="请选择默认主题">
                  <Option value="light">浅色主题</Option>
                  <Option value="dark">深色主题</Option>
                  <Option value="auto">跟随系统</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="primaryColor"
                label="主色调"
              >
                <Select placeholder="请选择主色调">
                  <Option value="#1890ff">蓝色</Option>
                  <Option value="#52c41a">绿色</Option>
                  <Option value="#faad14">橙色</Option>
                  <Option value="#f5222d">红色</Option>
                  <Option value="#722ed1">紫色</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="enableDarkMode"
                label="启用深色模式"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableAnimation"
                label="启用动画效果"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          {/* 语言配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  语言配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="language"
                label="默认语言"
                rules={[{ required: true, message: '请选择默认语言' }]}
              >
                <Select placeholder="请选择默认语言">
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="zh-TW">繁体中文</Option>
                  <Option value="en-US">English</Option>
                  <Option value="ja-JP">日本語</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timezone"
                label="时区设置"
              >
                <Select placeholder="请选择时区">
                  <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                  <Option value="UTC">协调世界时 (UTC)</Option>
                  <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                  <Option value="Europe/London">英国时间 (UTC+0)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dateFormat"
                label="日期格式"
              >
                <Select placeholder="请选择日期格式">
                  <Option value="YYYY-MM-DD">2024-01-15</Option>
                  <Option value="MM/DD/YYYY">01/15/2024</Option>
                  <Option value="DD/MM/YYYY">15/01/2024</Option>
                  <Option value="YYYY年MM月DD日">2024年01月15日</Option>
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
  );
};

export default BasicConfigPage;








