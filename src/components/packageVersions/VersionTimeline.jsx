/* eslint-disable no-unused-vars */
/**
 * VersionTimeline Component
 * Displays version timeline with chronological events
 * 
 * Location: src/components/packageVersions/VersionTimeline.jsx
 */

import { Box, Typography, Paper, Skeleton, Chip } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  History as HistoryIcon,
  Archive as ArchiveIcon,
  Refresh as RegenerateIcon,
  Send as ReleaseIcon,
  Download as DownloadIcon,
  QrCode as GenerateIcon,
  Description as CandidateIcon,
  Verified as ValidateIcon,
  AddBox as CreateIcon
} from '@mui/icons-material';

const ACTIVITY_ICONS = {
  INSTANCE_CREATED: <CreateIcon />,
  PACKAGE_GENERATED: <GenerateIcon />,
  CANDIDATE_PAPERS_GENERATED: <CandidateIcon />,
  VALIDATION_PASSED: <ValidateIcon />,
  VALIDATION_FAILED: <ErrorIcon />,
  PACKAGE_RELEASED: <ReleaseIcon />,
  PACKAGE_DOWNLOADED: <DownloadIcon />,
  PACKAGE_REGENERATED: <RegenerateIcon />,
  VERSION_CREATED: <HistoryIcon />,
  VERSION_ARCHIVED: <ArchiveIcon />,
  PACKAGE_REVOKED: <ErrorIcon />,
  AUDIT_VIEWED: <HistoryIcon />
};

const ACTIVITY_COLORS = {
  INSTANCE_CREATED: 'primary',
  PACKAGE_GENERATED: 'success',
  CANDIDATE_PAPERS_GENERATED: 'info',
  VALIDATION_PASSED: 'success',
  VALIDATION_FAILED: 'error',
  PACKAGE_RELEASED: 'warning',
  PACKAGE_DOWNLOADED: 'success',
  PACKAGE_REGENERATED: 'warning',
  VERSION_CREATED: 'primary',
  VERSION_ARCHIVED: 'default',
  PACKAGE_REVOKED: 'error',
  AUDIT_VIEWED: 'default'
};

const ACTIVITY_LABELS = {
  INSTANCE_CREATED: 'Instance Created',
  PACKAGE_GENERATED: 'Package Generated',
  CANDIDATE_PAPERS_GENERATED: 'Candidate Papers Generated',
  VALIDATION_PASSED: 'Validation Passed',
  VALIDATION_FAILED: 'Validation Failed',
  PACKAGE_RELEASED: 'Package Released',
  PACKAGE_DOWNLOADED: 'Package Downloaded',
  PACKAGE_REGENERATED: 'Package Regenerated',
  VERSION_CREATED: 'Version Created',
  VERSION_ARCHIVED: 'Version Archived',
  PACKAGE_REVOKED: 'Package Revoked',
  AUDIT_VIEWED: 'Audit Viewed'
};

const VersionTimeline = ({ timeline, loading = false, onItemClick }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Box sx={{ mt: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="80%" />
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No timeline data available
        </Typography>
      </Paper>
    );
  }

  // Get the latest version number from the timeline
  const latestVersion = timeline.reduce((max, item) => {
    const version = item.versionNumber || item.version || 0;
    return Math.max(max, version);
  }, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Version Timeline
        </Typography>
        {latestVersion > 0 && (
          <Chip
            label={`Latest Version: V${latestVersion}`}
            color="primary"
            size="small"
          />
        )}
      </Box>

      <Timeline position="right">
        {timeline.map((item, index) => {
          const isLast = index === timeline.length - 1;
          const activityType = item.activityType || item.type || 'AUDIT_VIEWED';
          const icon = ACTIVITY_ICONS[activityType] || <HistoryIcon />;
          const color = ACTIVITY_COLORS[activityType] || 'default';
          const label = ACTIVITY_LABELS[activityType] || activityType;
          const isSuccess = item.status === 'SUCCESS' || item.status === 'COMPLETED';
          const isFailed = item.status === 'FAILED' || item.status === 'ERROR';
          const isPending = item.status === 'PENDING' || item.status === 'IN_PROGRESS';

          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="text.secondary" variant="caption">
                <Box>
                  <Typography variant="caption" display="block">
                    {new Date(item.timestamp || item.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.timestamp || item.createdAt).toLocaleTimeString()}
                  </Typography>
                </Box>
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot color={color}>
                  {icon}
                </TimelineDot>
                {!isLast && <TimelineConnector />}
              </TimelineSeparator>
              
              <TimelineContent>
                <Box
                  sx={{
                    cursor: onItemClick ? 'pointer' : 'default',
                    '&:hover': onItemClick ? {
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    } : {}
                  }}
                  onClick={() => onItemClick && onItemClick(item)}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight={500}>
                      {label}
                    </Typography>
                    {item.versionNumber && (
                      <Chip
                        label={`V${item.versionNumber}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {item.isLatest && (
                      <Chip
                        label="Latest"
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>
                  
                  {item.description && (
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  )}
                  
                  <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                    {item.performedBy && (
                      <Typography variant="caption" color="text.secondary">
                        By: {item.performedBy.name || item.performedBy}
                      </Typography>
                    )}
                    
                    {item.reason && (
                      <Typography variant="caption" color="text.secondary">
                        Reason: {item.reason}
                      </Typography>
                    )}
                    
                    {item.status && (
                      <Chip
                        label={item.status}
                        size="small"
                        color={isSuccess ? 'success' : isFailed ? 'error' : isPending ? 'warning' : 'default'}
                        variant="outlined"
                      />
                    )}
                    
                    {item.duration && (
                      <Typography variant="caption" color="text.secondary">
                        Duration: {item.duration}s
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Paper>
  );
};

export default VersionTimeline;