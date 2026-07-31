/**
 * Recent Activities Component
 * List of recent system activities
 */

import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, Chip, Skeleton } from '@mui/material';
import {
  QuestionAnswer as QuestionIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  CloudUpload as UploadIcon,
  Publish as PublishIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const getActivityIcon = (action) => {
  const icons = {
    QUESTION_CREATED: <QuestionIcon />,
    QUESTION_APPROVED: <ApprovedIcon />,
    QUESTION_REJECTED: <RejectedIcon />,
    QUESTION_PUBLISHED: <PublishIcon />,
    MEDIA_UPLOADED: <UploadIcon />,
    QUESTION_UPDATED: <EditIcon />,
  };
  return icons[action] || <QuestionIcon />;
};

const getActivityColor = (action) => {
  const colors = {
    QUESTION_CREATED: 'primary',
    QUESTION_APPROVED: 'success',
    QUESTION_REJECTED: 'error',
    QUESTION_PUBLISHED: 'success',
    MEDIA_UPLOADED: 'info',
    QUESTION_UPDATED: 'warning',
  };
  return colors[action] || 'default';
};

const getActivityLabel = (action) => {
  const labels = {
    QUESTION_CREATED: 'Created',
    QUESTION_APPROVED: 'Approved',
    QUESTION_REJECTED: 'Rejected',
    QUESTION_PUBLISHED: 'Published',
    MEDIA_UPLOADED: 'Uploaded Media',
    QUESTION_UPDATED: 'Updated',
  };
  return labels[action] || action;
};

const RecentActivities = ({ activities, loading, onViewAll }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="textSecondary">No recent activities</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Recent Activities</Typography>
        {onViewAll && (
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={onViewAll}
          >
            View All
          </Typography>
        )}
      </Box>
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {activities.slice(0, 10).map((activity) => (
          <ListItem key={activity.id || activity._id} divider>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${getActivityColor(activity.action)}.light`, color: `${getActivityColor(activity.action)}.main` }}>
                {getActivityIcon(activity.action)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {activity.user?.name || 'System'}
                  </Typography>
                  <Chip
                    label={getActivityLabel(activity.action)}
                    size="small"
                    color={getActivityColor(activity.action)}
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    {activity.description || `${activity.action} performed`}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(activity.createdAt), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentActivities;