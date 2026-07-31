/**
 * Subject Filters Component
 * Filter controls for subjects
 */

import { useState, useEffect } from 'react';
import { Box, Stack, Chip, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import StatusFilter from '../../filters/StatusFilter';
import * as subjectService from '../../../services/questionBank/subjectService';

const SubjectFilters = ({
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  onClear,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasActiveFilters = selectedCategory || statusFilter;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await subjectService.getCategories({ limit: 100 });
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleClear = () => {
    setSelectedCategory('');
    setStatusFilter('');
    if (onClear) onClear();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || '')}
            label="Category"
            disabled={loading}
          >
            <MenuItem value="">All Categories</MenuItem>
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

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

export default SubjectFilters;