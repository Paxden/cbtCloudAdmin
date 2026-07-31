/**
 * Import Status Chip Component
 * Reusable status chip for imports
 */

import { Chip } from '@mui/material';

const STATUS_CONFIG = {
  PROCESSING: { color: 'warning', label: 'Processing' },
  COMPLETED: { color: 'success', label: 'Completed' },
  FAILED: { color: 'error', label: 'Failed' },
};

const ImportStatusChip = ({ status, size = 'small', sx = {}, ...props }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PROCESSING;

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

export default ImportStatusChip;