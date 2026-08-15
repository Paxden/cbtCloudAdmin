/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/**
 * Blueprint Section Dialog Component
 * Add or edit a blueprint section
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Divider,
  Chip,
  Stack,
  Alert,
  IconButton,
  Tooltip,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const DIFFICULTY_OPTIONS = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const QUESTION_TYPE_OPTIONS = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN', 'MATCHING', 'ESSAY'];

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Section name is required').max(200),
  description: yup.string().max(500),
  subjectId: yup.string().required('Subject is required'),
  topicId: yup.string().nullable(),
  questionCount: yup.number().required('Question count is required').min(1).max(1000),
  marksPerQuestion: yup.number().required('Marks per question is required').min(0.5).max(100),
  difficultyDistribution: yup.array().of(
    yup.object().shape({
      difficulty: yup.string().required('Difficulty is required'),
      percentage: yup.number().required('Percentage is required').min(0).max(100),
    })
  ).min(1, 'At least one difficulty level is required'),
  questionTypeDistribution: yup.array().of(
    yup.object().shape({
      questionType: yup.string().required('Question type is required'),
      percentage: yup.number().required('Percentage is required').min(0).max(100),
    })
  ).min(1, 'At least one question type is required'),
});

const BlueprintSectionDialog = ({
  open,
  onClose,
  onSave,
  section,
  isEdit = false,
  subjects = [],
  topics = [],
  loading = false,
}) => {
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: section?.name || '',
      description: section?.description || '',
      subjectId: section?.subjectId?._id || section?.subjectId || '',
      topicId: section?.topicId?._id || section?.topicId || null,
      questionCount: section?.questionCount || 10,
      marksPerQuestion: section?.marksPerQuestion || 1,
      difficultyDistribution: section?.difficultyDistribution || [
        { difficulty: 'EASY', percentage: 25 },
        { difficulty: 'MEDIUM', percentage: 25 },
        { difficulty: 'HARD', percentage: 25 },
        { difficulty: 'EXPERT', percentage: 25 },
      ],
      questionTypeDistribution: section?.questionTypeDistribution || [
        { questionType: 'SINGLE_CHOICE', percentage: 50 },
        { questionType: 'MULTIPLE_CHOICE', percentage: 25 },
        { questionType: 'TRUE_FALSE', percentage: 25 },
      ],
    },
  });

  const { fields: difficultyFields, append: appendDifficulty, remove: removeDifficulty } = useFieldArray({
    control,
    name: 'difficultyDistribution',
  });

  const { fields: questionTypeFields, append: appendQuestionType, remove: removeQuestionType } = useFieldArray({
    control,
    name: 'questionTypeDistribution',
  });

  const selectedSubject = watch('subjectId');

  // Load topics when subject changes
  useEffect(() => {
    // Topics would be loaded via prop change or API call
  }, [selectedSubject]);

  // Reset form when section changes
  useEffect(() => {
    if (section) {
      reset({
        name: section.name || '',
        description: section.description || '',
        subjectId: section.subjectId?._id || section.subjectId || '',
        topicId: section.topicId?._id || section.topicId || null,
        questionCount: section.questionCount || 10,
        marksPerQuestion: section.marksPerQuestion || 1,
        difficultyDistribution: section.difficultyDistribution || [
          { difficulty: 'EASY', percentage: 25 },
          { difficulty: 'MEDIUM', percentage: 25 },
          { difficulty: 'HARD', percentage: 25 },
          { difficulty: 'EXPERT', percentage: 25 },
        ],
        questionTypeDistribution: section.questionTypeDistribution || [
          { questionType: 'SINGLE_CHOICE', percentage: 50 },
          { questionType: 'MULTIPLE_CHOICE', percentage: 25 },
          { questionType: 'TRUE_FALSE', percentage: 25 },
        ],
      });
    }
  }, [section, reset]);

  const onSubmit = (data) => {
    // Validate distributions total 100%
    const diffTotal = data.difficultyDistribution.reduce((sum, d) => sum + (d.percentage || 0), 0);
    const typeTotal = data.questionTypeDistribution.reduce((sum, d) => sum + (d.percentage || 0), 0);

    if (Math.round(diffTotal) !== 100) {
      setError(`Difficulty distribution must total 100% (currently ${diffTotal}%)`);
      return;
    }

    if (Math.round(typeTotal) !== 100) {
      setError(`Question type distribution must total 100% (currently ${typeTotal}%)`);
      return;
    }

    setError(null);
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit Section' : 'Add Section'}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form id="section-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Section Name */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Section Name *"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            {/* Subject */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.subjectId}>
                    <InputLabel>Subject *</InputLabel>
                    <Select {...field} label="Subject *" disabled={loading}>
                      {subjects.map((subject) => (
                        <MenuItem key={subject._id} value={subject._id}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subjectId && (
                      <FormHelperText>{errors.subjectId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Topic */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="topicId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.topicId}>
                    <InputLabel>Topic</InputLabel>
                    <Select
                      {...field}
                      label="Topic"
                      disabled={loading || !selectedSubject}
                      value={field.value || ''}
                    >
                      <MenuItem value="">None</MenuItem>
                      {topics.map((topic) => (
                        <MenuItem key={topic._id} value={topic._id}>
                          {topic.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.topicId && (
                      <FormHelperText>{errors.topicId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Question Count */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="questionCount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Question Count *"
                    type="number"
                    fullWidth
                    error={!!errors.questionCount}
                    helperText={errors.questionCount?.message}
                    disabled={loading}
                    InputProps={{ inputProps: { min: 1, max: 1000 } }}
                  />
                )}
              />
            </Grid>

            {/* Marks Per Question */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="marksPerQuestion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Marks Per Question *"
                    type="number"
                    fullWidth
                    error={!!errors.marksPerQuestion}
                    helperText={errors.marksPerQuestion?.message}
                    disabled={loading}
                    InputProps={{ inputProps: { min: 0.5, max: 100, step: 0.5 } }}
                  />
                )}
              />
            </Grid>

            {/* Difficulty Distribution */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Difficulty Distribution *
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                Total must equal 100%
              </Typography>

              {difficultyFields.map((field, index) => (
                <Stack key={field.id} direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Controller
                    name={`difficultyDistribution.${index}.difficulty`}
                    control={control}
                    render={({ field }) => (
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select {...field} disabled={loading}>
                          {DIFFICULTY_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option.charAt(0) + option.slice(1).toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name={`difficultyDistribution.${index}.percentage`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        label="%"
                        sx={{ width: 100 }}
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                        disabled={loading}
                      />
                    )}
                  />
                  {difficultyFields.length > 1 && (
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={() => removeDifficulty(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              ))}

              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => appendDifficulty({ difficulty: 'EASY', percentage: 0 })}
                disabled={loading || difficultyFields.length >= 4}
              >
                Add Difficulty Level
              </Button>

              {errors.difficultyDistribution && (
                <FormHelperText error>{errors.difficultyDistribution.message}</FormHelperText>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Question Type Distribution */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Question Type Distribution *
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                Total must equal 100%
              </Typography>

              {questionTypeFields.map((field, index) => (
                <Stack key={field.id} direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Controller
                    name={`questionTypeDistribution.${index}.questionType`}
                    control={control}
                    render={({ field }) => (
                      <FormControl size="small" sx={{ flex: 1 }}>
                        <Select {...field} disabled={loading}>
                          {QUESTION_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option.replace('_', ' ').charAt(0) + option.replace('_', ' ').slice(1).toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name={`questionTypeDistribution.${index}.percentage`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        label="%"
                        sx={{ width: 100 }}
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                        disabled={loading}
                      />
                    )}
                  />
                  {questionTypeFields.length > 1 && (
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={() => removeQuestionType(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              ))}

              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => appendQuestionType({ questionType: 'SINGLE_CHOICE', percentage: 0 })}
                disabled={loading || questionTypeFields.length >= 6}
              >
                Add Question Type
              </Button>

              {errors.questionTypeDistribution && (
                <FormHelperText error>{errors.questionTypeDistribution.message}</FormHelperText>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="section-form"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEdit ? 'Update Section' : 'Add Section'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlueprintSectionDialog;