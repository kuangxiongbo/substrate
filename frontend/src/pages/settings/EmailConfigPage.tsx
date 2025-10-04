/**
 * 邮箱配置页面 - 邮件服务设置
 */
import React, { useState } from 'react';
import {
  Form,
  Input,
  Switch,
  Select,
  InputNumber,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  message,
  Divider,
  Alert,
  Tag,
  Steps,
} from 'antd';
import {
  MailOutlined,
  SendOutlined,
  SettingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const EmailConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('邮箱配置保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestLoading(true);
    try {
      // 模拟发送测试邮件
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('测试邮件发送成功！请检查邮箱');
    } catch (error) {
      message.error('测试邮件发送失败');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title level={3} className="settings-page-title">
        <MailOutlined className="settings-page-title-icon" />
        邮箱配置
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpSecure: false,
          smtpUser: '',
          smtpPassword: '',
          fromEmail: '',
          fromName: '系统管理员',
          enableEmail: true,
          enableSSL: true,
          enableTLS: true,
        }}
      >
        <Row gutter={[24, 24]}>
          {/* SMTP服务器配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  SMTP服务器配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="smtpHost"
                label="SMTP服务器地址"
                rules={[{ required: true, message: '请输入SMTP服务器地址' }]}
              >
                <Input placeholder="例如：smtp.gmail.com" />
              </Form.Item>

              <Form.Item
                name="smtpPort"
                label="SMTP端口"
                rules={[{ required: true, message: '请输入SMTP端口' }]}
              >
                <InputNumber
                  min={1}
                  max={65535}
                  className="settings-input-full-width"
                  placeholder="例如：587"
                />
              </Form.Item>

              <Form.Item
                name="smtpUser"
                label="SMTP用户名"
                rules={[{ required: true, message: '请输入SMTP用户名' }]}
              >
                <Input placeholder="请输入SMTP用户名" />
              </Form.Item>

              <Form.Item
                name="smtpPassword"
                label="SMTP密码"
                rules={[{ required: true, message: '请输入SMTP密码' }]}
              >
                <Input.Password placeholder="请输入SMTP密码" />
              </Form.Item>

              <Form.Item
                name="smtpSecure"
                label="使用SSL连接"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableTLS"
                label="启用TLS"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          {/* 邮件发送配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SendOutlined />
                  邮件发送配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="fromEmail"
                label="发件人邮箱"
                rules={[
                  { required: true, message: '请输入发件人邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input placeholder="请输入发件人邮箱" />
              </Form.Item>

              <Form.Item
                name="fromName"
                label="发件人名称"
                rules={[{ required: true, message: '请输入发件人名称' }]}
              >
                <Input placeholder="请输入发件人名称" />
              </Form.Item>

              <Form.Item
                name="replyTo"
                label="回复邮箱"
              >
                <Input placeholder="请输入回复邮箱" />
              </Form.Item>

              <Form.Item
                name="maxRecipients"
                label="单次最大收件人数"
                rules={[{ required: true, message: '请输入单次最大收件人数' }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  className="settings-input-full-width"
                  placeholder="请输入单次最大收件人数"
                />
              </Form.Item>

              <Form.Item
                name="sendTimeout"
                label="发送超时时间（秒）"
                rules={[{ required: true, message: '请输入发送超时时间' }]}
              >
                <InputNumber
                  min={5}
                  max={300}
                  className="settings-input-full-width"
                  placeholder="请输入发送超时时间"
                />
              </Form.Item>

              <Form.Item
                name="enableEmail"
                label="启用邮件发送"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          {/* 邮件模板配置 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <MailOutlined />
                  邮件模板配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="welcomeSubject"
                label="欢迎邮件主题"
                rules={[{ required: true, message: '请输入欢迎邮件主题' }]}
              >
                <Input placeholder="请输入欢迎邮件主题" />
              </Form.Item>

              <Form.Item
                name="welcomeTemplate"
                label="欢迎邮件模板"
                rules={[{ required: true, message: '请输入欢迎邮件模板' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="请输入欢迎邮件模板内容"
                />
              </Form.Item>

              <Form.Item
                name="resetPasswordSubject"
                label="密码重置邮件主题"
                rules={[{ required: true, message: '请输入密码重置邮件主题' }]}
              >
                <Input placeholder="请输入密码重置邮件主题" />
              </Form.Item>

              <Form.Item
                name="resetPasswordTemplate"
                label="密码重置邮件模板"
                rules={[{ required: true, message: '请输入密码重置邮件模板' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="请输入密码重置邮件模板内容"
                />
              </Form.Item>
            </Card>
          </Col>

          {/* 邮件发送限制 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  发送限制配置
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="dailyLimit"
                label="每日发送限制"
                rules={[{ required: true, message: '请输入每日发送限制' }]}
              >
                <InputNumber
                  min={1}
                  max={10000}
                  className="settings-input-full-width"
                  placeholder="请输入每日发送限制"
                />
              </Form.Item>

              <Form.Item
                name="hourlyLimit"
                label="每小时发送限制"
                rules={[{ required: true, message: '请输入每小时发送限制' }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  className="settings-input-full-width"
                  placeholder="请输入每小时发送限制"
                />
              </Form.Item>

              <Form.Item
                name="enableRateLimit"
                label="启用发送频率限制"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableBlacklist"
                label="启用黑名单功能"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="blacklistEmails"
                label="黑名单邮箱"
                extra="每行一个邮箱地址"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="例如：&#10;spam@example.com&#10;test@example.com"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* 配置状态 */}
        <Card
          title="配置状态"
          className="settings-status-section"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="green" className="settings-tag-large">
                  SMTP连接
                </Tag>
                <Text type="secondary">连接正常</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="blue" className="settings-tag-large">
                  邮件发送
                </Tag>
                <Text type="secondary">功能正常</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="orange" className="settings-tag-large">
                  发送限制
                </Tag>
                <Text type="secondary">已启用</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 操作按钮 */}
        <Row justify="center" className="settings-save-section">
          <Space>
            <Button
              size="large"
              icon={<SendOutlined />}
              loading={testLoading}
              onClick={handleTestEmail}
            >
              发送测试邮件
            </Button>
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

export default EmailConfigPage;
