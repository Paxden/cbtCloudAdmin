/**
 * Blueprint Status Chip Component
 * Displays blueprint status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as ArchivedIcon,
  Pending as DraftIcon,
  Lock as LockedIcon,
} from '@mui/icons-material';

const BlueprintStatusChip = ({ status, size = 'small', isLocked = false, ...props }) => {
  const statusConfig = {
    DRAFT: {
      label: 'Draft',
      color: 'default',
      icon: <DraftIcon />,
    },
    ACTIVE: {
      label: 'Active',
      color: 'success',
      icon: <ActiveIcon />,
    },
    ARCHIVED: {
      label: 'Archived',
      color: 'error',
      icon: <ArchivedIcon />,
    },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={isLocked ? <LockedIcon /> : config.icon}
      size={size}
      variant={isLocked ? 'filled' : 'outlined'}
      {...props}
    />
  );
};

export default BlueprintStatusChip;