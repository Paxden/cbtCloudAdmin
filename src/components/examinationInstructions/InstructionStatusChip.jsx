/**
 * Instruction Status Chip Component
 * Displays instruction status with appropriate colors
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as PublishedIcon,
  Cancel as ArchivedIcon,
  Pending as DraftIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const InstructionStatusChip = ({ status, size = 'small', ...props }) => {
  const statusConfig = {
    DRAFT: {
      label: 'Draft',
      color: 'default',
      icon: <DraftIcon />,
    },
    PUBLISHED: {
      label: 'Published',
      color: 'success',
      icon: <PublishedIcon />,
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

export default InstructionStatusChip;