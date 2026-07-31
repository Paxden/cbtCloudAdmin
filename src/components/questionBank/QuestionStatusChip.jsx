/**
 * Question Status Chip Component
 * Reusable status chip for questions
 */

import { Chip } from '@mui/material';

const STATUS_CONFIG = {
  DRAFT: { color: 'default', label: 'Draft' },
  PENDING_REVIEW: { color: 'warning', label: 'Pending Review' },
  APPROVED: { color: 'info', label: 'Approved' },
  PUBLISHED: { color: 'success', label: 'Published' },
  REJECTED: { color: 'error', label: 'Rejected' },
  ARCHIVED: { color: 'default', label: 'Archived' },
};

const QuestionStatusChip = ({ status, size = 'small', sx = {}, ...props }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;

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

export default QuestionStatusChip;