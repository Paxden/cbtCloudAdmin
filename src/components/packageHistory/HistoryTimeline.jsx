/* eslint-disable no-unused-vars */
/**
 * HistoryTimeline Component
 * Displays package history timeline
 * 
 * Location: src/components/packageHistory/HistoryTimeline.jsx
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
  AddBox as CreateIcon,
  Visibility as AuditIcon,
  Cancel as RevokeIcon,
  Delete as DeleteIcon
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
  PACKAGE_REVOKED: <RevokeIcon />,
  PACKAGE_DELETED: <DeleteIcon />,
  AUDIT_VIEWED: <AuditIcon />
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
  PACKAGE_DELETED: 'error',
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
  PACKAGE_DELETED: 'Package Deleted',
  AUDIT_VIEWED: 'Audit Viewed'
};

const HistoryTimeline = ({ timeline, loading = false, onItemClick }) => {
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

  // Group timeline items by date
  const groupedTimeline = timeline.reduce((groups, item) => {
    const date = new Date(item.timestamp || item.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTimeline).sort((a, b) => 
    new Date(a) - new Date(b)
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Activity Timeline
        </Typography>
        <Chip
          label={`${timeline.length} activities`}
          color="primary"
          size="small"
          variant="outlined"
        />
      </Box>

      <Timeline position="right">
        {sortedDates.map((date, dateIndex) => {
          const items = groupedTimeline[date];
          const isLastDate = dateIndex === sortedDates.length - 1;

          return items.map((item, index) => {
            const isLast = index === items.length - 1 && isLastDate;
            const activityType = item.activityType || item.type || 'AUDIT_VIEWED';
            const icon = ACTIVITY_ICONS[activityType] || <HistoryIcon />;
            const color = ACTIVITY_COLORS[activityType] || 'default';
            const label = ACTIVITY_LABELS[activityType] || activityType;
            const isSuccess = item.status === 'SUCCESS' || item.status === 'COMPLETED';
            const isFailed = item.status === 'FAILED' || item.status === 'ERROR';
            const isPending = item.status === 'PENDING' || item.status === 'IN_PROGRESS';

            // Show date header only for first item in each date group
            const showDateHeader = index === 0;

            return (
              <TimelineItem key={item._id || index}>
                <TimelineOppositeContent color="text.secondary" variant="caption">
                  <Box>
                    {showDateHeader && (
                      <Typography variant="caption" display="block" fontWeight={500} color="text.primary">
                        {date}
                      </Typography>
                    )}
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
                      p: 1,
                      borderRadius: 1,
                      '&:hover': onItemClick ? {
                        backgroundColor: 'action.hover'
                      } : {}
                    }}
                    onClick={() => onItemClick && onItemClick(item)}
                  >
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="body2" fontWeight={500}>
                        {label}
                      </Typography>
                      {item.packageName && (
                        <Chip
                          label={item.packageName}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {item.version && (
                        <Chip
                          label={`V${item.version}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    {item.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.description}
                      </Typography>
                    )}
                    
                    <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                      {item.performedBy && (
                        <Typography variant="caption" color="text.secondary">
                          By: {item.performedBy.name || item.performedBy}
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
                      
                      {item.severity && (
                        <Chip
                          label={item.severity}
                          size="small"
                          color={item.severity === 'CRITICAL' ? 'error' : item.severity === 'WARNING' ? 'warning' : 'info'}
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
          });
        })}
      </Timeline>
    </Paper>
  );
};

export default HistoryTimeline;