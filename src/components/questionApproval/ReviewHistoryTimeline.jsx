/* eslint-disable no-unused-vars */
/**
 * Review History Timeline Component
 * Displays review history as a timeline
 */

import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const getActionConfig = (action) => {
  const configs = {
    SUBMITTED: { icon: <PendingIcon fontSize="small" />, color: 'warning' },
    APPROVED: { icon: <CheckCircleIcon fontSize="small" />, color: 'success' },
    REJECTED: { icon: <CancelIcon fontSize="small" />, color: 'error' },
  };
  return configs[action] || { icon: <HistoryIcon fontSize="small" />, color: 'default' };
};

const ReviewHistoryTimeline = ({ history, loading, onRefresh }) => {
  if (loading) {
    return (
      <Box>
        {[...Array(3)].map((_, index) => (
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

  if (!history || history.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No review history available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {history.map((item, index) => {
        const config = getActionConfig(item.action);
        const Icon = config.icon.type;

        return (
          <Box key={item._id || index}>
            <Box sx={{ display: 'flex', gap: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${config.color}.light`,
                    color: `${config.color}.main`,
                  }}
                >
                  {config.icon}
                </Box>
                {index < history.length - 1 && (
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
                    label={item.action}
                    size="small"
                    color={config.color}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </Stack>

                {item.reviewerId && (
                  <Typography variant="body2" fontWeight={500}>
                    By: {item.reviewerId?.name || 'System'}
                  </Typography>
                )}

                {item.comment && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      mt: 0.5,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">{item.comment}</Typography>
                  </Paper>
                )}

                {item.previousStatus && item.newStatus && (
                  <Typography variant="caption" color="textSecondary">
                    Status: {item.previousStatus} → {item.newStatus}
                  </Typography>
                )}
              </Box>
            </Box>
            {index < history.length - 1 && <Divider />}
          </Box>
        );
      })}
    </Box>
  );
};

export default ReviewHistoryTimeline;