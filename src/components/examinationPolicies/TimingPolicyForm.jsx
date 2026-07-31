/* eslint-disable no-unused-vars */
/**
 * Timing Policy Form Component
 * Configures timing rules for the examination
 */

import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
  Divider,
  Slider,
  Alert,
  FormHelperText,
} from '@mui/material';

const TimingPolicyForm = ({ policies, onChange, errors, readOnly }) => {
  const handleChange = (field, value) => {
    onChange({ ...policies, [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Timing Policies
      </Typography>
      <Typography variant="caption" color="textSecondary" paragraph>
        Configure timing rules for the examination
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Total Examination Time */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Total Examination Time (minutes)"
            type="number"
            fullWidth
            size="small"
            value={policies?.totalTime || 60}
            onChange={(e) => handleChange('totalTime', parseInt(e.target.value) || 60)}
            disabled={readOnly}
            InputProps={{ inputProps: { min: 5, max: 480 } }}
          />
          <FormHelperText>Total duration of the examination in minutes</FormHelperText>
        </Grid>

        {/* Grace Period */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Grace Period (minutes)"
            type="number"
            fullWidth
            size="small"
            value={policies?.gracePeriod || 0}
            onChange={(e) => handleChange('gracePeriod', parseInt(e.target.value) || 0)}
            disabled={readOnly}
            InputProps={{ inputProps: { min: 0, max: 30 } }}
          />
          <FormHelperText>Additional time allowed after the main duration</FormHelperText>
        </Grid>

        {/* Auto Submit */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.autoSubmit || false}
                onChange={(e) => handleChange('autoSubmit', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Auto Submit on Timeout"
          />
          <FormHelperText>Automatically submit when time expires</FormHelperText>
        </Grid>

        {/* Auto Save Interval */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.autoSave || false}
                onChange={(e) => handleChange('autoSave', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Enable Auto Save"
          />
          <FormHelperText>Automatically save candidate progress</FormHelperText>
        </Grid>

        {/* Warning Before Expiry */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Warning Thresholds (minutes)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="First Warning"
                type="number"
                size="small"
                fullWidth
                value={policies?.warningThresholds?.[0] || 15}
                onChange={(e) => {
                  const thresholds = [...(policies?.warningThresholds || [15, 10, 5])];
                  thresholds[0] = parseInt(e.target.value) || 15;
                  handleChange('warningThresholds', thresholds);
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Second Warning"
                type="number"
                size="small"
                fullWidth
                value={policies?.warningThresholds?.[1] || 10}
                onChange={(e) => {
                  const thresholds = [...(policies?.warningThresholds || [15, 10, 5])];
                  thresholds[1] = parseInt(e.target.value) || 10;
                  handleChange('warningThresholds', thresholds);
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Final Warning"
                type="number"
                size="small"
                fullWidth
                value={policies?.warningThresholds?.[2] || 5}
                onChange={(e) => {
                  const thresholds = [...(policies?.warningThresholds || [15, 10, 5])];
                  thresholds[2] = parseInt(e.target.value) || 5;
                  handleChange('warningThresholds', thresholds);
                }}
                disabled={readOnly}
              />
            </Grid>
          </Grid>
          <FormHelperText>Minutes before expiry to show warnings</FormHelperText>
        </Grid>
      </Grid>

      {errors?.timing && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.timing}
        </Alert>
      )}
    </Paper>
  );
};

export default TimingPolicyForm;