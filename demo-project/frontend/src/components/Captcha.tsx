/**
 * 验证码组件
 */
import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/login-page.css';

interface CaptchaProps {
  onCaptchaIdChange: (captchaId: string) => void;
  onVerify?: (captchaId: string, captchaValue: string) => void;
  onRefresh?: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onCaptchaIdChange, onVerify, onRefresh }) => {
  const { currentTheme } = useTheme();
  const [captchaId, setCaptchaId] = useState<string>('');
  const [captchaValue, setCaptchaValue] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = async () => {
    try {
      const response = await fetch('/api/v1/captcha/generate');
      if (response.ok) {
        const data = await response.json();
        setCaptchaId(data.captcha_id);
        setImageUrl(data.image_url);
        setCaptchaValue('');
        onCaptchaIdChange(data.captcha_id);
      }
    } catch (error) {
      console.error('生成验证码失败:', error);
    }
  };

  const handleRefresh = () => {
    generateCaptcha();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleVerify = () => {
    if (captchaId && captchaValue && onVerify) {
      onVerify(captchaId, captchaValue);
    }
  };

  return (
    <div className={`captcha-container ${currentTheme?.meta.id || 'light'}-theme`}>
      <div className="captcha-input-group">
        <Input
          value={captchaValue}
          onChange={(e) => setCaptchaValue(e.target.value)}
          placeholder="请输入验证码"
          className="captcha-input"
          onPressEnter={handleVerify}
        />
        <div className="captcha-display">
          <div className="captcha-image-container">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="验证码"
                className="captcha-image"
                onClick={handleRefresh}
              />
            )}
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            size="small"
            className="captcha-refresh-btn"
          >
            刷新
          </Button>
        </div>
      </div>
      <div className="captcha-hint">
        点击图片或刷新按钮可更换验证码
      </div>
    </div>
  );
};

export default Captcha;
