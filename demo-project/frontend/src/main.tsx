import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { antdTheme } from './styles/antd-theme'
import './styles/global.css'
import './styles/theme-variables.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </ThemeProvider>
  </StrictMode>,
)
