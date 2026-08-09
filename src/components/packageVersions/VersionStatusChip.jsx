/**
 * VersionStatusChip Component
 * Displays version status with color coding
 * 
 * Location: src/components/packageVersions/VersionStatusChip.jsx
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  Archive as ArchivedIcon,
  History as SupersededIcon,
  Cancel as RevokedIcon,
  Error as FailedIcon
} from '@mui/icons-material';

const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Active',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: ActiveIcon
  },
  ARCHIVED: {
    label: 'Archived',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: ArchivedIcon
  },
  SUPERSEDED: {
    label: 'Superseded',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: SupersededIcon
  },
  REVOKED: {
    label: 'Revoked',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: RevokedIcon
  },
  FAILED: {
    label: 'Failed',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: FailedIcon
  }
};

const VersionStatusChip = ({ status, size = 'medium', showIcon = true }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ACTIVE;
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

export default VersionStatusChip;