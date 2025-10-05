/**
 * 自定义输入框组件
 */
import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const Input: React.FC<InputProps> = (props) => {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`custom-input ${currentTheme?.meta.id || 'light'}-theme`}>
      <AntInput {...props} />
    </div>
  );
};

export { Input };
export default Input;
