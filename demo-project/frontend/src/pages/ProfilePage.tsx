/**
 * 个人资料设置页面
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Avatar,
  Upload,
  Select,
  DatePicker,
  Switch,
  // Divider,
  // Tag,
  // Alert,
} from 'antd';
import dayjs from 'dayjs';
import {
  UserOutlined,
  // CameraOutlined,
  SaveOutlined,
  ReloadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  // CalendarOutlined,
  // EditOutlined,
  // CheckOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  location?: string;
  birthday?: string;
  bio?: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profile_public: boolean;
    show_email: boolean;
    show_phone: boolean;
  };
  created_at: string;
  updated_at: string;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockProfile: UserProfile = {
        id: user?.id || '1',
        email: user?.email || 'demo@example.com',
        name: user?.name || 'Demo User',
        avatar: user?.avatar,
        phone: '+86 138 0013 8000',
        location: '北京市',
        birthday: '1990-01-01',
        bio: '这是一个示例用户简介',
        language: 'zh-CN',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profile_public: true,
          show_email: false,
          show_phone: false,
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
      };

      setProfile(mockProfile);
      // 处理日期字段，将字符串转换为dayjs对象
      const formData = {
        ...mockProfile,
        birthday: mockProfile.birthday ? dayjs(mockProfile.birthday) : undefined,
      };
      form.setFieldsValue(formData);
    } catch (error) {
      console.error('加载用户资料失败:', error);
      message.error('加载用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (_values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 处理日期字段，将dayjs对象转换为字符串
      const processedValues = {
        ..._values,
        birthday: _values.birthday ? _values.birthday.format('YYYY-MM-DD') : undefined,
      };
      
      const updatedProfile = { ...profile, ...processedValues, updated_at: new Date().toISOString() };
      setProfile(updatedProfile);
      message.success('个人资料保存成功');
    } catch (error) {
      console.error('保存个人资料失败:', error);
      message.error('保存个人资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (_values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      passwordForm.resetFields();
      message.success('密码修改成功');
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      const newAvatar = info.file.response?.url || URL.createObjectURL(info.file.originFileObj);
      setProfile(prev => prev ? { ...prev, avatar: newAvatar } : null);
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="settings-header-card">
          <Space align="center">
            <UserOutlined className="monitoring-header-icon" />
            <Title level={2} className="monitoring-title">
              个人资料
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadUserProfile}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
          <Text className="monitoring-description">
            管理您的个人资料和账户设置
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* 基本信息 */}
          <Col xs={24} lg={16}>
            <Card title="基本信息">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveProfile}
                initialValues={profile || {}}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[{ required: true, message: '请输入姓名' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="输入姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="邮箱"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="输入邮箱" disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="手机号"
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="输入手机号" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="location"
                      label="所在地"
                    >
                      <Input prefix={<EnvironmentOutlined />} placeholder="输入所在地" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="birthday"
                  label="生日"
                >
                  <DatePicker className="profile-date-picker" placeholder="选择生日" />
                </Form.Item>

                <Form.Item
                  name="bio"
                  label="个人简介"
                >
                  <Input.TextArea rows={3} placeholder="输入个人简介" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    保存资料
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 头像和设置 */}
          <Col xs={24} lg={8}>
            {/* 头像设置 */}
            <Card title="头像设置" className="mb-4">
              <div className="text-center">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={handleAvatarUpload}
                  beforeUpload={() => false}
                >
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    src={profile?.avatar}
                    className="mb-2"
                  />
                </Upload>
                <div>
                  <Text type="secondary">点击上传新头像</Text>
                </div>
              </div>
            </Card>

            {/* 账户信息 */}
            <Card title="账户信息">
              <Space direction="vertical" className="profile-space-full-width">
                <div>
                  <Text type="secondary">用户ID</Text>
                  <div>
                    <Text code>{profile?.id}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">注册时间</Text>
                  <div>
                    <Text>{profile?.created_at ? new Date(profile.created_at).toLocaleString() : '-'}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">最后更新</Text>
                  <div>
                    <Text>{profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : '-'}</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="mt-6">
          {/* 偏好设置 */}
          <Col xs={24} lg={12}>
            <Card title={t('profile.preferences')}>
              <Space direction="vertical" className="profile-space-full-width">
                <div>
                  <Text strong>{t('basicConfig.defaultLanguageLabel')}</Text>
                  <div className="mt-1">
                    <Select
                      value={profile?.language}
                      onChange={(value) => setProfile(prev => prev ? { ...prev, language: value } : null)}
                      className="profile-input-full-width"
                    >
                      <Option value="zh-CN">{t('languages.zh-CN')}</Option>
                      <Option value="en-US">{t('languages.en-US')}</Option>
                      <Option value="ja-JP">{t('languages.ja-JP')}</Option>
                    </Select>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* 通知设置 */}
          <Col xs={24} lg={12}>
            <Card title="通知设置">
              <Space direction="vertical" className="profile-space-full-width">
                <div className="flex justify-between items-center">
                  <Text>邮件通知</Text>
                  <Switch
                    checked={profile?.notifications.email}
                    onChange={(checked) => setProfile(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    } : null)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Text>推送通知</Text>
                  <Switch
                    checked={profile?.notifications.push}
                    onChange={(checked) => setProfile(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    } : null)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Text>短信通知</Text>
                  <Switch
                    checked={profile?.notifications.sms}
                    onChange={(checked) => setProfile(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, sms: checked }
                    } : null)}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="mt-6">
          {/* 隐私设置 */}
          <Col xs={24} lg={12}>
            <Card title="隐私设置">
              <Space direction="vertical" className="profile-space-full-width">
                <div className="flex justify-between items-center">
                  <Text>公开个人资料</Text>
                  <Switch
                    checked={profile?.privacy.profile_public}
                    onChange={(checked) => setProfile(prev => prev ? {
                      ...prev,
                      privacy: { ...prev.privacy, profile_public: checked }
                    } : null)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Text>显示邮箱</Text>
                  <Switch
                    checked={profile?.privacy.show_email}
                    onChange={(checked) => setProfile(prev => prev ? {
                      ...prev,
                      privacy: { ...prev.privacy, show_email: checked }
                    } : null)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Text>显示手机号</Text>
                  <Switch
                    checked={profile?.privacy.show_phone}
                    onChange={(checked) => setProfile(prev => prev ? {
                      ...prev,
                      privacy: { ...prev.privacy, show_phone: checked }
                    } : null)}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          {/* 修改密码 */}
          <Col xs={24} lg={12}>
            <Card title="修改密码">
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handleChangePassword}
              >
                <Form.Item
                  name="currentPassword"
                  label="当前密码"
                  rules={[{ required: true, message: '请输入当前密码' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="输入当前密码" />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="新密码"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 8, message: '密码至少8位' },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="输入新密码" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  rules={[
                    { required: true, message: '请确认新密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    修改密码
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
