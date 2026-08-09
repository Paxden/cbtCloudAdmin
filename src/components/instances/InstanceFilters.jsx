/* eslint-disable no-unused-vars */
/**
 * InstanceFilters
 * Filter controls for the instances page
 * 
 * Location: src/components/instances/InstanceFilters.jsx
 */

import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { InstanceStatusLabels } from '../../types/examInstance.types';

const InstanceFilters = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearch = () => {
    onFilterChange({ search: searchInput });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  const hasFilters = filters.search || filters.status;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search by code, exam name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchInput && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton size="small" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.entries(InstanceStatusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasFilters && (
          <Button
            variant="text"
            size="small"
            onClick={onReset}
            startIcon={<ClearIcon />}
          >
            Clear Filters
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default InstanceFilters;