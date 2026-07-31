/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Question Filters Component
 * Filter controls for question bank
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
import StatusFilter from '../filters/StatusFilter';
import * as categoryService from '../../services/questionBank/categoryService';
import * as subjectService from '../../services/questionBank/subjectService';
import * as topicService from '../../services/questionBank/topicService';
import * as difficultyService from '../../services/questionBank/difficultyService';
import * as questionTypeService from '../../services/questionBank/questionTypeService';

const QuestionFilters = ({
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

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

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

  // Fetch subjects when category changes
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

  // Fetch topics when subject changes
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
          <StatusFilter
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            size="small"
            sx={{ minWidth: 150, width: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Marks From"
            type="number"
            size="small"
            value={filters.marksFrom || ''}
            onChange={(e) => handleFilterChange('marksFrom', e.target.value)}
            fullWidth
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Marks To"
            type="number"
            size="small"
            value={filters.marksTo || ''}
            onChange={(e) => handleFilterChange('marksTo', e.target.value)}
            fullWidth
            InputProps={{ inputProps: { min: 0 } }}
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
            {filters.categoryId && (
              <Chip
                label={`Category: ${categories.find(c => c._id === filters.categoryId)?.name || ''}`}
                onDelete={() => handleFilterChange('categoryId', '')}
                size="small"
              />
            )}
            {filters.subjectId && (
              <Chip
                label={`Subject: ${subjects.find(s => s._id === filters.subjectId)?.name || ''}`}
                onDelete={() => handleFilterChange('subjectId', '')}
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

export default QuestionFilters;