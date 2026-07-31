/* eslint-disable no-unused-vars */
/**
 * Sidebar Component
 * Main navigation sidebar
 */

import { Box, List, Divider, Toolbar, Typography, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import AppLogo from '../common/AppLogo';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuth } from '../../hooks/useAuth';

// ✅ Role labels as a simple object
const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Administrator',
  TECH_ADMIN: 'Technical Administrator',
  EXAM_MANAGER: 'Exam Manager',
  CANDIDATE: 'Candidate',
};

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { menu } = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get user initials
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
  const userRole = typeof user?.role === 'string' ? user.role : 'EXAM_MANAGER';
  const roleLabel = ROLE_LABELS[userRole] || userRole;

  // ✅ DEBUG: Log to see what's in the user object
  // console.log('🔍 Sidebar user:', user);
  // console.log('🔍 Sidebar userName:', userName);
  // console.log('🔍 Sidebar userRole:', userRole);
  // console.log('🔍 Sidebar roleLabel:', roleLabel);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Logo */}
      <Toolbar
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 64,
        }}
      >
        <AppLogo />
      </Toolbar>

      {/* User Info */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            fontSize: '1.25rem',
          }}
        >
          {getInitials(userName)}
        </Avatar>
        <Typography variant="body2" fontWeight={600} noWrap>
          {String(userName)}
        </Typography>
        {userEmail && (
          <Typography variant="caption" color="textSecondary" noWrap>
            {String(userEmail)}
          </Typography>
        )}
        {/* ✅ Chip label must be a STRING */}
        <Chip
          label={String(roleLabel)}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List disablePadding>
          {menu.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              onClose={onClose}
            />
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="textSecondary">
          v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;