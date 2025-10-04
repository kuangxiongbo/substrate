import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, isLoading, error, clearError } = useAuthStore();
  
  const [token, setToken] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  
  // 从URL参数获取token
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);
  
  // 清除错误信息
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  const handleVerify = async () => {
    if (!token) return;
    
    try {
      await verifyEmail({ token });
      setIsVerified(true);
    } catch (error) {
      // 错误已经在store中处理
    }
  };
  
  // 自动验证
  useEffect(() => {
    if (token && !isVerified && !error) {
      handleVerify();
    }
  }, [token]);
  
  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100">
              <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              邮箱验证成功
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              您的邮箱已成功验证。现在可以正常使用所有功能了。
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/login')}
                fullWidth
              >
                前往登录页面
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning-100">
              <svg className="h-6 w-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              验证链接无效
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              邮箱验证链接无效或已过期。请重新注册或联系管理员。
            </p>
            <div className="mt-6">
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                重新注册
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-100">
              <svg className="h-6 w-6 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              验证失败
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
            <div className="mt-6 space-y-4">
              <Button
                onClick={handleVerify}
                loading={isLoading}
                fullWidth
              >
                重试验证
              </Button>
              <Link
                to="/register"
                className="block font-medium text-primary-600 hover:text-primary-500 text-center"
              >
                重新注册
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
            <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            正在验证邮箱
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请稍候，我们正在验证您的邮箱地址...
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;




