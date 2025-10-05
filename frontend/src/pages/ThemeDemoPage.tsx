/**
 * 主题演示页面
 */
import React from 'react';
import { Card, Row, Col, Button, Input, Select, Switch, Tag, Badge, Avatar, Progress, Space, Typography, Alert } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/settings-pages.css';

const { Title, Text } = Typography;

const ThemeDemoPage: React.FC = () => {
  const { currentTheme, switchTheme } = useTheme();

  const handleThemeSwitch = (themeId: string) => {
    switchTheme(themeId);
  };

  return (
    <div className={`theme-demo-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <Card
        title={
          <Space>
            <SettingOutlined />
            <Title level={3}>主题演示</Title>
          </Space>
        }
        className="settings-header-card"
      >
        <Alert
          message="主题演示页面"
          description="这里展示了当前主题下的各种组件样式效果"
          type="info"
          showIcon
          className="demo-alert"
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card title="按钮组件" className="settings-card">
              <Space direction="vertical" className="demo-space">
                <Button type="primary">主要按钮</Button>
                <Button>默认按钮</Button>
                <Button type="dashed">虚线按钮</Button>
                <Button type="text">文本按钮</Button>
                <Button danger>危险按钮</Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card title="表单组件" className="settings-card">
              <Space direction="vertical" className="demo-space">
                <Input placeholder="输入框" />
                <Select placeholder="选择器" className="demo-select">
                  <Select.Option value="option1">选项1</Select.Option>
                  <Select.Option value="option2">选项2</Select.Option>
                </Select>
                <Switch defaultChecked />
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card title="其他组件" className="settings-card">
              <Space direction="vertical" className="demo-space">
                <Tag color="blue">标签</Tag>
                <Badge count={5}>
                  <Avatar icon={<UserOutlined />} />
                </Badge>
                <Progress percent={70} />
              </Space>
            </Card>
          </Col>
        </Row>

        <Card title="主题切换" className="settings-card demo-theme-card">
          <Space>
            <Button 
              type={currentTheme?.meta.id === 'light' ? 'primary' : 'default'}
              onClick={() => handleThemeSwitch('light')}
            >
              浅色主题
            </Button>
            <Button 
              type={currentTheme?.meta.id === 'dark' ? 'primary' : 'default'}
              onClick={() => handleThemeSwitch('dark')}
            >
              深色主题
            </Button>
          </Space>
          <div className="demo-theme-info">
            <Text type="secondary">
              当前主题: {currentTheme?.meta.name || '未知'}
            </Text>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default ThemeDemoPage;
