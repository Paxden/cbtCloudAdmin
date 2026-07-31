/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Subject Form Dialog Component
 * Create and edit subject form
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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AppDialog from '../../dialogs/AppDialog';
import AppButton from '../../common/buttons/AppButton';
import * as subjectService from '../../../services/questionBank/subjectService';

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Subject name is required')
    .min(3, 'Subject name must be at least 3 characters')
    .max(100, 'Subject name cannot exceed 100 characters')
    .trim(),
  code: yup
    .string()
    .required('Subject code is required')
    .min(2, 'Subject code must be at least 2 characters')
    .max(20, 'Subject code cannot exceed 20 characters')
    .matches(/^[A-Z0-9_]+$/, 'Code must contain only uppercase letters, numbers, and underscores')
    .trim()
    .transform((value) => value.toUpperCase()),
  categoryId: yup
    .string()
    .required('Category is required'),
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

const SubjectFormDialog = ({
  open,
  subject,
  onClose,
  onSubmit,
  loading,
  error,
  mode = 'create',
}) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      code: '',
      categoryId: '',
      description: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await subjectService.getCategories({ limit: 100 });
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (subject && mode === 'edit') {
      reset({
        name: subject.name || '',
        code: subject.code || '',
        categoryId: subject.categoryId?._id || subject.categoryId || '',
        description: subject.description || '',
        status: subject.status || 'ACTIVE',
      });
    } else {
      reset({
        name: '',
        code: '',
        categoryId: '',
        description: '',
        status: 'ACTIVE',
      });
    }
    setSubmitError(null);
  }, [subject, mode, open, reset]);

  const handleFormSubmit = async (data) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save subject');
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
        {isEditMode ? 'Update Subject' : 'Create Subject'}
      </AppButton>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit Subject' : 'Create New Subject'}
      subtitle={isEditMode ? 'Update subject details' : 'Add a new subject'}
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
                label="Subject Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
                autoFocus
                placeholder="e.g., Professional Knowledge"
              />
            )}
          />

          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Subject Code"
                fullWidth
                required
                error={!!errors.code}
                helperText={errors.code?.message || 'e.g., PKNOW, ETH, ADMIN'}
                disabled={loading || isEditMode}
                placeholder="e.g., PKNOW"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            )}
          />

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.categoryId}>
                <InputLabel>Category</InputLabel>
                <Select
                  {...field}
                  label="Category"
                  disabled={loading || categoriesLoading}
                >
                  {categoriesLoading ? (
                    <MenuItem disabled>Loading categories...</MenuItem>
                  ) : categories.length === 0 ? (
                    <MenuItem disabled>No categories available</MenuItem>
                  ) : (
                    categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.categoryId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.categoryId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

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
                placeholder="Brief description of the subject..."
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

export default SubjectFormDialog;