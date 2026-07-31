/**
 * Candidate Status Chip Component
 * Displays candidate status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pending as RegisteredIcon,
  Delete as DeletedIcon,
} from '@mui/icons-material';

const CandidateStatusChip = ({ status, size = 'small', ...props }) => {
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
    REGISTERED: {
      label: 'Registered',
      color: 'warning',
      icon: <RegisteredIcon />,
    },
    DELETED: {
      label: 'Deleted',
      color: 'error',
      icon: <DeletedIcon />,
    },
  };

  const config = statusConfig[status] || statusConfig.REGISTERED;

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

export default CandidateStatusChip;