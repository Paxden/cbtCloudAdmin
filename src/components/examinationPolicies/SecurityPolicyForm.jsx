/* eslint-disable no-unused-vars */
/**
 * Security Policy Form Component
 * Configures security rules for the examination
 */

import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  FormHelperText,
} from '@mui/material';

const SecurityPolicyForm = ({ policies, onChange, errors, readOnly }) => {
  const handleChange = (field, value) => {
    onChange({ ...policies, [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Security Policies
      </Typography>
      <Typography variant="caption" color="textSecondary" paragraph>
        Configure security measures for the examination
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {/* Fullscreen Required */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.fullscreenRequired || false}
                onChange={(e) => handleChange('fullscreenRequired', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Require Fullscreen"
          />
          <FormHelperText>Force candidates into fullscreen mode</FormHelperText>
        </Grid>

        {/* Prevent Copy */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.preventCopy || false}
                onChange={(e) => handleChange('preventCopy', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Prevent Copy"
          />
          <FormHelperText>Disable copy functionality</FormHelperText>
        </Grid>

        {/* Prevent Paste */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.preventPaste || false}
                onChange={(e) => handleChange('preventPaste', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Prevent Paste"
          />
          <FormHelperText>Disable paste functionality</FormHelperText>
        </Grid>

        {/* Prevent Print */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.preventPrint || false}
                onChange={(e) => handleChange('preventPrint', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Prevent Print"
          />
          <FormHelperText>Disable print functionality</FormHelperText>
        </Grid>

        {/* Disable Right Click */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.disableRightClick || false}
                onChange={(e) => handleChange('disableRightClick', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Disable Right Click"
          />
          <FormHelperText>Disable right-click context menu</FormHelperText>
        </Grid>

        {/* Disable Developer Tools */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.disableDevTools || false}
                onChange={(e) => handleChange('disableDevTools', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Disable Developer Tools"
          />
          <FormHelperText>Prevent opening developer tools</FormHelperText>
        </Grid>

        {/* Detect Multiple Tabs */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.detectMultipleTabs || false}
                onChange={(e) => handleChange('detectMultipleTabs', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Detect Multiple Tabs"
          />
          <FormHelperText>Detect if candidate opens multiple tabs</FormHelperText>
        </Grid>

        {/* Detect Window Switch */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.detectWindowSwitch || false}
                onChange={(e) => handleChange('detectWindowSwitch', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Detect Window Switch"
          />
          <FormHelperText>Detect if candidate switches windows</FormHelperText>
        </Grid>
      </Grid>

      {errors?.security && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.security}
        </Alert>
      )}
    </Paper>
  );
};

export default SecurityPolicyForm;