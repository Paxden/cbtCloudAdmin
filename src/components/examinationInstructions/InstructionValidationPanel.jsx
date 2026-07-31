/* eslint-disable no-unused-vars */
/**
 * Instruction Validation Panel Component
 * Displays instruction validation results
 */

import React from 'react';
import { Paper, Typography, Stack, Chip, Box, Divider, Alert, Grid, Card, CardContent } from '@mui/material';
import {
  CheckCircle as ValidIcon,
  Cancel as InvalidIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const InstructionValidationPanel = ({ validation, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">Validating instructions...</Typography>
      </Paper>
    );
  }

  if (!validation) {
    return null;
  }

  const { isValid, errors = [], warnings = [], summary = {} } = validation;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Validation Results
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
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Summary */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="textSecondary">
                  Instruction Sections
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {summary.totalSections || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="textSecondary">
                  Resources
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {summary.totalResources || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="textSecondary">
                  Missing Sections
                </Typography>
                <Typography variant="h5" fontWeight={600} color="error">
                  {summary.missingSections || 0}
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
              {error.field && (
                <Typography variant="caption" display="block">
                  Field: {error.field}
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

export default InstructionValidationPanel;