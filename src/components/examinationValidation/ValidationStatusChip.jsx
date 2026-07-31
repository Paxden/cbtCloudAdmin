/**
 * Validation Status Chip Component
 * Displays validation status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as PassedIcon,
  Cancel as FailedIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

const ValidationStatusChip = ({ status, size = 'small', ...props }) => {
  // ✅ Safely get status string
  const statusStr = String(status || 'PENDING').toUpperCase();

  const statusConfig = {
    PASSED: {
      label: 'Passed',
      color: 'success',
      icon: <PassedIcon />,
    },
    FAILED: {
      label: 'Failed',
      color: 'error',
      icon: <FailedIcon />,
    },
    WARNING: {
      label: 'Warning',
      color: 'warning',
      icon: <WarningIcon />,
    },
    PENDING: {
      label: 'Pending',
      color: 'default',
      icon: <PendingIcon />,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      color: 'info',
      icon: <PendingIcon />,
    },
  };

  const config = statusConfig[statusStr] || statusConfig.PENDING;

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size={size}
      variant="filled"
      {...props}
    />
  );
};

export default ValidationStatusChip;