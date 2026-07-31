/**
 * Category Filters Component
 * Filter controls for categories
 */

import { Box, Stack, Chip } from '@mui/material';
import StatusFilter from '../../filters/StatusFilter';

const CategoryFilters = ({
  statusFilter,
  setStatusFilter,
  onClear,
}) => {
  const hasActiveFilters = statusFilter;

  const handleClear = () => {
    setStatusFilter('');
    if (onClear) onClear();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <StatusFilter
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        />

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

export default CategoryFilters;