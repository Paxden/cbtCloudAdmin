/* eslint-disable no-useless-assignment */
/**
 * VersionStatusChip
 * Displays version status with appropriate colors and icons
 * 
 * Location: src/components/version/VersionStatusChip.jsx
 */

import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Archive as ArchiveIcon,
  Pending as PendingIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  VersionStatus,
  VersionStatusLabels,
  VersionStatusColors,
} from '../../types/version.types';

const VersionStatusChip = ({ status, size = 'small' }) => {
  const label = VersionStatusLabels[status] || status;
  const color = VersionStatusColors[status] || '#9e9e9e';

  let icon = null;
  switch (status) {
    case VersionStatus.ACTIVE:
      icon = <CheckCircleIcon />;
      break;
    case VersionStatus.REVOKED:
      icon = <CancelIcon />;
      break;
    case VersionStatus.ARCHIVED:
      icon = <ArchiveIcon />;
      break;
    case VersionStatus.GENERATING:
      icon = <RefreshIcon />;
      break;
    case VersionStatus.DRAFT:
      icon = <EditIcon />;
      break;
    case VersionStatus.GENERATED:
      icon = <PendingIcon />;
      break;
    default:
      icon = <PendingIcon />;
  }

  return (
    <Chip
      icon={icon}
      label={label}
      size={size}
      sx={{
        bgcolor: color,
        color: 'white',
        '& .MuiChip-icon': { color: 'white' },
      }}
    />
  );
};

export default VersionStatusChip;