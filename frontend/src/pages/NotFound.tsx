import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/login-page.css';

const NotFound: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <div className={`not-found-page min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${currentTheme?.meta.id || 'light'}-theme`}>
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h1 className="mt-6 text-6xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">页面未找到</h2>
          <p className="mt-2 text-gray-600">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => window.history.back()}
            type="default"
            block
          >
            返回上一页
          </Button>
          
          <Link to="/dashboard">
            <Button block>
              返回首页
            </Button>
          </Link>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>如果您认为这是一个错误，请联系管理员。</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

















