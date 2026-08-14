/* eslint-disable no-unused-vars */
/**
 * Top Navbar Component
 * Main app bar with navigation controls
 * 
 * Key Improvements:
 * - Better visual hierarchy
 * - Smooth transitions
 * - Search bar integration
 * - Notification bell with animation
 * - Responsive design
 * - Accessibility improvements
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Tooltip,
  Chip,
  Typography,
  InputBase,
  alpha,
  useTheme,
  useMediaQuery,
  Slide,
  useScrollTrigger,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import Breadcrumbs from './Breadcrumbs';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';
import { useAuth } from '../../hooks/useAuth';

// ✅ Role labels with professional formatting
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
  onThemeToggle,
  isDarkMode,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifications, setNotifications] = useState(3);

  // Hide on scroll
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

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

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchValue('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/question-bank/search?q=${encodeURIComponent(searchValue)}`);
      handleSearchClose();
    }
  };

  // ✅ Safe role extraction
  const userRole = typeof user?.role === 'string' ? user.role : 'EXAM_MANAGER';
  const roleLabel = ROLE_LABELS[userRole] || userRole;

  return (
    <Slide appear={false} direction="down" in={!trigger}>
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
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            px: { xs: 1.5, sm: 2 },
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Mobile Menu Toggle */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{
              display: { sm: 'none' },
              '&:hover': {
                bgcolor: alpha('#2563eb', 0.04),
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Breadcrumb */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: { xs: isSearchOpen ? 'none' : 'block', sm: 'block' },
            }}
          >
            <Breadcrumbs />
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: isSearchOpen ? 1 : 0,
            }}
          >
            {isSearchOpen ? (
              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  bgcolor: alpha('#000', 0.04),
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  transition: 'all 0.3s',
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase
                  placeholder="Search questions, exams..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  autoFocus
                  fullWidth
                  sx={{
                    fontSize: '0.875rem',
                    '& input': {
                      padding: '6px 0',
                    },
                  }}
                />
                <IconButton size="small" onClick={handleSearchClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Tooltip title="Search">
                <IconButton
                  color="inherit"
                  onClick={handleSearchOpen}
                  sx={{
                    display: { xs: 'flex', sm: 'flex' },
                    '&:hover': {
                      bgcolor: alpha('#2563eb', 0.04),
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            {/* Theme Toggle */}
            <Tooltip title={isDarkMode ? 'Light mode' : 'Dark mode'}>
              <IconButton
                color="inherit"
                onClick={onThemeToggle}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    bgcolor: alpha('#2563eb', 0.04),
                  },
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationOpen}
                sx={{
                  '&:hover': {
                    bgcolor: alpha('#2563eb', 0.04),
                  },
                  position: 'relative',
                }}
              >
                <Badge
                  badgeContent={notifications}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: notifications > 0 ? 'pulse 2s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(1)',
                        },
                        '50%': {
                          transform: 'scale(1.1)',
                        },
                        '100%': {
                          transform: 'scale(1)',
                        },
                      },
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Role Badge */}
            <Chip
              label={roleLabel}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                height: 24,
                fontSize: '0.65rem',
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />

            {/* User Menu */}
            <UserMenu
              anchorEl={userMenuAnchor}
              onOpen={handleUserMenuOpen}
              onClose={handleUserMenuClose}
            />
          </Box>
        </Toolbar>

        {/* Notification Menu */}
        <NotificationMenu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          onNotificationCountChange={setNotifications}
        />
      </AppBar>
    </Slide>
  );
};

export default TopNavbar;