/**
 * Candidate Filters Component
 * Filter controls for candidate list
 */

import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';

const CandidateFilters = ({
  filters,
  onFilterChange,
  onClear,
  examinations,
  loading,
}) => {
  const hasActiveFilters = Object.values(filters).some(
    (v) => v && v !== '' && v !== 'all'
  );

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, number, email..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleFilterChange('search', '')}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
              disabled={loading}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="REGISTERED">Registered</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.gender || ''}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              label="Gender"
              disabled={loading}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department || ''}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              label="Department"
              disabled={loading}
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
              <MenuItem value="Administration">Administration</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Human Resources">Human Resources</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Organization</InputLabel>
            <Select
              value={filters.organization || ''}
              onChange={(e) => handleFilterChange('organization', e.target.value)}
              label="Organization"
              disabled={loading}
            >
              <MenuItem value="">All</MenuItem>
              {examinations?.map((exam) => (
                <MenuItem key={exam._id} value={exam._id}>
                  {exam.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={1} alignItems="center">
            {hasActiveFilters && (
              <Chip
                label="Clear All Filters"
                onDelete={handleClear}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            <Chip
              label={`${Object.values(filters).filter((v) => v && v !== '' && v !== 'all').length} filters active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateFilters;