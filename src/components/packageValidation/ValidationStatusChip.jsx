/**
 * ValidationStatusChip Component
 * Displays validation status with color coding
 * 
 * Location: src/components/packageValidation/ValidationStatusChip.jsx
 */

import { Chip } from '@mui/material';
import {
  Pending as PendingIcon,
  CheckCircle as ValidIcon,
  Warning as WarningIcon,
  Error as FailedIcon,
  Cancel as RejectedIcon,
  CheckCircle as ReadyIcon
} from '@mui/icons-material';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: PendingIcon
  },
  VALID: {
    label: 'Valid',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: ValidIcon
  },
  WARNING: {
    label: 'Warning',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: WarningIcon
  },
  FAILED: {
    label: 'Failed',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: FailedIcon
  },
  REJECTED: {
    label: 'Rejected',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: RejectedIcon
  },
  READY: {
    label: 'Ready for Distribution',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    icon: ReadyIcon
  }
};

const ValidationStatusChip = ({ status, size = 'medium', showIcon = true }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const IconComponent = config.icon;

  return (
    <Chip
      icon={showIcon ? <IconComponent /> : undefined}
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: 500,
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
    />
  );
};

export default ValidationStatusChip;