/* eslint-disable no-unused-vars */
/**
 * Profile Card Component
 * Displays user profile information
 */

import { Paper, Avatar, Box, Typography,  Stack, Divider, Skeleton } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import RoleChip from '../chips/RoleChip';
import StatusChip from '../chips/StatusChip';
import { format } from 'date-fns';

const ProfileCard = ({ profile, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Skeleton variant="circular" width={100} height={100} />
        <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="40%" height={20} />
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={80} height={30} />
          <Skeleton variant="rectangular" width={80} height={30} />
        </Box>
      </Paper>
    );
  }

  if (!profile) {
    return (
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography color="textSecondary">No profile data available</Typography>
      </Paper>
    );
  }

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

  return (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar
        sx={{
          width: 100,
          height: 100,
          bgcolor: 'primary.main',
          fontSize: 36,
          mb: 2,
        }}
        src={profile.avatar}
      >
        {getInitials(profile.name)}
      </Avatar>

      <Typography variant="h5" fontWeight={600}>
        {profile.name}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {profile.email}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <RoleChip role={profile.role} />
        <StatusChip status={profile.status} />
      </Stack>

      <Divider sx={{ my: 3, width: '100%' }} />

      <Box sx={{ width: '100%' }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="textSecondary">
              Member Since
            </Typography>
            <Typography variant="body2">
              {format(new Date(profile.createdAt), 'dd MMM yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="textSecondary">
              Last Login
            </Typography>
            <Typography variant="body2">
              {format(new Date(profile.lastLogin), 'dd MMM yyyy, HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="textSecondary">
              Phone
            </Typography>
            <Typography variant="body2">
              {profile.phone || 'Not set'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="textSecondary">
              Password Last Changed
            </Typography>
            <Typography variant="body2">
              {profile.passwordLastChanged
                ? format(new Date(profile.passwordLastChanged), 'dd MMM yyyy')
                : 'Never'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProfileCard;