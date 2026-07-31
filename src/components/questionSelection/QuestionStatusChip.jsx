/**
 * Question Status Chip Component
 * Displays question status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as LockedIcon,
  LockOpen as UnlockedIcon,
  CheckCircle as SelectedIcon,
  RemoveCircle as RemovedIcon,
} from '@mui/icons-material';

const QuestionStatusChip = ({ status, size = 'small', isLocked = false, ...props }) => {
  const statusConfig = {
    SELECTED: {
      label: 'Selected',
      color: 'success',
      icon: <SelectedIcon />,
    },
    LOCKED: {
      label: 'Locked',
      color: 'primary',
      icon: <LockedIcon />,
    },
    UNLOCKED: {
      label: 'Unlocked',
      color: 'default',
      icon: <UnlockedIcon />,
    },
    REMOVED: {
      label: 'Removed',
      color: 'error',
      icon: <RemovedIcon />,
    },
  };

  const config = statusConfig[status] || statusConfig.UNLOCKED;

  // If locked, override with locked config
  const displayConfig = isLocked ? statusConfig.LOCKED : config;

  return (
    <Chip
      label={displayConfig.label}
      color={displayConfig.color}
      icon={displayConfig.icon}
      size={size}
      variant={isLocked ? 'filled' : 'outlined'}
      {...props}
    />
  );
};

export default QuestionStatusChip;