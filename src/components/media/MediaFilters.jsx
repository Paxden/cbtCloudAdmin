/* eslint-disable no-unused-vars */
/**
 * Media Filters Component
 * Filter controls for media library
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import StatusFilter from '../filters/StatusFilter';

const MediaFilters = ({
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

  const mimeTypes = [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPEG' },
    { value: 'image/jpg', label: 'JPG' },
    { value: 'image/svg+xml', label: 'SVG' },
    { value: 'image/gif', label: 'GIF' },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <StatusFilter
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }} fullWidth>
          <InputLabel>File Type</InputLabel>
          <Select
            value={filters.mimeType || ''}
            onChange={(e) => handleFilterChange('mimeType', e.target.value || '')}
            label="File Type"
            disabled={loading}
          >
            <MenuItem value="">All Types</MenuItem>
            {mimeTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }} fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            label="Sort By"
            disabled={loading}
          >
            <MenuItem value="createdAt">Date Uploaded</MenuItem>
            <MenuItem value="originalName">File Name</MenuItem>
            <MenuItem value="fileSize">File Size</MenuItem>
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

export default MediaFilters;