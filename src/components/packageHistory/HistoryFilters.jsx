/* eslint-disable no-unused-vars */
/**
 * HistoryFilters Component
 * Filtering controls for package history
 * 
 * Location: src/components/packageHistory/HistoryFilters.jsx
 */

import { useState, useCallback } from 'react';
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

const ACTIVITY_TYPE_OPTIONS = [
  { value: '', label: 'All Activities' },
  { value: 'INSTANCE_CREATED', label: 'Instance Created' },
  { value: 'PACKAGE_GENERATED', label: 'Package Generated' },
  { value: 'CANDIDATE_PAPERS_GENERATED', label: 'Candidate Papers Generated' },
  { value: 'VALIDATION_PASSED', label: 'Validation Passed' },
  { value: 'VALIDATION_FAILED', label: 'Validation Failed' },
  { value: 'PACKAGE_RELEASED', label: 'Package Released' },
  { value: 'PACKAGE_DOWNLOADED', label: 'Package Downloaded' },
  { value: 'PACKAGE_REGENERATED', label: 'Package Regenerated' },
  { value: 'VERSION_CREATED', label: 'Version Created' },
  { value: 'VERSION_ARCHIVED', label: 'Version Archived' },
  { value: 'PACKAGE_REVOKED', label: 'Package Revoked' },
  { value: 'PACKAGE_DELETED', label: 'Package Deleted' },
  { value: 'AUDIT_VIEWED', label: 'Audit Viewed' }
];

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'INFORMATION', label: 'Information' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'CRITICAL', label: 'Critical' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'PENDING', label: 'Pending' }
];

const HistoryFilters = ({ filters, onFilterChange, onReset }) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const hasAdvancedFilters = useCallback(() => {
    const { search, activityType, severity, status, ...rest } = localFilters;
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
      activityType: '',
      severity: '',
      userId: '',
      centreId: '',
      packageId: '',
      examId: '',
      instanceId: '',
      startDate: '',
      endDate: '',
      status: '',
      sort: '-timestamp'
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
            placeholder="Search by package name, examination, user..."
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
            <InputLabel>Activity</InputLabel>
            <Select
              value={localFilters.activityType || ''}
              label="Activity"
              onChange={(e) => handleChange('activityType', e.target.value)}
            >
              {ACTIVITY_TYPE_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={1.5}>
          <FormControl fullWidth size="small">
            <InputLabel>Severity</InputLabel>
            <Select
              value={localFilters.severity || ''}
              label="Severity"
              onChange={(e) => handleChange('severity', e.target.value)}
            >
              {SEVERITY_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={1.5}>
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
        <Grid item xs={12} sm={6} md={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            disabled={!localFilters.search && !localFilters.activityType && !localFilters.severity && !localFilters.status && !hasAdvancedFilters()}
          >
            Apply
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={1}>
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
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="User ID"
                placeholder="Enter user ID"
                value={localFilters.userId || ''}
                onChange={(e) => handleChange('userId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Centre ID"
                placeholder="Enter centre ID"
                value={localFilters.centreId || ''}
                onChange={(e) => handleChange('centreId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Package ID"
                placeholder="Enter package ID"
                value={localFilters.packageId || ''}
                onChange={(e) => handleChange('packageId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Examination ID"
                placeholder="Enter examination ID"
                value={localFilters.examId || ''}
                onChange={(e) => handleChange('examId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Instance ID"
                placeholder="Enter instance ID"
                value={localFilters.instanceId || ''}
                onChange={(e) => handleChange('instanceId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={localFilters.startDate || null}
                  onChange={(date) => handleChange('startDate', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
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

export default HistoryFilters;