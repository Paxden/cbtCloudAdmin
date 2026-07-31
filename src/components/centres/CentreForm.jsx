/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
/**
 * Centre Form Component
 * Create and edit centre form
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Autocomplete,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const CENTRE_STATUSES = ['ACTIVE', 'INACTIVE', 'PENDING'];

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Centre name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name cannot exceed 200 characters'),
  code: yup
    .string()
    .required('Centre code is required')
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code cannot exceed 20 characters')
    .matches(/^[A-Z0-9\-_]+$/, 'Code can only contain uppercase letters, numbers, hyphens, and underscores'),
  address: yup
    .string()
    .required('Address is required')
    .max(500, 'Address cannot exceed 500 characters'),
  capacity: yup
    .number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .max(10000, 'Capacity cannot exceed 10,000'),
  manager: yup
    .string()
    .nullable(),
  status: yup
    .string()
    .oneOf(CENTRE_STATUSES, 'Invalid status')
    .default('PENDING'),
});

const CentreForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isEdit = false,
  users = [],
  loadingUsers = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      address: initialData?.address || '',
      capacity: initialData?.capacity || 1,
      manager: initialData?.manager?._id || initialData?.managerId || null,
      status: initialData?.status || 'PENDING',
    },
  });

  const statusValue = watch('status');

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEdit ? 'Edit Centre' : 'Create New Centre'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Centre Name"
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
                  label="Centre Code"
                  fullWidth
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  disabled={loading || isEdit}
                  required
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              )}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={loading}
                  required
                />
              )}
            />
          </Grid>

          {/* Capacity */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Capacity"
                  type="number"
                  fullWidth
                  error={!!errors.capacity}
                  helperText={errors.capacity?.message}
                  disabled={loading}
                  required
                  InputProps={{ inputProps: { min: 1, max: 10000 } }}
                />
              )}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status *</InputLabel>
                  <Select {...field} label="Status *" disabled={loading}>
                    {CENTRE_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Manager */}
          <Grid item xs={12}>
            <Controller
              name="manager"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={users}
                  loading={loadingUsers}
                  getOptionLabel={(option) => 
                    typeof option === 'string' 
                      ? option 
                      : `${option.name || option.firstName || ''} ${option.lastName || ''} (${option.email})`
                  }
                  value={users.find(u => u._id === field.value) || null}
                  onChange={(_, newValue) => {
                    field.onChange(newValue?._id || null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Centre Manager"
                      fullWidth
                      error={!!errors.manager}
                      helperText={errors.manager?.message}
                      disabled={loading}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
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
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CentreForm;