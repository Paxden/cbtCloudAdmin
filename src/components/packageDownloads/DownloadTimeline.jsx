/**
 * DownloadTimeline Component
 * Displays download timeline
 *
 * Location: src/components/packageDownloads/DownloadTimeline.jsx
 */

import { Box, Typography, Paper, Skeleton } from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Download as DownloadIcon,
  Security as SecurityIcon,
  Send as SendIcon,
} from "@mui/icons-material";

const DownloadTimeline = ({ timeline, loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Box sx={{ mt: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2, mb: 2 }}>
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
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          No timeline data available
        </Typography>
      </Paper>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case "release":
        return <SendIcon />;
      case "started":
        return <DownloadIcon />;
      case "transfer":
        return <PendingIcon />;
      case "checksum":
        return <SecurityIcon />;
      case "completed":
        return <SuccessIcon />;
      case "failed":
        return <ErrorIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "release":
        return "info";
      case "started":
        return "primary";
      case "transfer":
        return "warning";
      case "checksum":
        return "secondary";
      case "completed":
        return "success";
      case "failed":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Download Timeline
      </Typography>

      <Timeline position="right">
        {timeline.map((item, index) => {
          const isLast = index === timeline.length - 1;

          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="text.secondary" variant="caption">
                {new Date(item.timestamp).toLocaleString()}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={getColor(item.type)}>
                  {getIcon(item.type)}
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
                {item.details && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {item.details}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Paper>
  );
};

export default DownloadTimeline;
