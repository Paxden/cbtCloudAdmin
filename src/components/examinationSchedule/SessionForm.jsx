/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
/**
 * Session Form Component
 * Create and edit session form
 */

import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Typography,
  Paper,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';

const schema = yup.object().shape({
  sessionName: yup.string().required('Session name is required').max(200),
  centreId: yup.string().required('Centre is required'),
  sessionDate: yup.string().required('Date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  capacity: yup.number().min(1, 'Capacity must be at least 1').max(10000),
  notes: yup.string().max(500),
});

const SessionForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  isEdit = false,
  centres = [],
  examinations = [],
  selectedExaminationId,
  readOnly = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      sessionName: initialData?.sessionName || initialData?.name || '',
      centreId: initialData?.centreId?._id || initialData?.centreId || '',
      sessionDate: initialData?.sessionDate ? format(new Date(initialData.sessionDate), 'yyyy-MM-dd') : '',
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || '',
      capacity: initialData?.capacity || 100,
      notes: initialData?.notes || '',
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isEdit ? 'Edit Session' : 'Create New Session'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          {/* Session Name */}
          <Grid item xs={12}>
            <Controller
              name="sessionName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Session Name"
                  fullWidth
                  error={!!errors.sessionName}
                  helperText={errors.sessionName?.message}
                  disabled={loading || readOnly}
                  required
                />
              )}
            />
          </Grid>

          {/* Centre */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="centreId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.centreId}>
                  <InputLabel>Centre *</InputLabel>
                  <Select {...field} label="Centre *" disabled={loading || readOnly}>
                    <MenuItem value="">
                      <em>Select Centre</em>
                    </MenuItem>
                    {centres.map((centre) => (
                      <MenuItem key={centre._id} value={centre._id}>
                        {centre.name} ({centre.code}) - Capacity: {centre.capacity || 0}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.centreId && (
                    <FormHelperText>{errors.centreId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Date */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="sessionDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  fullWidth
                  error={!!errors.sessionDate}
                  helperText={errors.sessionDate?.message}
                  disabled={loading || readOnly}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Start Time */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Time"
                  type="time"
                  fullWidth
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                  disabled={loading || readOnly}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* End Time */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="End Time"
                  type="time"
                  fullWidth
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
                  disabled={loading || readOnly}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            {startTime && endTime && startTime >= endTime && (
              <FormHelperText error>
                End time must be after start time
              </FormHelperText>
            )}
          </Grid>

          {/* Capacity */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Maximum Candidates"
                  type="number"
                  fullWidth
                  error={!!errors.capacity}
                  helperText={errors.capacity?.message}
                  disabled={loading || readOnly}
                  InputProps={{ inputProps: { min: 1, max: 10000 } }}
                />
              )}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notes"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  disabled={loading || readOnly}
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
          {!readOnly && (
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !centres.length}
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          )}
        </Stack>
      </form>
    </Paper>
  );
};

export default SessionForm;