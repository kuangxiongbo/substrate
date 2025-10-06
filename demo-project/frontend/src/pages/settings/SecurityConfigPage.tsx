/**
 * 安全配置页面 - 系统安全设置
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
  // Divider,
  // Alert,
  Tag,
} from 'antd';
import {
  SecurityScanOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../styles/settings-pages.css';

const { Text } = Typography;
const { Option } = Select;

const SecurityConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
          category: 'security',
          configs: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      message.success(t('common.success'));
    } catch (error) {
      console.error('保存安全配置失败:', error);
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
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
          enableTwoFactor: false,
          enableCaptcha: true,
          maxLoginAttempts: 5,
          lockoutDuration: 30,
          sessionTimeout: 60,
          passwordMinLength: 8,
          requireSpecialChars: true,
          enableIPWhitelist: false,
          enableAuditLog: true,
        }}
      >
        <Row gutter={[24, 24]}>
          {/* 登录安全 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <LockOutlined />
                  {t('security.loginSecurity')}
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="enableTwoFactor"
                label={t('security.enableTwoFactor')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableCaptcha"
                label={t('security.enableCaptcha')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="maxLoginAttempts"
                label={t('security.maxLoginAttempts')}
                rules={[{ required: true, message: t('security.maxLoginAttemptsPlaceholder') }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  className="settings-input-full-width"
                  placeholder={t('security.maxLoginAttemptsPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="lockoutDuration"
                label={t('security.accountLockoutTime')}
                rules={[{ required: true, message: t('security.accountLockoutTimePlaceholder') }]}
              >
                <InputNumber
                  min={1}
                  max={1440}
                  className="settings-input-full-width"
                  placeholder={t('security.accountLockoutTimePlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label={t('security.sessionTimeout')}
                rules={[{ required: true, message: t('security.sessionTimeoutPlaceholder') }]}
              >
                <InputNumber
                  min={5}
                  max={1440}
                  className="settings-input-full-width"
                  placeholder={t('security.sessionTimeoutPlaceholder')}
                />
              </Form.Item>
            </Card>
          </Col>

          {/* 密码策略 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SafetyOutlined />
                  {t('security.passwordPolicy')}
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="passwordMinLength"
                label={t('security.passwordMinLength')}
                rules={[{ required: true, message: t('security.passwordMinLengthPlaceholder') }]}
              >
                <InputNumber
                  min={6}
                  max={32}
                  className="settings-input-full-width"
                  placeholder={t('security.passwordMinLengthPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name="requireUppercase"
                label={t('security.requireUppercase')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="requireLowercase"
                label={t('security.requireLowercase')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="requireNumbers"
                label={t('security.requireNumbers')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="requireSpecialChars"
                label={t('security.requireSpecialChars')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="passwordExpiry"
                label={t('security.passwordExpiry')}
              >
                <InputNumber
                  min={0}
                  max={365}
                  className="settings-input-full-width"
                  placeholder={t('security.neverExpire')}
                />
              </Form.Item>
            </Card>
          </Col>

          {/* 访问控制 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SafetyCertificateOutlined />
                  访问控制
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="enableIPWhitelist"
                label="启用IP白名单"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="allowedIPs"
                label="允许的IP地址"
                extra="每行一个IP地址或IP段"
              >
                <Input.TextArea
                  rows={4}
                  placeholder="例如：&#10;192.168.1.1&#10;192.168.1.0/24&#10;10.0.0.0/8"
                />
              </Form.Item>

              <Form.Item
                name="enableGeoBlocking"
                label="启用地理位置限制"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="allowedCountries"
                label="允许的国家/地区"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择允许的国家/地区"
                  className="settings-input-full-width"
                >
                  <Option value="CN">中国</Option>
                  <Option value="US">美国</Option>
                  <Option value="JP">日本</Option>
                  <Option value="KR">韩国</Option>
                  <Option value="SG">新加坡</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* 审计日志 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <SecurityScanOutlined />
                  审计日志
                </Space>
              }
              className="settings-card"
            >
              <Form.Item
                name="enableAuditLog"
                label="启用审计日志"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="logRetentionDays"
                label="日志保留天数"
                rules={[{ required: true, message: '请输入日志保留天数' }]}
              >
                <InputNumber
                  min={1}
                  max={3650}
                  className="settings-input-full-width"
                  placeholder="请输入日志保留天数"
                />
              </Form.Item>

              <Form.Item
                name="logLevel"
                label="日志级别"
                rules={[{ required: true, message: '请选择日志级别' }]}
              >
                <Select placeholder="请选择日志级别">
                  <Option value="DEBUG">DEBUG</Option>
                  <Option value="INFO">INFO</Option>
                  <Option value="WARN">WARN</Option>
                  <Option value="ERROR">ERROR</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="enableRealTimeAlert"
                label="启用实时告警"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="alertEmail"
                label="告警邮箱"
              >
                <Input placeholder="请输入告警邮箱" />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* 安全状态 */}
        <Card
          title="当前安全状态"
          className="settings-status-section"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="green" className="settings-tag-large">
                  系统安全
                </Tag>
                <Text type="secondary">所有安全检查通过</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="blue" className="settings-tag-large">
                  密码策略
                </Tag>
                <Text type="secondary">强密码策略已启用</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" className="settings-status-container">
                <Tag color="orange" className="settings-tag-large">
                  访问控制
                </Tag>
                <Text type="secondary">基础访问控制已启用</Text>
              </Space>
            </Col>
          </Row>
        </Card>

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

export default SecurityConfigPage;





























