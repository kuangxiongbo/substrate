import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { isValidEmail } from '../utils/helpers';

// 定义忘记密码数据类型
interface ForgotPasswordData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<ForgotPasswordData>({ email: '' });
  const [formErrors, setFormErrors] = useState<Partial<ForgotPasswordData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // 清除错误信息
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name as keyof ForgotPasswordData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<ForgotPasswordData> = {};
    
    if (!formData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!isValidEmail(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await forgotPassword(formData);
      setIsSubmitted(true);
    } catch (error) {
      // 错误已经在store中处理
    }
  };
  
  if (isSubmitted) {
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
              邮件已发送
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              我们已向 <strong>{formData.email}</strong> 发送了密码重置链接。
              请检查您的邮箱并点击链接来重置密码。
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                返回登录页面
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
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            忘记密码？
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            输入您的邮箱地址，我们将发送重置链接给您
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              label="邮箱地址"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              placeholder="请输入您的邮箱"
              leftIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
          </div>
          
          {error && (
            <div className="rounded-md bg-error-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-error-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? '发送中...' : '发送重置链接'}
          </Button>
          
          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              返回登录页面
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;






