/* eslint-disable no-unused-vars */
/**
 * General Instructions Editor Component
 * Simple text editor for examination instructions (without react-quill)
 */

import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Divider,
  Alert,
  FormHelperText,
  Stack,
} from '@mui/material';

const GeneralInstructionsEditor = ({
  instructions,
  onChange,
  errors,
  readOnly,
}) => {
  const handleChange = (field, value) => {
    onChange({ ...instructions, [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        General Instructions
      </Typography>
      <Typography variant="caption" color="textSecondary" paragraph>
        Create instructions that candidates will see before the examination begins
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Welcome Message */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Welcome Message *
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={instructions?.welcomeMessage || ''}
            onChange={(e) => handleChange('welcomeMessage', e.target.value)}
            disabled={readOnly}
            placeholder="Enter a welcoming message for candidates..."
            error={!!errors?.welcomeMessage}
            helperText={errors?.welcomeMessage}
          />
        </Grid>

        {/* Examination Overview */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Examination Overview
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={instructions?.overview || ''}
            onChange={(e) => handleChange('overview', e.target.value)}
            disabled={readOnly}
            placeholder="Provide an overview of the examination..."
            error={!!errors?.overview}
            helperText={errors?.overview}
          />
        </Grid>

        {/* Candidate Responsibilities */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Candidate Responsibilities
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={instructions?.responsibilities || ''}
            onChange={(e) => handleChange('responsibilities', e.target.value)}
            disabled={readOnly}
            placeholder="List candidate responsibilities and expectations..."
            error={!!errors?.responsibilities}
            helperText={errors?.responsibilities}
          />
        </Grid>

        {/* Submission Instructions */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Submission Instructions *
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={instructions?.submissionInstructions || ''}
            onChange={(e) => handleChange('submissionInstructions', e.target.value)}
            disabled={readOnly}
            placeholder="Provide instructions for submitting the examination..."
            error={!!errors?.submissionInstructions}
            helperText={errors?.submissionInstructions}
          />
        </Grid>

        {/* Warning Messages */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Warning Messages
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={instructions?.warningMessages || ''}
            onChange={(e) => handleChange('warningMessages', e.target.value)}
            disabled={readOnly}
            placeholder="Add warning messages for candidates..."
            error={!!errors?.warningMessages}
            helperText={errors?.warningMessages}
          />
        </Grid>

        {/* Completion Message */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Completion Message *
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={instructions?.completionMessage || ''}
            onChange={(e) => handleChange('completionMessage', e.target.value)}
            disabled={readOnly}
            placeholder="Enter a message to show after completion..."
            error={!!errors?.completionMessage}
            helperText={errors?.completionMessage}
          />
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

export default GeneralInstructionsEditor;