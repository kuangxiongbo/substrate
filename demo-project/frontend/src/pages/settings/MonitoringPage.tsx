/**
 * 样式监控页面
 * 实时监控样式合规性状态
 */

import React from 'react';
import { Card, Typography, Space, Divider } from 'antd';
import { MonitorOutlined, BarChartOutlined, ToolOutlined } from '@ant-design/icons';
import ComplianceDashboard from '../../components/monitoring/ComplianceDashboard';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/compliance-dashboard.css';
import '../../styles/settings-pages.css';

const { Title, Paragraph } = Typography;

const MonitoringPage: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <div className={`monitoring-page ${currentTheme?.meta.id || 'light'}-theme`}>
      <div className="page-header">
        <Space align="center">
          <MonitorOutlined className="monitoring-header-icon" />
          <div>
            <Title level={2} className="monitoring-title">
              样式合规监控
            </Title>
            <Paragraph type="secondary" className="monitoring-description">
              实时监控项目样式合规性，确保所有样式都通过主题包系统管理
            </Paragraph>
          </div>
        </Space>
      </div>

      <Divider />

      {/* 功能说明 */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            监控功能
          </Space>
        }
        className="monitoring-feature-card"
      >
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <MonitorOutlined />
            </div>
            <div className="feature-content">
              <h4>实时监控</h4>
              <p>持续监控项目文件，自动检测样式违规项</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <ToolOutlined />
            </div>
            <div className="feature-content">
              <h4>自动修复</h4>
              <p>支持自动修复常见的样式违规问题</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <BarChartOutlined />
            </div>
            <div className="feature-content">
              <h4>统计报告</h4>
              <p>提供详细的合规性统计和修复建议</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 监控仪表板 */}
      <ComplianceDashboard />

      {/* 使用说明 */}
      <Card 
        title="使用说明"
        className="monitoring-usage-card"
      >
        <div className="usage-guide">
          <div className="guide-section">
            <h4>1. 启动监控</h4>
            <p>点击"开始监控"按钮启动实时监控系统，系统将定期检查项目文件的样式合规性。</p>
          </div>
          
          <div className="guide-section">
            <h4>2. 查看违规</h4>
            <p>在"违规详情"表格中查看具体的违规文件和问题描述，包括违规类型和位置信息。</p>
          </div>
          
          <div className="guide-section">
            <h4>3. 自动修复</h4>
            <p>开启"自动修复"功能，系统将自动修复常见的样式违规问题，如内联样式和硬编码值。</p>
          </div>
          
          <div className="guide-section">
            <h4>4. 手动修复</h4>
            <p>根据"修复建议"手动修复复杂的违规问题，确保代码质量。</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonitoringPage;
