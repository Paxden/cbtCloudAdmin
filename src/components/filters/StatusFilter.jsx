/**
 * Status Filter Component
 * Reusable status filter dropdown
 */

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const StatusFilter = ({
  value,
  onChange,
  label = 'Status',
  options = STATUS_OPTIONS,
  size = 'small',
  fullWidth = false,
  sx = {},
}) => {
  return (
    <FormControl size={size} fullWidth={fullWidth} sx={{ minWidth: 150, ...sx }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value || ''} onChange={onChange} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StatusFilter;