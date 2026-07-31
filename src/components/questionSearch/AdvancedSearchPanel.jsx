/* eslint-disable no-unused-vars */
/**
 * Advanced Search Panel Component
 * Main search interface with all filters
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Chip,
  IconButton,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Switch,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';
import * as searchService from '../../services/questionSearch/questionSearchService';

const AdvancedSearchPanel = ({
  onSearch,
  onSaveSearch,
  loading = false,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    categories: [],
    subjects: [],
    topics: [],
    questionTypes: [],
    difficulties: [],
  });

  const debouncedKeyword = useDebounce(filters.keyword, 300);

  // Fetch filter data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await searchService.getSearchFilters();
        setFilterData(response.data || {});
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };
    fetchFilterData();
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedKeyword && debouncedKeyword.length > 2) {
        setSuggestionsLoading(true);
        try {
          const response = await searchService.getSearchSuggestions(
            debouncedKeyword,
            'questionText',
            10
          );
          setSuggestions(response.data || []);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        } finally {
          setSuggestionsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedKeyword]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const marksValue = filters.marksRange || [0, 100];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Basic Search */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          placeholder="Search questions by keyword, code, or reference..."
          value={filters.keyword || ''}
          onChange={(e) => handleFilterChange('keyword', e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {filters.keyword && (
                  <IconButton size="small" onClick={() => handleFilterChange('keyword', '')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                {suggestionsLoading && <CircularProgress size={20} />}
              </>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {suggestions.map((suggestion) => (
            <Chip
              key={suggestion}
              label={suggestion}
              size="small"
              variant="outlined"
              onClick={() => handleFilterChange('keyword', suggestion)}
            />
          ))}
        </Box>
      )}

      {/* Toggle Advanced */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          size="small"
          onClick={() => setShowAdvanced(!showAdvanced)}
          endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={onSaveSearch}
          >
            Save Search
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Advanced Filters */}
      <Collapse in={showAdvanced}>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {/* Category */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterData.categories || []}
              getOptionLabel={(option) => option.name || option}
              value={filters.categories || []}
              onChange={(e, value) => handleFilterChange('categories', value)}
              renderInput={(params) => (
                <TextField {...params} label="Categories" size="small" fullWidth />
              )}
              size="small"
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name || option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>

          {/* Subject */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterData.subjects || []}
              getOptionLabel={(option) => option.name || option}
              value={filters.subjects || []}
              onChange={(e, value) => handleFilterChange('subjects', value)}
              renderInput={(params) => (
                <TextField {...params} label="Subjects" size="small" fullWidth />
              )}
              size="small"
            />
          </Grid>

          {/* Topic */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterData.topics || []}
              getOptionLabel={(option) => option.name || option}
              value={filters.topics || []}
              onChange={(e, value) => handleFilterChange('topics', value)}
              renderInput={(params) => (
                <TextField {...params} label="Topics" size="small" fullWidth />
              )}
              size="small"
            />
          </Grid>

          {/* Question Type */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterData.questionTypes || []}
              getOptionLabel={(option) => option.name || option}
              value={filters.questionTypes || []}
              onChange={(e, value) => handleFilterChange('questionTypes', value)}
              renderInput={(params) => (
                <TextField {...params} label="Question Types" size="small" fullWidth />
              )}
              size="small"
            />
          </Grid>

          {/* Difficulty */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={filterData.difficulties || []}
              getOptionLabel={(option) => option.name || option}
              value={filters.difficulties || []}
              onChange={(e, value) => handleFilterChange('difficulties', value)}
              renderInput={(params) => (
                <TextField {...params} label="Difficulties" size="small" fullWidth />
              )}
              size="small"
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED', 'ARCHIVED']}
              getOptionLabel={(option) => option.replace('_', ' ')}
              value={filters.statuses || []}
              onChange={(e, value) => handleFilterChange('statuses', value)}
              renderInput={(params) => (
                <TextField {...params} label="Status" size="small" fullWidth />
              )}
              size="small"
            />
          </Grid>

          {/* Created By */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Created By"
              value={filters.createdBy || ''}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          {/* Date Range */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="From Date"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="To Date"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Marks Range */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ px: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Marks Range
              </Typography>
              <Slider
                value={marksValue}
                onChange={(e, value) => {
                  handleFilterChange('marksRange', value);
                  handleFilterChange('marksFrom', value[0]);
                  handleFilterChange('marksTo', value[1]);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={0.5}
              />
            </Box>
          </Grid>

          {/* Boolean Filters */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasImages || false}
                    onChange={(e) => handleFilterChange('hasImages', e.target.checked)}
                  />
                }
                label="Has Images"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasFormulas || false}
                    onChange={(e) => handleFilterChange('hasFormulas', e.target.checked)}
                  />
                }
                label="Has Formulas"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasTables || false}
                    onChange={(e) => handleFilterChange('hasTables', e.target.checked)}
                  />
                }
                label="Has Tables"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.includeDeleted || false}
                    onChange={(e) => handleFilterChange('includeDeleted', e.target.checked)}
                  />
                }
                label="Include Deleted"
              />
            </Box>
          </Grid>

          {/* Sorting */}
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                label="Sort By"
              >
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="updatedAt">Updated Date</MenuItem>
                <MenuItem value="questionCode">Question Code</MenuItem>
                <MenuItem value="difficulty">Difficulty</MenuItem>
                <MenuItem value="marks">Marks</MenuItem>
                <MenuItem value="name">Alphabetical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Sort Order</InputLabel>
              <Select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                label="Sort Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Apply Filters Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={<SearchIcon />}
              >
                Apply Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default AdvancedSearchPanel;