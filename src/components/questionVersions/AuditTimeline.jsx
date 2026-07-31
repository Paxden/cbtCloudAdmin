/* eslint-disable no-unused-vars */
/**
 * Audit Timeline Component
 * Displays chronological audit events
 */

import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Skeleton,
  Paper,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  Publish as PublishIcon,
  Archive as ArchiveIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const getActionConfig = (action) => {
  const configs = {
    QUESTION_CREATED: { icon: <EditIcon fontSize="small" />, color: 'primary', label: 'Created' },
    QUESTION_UPDATED: { icon: <EditIcon fontSize="small" />, color: 'info', label: 'Updated' },
    SUBMITTED: { icon: <PendingIcon fontSize="small" />, color: 'warning', label: 'Submitted' },
    APPROVED: { icon: <CheckCircleIcon fontSize="small" />, color: 'success', label: 'Approved' },
    REJECTED: { icon: <CancelIcon fontSize="small" />, color: 'error', label: 'Rejected' },
    PUBLISHED: { icon: <PublishIcon fontSize="small" />, color: 'success', label: 'Published' },
    ARCHIVED: { icon: <ArchiveIcon fontSize="small" />, color: 'default', label: 'Archived' },
    VIEWED: { icon: <VisibilityIcon fontSize="small" />, color: 'info', label: 'Viewed' },
    VERSION_RESTORED: { icon: <HistoryIcon fontSize="small" />, color: 'warning', label: 'Restored' },
  };
  return configs[action] || { icon: <HistoryIcon fontSize="small" />, color: 'default', label: action };
};

const AuditTimeline = ({ events, loading, onRefresh }) => {
  if (loading) {
    return (
      <Box>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, py: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No audit events found
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {events.map((event, index) => {
        const config = getActionConfig(event.action);

        return (
          <Box key={event._id || index}>
            <Box sx={{ display: 'flex', gap: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `${config.color}.light`,
                    color: `${config.color}.main`,
                  }}
                >
                  {config.icon}
                </Avatar>
                {index < events.length - 1 && (
                  <Box
                    sx={{
                      width: 2,
                      flex: 1,
                      bgcolor: 'divider',
                      mt: 1,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ flex: 1, pt: 0.5 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={config.label}
                    size="small"
                    color={config.color}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(event.createdAt || event.timestamp), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2" fontWeight={500}>
                    {event.user?.name || event.userId?.name || 'System'}
                  </Typography>
                </Box>

                {event.description && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      mt: 0.5,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">{event.description}</Typography>
                  </Paper>
                )}

                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <Box sx={{ mt: 0.5 }}>
                    {event.metadata.comment && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        Comment: {event.metadata.comment}
                      </Typography>
                    )}
                    {event.metadata.previousStatus && event.metadata.newStatus && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        Status: {event.metadata.previousStatus} → {event.metadata.newStatus}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
            {index < events.length - 1 && <Divider />}
          </Box>
        );
      })}
    </Box>
  );
};

export default AuditTimeline;