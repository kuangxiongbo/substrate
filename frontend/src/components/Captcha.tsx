import React, { useState, useEffect } from 'react';
import { Input, Button, Space, message, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { request } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface CaptchaData {
  captcha_id: string;
  image: string;
  expires_in: number;
}

interface CaptchaProps {
  value?: string;
  onChange?: (value: string) => void;
  onCaptchaIdChange?: (captchaId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

const Captcha: React.FC<CaptchaProps> = ({
  value = '',
  onChange,
  onCaptchaIdChange,
  placeholder = '请输入验证码',
  disabled = false,
  size = 'middle'
}) => {
  const { currentTheme } = useTheme();
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // 生成验证码
  const generateCaptcha = async () => {
    setLoading(true);
    try {
      const response = await request.get<CaptchaData>('/v1/captcha/generate');
      setCaptchaData(response);
      if (onCaptchaIdChange) {
        onCaptchaIdChange(response.captcha_id);
      }
      message.success('验证码已刷新');
    } catch (error: any) {
      message.error(error.detail || '获取验证码失败');
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const verifyCaptcha = async (captchaId: string, captchaText: string) => {
    try {
      await request.post('/v1/captcha/verify', {
        captcha_id: captchaId,
        captcha_text: captchaText
      });
      return true;
    } catch (error: any) {
      message.error(error.detail || '验证码错误');
      return false;
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && captchaData) {
      verifyCaptcha(captchaData.captcha_id, inputValue);
    }
  };

  // 组件挂载时生成验证码
  useEffect(() => {
    generateCaptcha();
  }, []);

  // 同步外部value变化
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={`captcha-container ${currentTheme?.meta.id || 'light'}-theme`}>
      <Space.Compact className="captcha-input-group">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || loading}
          size={size}
          maxLength={4}
          className="captcha-input"
        />
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={generateCaptcha}
          disabled={disabled}
          loading={loading}
          size={size}
          title="刷新验证码"
        />
      </Space.Compact>
      
      {captchaData && (
        <div className="captcha-display">
          <div
            className="captcha-image-container"
            onClick={generateCaptcha}
            title="点击刷新验证码"
          >
            {loading ? (
              <Spin size="small" />
            ) : (
              <img
                src={captchaData.image}
                alt="验证码"
                className="captcha-image"
              />
            )}
          </div>
          <div className="captcha-hint">
            点击图片刷新验证码
          </div>
        </div>
      )}
    </div>
  );
};

export default Captcha;







