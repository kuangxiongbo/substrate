import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { isValidEmail } from '../utils/helpers';

// 定义登录凭据类型
interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    remember_me: false,
  });
  
  const [formErrors, setFormErrors] = useState<Partial<LoginCredentials>>({});
  const [systemTitle, setSystemTitle] = useState('Spec-Kit');
  const [systemLogo, setSystemLogo] = useState('/assets/logo.png');
  
  // 如果已经登录，重定向到仪表板
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // 清除错误信息
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // 加载系统配置
  useEffect(() => {
    const loadSystemConfig = () => {
      const savedTitle = localStorage.getItem('systemTitle');
      const savedLogo = localStorage.getItem('systemLogo');
      
      if (savedTitle) {
        setSystemTitle(savedTitle);
        document.title = savedTitle;
      }
      if (savedLogo) {
        setSystemLogo(savedLogo);
      }
    };

    loadSystemConfig();

    // 监听系统配置更改事件
    const handleConfigChange = (event: CustomEvent) => {
      const { systemTitle: title, logo } = event.detail || {};
      if (title) {
        setSystemTitle(title);
        document.title = title;
      }
      if (logo) {
        setSystemLogo(logo);
      }
    };

    // 监听localStorage变化
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'systemTitle' && event.newValue) {
        setSystemTitle(event.newValue);
        document.title = event.newValue;
      }
      if (event.key === 'systemLogo' && event.newValue) {
        setSystemLogo(event.newValue);
      }
    };

    window.addEventListener('systemTitleChanged', handleConfigChange as EventListener);
    window.addEventListener('logoChanged', handleConfigChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('systemTitleChanged', handleConfigChange as EventListener);
      window.removeEventListener('logoChanged', handleConfigChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // 清除对应字段的错误
    if (formErrors[name as keyof LoginCredentials]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};
    
    if (!formData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!isValidEmail(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.password) {
      errors.password = '请输入密码';
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
      await login(formData);
      // 登录成功后会通过useEffect重定向
    } catch (error) {
      // 错误已经在store中处理
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo和系统标题区域 */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              {systemLogo && systemLogo !== '/assets/logo.png' ? (
                <img 
                  src={systemLogo} 
                  alt="系统Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
              ) : null}
              <svg 
                className="w-8 h-8 text-white" 
                style={{ display: systemLogo && systemLogo !== '/assets/logo.png' ? 'none' : 'block' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{systemTitle}</h1>
          <p className="text-sm text-gray-600">多用户管理系统</p>
        </div>

        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            登录您的账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            或者{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              创建新账户
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="请输入您的邮箱"
              prefix={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
            
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="请输入您的密码"
              prefix={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={formData.remember_me}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>
            
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                忘记密码？
              </Link>
            </div>
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
            type="primary"
            block
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">演示账户</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>测试账户: demo@example.com</p>
            <p>测试密码: MySecure2024!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;




















