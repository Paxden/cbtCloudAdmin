/**
 * Role Chip Component
 * Reusable role chip with predefined colors
 */

import { Chip } from '@mui/material';

const ROLE_CONFIG = {
  SUPER_ADMIN: { color: 'error', label: 'Super Admin' },
  TECH_ADMIN: { color: 'primary', label: 'Tech Admin' },
  EXAM_MANAGER: { color: 'success', label: 'Exam Manager' },
  CANDIDATE: { color: 'default', label: 'Candidate' },
};

const RoleChip = ({ role, size = 'small', sx = {}, ...props }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.CANDIDATE;

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

export default RoleChip;