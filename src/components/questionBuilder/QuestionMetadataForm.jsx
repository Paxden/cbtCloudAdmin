/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Question Metadata Form Component
 * Handles category, subject, topic, type, difficulty, and marks
 */

import { useState, useEffect } from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as categoryService from '../../services/questionBank/categoryService';
import * as subjectService from '../../services/questionBank/subjectService';
import * as topicService from '../../services/questionBank/topicService';
import * as difficultyService from '../../services/questionBank/difficultyService';
import * as questionTypeService from '../../services/questionBank/questionTypeService';

const QuestionMetadataForm = ({
  control,
  errors,
  watch,
  setValue,
  disabled = false,
}) => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedCategory = watch('categoryId');
  const selectedSubject = watch('subjectId');

  // Fetch all dropdown data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        console.error('Failed to fetch metadata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch subjects when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubjects = async () => {
        try {
          const response = await subjectService.getSubjects({
            categoryId: selectedCategory,
            status: 'ACTIVE',
            limit: 100,
          });
          setSubjects(response.data || []);
          // Clear selected subject if it's not in the new list
          if (selectedSubject) {
            const exists = response.data.some((s) => s._id === selectedSubject);
            if (!exists) {
              setValue('subjectId', '');
            }
          }
        } catch (error) {
          console.error('Failed to fetch subjects:', error);
        }
      };
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedCategory, selectedSubject, setValue]);

  // Fetch topics when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const fetchTopics = async () => {
        try {
          const response = await topicService.getTopics({
            subjectId: selectedSubject,
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
  }, [selectedSubject]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Question Metadata
      </Typography>

      <Grid container spacing={2}>
        {/* Category */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Category *</InputLabel>
                <Select
                  {...field}
                  label="Category *"
                  disabled={disabled}
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <FormHelperText>{errors.categoryId.message}</FormHelperText>
                )}
              </FormControl>
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
                <Select
                  {...field}
                  label="Subject *"
                  disabled={disabled || !selectedCategory}
                >
                  <MenuItem value="">
                    <em>Select Subject</em>
                  </MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code})
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
                <InputLabel>Topic *</InputLabel>
                <Select
                  {...field}
                  label="Topic *"
                  disabled={disabled || !selectedSubject}
                >
                  <MenuItem value="">
                    <em>Select Topic</em>
                  </MenuItem>
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

        {/* Question Type */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="questionTypeId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.questionTypeId}>
                <InputLabel>Question Type *</InputLabel>
                <Select
                  {...field}
                  label="Question Type *"
                  disabled={disabled}
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  {questionTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.questionTypeId && (
                  <FormHelperText>{errors.questionTypeId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Difficulty Level */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="difficultyId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.difficultyId}>
                <InputLabel>Difficulty Level *</InputLabel>
                <Select
                  {...field}
                  label="Difficulty Level *"
                  disabled={disabled}
                >
                  <MenuItem value="">
                    <em>Select Difficulty</em>
                  </MenuItem>
                  {difficulties.map((difficulty) => (
                    <MenuItem key={difficulty._id} value={difficulty._id}>
                      {difficulty.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.difficultyId && (
                  <FormHelperText>{errors.difficultyId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Marks */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="marks"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Marks *"
                type="number"
                fullWidth
                disabled={disabled}
                error={!!errors.marks}
                helperText={errors.marks?.message}
                InputProps={{
                  inputProps: { min: 0.5, max: 100, step: 0.5 },
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionMetadataForm;