/**
 * User Menu Component
 * Profile and logout menu with enhanced UX
 * 
 * Key Improvements:
 * - Better visual hierarchy
 * - Hover effects
 * - Keyboard navigation
 * - Divider with gradient
 * - Profile section with avatar
 * - Accessibility improvements
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
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Help as HelpIcon,
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

  // ✅ Safe data extraction
  const userName = typeof user?.name === 'string' ? user.name : 'User';
  const userEmail = typeof user?.email === 'string' ? user.email : '';
  const userRole = typeof user?.role === 'string' ? user.role : '';

  // Menu items configuration
  const menuItems = [
    {
      label: 'Dashboard',
      icon: DashboardIcon,
      path: '/dashboard',
    },
    {
      label: 'Profile',
      icon: PersonIcon,
      path: '/profile',
    },
    {
      label: 'Change Password',
      icon: LockIcon,
      path: '/change-password',
    },
    {
      label: 'Settings',
      icon: SettingsIcon,
      path: '/settings',
    },
  ];

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={onOpen}
          edge="end"
          size="small"
          sx={{
            p: 0,
            ml: 0.5,
            '&:hover': {
              '& .MuiAvatar-root': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              cursor: 'pointer',
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
            minWidth: 260,
            maxWidth: 280,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          },
        }}
        MenuListProps={{
          sx: {
            py: 0.5,
          },
        }}
      >
        {/* User Info */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: alpha('#2563eb', 0.04),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.5,
          }}
        >
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              color: 'text.primary',
              fontSize: '0.9375rem',
            }}
          >
            {userName}
          </Typography>
          {userEmail && (
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                fontSize: '0.75rem',
              }}
            >
              {userEmail}
            </Typography>
          )}
          {userRole && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                color: 'primary.main',
                bgcolor: alpha('#2563eb', 0.08),
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              {userRole.replace('_', ' ')}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Menu Items */}
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => handleNavigate(item.path)}
            sx={{
              mx: 0.5,
              borderRadius: 1,
              py: 0.75,
              px: 1.5,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: alpha('#2563eb', 0.04),
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: 'text.secondary',
                transition: 'color 0.2s',
              }}
            >
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: 400,
              }}
            />
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5 }} />

        {/* Help */}
        <MenuItem
          onClick={() => handleNavigate('/help')}
          sx={{
            mx: 0.5,
            borderRadius: 1,
            py: 0.75,
            px: 1.5,
            '&:hover': {
              bgcolor: alpha('#2563eb', 0.04),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Help & Support"
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: 400,
            }}
          />
        </MenuItem>

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            mx: 0.5,
            borderRadius: 1,
            py: 0.75,
            px: 1.5,
            color: 'error.main',
            '&:hover': {
              bgcolor: alpha('#dc2626', 0.04),
              '& .MuiListItemIcon-root': {
                color: 'error.main',
              },
            },
            transition: 'all 0.2s',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: 'error.main',
              transition: 'color 0.2s',
            }}
          >
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;