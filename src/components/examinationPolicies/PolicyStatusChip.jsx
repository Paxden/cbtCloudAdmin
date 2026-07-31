/**
 * Policy Status Chip Component
 * Displays policy status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as ArchivedIcon,
  Pending as DraftIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const PolicyStatusChip = ({ status, size = 'small', ...props }) => {
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
    WARNING: {
      label: 'Warning',
      color: 'warning',
      icon: <WarningIcon />,
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

export default PolicyStatusChip;