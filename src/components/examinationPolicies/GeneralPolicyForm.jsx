/**
 * General Policy Form Component
 * Configures general examination policies
 */

import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
  Divider,
  Alert,
  FormHelperText,
} from '@mui/material';

const GeneralPolicyForm = ({ policies, onChange, errors, readOnly }) => {
  const handleChange = (field, value) => {
    onChange({ ...policies, [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        General Policies
      </Typography>
      <Typography variant="caption" color="textSecondary" paragraph>
        Configure general examination behaviour and candidate experience
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Examination Status */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.examinationStatus || false}
                onChange={(e) => handleChange('examinationStatus', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Examination Status"
          />
          <FormHelperText>Enable/disable the examination</FormHelperText>
        </Grid>

        {/* Candidate Login Method */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Candidate Login Method"
            select
            fullWidth
            size="small"
            value={policies?.loginMethod || 'email'}
            onChange={(e) => handleChange('loginMethod', e.target.value)}
            disabled={readOnly}
            SelectProps={{ native: true }}
          >
            <option value="email">Email</option>
            <option value="candidateNumber">Candidate Number</option>
            <option value="both">Both</option>
          </TextField>
          <FormHelperText>How candidates log in to the examination</FormHelperText>
        </Grid>

        {/* Maximum Login Attempts */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Maximum Login Attempts"
            type="number"
            fullWidth
            size="small"
            value={policies?.maxLoginAttempts || 3}
            onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value) || 3)}
            disabled={readOnly}
            InputProps={{ inputProps: { min: 1, max: 10 } }}
          />
          <FormHelperText>Number of login attempts allowed</FormHelperText>
        </Grid>

        {/* Allow Resume */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.allowResume || false}
                onChange={(e) => handleChange('allowResume', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Allow Resume"
          />
          <FormHelperText>Allow candidates to resume interrupted examinations</FormHelperText>
        </Grid>

        {/* Allow Review Before Submission */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.allowReview || false}
                onChange={(e) => handleChange('allowReview', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Allow Review Before Submission"
          />
          <FormHelperText>Allow candidates to review answers before submitting</FormHelperText>
        </Grid>

        {/* Allow Question Flagging */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.allowFlagging || false}
                onChange={(e) => handleChange('allowFlagging', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Allow Question Flagging"
          />
          <FormHelperText>Allow candidates to flag questions for review</FormHelperText>
        </Grid>

        {/* Randomize Questions */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.randomizeQuestions || false}
                onChange={(e) => handleChange('randomizeQuestions', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Randomize Questions"
          />
          <FormHelperText>Display questions in random order per candidate</FormHelperText>
        </Grid>

        {/* Randomize Options */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={policies?.randomizeOptions || false}
                onChange={(e) => handleChange('randomizeOptions', e.target.checked)}
                disabled={readOnly}
              />
            }
            label="Randomize Options"
          />
          <FormHelperText>Randomize answer option order per candidate</FormHelperText>
        </Grid>
      </Grid>

      {errors?.general && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.general}
        </Alert>
      )}
    </Paper>
  );
};

export default GeneralPolicyForm;