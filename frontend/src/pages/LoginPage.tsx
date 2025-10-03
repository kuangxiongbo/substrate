/**
 * 登录页面 - 专业UI设计师设计
 * 基于Ant Design的美观登录界面
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  Divider,
  message,
  Row,
  Col,
  Avatar,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GithubOutlined,
  GoogleOutlined,
  TwitterOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import Captcha from '../components/Captcha';

const { Title, Text, Paragraph } = Typography;

// 定义登录凭据类型
interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
  captcha?: string;
  captcha_id?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [form] = Form.useForm();
  const [showCaptcha, setShowCaptcha] = useState(false);

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, clearError]);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      await login(values);
      message.success('登录成功！');
      setShowCaptcha(false); // 登录成功后隐藏验证码
    } catch (err: any) {
      message.error(err.detail || '登录失败，请检查您的凭据');
      // 登录失败后显示验证码
      setShowCaptcha(true);
    }
  };

  const handleDemoLogin = () => {
    form.setFieldsValue({
      email: 'demo@example.com',
      password: 'MySecure2024!',
    });
  };

  const handleAdminLogin = () => {
    form.setFieldsValue({
      email: 'admin@system.com',
      password: 'Admin123!',
    });
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto"
      >
        <Row gutter={[48, 48]} align="middle" justify="center">
          {/* 左侧品牌区域 */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="mb-8">
                <Avatar
                  size={80}
                  icon={<SafetyCertificateOutlined />}
                  style={{
                    backgroundColor: '#1890ff',
                    marginBottom: 24,
                  }}
                />
                <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
                  多用户管理系统
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 32 }}>
                  安全、高效、现代化的企业级用户管理解决方案
                </Paragraph>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                    基于角色的权限控制 (RBAC)
                  </Text>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                    JWT 安全认证机制
                  </Text>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                    GDPR 合规数据处理
                  </Text>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                    响应式现代化界面
                  </Text>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* 右侧登录表单 */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                className="login-card"
                style={{
                  borderRadius: 16,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              >
                <div className="text-center mb-8">
                  <Title level={2} style={{ marginBottom: 8 }}>
                    欢迎回来
                  </Title>
                  <Text type="secondary">
                    请登录您的账户以继续使用系统
                  </Text>
                </div>

                <Form
                  form={form}
                  name="login"
                  onFinish={handleSubmit}
                  layout="vertical"
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item
                    name="email"
                    label="邮箱地址"
                    rules={[
                      { required: true, message: '请输入邮箱地址' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="请输入邮箱地址"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6位字符' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="请输入密码"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>

                  {showCaptcha && (
                    <Form.Item
                      name="captcha"
                      label="验证码"
                      rules={[
                        { required: true, message: '请输入验证码' },
                        { len: 4, message: '验证码为4位字符' },
                      ]}
                    >
                      <Captcha
                        placeholder="请输入验证码"
                        onCaptchaIdChange={(captchaId) => {
                          form.setFieldsValue({ captcha_id: captchaId });
                        }}
                      />
                    </Form.Item>
                  )}

                  <Form.Item>
                    <div className="flex justify-between items-center">
                      <Form.Item name="remember_me" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                      </Form.Item>
                      <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                        忘记密码？
                      </Link>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      block
                      size="large"
                      style={{
                        height: 48,
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 500,
                      }}
                    >
                      {isLoading ? '登录中...' : '登录'}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider>快速登录</Divider>

                <Space direction="vertical" size="middle" className="w-full">
                  <Button
                    type="default"
                    block
                    size="large"
                    onClick={handleDemoLogin}
                    style={{ height: 44, borderRadius: 8 }}
                  >
                    <UserOutlined /> 演示账户登录
                  </Button>
                  
                  <Button
                    type="default"
                    block
                    size="large"
                    onClick={handleAdminLogin}
                    style={{ height: 44, borderRadius: 8 }}
                  >
                    <SafetyCertificateOutlined /> 超级管理员登录
                  </Button>
                </Space>

                <div className="text-center mt-6">
                  <Text type="secondary">
                    还没有账户？{' '}
                    <Link to="/register" style={{ color: '#1890ff', fontWeight: 500 }}>
                      立即注册
                    </Link>
                  </Text>
                </div>

                <div className="text-center mt-4">
                  <Space size="large">
                    <Tooltip title="GitHub">
                      <Button type="text" icon={<GithubOutlined />} size="large" />
                    </Tooltip>
                    <Tooltip title="Google">
                      <Button type="text" icon={<GoogleOutlined />} size="large" />
                    </Tooltip>
                    <Tooltip title="Twitter">
                      <Button type="text" icon={<TwitterOutlined />} size="large" />
                    </Tooltip>
                  </Space>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default LoginPage;


