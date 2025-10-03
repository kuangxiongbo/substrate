/**
 * 布局配置页面
 * 基于Spec-Kit方法实现的布局设置页面
 */

import React from 'react';
import { Row, Col, Card, Typography, Space, Divider } from 'antd';
import { SettingOutlined, LayoutOutlined, BgColorsOutlined } from '@ant-design/icons';
import LayoutSwitcher from '../../components/layout/LayoutSwitcher';
import EnhancedThemeSwitcher from '../../components/theme/EnhancedThemeSwitcher';
import './LayoutConfigPage.css';

const { Title, Text } = Typography;

const LayoutConfigPage: React.FC = () => {
  return (
    <div className="layout-config-page">
      <div className="page-header">
        <Space>
          <SettingOutlined className="page-icon" />
          <div>
            <Title level={2} className="page-title">
              界面设置
            </Title>
            <Text type="secondary" className="page-description">
              自定义您的界面布局和主题偏好
            </Text>
          </div>
        </Space>
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        {/* 布局设置 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <LayoutOutlined />
                <span>布局设置</span>
              </Space>
            }
            className="config-card"
          >
            <LayoutSwitcher />
          </Card>
        </Col>

        {/* 主题设置 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BgColorsOutlined />
                <span>主题设置</span>
              </Space>
            }
            className="config-card"
          >
            <EnhancedThemeSwitcher />
          </Card>
        </Col>
      </Row>

      {/* 预览区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title="实时预览"
            className="preview-card"
          >
            <div className="preview-content">
              <Text type="secondary">
                您的设置更改将立即生效，您可以在这里看到实时预览效果。
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LayoutConfigPage;
