/**
 * Assignment Status Chip Component
 * Displays assignment status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as RemovedIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const AssignmentStatusChip = ({ status, size = 'small', ...props }) => {
  const statusConfig = {
    ACTIVE: {
      label: 'Assigned',
      color: 'success',
      icon: <ActiveIcon />,
    },
    REMOVED: {
      label: 'Removed',
      color: 'error',
      icon: <RemovedIcon />,
    },
    PENDING: {
      label: 'Pending',
      color: 'warning',
      icon: <PendingIcon />,
    },
    INACTIVE: {
      label: 'Inactive',
      color: 'default',
      icon: <WarningIcon />,
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

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

export default AssignmentStatusChip;