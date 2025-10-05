/**
 * 重置密码页面
 */
import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/login-page.css';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('重置密码邮件已发送，请查收邮箱');
      } else {
        message.error('发送失败，请重试');
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error('发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${currentTheme?.meta.id || 'light'}-theme`}>
      <div className="login-hero-section">
        <div className="login-hero-avatar">
          <LockOutlined />
        </div>
        <Title level={2} className="login-hero-title">重置密码</Title>
        <Text className="login-hero-description">
          输入您的邮箱地址，我们将发送重置密码的链接
        </Text>
      </div>

      <Card className="login-card">
        <Title level={3} className="login-card-title">重置密码</Title>
        
        <Form
          name="reset-password"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱地址"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-submit-button"
              block
            >
              发送重置邮件
            </Button>
          </Form.Item>
        </Form>

        <div className="reset-password-actions">
          <Space>
            <Button type="link" onClick={() => window.location.href = '/login'}>
              返回登录
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
