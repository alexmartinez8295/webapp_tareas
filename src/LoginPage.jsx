import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [errorMessage, setErrorMessage] = useState('');
  const [language, setLanguage] = useState(i18n.language);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrorMessage(''); // Clear previous error messages
    const result = await login(email, password);
    if (result.success) {
      navigate('/'); // Redirect to dashboard on successful login
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: isMobile ? 1 : 2, // Adjust padding for mobile
        boxSizing: 'border-box', // Include padding in element's total width and height
      }}
    >
      {/* Left Column: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: isMobile ? 1 : 2, // Padding for content inside column
          boxSizing: 'border-box',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 2 }}>
            <FormControl size="small">
              <InputLabel id="language-select-label">{t('Language')}</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label={t('Language')}
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            {t('Login')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label={t('Email')}
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label={t('Password')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errorMessage && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              {t('Login')}
            </Button>
            <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/register')}>
              {t("Don't have an account? Register")}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Right Column: Configurable Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          boxShadow: '0 0 8px rgba(0, 255, 0, 0.7)',
          p: 2,
          boxSizing: 'border-box',
          minHeight: isMobile ? '50vh' : 'auto', // Ensure it takes at least half screen on mobile
        }}
      >
        <Typography variant="h6" color="primary.main" align="center">
          {t('Your configurable content goes here (images, banners, etc.)')}
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
