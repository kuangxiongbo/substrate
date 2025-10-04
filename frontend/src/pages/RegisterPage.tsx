/**
 * 注册页面 - 专业UI设计师设计
 * 基于Ant Design的美观注册界面
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Progress,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { getPasswordStrength, getPasswordStrengthColor, getPasswordStrengthText } from '../utils/helpers';
import Captcha from '../components/Captcha';
import '../styles/login-page.css';

const { Title, Text, Paragraph } = Typography;

// 定义注册数据类型
interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  consent: boolean;
  captcha: string;
  captcha_id: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [form] = Form.useForm();
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, clearError]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  const handleSubmit = async (values: RegisterData) => {
    try {
      await register(values);
      message.success('注册成功！请检查您的邮箱进行验证。');
      navigate('/login');
    } catch (err: any) {
      message.error(err.detail || '注册失败，请重试');
    }
  };

  const getPasswordRequirements = () => {
    const requirements = [
      { text: '至少8个字符', met: password.length >= 8 },
      { text: '包含大写字母', met: /[A-Z]/.test(password) },
      { text: '包含小写字母', met: /[a-z]/.test(password) },
      { text: '包含数字', met: /\d/.test(password) },
      { text: '包含特殊字符', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
    return requirements;
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
                  className="register-hero-avatar"
                />
                <Title level={1} className="login-hero-title">
                  加入我们
                </Title>
                <Paragraph className="login-hero-description">
                  创建您的账户，开始使用专业的多用户管理系统
                </Paragraph>
              </div>

              <div className="space-y-4">
                <div className="register-feature-item">
                  <CheckCircleOutlined className="register-feature-icon" />
                  <Text className="register-feature-text">
                    免费注册，无隐藏费用
                  </Text>
                </div>
                <div className="register-feature-item">
                  <CheckCircleOutlined className="register-feature-icon" />
                  <Text className="register-feature-text">
                    企业级安全保障
                  </Text>
                </div>
                <div className="register-feature-item">
                  <CheckCircleOutlined className="register-feature-icon" />
                  <Text className="register-feature-text">
                    24/7 技术支持
                  </Text>
                </div>
                <div className="register-feature-item">
                  <CheckCircleOutlined className="register-feature-icon" />
                  <Text className="register-feature-text">
                    数据隐私保护
                  </Text>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* 右侧注册表单 */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Card className="login-card">
                  <div className="text-center mb-8">
                    <Title level={2} className="login-card-title">
                      创建账户
                    </Title>
                  <Text type="secondary">
                    填写以下信息完成注册
                  </Text>
                </div>

                <Form
                  form={form}
                  name="register"
                  onFinish={handleSubmit}
                  layout="vertical"
                  size="large"
                  autoComplete="off"
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="first_name"
                        label="名字"
                      >
                        <Input
                          prefix={<UserOutlined className="login-input-icon" />}
                          placeholder="名字（可选）"
                          className="login-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="last_name"
                        label="姓氏"
                      >
                        <Input
                          prefix={<UserOutlined className="login-input-icon" />}
                          placeholder="姓氏（可选）"
                          className="login-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="email"
                    label="邮箱地址"
                    rules={[
                      { required: true, message: '请输入邮箱地址' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="login-input-icon" />}
                      placeholder="请输入邮箱地址"
                      className="login-input"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 8, message: '密码至少8位字符' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="login-input-icon" />}
                      placeholder="请输入密码"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      className="login-input"
                      onChange={handlePasswordChange}
                    />
                  </Form.Item>

                  {password && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Text strong>密码强度</Text>
                        <Text 
                          className="password-strength-text" 
                          style={{ color: getPasswordStrengthColor(passwordStrength) }}
                        >
                          {getPasswordStrengthText(passwordStrength)}
                        </Text>
                      </div>
                      <Progress
                        percent={passwordStrength * 20}
                        strokeColor={getPasswordStrengthColor(passwordStrength)}
                        showInfo={false}
                        className="mb-3"
                      />
                      <div className="space-y-1">
                        {getPasswordRequirements().map((req, index) => (
                          <div key={index} className="password-requirement-item">
                            {req.met ? (
                              <CheckCircleOutlined className="password-requirement-icon password-requirement-met" />
                            ) : (
                              <CloseCircleOutlined className="password-requirement-icon password-requirement-unmet" />
                            )}
                            <Text
                              className={`password-requirement-text ${req.met ? 'password-requirement-met' : 'password-requirement-unmet'}`}
                            >
                              {req.text}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                  <Form.Item
                    name="consent"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value ? Promise.resolve() : Promise.reject(new Error('请同意隐私政策和使用条款')),
                      },
                    ]}
                  >
                    <Checkbox>
                      我同意{' '}
                      <Link to="/privacy" className="register-terms-link">
                        隐私政策
                      </Link>{' '}
                      和{' '}
                      <Link to="/terms" className="register-terms-link">
                        使用条款
                      </Link>
                    </Checkbox>
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
                      {isLoading ? '注册中...' : '创建账户'}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider>已有账户？</Divider>

                <div className="text-center">
                  <Link to="/login">
                  <Button
                    type="default"
                    block
                    size="large"
                    className="login-demo-button"
                  >
                      立即登录
                    </Button>
                  </Link>
                </div>

                <div className="text-center mt-6">
                  <Text type="secondary" className="register-disclaimer-text">
                    注册即表示您同意我们的服务条款和隐私政策。
                    我们承诺保护您的个人信息安全。
                  </Text>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default RegisterPage;













