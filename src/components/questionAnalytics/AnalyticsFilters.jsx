/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Analytics Filters Component
 * Filter controls for analytics dashboard
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
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { FilterList as FilterIcon, Clear as ClearIcon } from '@mui/icons-material';
import * as categoryService from '../../services/questionBank/categoryService';
import * as subjectService from '../../services/questionBank/subjectService';
import * as topicService from '../../services/questionBank/topicService';
import * as difficultyService from '../../services/questionBank/difficultyService';
import * as questionTypeService from '../../services/questionBank/questionTypeService';

const AnalyticsFilters = ({
  filters,
  onFilterChange,
  onClear,
  loading = false,
}) => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '' && v !== undefined);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const [categoriesRes, difficultiesRes, typesRes] = await Promise.all([
          categoryService.getActiveCategories({ limit: 100 }),
          difficultyService.getDifficulties({ status: 'ACTIVE', limit: 100 }),
          questionTypeService.getQuestionTypes({ status: 'ACTIVE', limit: 100 }),
        ]);
        setCategories(categoriesRes.data || []);
        setDifficulties(difficultiesRes.data || []);
        setQuestionTypes(typesRes.data || []);
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
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_REVIEW', label: 'Pending Review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'ARCHIVED', label: 'Archived' },
  ];

  const renderSelect = (key, label, options, valueKey = '_id', labelKey = 'name') => (
    <FormControl size="small" fullWidth>
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
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Button
          size="small"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <Chip
              label={Object.keys(filters).filter(k => filters[k]).length}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            color="error"
          >
            Clear All
          </Button>
        )}
      </Box>

      {showFilters && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl size="small" fullWidth>
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
            {renderSelect('questionTypeId', 'Question Type', questionTypes)}
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

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="To Date"
              type="date"
              size="small"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default AnalyticsFilters;