/**
 * DistributionStatusChip Component
 * Displays distribution status with color coding
 * 
 * Location: src/components/packageDistribution/DistributionStatusChip.jsx
 */

import { Chip } from '@mui/material';
import {
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  PlayArrow as ReleasedIcon,
  Download as DownloadedIcon,
  CheckCircle as ReceivedIcon,
  Error as FailedIcon,
  Cancel as RevokedIcon
} from '@mui/icons-material';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: PendingIcon
  },
  APPROVED: {
    label: 'Approved',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    icon: ApprovedIcon
  },
  RELEASED: {
    label: 'Released',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: ReleasedIcon
  },
  DOWNLOADED: {
    label: 'Downloaded',
    color: '#0288d1',
    bgColor: '#e1f5fe',
    icon: DownloadedIcon
  },
  RECEIVED: {
    label: 'Received',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: ReceivedIcon
  },
  FAILED: {
    label: 'Failed',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: FailedIcon
  },
  REVOKED: {
    label: 'Revoked',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: RevokedIcon
  }
};

const DistributionStatusChip = ({ status, size = 'medium', showIcon = true }) => {
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

export default DistributionStatusChip;