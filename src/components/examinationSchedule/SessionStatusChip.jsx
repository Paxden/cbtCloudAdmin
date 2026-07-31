/**
 * Session Status Chip Component
 * Displays session status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as ScheduledIcon,
  Cancel as CancelledIcon,
  Pending as DraftIcon,
  PlayArrow as RunningIcon,
  CheckCircle as CompletedIcon,
  Warning as ConflictIcon,
} from '@mui/icons-material';

const SessionStatusChip = ({ status, size = 'small', ...props }) => {
  const statusConfig = {
    DRAFT: {
      label: 'Draft',
      color: 'default',
      icon: <DraftIcon />,
    },
    SCHEDULED: {
      label: 'Scheduled',
      color: 'primary',
      icon: <ScheduledIcon />,
    },
    RUNNING: {
      label: 'Running',
      color: 'info',
      icon: <RunningIcon />,
    },
    COMPLETED: {
      label: 'Completed',
      color: 'success',
      icon: <CompletedIcon />,
    },
    CANCELLED: {
      label: 'Cancelled',
      color: 'error',
      icon: <CancelledIcon />,
    },
    CONFLICT: {
      label: 'Conflict',
      color: 'warning',
      icon: <ConflictIcon />,
    },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size={size}
      variant="outlined"
      {...props}
    />
  );
};

export default SessionStatusChip;