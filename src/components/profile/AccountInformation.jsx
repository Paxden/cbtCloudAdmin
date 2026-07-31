/* eslint-disable no-unused-vars */
/**
 * Account Information Component
 * Display account details and security info
 */

import {
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Skeleton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  Devices as DevicesIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import RoleChip from '../chips/RoleChip';
import { useAuth } from '../../hooks/useAuth';

const InfoItem = ({ icon, label, value, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1 }}>
      <Box sx={{ color: 'text.secondary', mt: 0.5 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="textSecondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value || '-'}
        </Typography>
      </Box>
    </Box>
  );
};

const AccountInformation = ({ profile, loading, sessions }) => {
  const { user } = useAuth();
  const profileData = profile || user || {};

  // Get user initials for avatar fallback
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

  const items = [
    {
      key: 'name',
      icon: <PersonIcon fontSize="small" />,
      label: 'Full Name',
      value: profileData.name || 'Not set',
    },
    {
      key: 'email',
      icon: <EmailIcon fontSize="small" />,
      label: 'Email Address',
      value: profileData.email || 'Not set',
    },
    {
      key: 'role',
      icon: <SecurityIcon fontSize="small" />,
      label: 'Role',
      value: <RoleChip role={profileData.role} size="small" />,
    },
    {
      key: 'created',
      icon: <CalendarIcon fontSize="small" />,
      label: 'Account Created',
      value: profileData.createdAt
        ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'N/A',
    },
    {
      key: 'lastLogin',
      icon: <DevicesIcon fontSize="small" />,
      label: 'Last Login',
      value: profileData.lastLogin
        ? new Date(profileData.lastLogin).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })
        : 'N/A',
    },
    {
      key: 'lastLoginIp',
      icon: <LocationIcon fontSize="small" />,
      label: 'Last Login IP',
      value: profileData.lastLoginIp || 'N/A',
    },
    {
      key: 'passwordChanged',
      icon: <LockIcon fontSize="small" />,
      label: 'Password Last Changed',
      value: profileData.passwordChangedAt
        ? new Date(profileData.passwordChangedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'N/A',
    },
    {
      key: 'status',
      icon: <BadgeIcon fontSize="small" />,
      label: 'Account Status',
      value: (
        <Chip
          label={profileData.status || 'Active'}
          color={profileData.status === 'ACTIVE' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  // Filter out items with null/undefined values
  const visibleItems = items.filter((item) => {
    if (typeof item.value === 'string') {
      return item.value !== 'N/A' && item.value !== 'Not set';
    }
    return true;
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Account Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {visibleItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.key}>
            <InfoItem {...item} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Permissions Section */}
      {profileData.permissions && profileData.permissions.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Permissions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {profileData.permissions.map((permission) => (
              <Chip
                key={permission}
                label={permission}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Active Sessions */}
      {sessions && sessions.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Active Sessions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {sessions.slice(0, 3).map((session) => (
              <Chip
                key={session.id || session._id}
                label={`${session.device || 'Device'} ${session.browser ? `(${session.browser})` : ''}`}
                size="small"
                variant="outlined"
                color={session.isCurrent ? 'primary' : 'default'}
              />
            ))}
            {sessions.length > 3 && (
              <Chip
                label={`+${sessions.length - 3} more`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default AccountInformation;