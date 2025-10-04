/**
 * 合规监控仪表板
 * 实时显示样式合规性状态
 */

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Table, Tag, Alert, Button, Space, Progress, Tooltip, Badge } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  BugOutlined, 
  ToolOutlined,
  ReloadOutlined,
  SettingOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { globalMonitor, MonitoringResult, MonitoringConfig } from '../../utils/continuous-monitoring';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/compliance-dashboard.css';

interface ComplianceDashboardProps {
  className?: string;
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ className }) => {
  const { currentTheme } = useTheme();
  const [monitoringResult, setMonitoringResult] = useState<MonitoringResult | null>(null);
  const [isAutoFixEnabled, setIsAutoFixEnabled] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // 添加监控结果监听器
    const handleMonitoringResult = (result: MonitoringResult) => {
      setMonitoringResult(result);
    };

    globalMonitor.addListener(handleMonitoringResult);

    // 获取当前状态
    const status = globalMonitor.getStatus();
    setIsMonitoring(status.isRunning);
    setIsAutoFixEnabled(status.config.autoFix);

    return () => {
      globalMonitor.removeListener(handleMonitoringResult);
    };
  }, []);

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      globalMonitor.stop();
      setIsMonitoring(false);
    } else {
      globalMonitor.start();
      setIsMonitoring(true);
    }
  };

  const handleToggleAutoFix = () => {
    const newAutoFix = !isAutoFixEnabled;
    globalMonitor.updateConfig({ autoFix: newAutoFix });
    setIsAutoFixEnabled(newAutoFix);
  };

  const handleRefresh = () => {
    // 触发一次手动检查
    globalMonitor.start();
  };

  const getComplianceRate = (): number => {
    if (!monitoringResult) return 100;
    const { totalFiles, violationFiles } = monitoringResult;
    return totalFiles > 0 ? Math.round(((totalFiles - violationFiles) / totalFiles) * 100) : 100;
  };

  const getViolationColor = (count: number): string => {
    if (count === 0) return 'green';
    if (count <= 5) return 'orange';
    return 'red';
  };

  const getSeverityLevel = (): 'success' | 'warning' | 'error' => {
    if (!monitoringResult) return 'success';
    const { violationFiles } = monitoringResult;
    if (violationFiles === 0) return 'success';
    if (violationFiles <= 5) return 'warning';
    return 'error';
  };

  const columns = [
    {
      title: '文件',
      dataIndex: 'file',
      key: 'file',
      render: (file: string) => (
        <code className="file-path">{file}</code>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          'inline-style': { color: 'red', text: '内联样式' },
          'hardcoded-value': { color: 'orange', text: '硬编码值' },
          'missing-theme': { color: 'blue', text: '缺少主题' },
          'duplicate-key': { color: 'purple', text: '重复键' },
        };
        const config = typeConfig[type as keyof typeof typeConfig] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '位置',
      dataIndex: 'line',
      key: 'line',
      render: (line: number) => line ? `第 ${line} 行` : '-',
    },
  ];

  const statusConfig = {
    success: { 
      icon: <CheckCircleOutlined />, 
      color: 'success',
      message: '所有文件都符合主题包样式规范'
    },
    warning: { 
      icon: <ExclamationCircleOutlined />, 
      color: 'warning',
      message: '发现少量样式违规，建议及时修复'
    },
    error: { 
      icon: <BugOutlined />, 
      color: 'error',
      message: '发现多个样式违规，需要立即修复'
    },
  };

  const currentStatus = statusConfig[getSeverityLevel()];

  return (
    <div className={`compliance-dashboard ${currentTheme?.meta.id || 'light'}-theme ${className || ''}`}>
      {/* 状态概览 */}
      <Card 
        title={
          <Space>
            <Badge 
              status={isMonitoring ? 'processing' : 'default'} 
              text="样式合规监控"
            />
            {monitoringResult && (
              <Tag color={getViolationColor(monitoringResult.violationFiles)}>
                {monitoringResult.violationFiles} 个违规
              </Tag>
            )}
          </Space>
        }
        extra={
          <Space>
            <Tooltip title={isAutoFixEnabled ? '关闭自动修复' : '开启自动修复'}>
              <Button 
                type={isAutoFixEnabled ? 'primary' : 'default'}
                icon={<ToolOutlined />}
                size="small"
                onClick={handleToggleAutoFix}
              >
                {isAutoFixEnabled ? '自动修复开' : '自动修复关'}
              </Button>
            </Tooltip>
            <Button 
              icon={<ReloadOutlined />}
              size="small"
              onClick={handleRefresh}
            >
              刷新
            </Button>
            <Button 
              type={isMonitoring ? 'primary' : 'default'}
              icon={<EyeOutlined />}
              size="small"
              onClick={handleToggleMonitoring}
            >
              {isMonitoring ? '停止监控' : '开始监控'}
            </Button>
          </Space>
        }
      >
        {/* 状态提示 */}
        <Alert
          message={currentStatus.message}
          type={currentStatus.color}
          icon={currentStatus.icon}
          showIcon
          className="compliance-alert"
        />

        {/* 统计卡片 */}
        <div className="compliance-stats">
          <div className="stat-card">
            <Statistic
              title="合规率"
              value={getComplianceRate()}
              suffix="%"
              valueStyle={{ 
                color: getViolationColor(100 - getComplianceRate()),
                fontSize: '24px'
              }}
            />
            <Progress 
              percent={getComplianceRate()} 
              strokeColor={getViolationColor(100 - getComplianceRate())}
              showInfo={false}
              size="small"
            />
          </div>

          <div className="stat-card">
            <Statistic
              title="检查文件"
              value={monitoringResult?.totalFiles || 0}
              suffix="个"
              valueStyle={{ color: 'var(--color-primary)' }}
            />
          </div>

          <div className="stat-card">
            <Statistic
              title="违规文件"
              value={monitoringResult?.violationFiles || 0}
              suffix="个"
              valueStyle={{ 
                color: getViolationColor(monitoringResult?.violationFiles || 0),
              }}
            />
          </div>

          <div className="stat-card">
            <Statistic
              title="最后检查"
              value={monitoringResult?.timestamp.toLocaleTimeString() || '未检查'}
              valueStyle={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* 违规详情 */}
        {monitoringResult && monitoringResult.details.length > 0 && (
          <Card 
            title="违规详情" 
            size="small" 
            className="compliance-detail-card"
          >
            <Table
              columns={columns}
              dataSource={monitoringResult.details}
              rowKey={(record, index) => `${record.file}-${index}`}
              pagination={{ pageSize: 10, size: 'small' }}
              size="small"
            />
          </Card>
        )}

        {/* 修复建议 */}
        {monitoringResult && monitoringResult.suggestions.length > 0 && (
          <Card 
            title="修复建议" 
            size="small" 
            className="compliance-detail-card"
          >
            <ul className="suggestions-list">
              {monitoringResult.suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item">
                  {suggestion}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default ComplianceDashboard;
