/**
 * Centre Status Chip Component
 * Displays centre status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pending as PendingIcon,
  Delete as DeletedIcon,
} from '@mui/icons-material';

const CentreStatusChip = ({ status, size = 'small', ...props }) => {
  const statusConfig = {
    ACTIVE: {
      label: 'Active',
      color: 'success',
      icon: <ActiveIcon />,
    },
    INACTIVE: {
      label: 'Inactive',
      color: 'default',
      icon: <InactiveIcon />,
    },
    PENDING: {
      label: 'Pending',
      color: 'warning',
      icon: <PendingIcon />,
    },
    DELETED: {
      label: 'Deleted',
      color: 'error',
      icon: <DeletedIcon />,
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

export default CentreStatusChip;