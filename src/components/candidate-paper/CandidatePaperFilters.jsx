/**
 * CandidatePaperFilters
 * Filter controls for the candidate papers page
 * 
 * Location: src/components/candidate-paper/CandidatePaperFilters.jsx
 */

import  { useState } from 'react';
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
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { PaperStatusLabels } from '../../types/candidatePaper.types';

const CandidatePaperFilters = ({
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
          placeholder="Search by code, candidate, centre..."
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
            {Object.entries(PaperStatusLabels).map(([value, label]) => (
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

export default CandidatePaperFilters;