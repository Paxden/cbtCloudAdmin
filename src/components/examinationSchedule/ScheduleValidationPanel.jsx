/* eslint-disable no-unused-vars */
/**
 * Schedule Validation Panel Component
 * Displays schedule validation results
 */

import React from 'react';
import { Paper, Typography, Stack, Chip, Box, Divider, Alert, Grid, Card, CardContent } from '@mui/material';
import {
  CheckCircle as ValidIcon,
  Cancel as InvalidIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ScheduleValidationPanel = ({ validation, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">Validating schedule...</Typography>
      </Paper>
    );
  }

  if (!validation) {
    return null;
  }

  const { isValid, errors = [], warnings = [], conflicts = [], summary = {} } = validation;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Schedule Validation Results
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip
          label={isValid ? 'Valid' : 'Invalid'}
          color={isValid ? 'success' : 'error'}
          size="medium"
        />
        <Chip
          label={`${errors.length} errors`}
          color="error"
          size="medium"
          variant="outlined"
        />
        <Chip
          label={`${warnings.length} warnings`}
          color="warning"
          size="medium"
          variant="outlined"
        />
        <Chip
          label={`${conflicts.length} conflicts`}
          color="error"
          size="medium"
          variant="outlined"
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="textSecondary">
                  Total Sessions
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {summary.totalSessions || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="textSecondary">
                  Centres Used
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {summary.totalCentres || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="textSecondary">
                  Total Capacity
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {summary.totalCapacity || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Errors ({errors.length})
          </Typography>
          {errors.map((error, index) => (
            <Alert key={index} severity="error" sx={{ mb: 0.5 }}>
              {error.message}
              {error.session && (
                <Typography variant="caption" display="block">
                  Session: {error.session}
                </Typography>
              )}
            </Alert>
          ))}
        </Box>
      )}

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Conflicts ({conflicts.length})
          </Typography>
          {conflicts.map((conflict, index) => (
            <Alert key={index} severity="warning" sx={{ mb: 0.5 }}>
              {conflict.message}
              {conflict.session1 && conflict.session2 && (
                <Typography variant="caption" display="block">
                  Between: {conflict.session1} and {conflict.session2}
                </Typography>
              )}
            </Alert>
          ))}
        </Box>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="warning" gutterBottom>
            Warnings ({warnings.length})
          </Typography>
          {warnings.map((warning, index) => (
            <Alert key={index} severity="warning" sx={{ mb: 0.5 }}>
              {warning.message}
            </Alert>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ScheduleValidationPanel;