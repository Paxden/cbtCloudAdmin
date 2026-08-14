/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
/**
 * Sidebar Component
 * Main navigation sidebar with enhanced UX
 * 
 * Key Improvements:
 * - Smooth animations and transitions
 * - Better visual hierarchy
 * - Accessible keyboard navigation
 * - Responsive design
 * - Professional user profile section
 * - Loading states
 * - Tooltips for collapsed mode
 */

import { Box, List, Divider, Toolbar, Typography, Chip, Avatar, Badge, IconButton, Tooltip, Collapse } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import AppLogo from '../common/AppLogo';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuth } from '../../hooks/useAuth';
import { ChevronLeft, ChevronRight, Settings, Logout, Circle } from '@mui/icons-material';

// ✅ Role labels with professional formatting
const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Administrator',
  TECH_ADMIN: 'Technical Administrator',
  EXAM_MANAGER: 'Exam Manager',
  CANDIDATE: 'Candidate',
};

// ✅ Role-specific colors for visual distinction
const ROLE_COLORS = {
  SUPER_ADMIN: '#7c3aed', // Purple
  TECH_ADMIN: '#2563eb', // Blue
  EXAM_MANAGER: '#0d9488', // Teal
  CANDIDATE: '#059669', // Green
};

const Sidebar = ({ open, onClose, variant = 'permanent', collapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menu } = useNavigation();
  const { user, logout } = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 960);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 960);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get user initials with fallback
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

  // ✅ Safe data extraction with validation
  const userName = typeof user?.name === 'string' && user.name.trim() ? user.name : 'User';
  const userEmail = typeof user?.email === 'string' ? user.email : '';
  const userRole = typeof user?.role === 'string' ? user.role : 'EXAM_MANAGER';
  const roleLabel = ROLE_LABELS[userRole] || userRole;
  const roleColor = ROLE_COLORS[userRole] || '#64748b';

  // Determine if sidebar should be visible
  const isDrawerOpen = isMobile ? open : true;
  const isCollapsed = !isMobile && collapsed && !isHovering;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        transition: (theme) => theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        width: isCollapsed ? 72 : 280,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          ...(collapsed && {
            '& .sidebar-toggle': {
              opacity: 7,
            },
          }),
        },
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Section with Toggle Button */}
      <Toolbar
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 64,
          px: isCollapsed ? 1 : 2,
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: 1,
          }}
        >
          {!isCollapsed && <AppLogo />}
          {isCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                CBT
              </Typography>
            </Box>
          )}
        </Box>

        {/* Toggle Button - Only visible on desktop */}
        {!isMobile && (
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
            <IconButton
              onClick={onToggleCollapse}
              sx={{
                position: 'absolute',
                right: -12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 1,
                width: 24,
                height: 24,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
                opacity: isCollapsed ? 0 : 1,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1,
                },
                zIndex: 10,
              }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      {/* User Profile Section - Enhanced */}
      <Box
        sx={{
          p: isCollapsed ? 1.5 : 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: isCollapsed ? 'column' : 'column',
          alignItems: 'center',
          gap: isCollapsed ? 0.5 : 1,
          transition: 'all 0.2s',
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Circle
              sx={{
                fontSize: 12,
                color: 'success.main',
                bgcolor: 'background.paper',
                borderRadius: '50%',
              }}
            />
          }
        >
          <Avatar
            sx={{
              width: isCollapsed ? 40 : 56,
              height: isCollapsed ? 40 : 56,
              bgcolor: 'primary.main',
              color: '#fff',
              fontSize: isCollapsed ? '0.875rem' : '1.25rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => navigate('/profile')}
          >
            {getInitials(userName)}
          </Avatar>
        </Badge>

        <Collapse in={!isCollapsed} orientation="vertical" timeout={200}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              noWrap
              sx={{
                maxWidth: '100%',
                textAlign: 'center',
              }}
            >
              {userName}
            </Typography>
            
            {userEmail && (
              <Typography
                variant="caption"
                color="textSecondary"
                noWrap
                sx={{
                  maxWidth: '100%',
                  textAlign: 'center',
                }}
              >
                {userEmail}
              </Typography>
            )}

           
          </Box>
        </Collapse>
      </Box>

      {/* Navigation Menu */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 1,
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.300',
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'grey.400',
          },
        }}
      >
        <List disablePadding>
          {menu.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              depth={0}
              onClose={onClose}
              collapsed={isCollapsed}
              isMobile={isMobile}
            />
          ))}
        </List>
      </Box>

      {/* Footer with Actions */}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          p: isCollapsed ? 1 : 1.5,
        }}
      >
        <List disablePadding>
          {/* Settings */}
          <SidebarItem
            item={{
              id: 'settings',
              title: isCollapsed ? '' : 'Settings',
              icon: Settings,
              path: '/settings',
              isFooter: true,
            }}
            depth={0}
            onClose={onClose}
            collapsed={isCollapsed}
            isMobile={isMobile}
          />
          
          {/* Logout */}
          <SidebarItem
            item={{
              id: 'logout',
              title: isCollapsed ? '' : 'Logout',
              icon: Logout,
              path: null,
              isFooter: true,
              onClick: handleLogout,
            }}
            depth={0}
            onClose={onClose}
            collapsed={isCollapsed}
            isMobile={isMobile}
          />
        </List>

        {/* Version */}
        {!isCollapsed && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 1,
              fontSize: '0.65rem',
            }}
          >
            v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;