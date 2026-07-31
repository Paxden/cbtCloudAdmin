/**
 * Media Status Chip Component
 * Reusable status chip for media items
 */

import { Chip } from '@mui/material';

const STATUS_CONFIG = {
  ACTIVE: { color: 'success', label: 'Active' },
  INACTIVE: { color: 'warning', label: 'Inactive' },
  DELETED: { color: 'default', label: 'Deleted' },
};

const MediaStatusChip = ({ status, size = 'small', sx = {}, ...props }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ACTIVE;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 500, ...sx }}
      {...props}
    />
  );
};

export default MediaStatusChip;