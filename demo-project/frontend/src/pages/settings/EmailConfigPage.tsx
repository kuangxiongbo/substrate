/**
 * 邮箱配置页面 - 邮件服务设置
 */
import React, { useState } from 'react';
import {
  Form,
  Input,
  Switch,
  // Select,
  InputNumber,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  message,
  // Divider,
  // Alert,
  Tag,
  // Steps,
} from 'antd';
import {
  MailOutlined,
  SendOutlined,
  SettingOutlined,
  // CheckCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../../styles/settings-pages.css';

const { Text } = Typography;
// const { Option } = Select;
// const { Step } = Steps;

const EmailConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const { currentTheme } = useTheme();
  const { t } = useTranslation();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/configs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'email',
          configs: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      message.success(t('email.saveSuccess'));
    } catch (error) {
      console.error('保存邮箱配置失败:', error);
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestLoading(true);
    try {
      // 模拟发送测试邮件
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success(t('email.testSuccess'));
    } catch (error) {
      message.error(t('email.testFailed'));
    } finally {
      setTestLoading(false);
    }
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
        initialValues={{
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpSecure: false,
          smtpUser: '',
          smtpPassword: '',
          fromEmail: '',
          fromName: t('email.defaultSenderName'),
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
                  {t('email.smtpConfig')}
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="smtpHost"
                label={t('email.smtpHost')}
                rules={[{ required: true, message: t('email.smtpHostPlaceholder') }]}
              >
                <Input placeholder={t('email.smtpHostExample')} />
              </Form.Item>

              <Form.Item
                name="smtpPort"
                label={t('email.smtpPort')}
                rules={[{ required: true, message: t('email.smtpPortPlaceholder') }]}
              >
                <InputNumber
                  min={1}
                  max={65535}
                  className="settings-input-full-width"
                  placeholder={t('email.smtpPortExample')}
                />
              </Form.Item>

              <Form.Item
                name="smtpUser"
                label={t('email.smtpUser')}
                rules={[{ required: true, message: t('email.smtpUserPlaceholder') }]}
              >
                <Input placeholder={t('email.smtpUserPlaceholder')} />
              </Form.Item>

              <Form.Item
                name="smtpPassword"
                label={t('email.smtpPassword')}
                rules={[{ required: true, message: t('email.smtpPasswordPlaceholder') }]}
              >
                <Input.Password placeholder={t('email.smtpPasswordPlaceholder')} />
              </Form.Item>

              <Form.Item
                name="smtpSecure"
                label={t('email.useSSL')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableTLS"
                label={t('email.enableTLS')}
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
                  {t('email.sendingConfig')}
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="fromEmail"
                label={t('email.fromEmail')}
                rules={[
                  { required: true, message: t('email.fromEmailPlaceholder') },
                  { type: 'email', message: t('email.validEmailMessage') },
                ]}
              >
                <Input placeholder={t('email.fromEmailPlaceholder')} />
              </Form.Item>

              <Form.Item
                name="fromName"
                label={t('email.fromName')}
                rules={[{ required: true, message: t('email.fromNamePlaceholder') }]}
              >
                <Input placeholder={t('email.fromNamePlaceholder')} />
              </Form.Item>

              <Form.Item
                name="replyTo"
                label={t('email.replyTo')}
              >
                <Input placeholder={t('email.replyToPlaceholder')} />
              </Form.Item>

              <Form.Item
                name="maxRecipients"
                label={t('email.maxRecipients')}
                rules={[{ required: true, message: t('email.maxRecipientsPlaceholder') }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  className="settings-input-full-width"
                  placeholder={t('email.maxRecipientsPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="sendTimeout"
                label={t('email.sendTimeout')}
                rules={[{ required: true, message: t('email.sendTimeoutPlaceholder') }]}
              >
                <InputNumber
                  min={5}
                  max={300}
                  className="settings-input-full-width"
                  placeholder={t('email.sendTimeoutPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="enableEmail"
                label={t('email.enableSending')}
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
                  {t('email.templateConfig')}
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="welcomeSubject"
                label={t('email.welcomeSubject')}
                rules={[{ required: true, message: t('email.welcomeSubjectPlaceholder') }]}
              >
                <Input placeholder={t('email.welcomeSubjectPlaceholder')} />
              </Form.Item>

              <Form.Item
                name="welcomeTemplate"
                label={t('email.welcomeTemplate')}
                rules={[{ required: true, message: t('email.welcomeTemplatePlaceholder') }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={t('email.welcomeTemplateContent')}
                />
              </Form.Item>

              <Form.Item
                name="resetPasswordSubject"
                label={t('email.resetPasswordSubject')}
                rules={[{ required: true, message: t('email.resetPasswordSubjectPlaceholder') }]}
              >
                <Input placeholder={t('email.resetPasswordSubjectPlaceholder')} />
              </Form.Item>

              <Form.Item
                name="resetPasswordTemplate"
                label={t('email.resetPasswordTemplate')}
                rules={[{ required: true, message: t('email.resetPasswordTemplatePlaceholder') }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={t('email.resetPasswordTemplateContent')}
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
                  {t('email.limitConfig')}
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="dailyLimit"
                label={t('email.dailyLimit')}
                rules={[{ required: true, message: t('email.dailyLimitPlaceholder') }]}
              >
                <InputNumber
                  min={1}
                  max={10000}
                  className="settings-input-full-width"
                  placeholder={t('email.dailyLimitPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="hourlyLimit"
                label={t('email.hourlyLimit')}
                rules={[{ required: true, message: t('email.hourlyLimitPlaceholder') }]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  className="settings-input-full-width"
                  placeholder={t('email.hourlyLimitPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="enableRateLimit"
                label={t('email.enableRateLimit')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableBlacklist"
                label={t('email.enableBlacklist')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="blacklistEmails"
                label={t('email.blacklistEmails')}
                extra={t('email.blacklistEmailsExtra')}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={t('email.blacklistEmailsPlaceholder')}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* 配置状态 */}
        <Card
          title={t('email.configStatus')}
          className="settings-status-section"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="green" className="settings-tag-large">
                  {t('email.smtpConnection')}
                </Tag>
                <Text type="secondary">{t('email.connectionNormal')}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="blue" className="settings-tag-large">
                  {t('email.emailSending')}
                </Tag>
                <Text type="secondary">{t('email.functionNormal')}</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="orange" className="settings-tag-large">
                  {t('email.sendLimit')}
                </Tag>
                <Text type="secondary">{t('email.enabled')}</Text>
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
              {t('email.sendTestEmail')}
            </Button>
            <Button size="large" onClick={() => form.resetFields()}>
              {t('common.reset')}
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
            >
              {t('common.save')}
            </Button>
          </Space>
        </Row>
      </Form>
      </motion.div>
    </div>
  );
};

export default EmailConfigPage;
