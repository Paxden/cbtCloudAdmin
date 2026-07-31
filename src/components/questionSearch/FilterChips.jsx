/* eslint-disable no-unused-vars */
/**
 * Filter Chips Component
 * Displays active filters as chips with remove functionality
 */

import { Box, Chip, Stack, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const FilterChips = ({ filters, onRemove, onClearAll }) => {
  const getFilterLabel = (key, value) => {
    const labels = {
      keyword: `Search: "${value}"`,
      categories: `Category: ${value}`,
      subjects: `Subject: ${value}`,
      topics: `Topic: ${value}`,
      questionTypes: `Type: ${value}`,
      difficulties: `Difficulty: ${value}`,
      statuses: `Status: ${value}`,
      dateFrom: `From: ${value}`,
      dateTo: `To: ${value}`,
      marksFrom: `Marks ≥ ${value}`,
      marksTo: `Marks ≤ ${value}`,
      createdBy: `Author: ${value}`,
      hasImages: 'Has Images',
      hasFormulas: 'Has Formulas',
      hasTables: 'Has Tables',
      includeDeleted: 'Include Deleted',
    };
    return labels[key] || `${key}: ${value}`;
  };

  const getFilterValue = (key, value) => {
    if (Array.isArray(value)) {
      return value;
    }
    return value;
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key] && filters[key] !== '' && filters[key] !== false
  );

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
          Active Filters:
        </Typography>

        {Object.entries(filters).map(([key, value]) => {
          if (value === undefined || value === null || value === '') return null;
          if (Array.isArray(value) && value.length === 0) return null;
          if (value === false) return null;

          if (Array.isArray(value)) {
            return value.map((item) => (
              <Chip
                key={`${key}-${item}`}
                label={getFilterLabel(key, item)}
                size="small"
                onDelete={() => onRemove(key, item)}
                color="primary"
                variant="outlined"
                deleteIcon={<CloseIcon />}
              />
            ));
          }

          return (
            <Chip
              key={key}
              label={getFilterLabel(key, value)}
              size="small"
              onDelete={() => onRemove(key, value)}
              color="primary"
              variant="outlined"
              deleteIcon={<CloseIcon />}
            />
          );
        })}

        {hasActiveFilters && (
          <Chip
            label="Clear All"
            size="small"
            color="error"
            variant="outlined"
            onClick={onClearAll}
          />
        )}
      </Stack>
    </Box>
  );
};

export default FilterChips;