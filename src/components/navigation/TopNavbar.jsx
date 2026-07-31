/* eslint-disable no-unused-vars */
/**
 * Top Navbar Component
 * Main app bar with navigation controls
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import Breadcrumbs from './Breadcrumbs';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';
import { useAuth } from '../../hooks/useAuth';

// ✅ Role labels as a simple object
const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Administrator',
  TECH_ADMIN: 'Technical Administrator',
  EXAM_MANAGER: 'Exam Manager',
  CANDIDATE: 'Candidate',
};

const TopNavbar = ({
  drawerWidth,
  open,
  onDrawerToggle,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // ✅ SAFE: Get role label as string
  const userRole = typeof user?.role === 'string' ? user.role : 'EXAM_MANAGER';
  const roleLabel = ROLE_LABELS[userRole] || userRole;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Menu Toggle */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Breadcrumb */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Breadcrumbs />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search */}
          <Tooltip title="Search">
            <IconButton
              color="inherit"
              onClick={() => navigate('/question-bank/search')}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <UserMenu
            anchorEl={userMenuAnchor}
            onOpen={handleUserMenuOpen}
            onClose={handleUserMenuClose}
          />

          {/* ✅ Role Badge - label must be a STRING */}
          <Chip
            label={String(roleLabel)}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          />
        </Box>
      </Toolbar>

      {/* Notification Menu */}
      <NotificationMenu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
      />
    </AppBar>
  );
};

export default TopNavbar;