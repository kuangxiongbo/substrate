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
  Divider,
  Alert,
  Tag,
} from 'antd';
import {
  SecurityScanOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

const SecurityConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('安全配置保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
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
      <Title level={3} style={{ marginBottom: 24 }}>
        <SecurityScanOutlined style={{ marginRight: 8 }} />
        安全配置
      </Title>

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
                  登录安全
                </Space>
              }
              style={{ height: '100%' }}
            >
              <Form.Item
                name="enableTwoFactor"
                label="启用双因素认证"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="enableCaptcha"
                label="启用图形验证码"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="maxLoginAttempts"
                label="最大登录尝试次数"
                rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: '100%' }}
                  placeholder="请输入最大登录尝试次数"
                />
              </Form.Item>

              <Form.Item
                name="lockoutDuration"
                label="账户锁定时间（分钟）"
                rules={[{ required: true, message: '请输入账户锁定时间' }]}
              >
                <InputNumber
                  min={1}
                  max={1440}
                  style={{ width: '100%' }}
                  placeholder="请输入账户锁定时间"
                />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="会话超时时间（分钟）"
                rules={[{ required: true, message: '请输入会话超时时间' }]}
              >
                <InputNumber
                  min={5}
                  max={1440}
                  style={{ width: '100%' }}
                  placeholder="请输入会话超时时间"
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
                  密码策略
                </Space>
              }
              style={{ height: '100%' }}
            >
              <Form.Item
                name="passwordMinLength"
                label="密码最小长度"
                rules={[{ required: true, message: '请输入密码最小长度' }]}
              >
                <InputNumber
                  min={6}
                  max={32}
                  style={{ width: '100%' }}
                  placeholder="请输入密码最小长度"
                />
              </Form.Item>

              <Form.Item
                name="requireUppercase"
                label="要求大写字母"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="requireLowercase"
                label="要求小写字母"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="requireNumbers"
                label="要求数字"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="requireSpecialChars"
                label="要求特殊字符"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="passwordExpiry"
                label="密码过期时间（天）"
              >
                <InputNumber
                  min={0}
                  max={365}
                  style={{ width: '100%' }}
                  placeholder="0表示永不过期"
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
              style={{ height: '100%' }}
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
                  style={{ width: '100%' }}
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
              style={{ height: '100%' }}
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
                  style={{ width: '100%' }}
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
          style={{ marginTop: 24 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <Tag color="green" style={{ fontSize: 16, padding: '8px 16px' }}>
                  系统安全
                </Tag>
                <Text type="secondary">所有安全检查通过</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <Tag color="blue" style={{ fontSize: 16, padding: '8px 16px' }}>
                  密码策略
                </Tag>
                <Text type="secondary">强密码策略已启用</Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <Tag color="orange" style={{ fontSize: 16, padding: '8px 16px' }}>
                  访问控制
                </Tag>
                <Text type="secondary">基础访问控制已启用</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 保存按钮 */}
        <Row justify="center" style={{ marginTop: 32 }}>
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


