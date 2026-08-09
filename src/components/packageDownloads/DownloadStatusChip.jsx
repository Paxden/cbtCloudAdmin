/**
 * DownloadStatusChip Component
 * Displays download status with color coding
 * 
 * Location: src/components/packageDownloads/DownloadStatusChip.jsx
 */

import { Chip } from '@mui/material';
import {
  Pending as PendingIcon,
  PlayArrow as StartedIcon,
  CheckCircle as CompletedIcon,
  Error as FailedIcon,
  Cancel as CancelledIcon,
  Warning as ExpiredIcon
} from '@mui/icons-material';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: PendingIcon
  },
  STARTED: {
    label: 'Started',
    color: '#0288d1',
    bgColor: '#e1f5fe',
    icon: StartedIcon
  },
  COMPLETED: {
    label: 'Completed',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: CompletedIcon
  },
  FAILED: {
    label: 'Failed',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: FailedIcon
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: CancelledIcon
  },
  EXPIRED: {
    label: 'Expired',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: ExpiredIcon
  }
};

const DownloadStatusChip = ({ status, size = 'medium', showIcon = true }) => {
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

export default DownloadStatusChip;