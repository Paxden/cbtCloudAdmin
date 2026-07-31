/**
 * User Menu Component
 * Profile and logout menu
 */

import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const UserMenu = ({
  anchorEl,
  onOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ SAFE: Extract primitive values from user object
  const userName = typeof user?.name === 'string' ? user.name : 'User';
  const userEmail = typeof user?.email === 'string' ? user.email : '';

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={onOpen}
          edge="end"
          size="small"
          sx={{ p: 0, ml: 1 }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
            }}
          >
            {getInitials(userName)}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {String(userName)}
          </Typography>
          <Typography variant="caption" color="textSecondary" noWrap>
            {userEmail ? String(userEmail) : 'No email'}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={() => handleNavigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleNavigate('/change-password')}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleNavigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;