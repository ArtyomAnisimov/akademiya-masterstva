/**
 * Боковое меню навигации
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Toolbar,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Assignment,
  Assessment,
  Settings,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Меню в зависимости от роли
  const getMenuItems = () => {
    const commonItems = [
      { path: '/', label: 'Дашборд', icon: <Dashboard /> },
    ];

    if (user?.role === 'ADMIN') {
      return [
        ...commonItems,
        { path: '/admin/users', label: 'Пользователи', icon: <People /> },
        { path: '/admin/courses', label: 'Курсы', icon: <School /> },
        { path: '/admin/assignments', label: 'Назначения', icon: <Assignment /> },
        { path: '/admin/reports', label: 'Отчеты', icon: <Assessment /> },
        { path: '/admin/settings', label: 'Настройки', icon: <Settings /> },
      ];
    } else if (user?.role === 'METHODIST') {
      return [
        ...commonItems,
        { path: '/methodist/courses', label: 'Мои курсы', icon: <School /> },
        { path: '/methodist/create', label: 'Создать курс', icon: <School /> },
      ];
    } else if (user?.role === 'DIRECTOR') {
      return [
        ...commonItems,
        { path: '/director/team', label: 'Команда', icon: <People /> },
        { path: '/director/assignments', label: 'Назначения', icon: <Assignment /> },
        { path: '/director/reports', label: 'Отчеты', icon: <Assessment /> },
      ];
    } else {
      return [
        ...commonItems,
        { path: '/specialist/courses', label: 'Мои курсы', icon: <School /> },
        { path: '/specialist/progress', label: 'Прогресс', icon: <Assessment /> },
      ];
    }
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', py: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'primary.main',
            fontSize: 28,
          }}
        >
          {user?.fullName?.charAt(0)+'C' || 'U'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
          {user?.fullName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.role || 'Пользователь'}
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <Logout color="error" />
            </ListItemIcon>
            <ListItemText primary="Выйти" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Мобильная версия */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Десктопная версия */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;