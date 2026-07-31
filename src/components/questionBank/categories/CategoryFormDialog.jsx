/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Category Form Dialog Component
 * Create and edit category form
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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AppDialog from '../../dialogs/AppDialog';
import AppButton from '../../common/AppButton';

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Category name is required')
    .min(3, 'Category name must be at least 3 characters')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim(),
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

const CategoryFormDialog = ({
  open,
  category,
  onClose,
  onSubmit,
  loading,
  error,
  mode = 'create', // 'create' | 'edit'
}) => {
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
      description: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (category && mode === 'edit') {
      reset({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'ACTIVE',
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'ACTIVE',
      });
    }
    setSubmitError(null);
  }, [category, mode, open, reset]);

  const handleFormSubmit = async (data) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save category');
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
        {isEditMode ? 'Update Category' : 'Create Category'}
      </AppButton>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Edit Category' : 'Create New Category'}
      subtitle={isEditMode ? 'Update category details' : 'Add a new question category'}
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
                label="Category Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
                autoFocus
                placeholder="e.g., Promotion Examination"
              />
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
                placeholder="Brief description of the category..."
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

export default CategoryFormDialog;