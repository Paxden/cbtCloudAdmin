/**
 * Import Filters Component
 * Filter controls for import history
 */

import { Box, Stack, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ImportFilters = ({
  filters,
  onFilterChange,
  onClear,
  loading = false,
}) => {
  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onClear();
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
  ];

  const fileTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'xlsx', label: 'Excel (.xlsx)' },
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }} fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || '')}
            label="Status"
            disabled={loading}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }} fullWidth>
          <InputLabel>File Type</InputLabel>
          <Select
            value={filters.fileType || ''}
            onChange={(e) => handleFilterChange('fileType', e.target.value || '')}
            label="File Type"
            disabled={loading}
          >
            {fileTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Chip
            label="Clear Filters"
            onDelete={handleClear}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
      </Stack>
    </Box>
  );
};

export default ImportFilters;