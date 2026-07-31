/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/**
 * Examination Form Component
 * Create and edit examination form
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const EXAMINATION_TYPES = ['Promotion', 'Recruitment', 'Certification', 'Internal Assessment'];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR + i);

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Examination name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name cannot exceed 200 characters'),
  code: yup
    .string()
    .required('Examination code is required')
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code cannot exceed 20 characters')
    .matches(/^[A-Z0-9\-_]+$/, 'Code can only contain uppercase letters, numbers, hyphens, and underscores'),
  description: yup
    .string()
    .max(1000, 'Description cannot exceed 1000 characters'),
  examinationType: yup
    .string()
    .required('Examination type is required')
    .oneOf(EXAMINATION_TYPES, 'Invalid examination type'),
  promotionYear: yup
    .number()
    .required('Promotion year is required')
    .min(2000, 'Year must be at least 2000')
    .max(2100, 'Year cannot exceed 2100'),
});

const ExaminationForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isEdit = false,
  checkCodeAvailability = null,
}) => {
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState(null);
  const [codeChecked, setCodeChecked] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      examinationType: initialData?.examinationType || '',
      promotionYear: initialData?.promotionYear || CURRENT_YEAR,
    },
  });

  const watchCode = watch('code');

  // Check code availability when code changes
  useEffect(() => {
    const checkCode = async () => {
      if (watchCode && watchCode.length >= 3 && !isEdit) {
        setIsCheckingCode(true);
        setCodeChecked(false);
        try {
          const result = await checkCodeAvailability?.(watchCode);
          setCodeAvailable(result?.data?.isAvailable);
          setCodeChecked(true);
        } catch (err) {
          setCodeAvailable(false);
          setCodeChecked(true);
        } finally {
          setIsCheckingCode(false);
        }
      } else if (isEdit) {
        setCodeAvailable(true);
        setCodeChecked(true);
      }
    };

    const debounce = setTimeout(checkCode, 500);
    return () => clearTimeout(debounce);
  }, [watchCode, isEdit, checkCodeAvailability]);

  const handleFormSubmit = (data) => {
    if (!isEdit && !codeAvailable) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEdit ? 'Edit Examination' : 'Create New Examination'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Examination Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                  required
                />
              )}
            />
          </Grid>

          {/* Code */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Examination Code"
                  fullWidth
                  error={!!errors.code || (!isEdit && codeChecked && !codeAvailable)}
                  helperText={
                    errors.code?.message ||
                    (!isEdit && codeChecked && !codeAvailable && 'Code is already taken') ||
                    (!isEdit && codeChecked && codeAvailable && '✓ Code is available')
                  }
                  disabled={loading || isEdit}
                  required
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                  InputProps={{
                    endAdornment: isCheckingCode && (
                      <CircularProgress size={20} />
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Examination Type */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="examinationType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.examinationType}>
                  <InputLabel>Examination Type *</InputLabel>
                  <Select {...field} label="Examination Type *" disabled={loading}>
                    {EXAMINATION_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.examinationType && (
                    <FormHelperText>{errors.examinationType.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Promotion Year */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="promotionYear"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.promotionYear}>
                  <InputLabel>Promotion Year *</InputLabel>
                  <Select {...field} label="Promotion Year *" disabled={loading}>
                    {YEAR_RANGE.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.promotionYear && (
                    <FormHelperText>{errors.promotionYear.message}</FormHelperText>
                  )}
                </FormControl>
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
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={loading}
                />
              )}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (!isEdit && (!codeChecked || !codeAvailable))}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default ExaminationForm;