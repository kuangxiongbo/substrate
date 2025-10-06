/**
 * 系统通知中心页面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Button,
  Typography,
  Space,
  message,
  Badge,
  Tag,
  Tooltip,
  Modal,
  Input,
  Select,
  // DatePicker,
  Avatar,
  Empty,
  // Divider,
  Form,
} from 'antd';
import {
  BellOutlined,
  NotificationOutlined,
  MessageOutlined,
  // SettingOutlined,
  CheckOutlined,
  DeleteOutlined,
  ReloadOutlined,
  // FilterOutlined,
  // ClearOutlined,
  ReadOutlined,
  // UnreadOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
// const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  created_at: string;
  expires_at?: string;
  sender: string;
  category: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  urgent: number;
}

const NotificationCenterPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    today: 0,
    urgent: 0,
  });
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [composeModalVisible, setComposeModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [composeForm] = Form.useForm();

  useEffect(() => {
    loadNotifications();
    // 每30秒刷新一次通知
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: '系统维护通知',
          content: '系统将于今晚22:00-24:00进行维护升级，期间可能影响正常使用。',
          type: 'warning',
          priority: 'high',
          isRead: false,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          sender: 'system',
          category: 'maintenance',
        },
        {
          id: '2',
          title: '新用户注册',
          content: '用户 john.doe@example.com 已成功注册账户。',
          type: 'info',
          priority: 'low',
          isRead: true,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          sender: 'admin',
          category: 'user',
        },
        {
          id: '3',
          title: '数据库备份完成',
          content: '数据库备份任务已完成，备份文件大小: 2.5GB。',
          type: 'success',
          priority: 'medium',
          isRead: false,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          sender: 'system',
          category: 'backup',
        },
        {
          id: '4',
          title: '安全警告',
          content: '检测到异常登录尝试，IP地址: 192.168.1.100',
          type: 'error',
          priority: 'urgent',
          isRead: false,
          created_at: new Date(Date.now() - 10800000).toISOString(),
          sender: 'security',
          category: 'security',
        },
        {
          id: '5',
          title: '系统更新',
          content: '系统已更新到版本 v2.1.0，包含多项功能改进和bug修复。',
          type: 'info',
          priority: 'medium',
          isRead: true,
          created_at: new Date(Date.now() - 14400000).toISOString(),
          sender: 'system',
          category: 'update',
        },
      ];

      const mockStats: NotificationStats = {
        total: mockNotifications.length,
        unread: mockNotifications.filter(n => !n.isRead).length,
        today: mockNotifications.filter(n => {
          const today = new Date();
          const notificationDate = new Date(n.created_at);
          return notificationDate.toDateString() === today.toDateString();
        }).length,
        urgent: mockNotifications.filter(n => n.priority === 'urgent').length,
      };

      setNotifications(mockNotifications);
      setStats(mockStats);
    } catch (error) {
      console.error('加载通知失败:', error);
      message.error('加载通知失败');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (notification: Notification) => {
    setNotifications(prev => prev.map(n => 
      n.id === notification.id 
        ? { ...n, isRead: true }
        : n
    ));
      message.success(t('notifications.markAsRead'));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    message.success(t('notifications.markAllAsRead'));
  };

  const handleDeleteNotification = (notification: Notification) => {
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
    message.success(t('notifications.notificationDeleted'));
  };

  const handleComposeNotification = async (values: any) => {
    try {
      // 模拟发送通知
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: values.title,
        content: values.content,
        type: values.type,
        priority: values.priority,
        isRead: false,
        created_at: new Date().toISOString(),
        sender: 'current_user',
        category: values.category,
      };

      setNotifications(prev => [newNotification, ...prev]);
      setComposeModalVisible(false);
      composeForm.resetFields();
      message.success(t('notifications.sendSuccess'));
    } catch (error) {
      message.error(t('notifications.sendFailed'));
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      info: <InfoCircleOutlined className="notification-icon-info" />,
      warning: <WarningOutlined className="notification-icon-warning" />,
      error: <ExclamationCircleOutlined className="notification-icon-error" />,
      success: <CheckOutlined className="notification-icon-success" />,
    };
    return iconMap[type as keyof typeof iconMap];
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      low: 'default',
      medium: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colorMap[priority as keyof typeof colorMap];
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = !searchText || 
      notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesType = !filterType || notification.type === filterType;
    const matchesPriority = !filterPriority || notification.priority === filterPriority;

    return matchesSearch && matchesType && matchesPriority;
  });

  return (
    <div className={`settings-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="settings-header-card">
          <Space align="center">
            <BellOutlined className="monitoring-header-icon" />
            <Title level={2} className="monitoring-title">
              {t('notifications.notificationCenter')}
            </Title>
            <Badge count={stats.unread} size="small">
            <Button
              icon={<ReloadOutlined />}
              onClick={loadNotifications}
              loading={loading}
            >
              {t('common.refresh')}
            </Button>
            </Badge>
          </Space>
          <Text className="monitoring-description">
            {t('notifications.description')}
          </Text>
        </div>

        {/* 统计信息 */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">{t('notifications.totalNotifications')}</Text>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <NotificationOutlined className="text-2xl text-blue-500" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">{t('notifications.unread')}</Text>
                  <div className="text-2xl font-bold text-orange-500">{stats.unread}</div>
                </div>
                <BellOutlined className="text-2xl text-orange-500" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">{t('notifications.today')}</Text>
                  <div className="text-2xl font-bold text-green-500">{stats.today}</div>
                </div>
                <MessageOutlined className="text-2xl text-green-500" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">{t('notifications.urgent')}</Text>
                  <div className="text-2xl font-bold text-red-500">{stats.urgent}</div>
                </div>
                <ExclamationCircleOutlined className="text-2xl text-red-500" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* 过滤器 */}
        <Card className="mb-4">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder={t('notifications.searchPlaceholder')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder={t('notifications.type')}
                value={filterType}
                onChange={setFilterType}
                allowClear
                className="notification-input-full-width"
              >
                <Option value="info">{t('notifications.info')}</Option>
                <Option value="warning">{t('notifications.warning')}</Option>
                <Option value="error">{t('notifications.error')}</Option>
                <Option value="success">{t('notifications.success')}</Option>
              </Select>
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder={t('notifications.priority')}
                value={filterPriority}
                onChange={setFilterPriority}
                allowClear
                className="notification-input-full-width"
              >
                <Option value="low">{t('notifications.priorityLow')}</Option>
                <Option value="medium">{t('notifications.priorityMedium')}</Option>
                <Option value="high">{t('notifications.priorityHigh')}</Option>
                <Option value="urgent">{t('notifications.priorityUrgent')}</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Space>
                <Button
                  icon={<ReadOutlined />}
                  onClick={handleMarkAllAsRead}
                  disabled={stats.unread === 0}
                >
                  {t('notifications.markAllAsRead')}
                </Button>
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  onClick={() => setComposeModalVisible(true)}
                >
                  {t('notifications.sendNotification')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 通知列表 */}
        <Card>
          {filteredNotifications.length === 0 ? (
            <Empty description={t('notifications.noNotifications')} />
          ) : (
            <List
              dataSource={filteredNotifications}
              renderItem={(notification) => (
                <List.Item
                  key={notification.id}
                  className={!notification.isRead ? 'bg-blue-50' : ''}
                  actions={[
                    <Tooltip title={t('notifications.markAsRead')} key="read">
                      <Button
                        type="text"
                        icon={<CheckOutlined />}
                        size="small"
                        onClick={() => handleMarkAsRead(notification)}
                        disabled={notification.isRead}
                      />
                    </Tooltip>,
                    <Tooltip title={t('notifications.viewDetails')} key="detail">
                      <Button
                        type="text"
                        icon={<BellOutlined />}
                        size="small"
                        onClick={() => {
                          setSelectedNotification(notification);
                          setDetailModalVisible(true);
                        }}
                      />
                    </Tooltip>,
                    <Tooltip title={t('common.delete')} key="delete">
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={() => handleDeleteNotification(notification)}
                      />
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getNotificationIcon(notification.type)}
                        className="notification-item-transparent"
                      />
                    }
                    title={
                      <Space>
                        <Text strong={!notification.isRead}>
                          {notification.title}
                        </Text>
                        <Tag color={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Tag>
                        {!notification.isRead && <Badge status="processing" />}
                      </Space>
                    }
                    description={
                      <div>
                        <Text>{notification.content}</Text>
                        <div className="mt-1">
                          <Text type="secondary" className="notification-timestamp">
                            {new Date(notification.created_at).toLocaleString()}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        {/* 通知详情模态框 */}
        <Modal
          title={t('notifications.notificationDetails')}
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              {t('common.close')}
            </Button>,
          ]}
        >
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <Text strong>{t('notifications.title')}: </Text>
                <Text>{selectedNotification.title}</Text>
              </div>
              <div>
                <Text strong>{t('notifications.content')}: </Text>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <Text>{selectedNotification.content}</Text>
                </div>
              </div>
              <div>
                <Text strong>{t('notifications.type')}: </Text>
                <Tag color={getPriorityColor(selectedNotification.type)}>
                  {selectedNotification.type}
                </Tag>
              </div>
              <div>
                <Text strong>{t('notifications.priority')}: </Text>
                <Tag color={getPriorityColor(selectedNotification.priority)}>
                  {selectedNotification.priority}
                </Tag>
              </div>
              <div>
                <Text strong>{t('notifications.sendTime')}: </Text>
                <Text>{new Date(selectedNotification.created_at).toLocaleString()}</Text>
              </div>
              <div>
                <Text strong>{t('notifications.sender')}: </Text>
                <Text>{selectedNotification.sender}</Text>
              </div>
            </div>
          )}
        </Modal>

        {/* 发送通知模态框 */}
        <Modal
          title={t('notifications.sendNotification')}
          open={composeModalVisible}
          onCancel={() => setComposeModalVisible(false)}
          footer={null}
        >
          <Form form={composeForm} onFinish={handleComposeNotification} layout="vertical">
            <Form.Item
              name="title"
              label={t('notifications.title')}
              rules={[{ required: true, message: t('notifications.titleRequired') }]}
            >
              <Input placeholder={t('notifications.titlePlaceholder')} />
            </Form.Item>
            <Form.Item
              name="content"
              label={t('notifications.content')}
              rules={[{ required: true, message: t('notifications.contentRequired') }]}
            >
              <TextArea placeholder={t('notifications.contentPlaceholder')} rows={4} />
            </Form.Item>
            <Form.Item
              name="type"
              label={t('notifications.type')}
              rules={[{ required: true, message: t('notifications.typeRequired') }]}
            >
              <Select placeholder={t('notifications.typePlaceholder')}>
                <Option value="info">{t('notifications.info')}</Option>
                <Option value="warning">{t('notifications.warning')}</Option>
                <Option value="error">{t('notifications.error')}</Option>
                <Option value="success">{t('notifications.success')}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="priority"
              label={t('notifications.priority')}
              rules={[{ required: true, message: t('notifications.priorityRequired') }]}
            >
              <Select placeholder={t('notifications.priorityPlaceholder')}>
                <Option value="low">{t('notifications.priorityLow')}</Option>
                <Option value="medium">{t('notifications.priorityMedium')}</Option>
                <Option value="high">{t('notifications.priorityHigh')}</Option>
                <Option value="urgent">{t('notifications.priorityUrgent')}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="category"
              label={t('notifications.category')}
              rules={[{ required: true, message: t('notifications.categoryRequired') }]}
            >
              <Select placeholder={t('notifications.categoryPlaceholder')}>
                <Option value="system">{t('notifications.categorySystem')}</Option>
                <Option value="user">{t('notifications.categoryUser')}</Option>
                <Option value="security">{t('notifications.categorySecurity')}</Option>
                <Option value="maintenance">{t('notifications.categoryMaintenance')}</Option>
                <Option value="update">{t('notifications.categoryUpdate')}</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t('notifications.send')}
                </Button>
                <Button onClick={() => setComposeModalVisible(false)}>
                  {t('common.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
};

export default NotificationCenterPage;
