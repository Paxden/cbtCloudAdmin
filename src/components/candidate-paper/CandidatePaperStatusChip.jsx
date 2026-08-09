/**
 * CandidatePaperStatusChip Component
 * Displays candidate paper status with color coding
 * 
 * Location: src/components/packages/CandidatePaperStatusChip.jsx
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as GeneratedIcon,
  Verified as ValidatedIcon,
  Pending as PendingIcon,
  Error as FailedIcon,
  Archive as ArchivedIcon,
  HourglassEmpty as ProcessingIcon
} from '@mui/icons-material';

const STATUS_CONFIG = {
  GENERATED: {
    label: 'Generated',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    icon: GeneratedIcon
  },
  VALIDATED: {
    label: 'Validated',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    icon: ValidatedIcon
  },
  PENDING: {
    label: 'Pending',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: PendingIcon
  },
  PROCESSING: {
    label: 'Processing',
    color: '#0288d1',
    bgColor: '#e1f5fe',
    icon: ProcessingIcon
  },
  FAILED: {
    label: 'Failed',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: FailedIcon
  },
  ARCHIVED: {
    label: 'Archived',
    color: '#6c757d',
    bgColor: '#f5f5f5',
    icon: ArchivedIcon
  }
};

const CandidatePaperStatusChip = ({ status, size = 'medium', showIcon = true }) => {
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

export default CandidatePaperStatusChip;