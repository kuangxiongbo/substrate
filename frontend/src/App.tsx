import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import './styles/theme-variables.css';
import './styles/utility-classes.css';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverviewPage from './pages/OverviewPage';
import UserManagementPage from './pages/UserManagementPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import ThemeDemoPage from './pages/ThemeDemoPage';
import OperationLogsPage from './pages/OperationLogsPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import LayoutWrapper from './components/layout/LayoutWrapper';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 公共路由组件（已登录用户不能访问）
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        {/* 公共路由 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          }
        />
        
        {/* 管理面板路由 */}
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <OverviewPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <UserManagementPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <SystemSettingsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings/basic"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <SystemSettingsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings/admin"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <SystemSettingsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings/security"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <SystemSettingsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings/email"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <SystemSettingsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
               <Route
                 path="/system-settings/layout"
                 element={
                   <ProtectedRoute>
                     <LayoutWrapper>
                       <SystemSettingsPage />
                     </LayoutWrapper>
                   </ProtectedRoute>
                 }
               />
               <Route
                 path="/theme-demo"
                 element={
                   <ProtectedRoute>
                     <LayoutWrapper>
                       <ThemeDemoPage />
                     </LayoutWrapper>
                   </ProtectedRoute>
                 }
               />
               <Route
                 path="/operation-logs"
                 element={
                   <ProtectedRoute>
                     <LayoutWrapper>
                       <OperationLogsPage />
                     </LayoutWrapper>
                   </ProtectedRoute>
                 }
               />
        
        {/* Dashboard 路由 - 重定向到概览页面 */}
        <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
        
        {/* 默认重定向 */}
        <Route path="/" element={<Navigate to="/overview" replace />} />
        
        {/* 404页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;