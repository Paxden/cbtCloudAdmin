/**
 * Version Filters Component
 * Filter controls for version history
 */

import { Box, Stack, Chip, FormControl, InputLabel, Select, MenuItem, Grid, TextField } from '@mui/material';

const VersionFilters = ({
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
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_REVIEW', label: 'Pending Review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'ARCHIVED', label: 'Archived' },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl size="small" fullWidth>
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
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Editor"
            size="small"
            value={filters.editor || ''}
            onChange={(e) => handleFilterChange('editor', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="From Date"
            type="date"
            size="small"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="To Date"
            type="date"
            size="small"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {hasActiveFilters && (
              <Chip
                label="Clear All Filters"
                onDelete={handleClear}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VersionFilters;