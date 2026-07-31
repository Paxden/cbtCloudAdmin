/**
 * Status Chip Component
 * Reusable status chip with predefined colors
 */

import { Chip } from '@mui/material';

const STATUS_CONFIG = {
  ACTIVE: { color: 'success', label: 'Active' },
  INACTIVE: { color: 'default', label: 'Inactive' },
  DRAFT: { color: 'warning', label: 'Draft' },
  PENDING_REVIEW: { color: 'info', label: 'Pending Review' },
  APPROVED: { color: 'primary', label: 'Approved' },
  PUBLISHED: { color: 'success', label: 'Published' },
  REJECTED: { color: 'error', label: 'Rejected' },
  ARCHIVED: { color: 'default', label: 'Archived' },
  PROCESSING: { color: 'warning', label: 'Processing' },
  COMPLETED: { color: 'success', label: 'Completed' },
  FAILED: { color: 'error', label: 'Failed' },
  PARTIAL: { color: 'warning', label: 'Partial' },
  LOCKED: { color: 'error', label: 'Locked' },
  SUSPENDED: { color: 'error', label: 'Suspended' },
};

const StatusChip = ({ status, size = 'small', sx = {}, ...props }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.INACTIVE;

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

export default StatusChip;