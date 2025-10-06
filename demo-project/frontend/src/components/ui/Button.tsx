/**
 * 自定义按钮组件
 */
import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const Button: React.FC<ButtonProps> = (props) => {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`custom-button ${currentTheme?.meta.id || 'light'}-theme`}>
      <AntButton {...props} />
    </div>
  );
};

export { Button };
export default Button;



