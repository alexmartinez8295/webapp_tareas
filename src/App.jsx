import React, { useState } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import theme from './theme';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemText, CssBaseline, Button, CircularProgress, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';
import TasksPage from './TasksPage';
import DashboardPage from './DashboardPage';


import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import KanbanBoard from './KanbanBoard';
import TaskDetailPage from './TaskDetailPage';
import AllTasksPage from './AllTasksPage';
import { useAuth } from './AuthContext';

const drawerWidth = 240;

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { t, i18n } = useTranslation(); // Correctly get t and i18n from useTranslation
  const { logout, token } = useAuth(); // Get logout and token from useAuth

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                  position="fixed"
                  sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    ml: { md: `${drawerWidth}px` },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                  }}
                >
                  <Toolbar>
                    {isMobile && (
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                      >
                        <MenuIcon />
                      </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                      {t('Clarity Task Manager')}
                    </Typography>
                    <Button color="inherit" onClick={() => changeLanguage('en')}>EN</Button>
                    <Button color="inherit" onClick={() => changeLanguage('es')}>ES</Button>
                    {token && (
                      <Button color="inherit" onClick={logout}>
                        {t('Logout')}
                      </Button>
                    )}
                  </Toolbar>
                </AppBar>
                <Drawer
                  variant={isMobile ? "temporary" : "permanent"}
                  open={isMobile ? mobileOpen : true}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                  sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                  }}
                >
                  <Toolbar />
                  <Box sx={{ overflow: 'auto' }}>
                    <List>
                      <ListItem button component={Link} to="/" onClick={isMobile ? handleDrawerToggle : null}>
                        <ListItemText primary={t('Dashboard')} />
                      </ListItem>
                      <ListItem button component={Link} to="/projects" onClick={isMobile ? handleDrawerToggle : null}>
                        <ListItemText primary={t('Projects')} />
                      </ListItem>
                      <ListItem button component={Link} to="/tasks" onClick={isMobile ? handleDrawerToggle : null}>
                        <ListItemText primary={t('Tasks')} />
                      </ListItem>
                      
                    </List>
                  </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <Toolbar />
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:projectId" element={<TasksPage />} />
                    <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
                    <Route path="/tasks" element={<AllTasksPage />} />
                    
                  </Routes>
                </Box>
              </Box>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default function ThemedApp() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}