/**
 * Import Filters Component
 * Filter controls for import history
 */

import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

const ImportFilters = ({
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
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Examination</InputLabel>
            <Select
              value={filters.examinationId || ''}
              onChange={(e) => handleFilterChange('examinationId', e.target.value)}
              label="Examination"
              disabled={loading}
            >
              <MenuItem value="">All Examinations</MenuItem>
              {examinations.map((exam) => (
                <MenuItem key={exam._id} value={exam._id}>
                  {exam.name} ({exam.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PROCESSING">Processing</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="PARTIAL">Partial</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Imported By"
            size="small"
            value={filters.importedBy || ''}
            onChange={(e) => handleFilterChange('importedBy', e.target.value)}
            fullWidth
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Date From"
            type="date"
            size="small"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Date To"
            type="date"
            size="small"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={1} alignItems="center">
            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClear}
              >
                Clear All Filters
              </Button>
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

export default ImportFilters;