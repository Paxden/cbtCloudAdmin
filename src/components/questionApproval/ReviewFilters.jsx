/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Review Filters Component
 * Filter controls for review queue
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
  Grid,
  TextField,
} from '@mui/material';
import * as categoryService from '../../services/questionBank/categoryService';
import * as subjectService from '../../services/questionBank/subjectService';
import * as topicService from '../../services/questionBank/topicService';
import * as difficultyService from '../../services/questionBank/difficultyService';

const ReviewFilters = ({
  filters,
  onFilterChange,
  onClear,
  loading = false,
}) => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [fetching, setFetching] = useState(false);

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '' && v !== undefined);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const [categoriesRes, difficultiesRes] = await Promise.all([
          categoryService.getActiveCategories({ limit: 100 }),
          difficultyService.getDifficulties({ status: 'ACTIVE', limit: 100 }),
        ]);
        setCategories(categoriesRes.data || []);
        setDifficulties(difficultiesRes.data || []);
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (filters.categoryId) {
      const fetchSubjects = async () => {
        try {
          const response = await subjectService.getSubjects({
            categoryId: filters.categoryId,
            status: 'ACTIVE',
            limit: 100,
          });
          setSubjects(response.data || []);
        } catch (error) {
          console.error('Failed to fetch subjects:', error);
        }
      };
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [filters.categoryId]);

  useEffect(() => {
    if (filters.subjectId) {
      const fetchTopics = async () => {
        try {
          const response = await topicService.getTopics({
            subjectId: filters.subjectId,
            status: 'ACTIVE',
            limit: 100,
          });
          setTopics(response.data || []);
        } catch (error) {
          console.error('Failed to fetch topics:', error);
        }
      };
      fetchTopics();
    } else {
      setTopics([]);
    }
  }, [filters.subjectId]);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onClear();
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING_REVIEW', label: 'Pending Review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const renderSelect = (key, label, options, valueKey = '_id', labelKey = 'name') => (
    <FormControl size="small" sx={{ minWidth: 150 }} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={filters[key] || ''}
        onChange={(e) => handleFilterChange(key, e.target.value || '')}
        label={label}
        disabled={fetching || loading}
      >
        <MenuItem value="">All</MenuItem>
        {options.map((item) => (
          <MenuItem key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl size="small" sx={{ minWidth: 150 }} fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || '')}
              label="Status"
              disabled={loading}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {renderSelect('categoryId', 'Category', categories)}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {renderSelect('subjectId', 'Subject', subjects)}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {renderSelect('topicId', 'Topic', topics)}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {renderSelect('difficultyId', 'Difficulty', difficulties)}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Author ID"
            size="small"
            value={filters.authorId || ''}
            onChange={(e) => handleFilterChange('authorId', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Reviewer ID"
            size="small"
            value={filters.reviewerId || ''}
            onChange={(e) => handleFilterChange('reviewerId', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="From Date"
            type="date"
            size="small"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {hasActiveFilters && (
              <Chip
                label="Clear All Filters"
                onDelete={handleClear}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {filters.categoryId && categories.find(c => c._id === filters.categoryId) && (
              <Chip
                label={`Category: ${categories.find(c => c._id === filters.categoryId)?.name || ''}`}
                onDelete={() => handleFilterChange('categoryId', '')}
                size="small"
              />
            )}
            {filters.status && (
              <Chip
                label={`Status: ${filters.status}`}
                onDelete={() => handleFilterChange('status', '')}
                size="small"
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewFilters;