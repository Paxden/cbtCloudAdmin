/**
 * Notification Menu Component
 * Notifications dropdown
 */

import {
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

// Placeholder notifications
const NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Question Published',
    message: '5 questions were published successfully',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Bulk Import Complete',
    message: '100 questions imported from Excel',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Review Pending',
    message: '10 questions are waiting for review',
    time: '3 hours ago',
    read: true,
  },
];

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon color="success" fontSize="small" />;
    case 'warning':
      return <WarningIcon color="warning" fontSize="small" />;
    case 'error':
      return <ErrorIcon color="error" fontSize="small" />;
    default:
      return <InfoIcon color="info" fontSize="small" />;
  }
};

const NotificationMenu = ({ anchorEl, open, onClose }) => {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
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
          width: 360,
          maxHeight: 400,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          Notifications
          {unreadCount > 0 && (
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {/* Notification List */}
      {NOTIFICATIONS.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            No notifications
          </Typography>
        </Box>
      ) : (
        NOTIFICATIONS.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{
              px: 2,
              py: 1.5,
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: notification.read ? 'transparent' : 'action.hover',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
              {getIcon(notification.type)}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" noWrap>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))
      )}

      <Divider />

      {/* Footer */}
      <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
        <Typography
          variant="caption"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            onClose();
            // Navigate to notifications page
          }}
        >
          View all notifications
        </Typography>
      </Box>
    </Menu>
  );
};

export default NotificationMenu;