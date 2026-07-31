/**
 * Navigation Policy Form Component
 * Configures navigation rules for the examination
 */


import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  FormHelperText,
} from '@mui/material';

const NavigationPolicyForm = ({ policies, onChange, errors, readOnly }) => {
  const handleChange = (field, value) => {
    onChange({ ...policies, [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Navigation Policies
      </Typography>
      <Typography variant="caption" color="textSecondary" paragraph>
        Configure how candidates navigate through the examination
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Navigation Type */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Navigation Type</FormLabel>
            <RadioGroup
              row
              value={policies?.navigationType || 'free'}
              onChange={(e) => handleChange('navigationType', e.target.value)}
            >
              <FormControlLabel value="free" control={<Radio />} label="Free Navigation" />
              <FormControlLabel value="sequential" control={<Radio />} label="Sequential Navigation" />
              <FormControlLabel value="section" control={<Radio />} label="Section-based Navigation" />
            </RadioGroup>
          </FormControl>
          <Typography variant="caption" color="textSecondary">
            Free: Navigate freely between questions. Sequential: Only move forward. Section: Navigate within sections.
          </Typography>
        </Grid>

        {/* Back Navigation */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.allowBack || false}
                onChange={(e) => handleChange('allowBack', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Allow Back Navigation"
          />
          <FormHelperText>Allow candidates to go back to previous questions</FormHelperText>
        </Grid>

        {/* Forward Navigation */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.allowForward || false}
                onChange={(e) => handleChange('allowForward', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Allow Forward Navigation"
          />
          <FormHelperText>Allow candidates to skip to next questions</FormHelperText>
        </Grid>

        {/* Skip Questions */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.allowSkip || false}
                onChange={(e) => handleChange('allowSkip', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Allow Skip Questions"
          />
          <FormHelperText>Allow candidates to skip questions and return later</FormHelperText>
        </Grid>

        {/* Lock After Submission */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.lockAfterSubmit || false}
                onChange={(e) => handleChange('lockAfterSubmit', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Lock Questions After Submission"
          />
          <FormHelperText>Prevent changes to answered questions</FormHelperText>
        </Grid>
      </Grid>

      {errors?.navigation && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.navigation}
        </Alert>
      )}
    </Paper>
  );
};

export default NavigationPolicyForm;