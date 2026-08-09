/**
 * CentreDeliveryStatus Component
 * Displays centre delivery status with timeline
 * 
 * Location: src/components/packageDistribution/CentreDeliveryStatus.jsx
 */

import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Skeleton,
  Alert
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';

const CentreDeliveryStatus = ({ status, loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Divider sx={{ my: 2 }} />
        {[...Array(4)].map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Paper>
    );
  }

  if (!status) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No delivery status available
        </Typography>
      </Paper>
    );
  }

  const timelineItems = status.timeline || [];

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          {status.centreName || 'Centre'} Delivery Status
        </Typography>
        <Chip
          label={status.status || 'Active'}
          color={status.status === 'Active' ? 'success' : 'default'}
          size="small"
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Total Packages</Typography>
            <Typography variant="h6">{status.totalPackages || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Pending</Typography>
            <Typography variant="h6" color="warning.main">{status.pendingPackages || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Delivered</Typography>
            <Typography variant="h6" color="success.main">{status.deliveredPackages || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Failed</Typography>
            <Typography variant="h6" color="error.main">{status.failedPackages || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Timeline */}
      {timelineItems.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Status Timeline
          </Typography>
          <Timeline position="right">
            {timelineItems.map((item, index) => {
              const isLast = index === timelineItems.length - 1;
              const getIcon = () => {
                switch (item.type) {
                  case 'success':
                    return <SuccessIcon />;
                  case 'error':
                    return <ErrorIcon />;
                  case 'pending':
                    return <PendingIcon />;
                  case 'sent':
                    return <SendIcon />;
                  case 'downloaded':
                    return <DownloadIcon />;
                  default:
                    return <AssignmentIcon />;
                }
              };

              const getColor = () => {
                switch (item.type) {
                  case 'success':
                    return 'success';
                  case 'error':
                    return 'error';
                  case 'pending':
                    return 'warning';
                  default:
                    return 'info';
                }
              };

              return (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary" variant="caption">
                    {new Date(item.date).toLocaleString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getColor()}>
                      {getIcon()}
                    </TimelineDot>
                    {!isLast && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2">{item.title}</Typography>
                    {item.description && (
                      <Typography variant="caption" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </Box>
      )}

      {/* Active Issues */}
      {status.issues && status.issues.length > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Active Issues</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {status.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </Alert>
      )}
    </Paper>
  );
};

export default CentreDeliveryStatus;