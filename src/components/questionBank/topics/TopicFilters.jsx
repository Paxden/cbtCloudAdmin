/* eslint-disable no-unused-vars */
/**
 * Topic Filters Component
 * Filter controls for topics with subject and category cascading
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
  CircularProgress,
} from '@mui/material';
import StatusFilter from '../../filters/StatusFilter';
import * as topicService from '../../../services/questionBank/topicService';
import * as subjectService from '../../../services/questionBank/subjectService';

const TopicFilters = ({
  selectedSubject,
  setSelectedSubject,
  statusFilter,
  setStatusFilter,
  onClear,
}) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasActiveFilters = selectedSubject || statusFilter;

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await subjectService.getSubjects({ limit: 100, status: 'ACTIVE' });
        setSubjects(response.data || []);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleClear = () => {
    setSelectedSubject('');
    setStatusFilter('');
    if (onClear) onClear();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Subject</InputLabel>
          <Select
            value={selectedSubject || ''}
            onChange={(e) => setSelectedSubject(e.target.value || '')}
            label="Subject"
            disabled={loading}
          >
            <MenuItem value="">All Subjects</MenuItem>
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
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

export default TopicFilters;