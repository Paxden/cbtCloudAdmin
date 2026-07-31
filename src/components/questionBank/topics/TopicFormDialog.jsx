/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
/**
 * Topic Form Dialog Component
 * Create and edit topic form with subject selection
 */

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AppDialog from '../../dialogs/AppDialog';
import AppButton from '../../common/buttons/AppButton';
import * as topicService from '../../../services/questionBank/topicService';
import * as subjectService from '../../../services/questionBank/subjectService';

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Topic name is required')
    .min(3, 'Topic name must be at least 3 characters')
    .max(100, 'Topic name cannot exceed 100 characters')
    .trim(),
  subjectId: yup
    .string()
    .required('Subject is required'),
  description: yup
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .nullable()
    .trim(),
  status: yup
    .string()
    .oneOf(['ACTIVE', 'INACTIVE'], 'Status must be ACTIVE or INACTIVE')
    .default('ACTIVE'),
});

const TopicFormDialog = ({
  open,
  topic,
  onClose,
  onSubmit,
  loading,
  error,
  mode = 'create',
}) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      subjectId: '',
      description: '',
      status: 'ACTIVE',
    },
  });

  const subjectId = watch('subjectId');

  // Fetch subjects for dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const response = await subjectService.getSubjects({ limit: 100, status: 'ACTIVE' });
        setSubjects(response.data || []);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Find selected subject details
  useEffect(() => {
    if (subjectId) {
      const subject = subjects.find((s) => s._id === subjectId);
      setSelectedSubject(subject || null);
    } else {
      setSelectedSubject(null);
    }
  }, [subjectId, subjects]);

  useEffect(() => {
    if (topic && mode === 'edit') {
      reset({
        name: topic.name || '',
        subjectId: topic.subjectId?._id || topic.subjectId || '',
        description: topic.description || '',
        status: topic.status || 'ACTIVE',
      });
    } else {
      reset({
        name: '',
        subjectId: '',
        description: '',
        status: 'ACTIVE',
      });
      setSelectedSubject(null);
    }
    setSubmitError(null);
  }, [topic, mode, open, reset]);

  const handleFormSubmit = async (data) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save topic');
    }
  };

  const isEditMode = mode === 'edit';

  const actions = (
    <>
      <AppButton variant="outlined" onClick={onClose} disabled={loading}>
        Cancel
      </AppButton>
      <AppButton
        type="submit"
        variant="contained"
        loading={loading}
        disabled={!isDirty && isEditMode}
      >
        {isEditMode ? 'Update Topic' : 'Create Topic'}
      </AppButton>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit Topic' : 'Create New Topic'}
      subtitle={isEditMode ? 'Update topic details' : 'Add a new topic'}
      actions={actions}
      maxWidth="sm"
      loading={loading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {(error || submitError) && (
            <Alert severity="error">{error || submitError}</Alert>
          )}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Topic Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
                autoFocus
                placeholder="e.g., Leadership, Operations"
              />
            )}
          />

          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.subjectId}>
                <InputLabel>Subject</InputLabel>
                <Select
                  {...field}
                  label="Subject"
                  disabled={loading || subjectsLoading}
                >
                  {subjectsLoading ? (
                    <MenuItem disabled>Loading subjects...</MenuItem>
                  ) : subjects.length === 0 ? (
                    <MenuItem disabled>No subjects available</MenuItem>
                  ) : (
                    subjects.map((subject) => (
                      <MenuItem key={subject._id} value={subject._id}>
                        {subject.name} ({subject.code})
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.subjectId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.subjectId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          {/* Display selected subject's category */}
          {selectedSubject && selectedSubject.categoryId && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="textSecondary">
                Category:
              </Typography>
              <Chip
                label={selectedSubject.categoryId.name}
                size="small"
                color="info"
                variant="outlined"
              />
            </Box>
          )}

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={loading}
                placeholder="Brief description of the topic..."
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  {...field}
                  label="Status"
                  disabled={loading}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>
      </form>
    </AppDialog>
  );
};

export default TopicFormDialog;