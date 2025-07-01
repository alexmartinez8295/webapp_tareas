import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './i18n';
import { AuthProvider } from './AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
);