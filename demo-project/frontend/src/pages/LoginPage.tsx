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
  App,
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
import { useTranslation } from 'react-i18next';
import Captcha from '../components/Captcha';
import '../styles/login-page.css';

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
  const { message } = App.useApp();
  const location = useLocation();
  const { login, isLoading, clearError, isAuthenticated } = useAuthStore();
  const [form] = Form.useForm();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const { t } = useTranslation();
  
  // 系统配置状态
  const [systemTitle, setSystemTitle] = useState('Spec-Kit');
  const [systemLogo, setSystemLogo] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, clearError]);

  // 加载系统配置
  useEffect(() => {
    const loadSystemConfig = async () => {
      // 先从后端数据库加载（无需认证）
      let backendConfigs = {};
      try {
        const response = await fetch('/api/v1/admin/configs?category=basic');
        
        if (response.ok) {
          const configs = await response.json();
          backendConfigs = configs.reduce((acc: Record<string, any>, config: any) => {
            acc[config.key] = config.value;
            return acc;
          }, {});
          console.log('LoginPage: 从数据库加载配置', backendConfigs);
        }
      } catch (error) {
        console.warn('LoginPage: 从数据库加载配置失败', error);
      }

      // 从localStorage加载（作为备用）
      const savedTitle = (backendConfigs as any).systemTitle || localStorage.getItem('systemTitle');
      const savedLogo = (backendConfigs as any).systemLogo || localStorage.getItem('systemLogo');
      
      console.log('LoginPage: 加载系统配置', { savedTitle, savedLogo });
      
      if (savedTitle) {
        setSystemTitle(savedTitle);
        document.title = savedTitle;
      }
      if (savedLogo) {
        setSystemLogo(savedLogo);
        console.log('LoginPage: 设置Logo', savedLogo);
      } else {
        console.log('LoginPage: 未找到logo，保持默认状态');
      }
    };

    loadSystemConfig();

    // 监听系统配置更改事件
    const handleConfigChange = (event: CustomEvent) => {
      const { systemTitle: title, logo } = event.detail || {};
      console.log('LoginPage: 收到配置更改事件', { title, logo, detail: event.detail });
      if (title) {
        setSystemTitle(title);
        document.title = title;
      }
      if (logo) {
        setSystemLogo(logo);
        console.log('LoginPage: 更新Logo', logo);
      }
    };

    // 监听localStorage变化
    const handleStorageChange = (event: StorageEvent) => {
      console.log('LoginPage: 收到storage事件', { key: event.key, newValue: event.newValue });
      if (event.key === 'systemTitle' && event.newValue) {
        setSystemTitle(event.newValue);
        document.title = event.newValue;
      }
      if (event.key === 'systemLogo' && event.newValue) {
        setSystemLogo(event.newValue);
        console.log('LoginPage: storage更新Logo', event.newValue);
      }
    };

    window.addEventListener('systemTitleChanged', handleConfigChange as EventListener);
    window.addEventListener('logoChanged', handleConfigChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('systemTitleChanged', handleConfigChange as EventListener);
      window.removeEventListener('logoChanged', handleConfigChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      await login(values);
      message.success(t('login.loginSuccess'));
      setShowCaptcha(false); // 登录成功后隐藏验证码
    } catch (err: any) {
      message.error(err.detail || t('login.loginFailed'));
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
                  src={systemLogo || undefined}
                  icon={<SafetyCertificateOutlined />}
                  className="login-hero-avatar"
                  onError={() => { console.log('LoginPage: Avatar Logo加载失败'); return false; }}
                />
                <Title level={1} className="login-hero-title">
                  {systemTitle || t('login.title')}
                </Title>
                <Paragraph className="login-hero-description">
                  {t('login.subtitle')}
                </Paragraph>
              </div>

              <div className="space-y-4">
                <div className="login-feature-item">
                  <div className="login-feature-dot"></div>
                  <Text className="login-feature-text">
                    {t('login.features.rbac')}
                  </Text>
                </div>
                <div className="login-feature-item">
                  <div className="login-feature-dot"></div>
                  <Text className="login-feature-text">
                    {t('login.features.jwt')}
                  </Text>
                </div>
                <div className="login-feature-item">
                  <div className="login-feature-dot"></div>
                  <Text className="login-feature-text">
                    {t('login.features.gdpr')}
                  </Text>
                </div>
                <div className="login-feature-item">
                  <div className="login-feature-dot"></div>
                  <Text className="login-feature-text">
                    {t('login.features.responsive')}
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
                <Card className="login-card">
                  <div className="text-center mb-8">
                    <Title level={2} className="login-card-title">
                      {t('login.login')}
                    </Title>
                  <Text type="secondary">
                    {t('login.login')}
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
                    label={t('login.email')}
                    rules={[
                      { required: true, message: t('common.error') },
                      { type: 'email', message: t('common.error') },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="login-input-icon" />}
                      placeholder={t('login.email')}
                      className="login-input"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={t('login.password')}
                    rules={[
                      { required: true, message: t('common.error') },
                      { min: 6, message: t('common.error') },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="login-input-icon" />}
                      placeholder={t('login.password')}
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      className="login-input"
                    />
                  </Form.Item>

                  {showCaptcha && (
                    <Form.Item
                      name="captcha"
                      label={t('login.captcha')}
                      rules={[
                        { required: true, message: t('login.captchaRequired') },
                        { len: 4, message: t('login.captchaLength') },
                      ]}
                    >
                      <Captcha
                        onCaptchaIdChange={(captchaId: string) => {
                          form.setFieldsValue({ captcha_id: captchaId });
                        }}
                      />
                    </Form.Item>
                  )}

                  <Form.Item>
                    <div className="flex justify-between items-center">
                      <Form.Item name="remember_me" valuePropName="checked" noStyle>
                        <Checkbox>{t('login.rememberMe')}</Checkbox>
                      </Form.Item>
                      <Link to="/forgot-password" className="login-forgot-link">
                        {t('login.forgotPassword')}
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
                      className="login-submit-button"
                    >
                      {isLoading ? t('common.loading') : t('login.loginButton')}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider>{t('login.quickLogin')}</Divider>

                <Space direction="vertical" size="middle" className="w-full">
                  <Button
                    type="default"
                    block
                    size="large"
                    onClick={handleDemoLogin}
                    className="login-demo-button"
                  >
                    <UserOutlined /> {t('login.demoAccount')}
                  </Button>
                  
                  <Button
                    type="default"
                    block
                    size="large"
                    onClick={handleAdminLogin}
                    className="login-admin-button"
                  >
                    <SafetyCertificateOutlined /> {t('login.adminAccount')}
                  </Button>
                </Space>

                <div className="text-center mt-6">
                  <Text type="secondary">
                    {t('login.noAccount')}{' '}
                    <Link to="/register" className="login-link-bold">
                      {t('login.registerNow')}
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


























