/* eslint-disable no-unused-vars */
/**
 * DownloadFilters Component
 * Filtering controls for package downloads
 * 
 * Location: src/components/packageDownloads/DownloadFilters.jsx
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  IconButton,
  Chip,
  Stack,
  Collapse,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'STARTED', label: 'Started' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'EXPIRED', label: 'Expired' }
];

const DownloadFilters = ({ filters, onFilterChange, onReset }) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const hasAdvancedFilters = useCallback(() => {
    const { search, status, ...rest } = localFilters;
    return Object.values(rest).some(v => v && v !== '');
  }, [localFilters]);

  const handleChange = useCallback((field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1
    }));
  }, []);

  const handleApply = useCallback(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  const handleClearAll = useCallback(() => {
    const cleared = {
      page: 1,
      limit: filters.limit || 20,
      search: '',
      status: '',
      centreId: '',
      packageId: '',
      examId: '',
      startDate: '',
      endDate: '',
      sort: '-createdAt'
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
    onReset();
  }, [filters.limit, onFilterChange, onReset]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  }, [handleApply]);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by package name, centre, downloaded by..."
            value={localFilters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: localFilters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleChange('search', '')}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Quick Filters */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={localFilters.status || ''}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            disabled={!localFilters.search && !localFilters.status && !hasAdvancedFilters()}
          >
            Apply
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Box display="flex" gap={1}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleClearAll}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              color={hasAdvancedFilters() ? 'primary' : 'default'}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Centre ID"
                placeholder="Enter centre ID"
                value={localFilters.centreId || ''}
                onChange={(e) => handleChange('centreId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Package ID"
                placeholder="Enter package ID"
                value={localFilters.packageId || ''}
                onChange={(e) => handleChange('packageId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Examination ID"
                placeholder="Enter examination ID"
                value={localFilters.examId || ''}
                onChange={(e) => handleChange('examId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={localFilters.startDate || null}
                  onChange={(date) => handleChange('startDate', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={localFilters.endDate || null}
                  onChange={(date) => handleChange('endDate', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DownloadFilters;