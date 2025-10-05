import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { formatDate, formatRelativeTime } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">用户仪表板</h1>
              <p className="text-gray-600">欢迎回来，{user.email}</p>
            </div>
            <Button
              type="default"
              onClick={handleLogout}
              loading={isLoading}
            >
              登出
            </Button>
          </div>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 用户信息卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">账户信息</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">邮箱地址</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">账户状态</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.account_status === 'ACTIVE' ? 'bg-success-100 text-success-800' :
                        user.account_status === 'INACTIVE' ? 'bg-warning-100 text-warning-800' :
                        'bg-error-100 text-error-800'
                      }`}>
                        {user.account_status === 'ACTIVE' ? '活跃' :
                         user.account_status === 'INACTIVE' ? '未激活' : '已暂停'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">邮箱验证</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.email_verified ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                      }`}>
                        {user.email_verified ? '已验证' : '未验证'}
                      </span>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 安全状态卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">安全状态</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">失败登录次数</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.failed_login_attempts}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">最后登录</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.last_login_timestamp ? formatRelativeTime(user.last_login_timestamp) : '从未登录'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">密码最后修改</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.last_password_change ? formatRelativeTime(user.last_password_change) : '从未修改'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 账户时间线卡片 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">账户时间线</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">注册时间</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(user.registration_timestamp)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">同意条款</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.consent_timestamp ? formatDate(user.consent_timestamp) : '未同意'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">账户创建</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 快速操作 */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">快速操作</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button type="default" block>
                    修改密码
                  </Button>
                  <Button type="default" block>
                    导出数据
                  </Button>
                  <Button type="default" block>
                    安全设置
                  </Button>
                  <Button type="primary" danger block>
                    删除账户
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 系统信息 */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">系统信息</h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    这是一个演示用户认证系统，展示了完整的注册、登录、密码管理等功能。
                    系统使用现代化的技术栈构建，包括 React、TypeScript、Tailwind CSS 等。
                  </p>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">前端技术</h4>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li>• React 18 + TypeScript</li>
                        <li>• Tailwind CSS</li>
                        <li>• Zustand 状态管理</li>
                        <li>• React Router</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">后端技术</h4>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li>• FastAPI + Python</li>
                        <li>• SQLAlchemy ORM</li>
                        <li>• JWT 认证</li>
                        <li>• Argon2id 密码哈希</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;



















