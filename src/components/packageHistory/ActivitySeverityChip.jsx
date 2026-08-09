/**
 * ActivitySeverityChip Component
 * Displays activity severity with color coding
 * 
 * Location: src/components/packageHistory/ActivitySeverityChip.jsx
 */

import { Chip } from '@mui/material';
import {
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as CriticalIcon
} from '@mui/icons-material';

const SEVERITY_CONFIG = {
  INFORMATION: {
    label: 'Information',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    icon: InfoIcon
  },
  WARNING: {
    label: 'Warning',
    color: '#ed6c02',
    bgColor: '#fff3e0',
    icon: WarningIcon
  },
  CRITICAL: {
    label: 'Critical',
    color: '#d32f2f',
    bgColor: '#ffebee',
    icon: CriticalIcon
  }
};

const ActivitySeverityChip = ({ severity, size = 'medium', showIcon = true }) => {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.INFORMATION;
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

export default ActivitySeverityChip;