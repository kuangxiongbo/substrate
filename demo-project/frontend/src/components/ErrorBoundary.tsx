/**
 * 错误边界组件 - 捕获和处理React组件错误
 */
import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Result, Button, Typography, Space } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/error-boundary.css';

const { Title, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // 可以在这里添加错误上报逻辑
    // 例如发送到错误监控服务
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/overview';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container">
          <Result
            status="error"
            title="页面出现错误"
            subTitle="抱歉，页面遇到了一个错误，请尝试刷新页面或返回首页。"
            extra={
              <Space>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                >
                  刷新页面
                </Button>
                <Button 
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                >
                  返回首页
                </Button>
              </Space>
            }
          >
            <div className="error-details">
              <Title level={5}>错误详情：</Title>
              <Text code className="error-message">
                {this.state.error?.message}
              </Text>
              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="error-stack">
                  <summary>错误堆栈</summary>
                  <pre className="error-stack-content">
                    {this.state.error?.stack}
                  </pre>
                  <pre className="error-stack-content">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

// 包装了主题的ErrorBoundary
const ThemedErrorBoundary: React.FC<Props> = (props) => {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`error-boundary ${currentTheme?.meta.id || 'light'}-theme`}>
      <ErrorBoundary {...props} />
    </div>
  );
};

export default ThemedErrorBoundary;
