/**
 * General Instructions Editor Component
 * Rich text editor for examination instructions
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet',
  'link', 'image',
];

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
          <ReactQuill
            theme="snow"
            value={instructions?.welcomeMessage || ''}
            onChange={(value) => handleChange('welcomeMessage', value)}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            placeholder="Enter a welcoming message for candidates..."
            style={{ height: 150, marginBottom: 50 }}
          />
          {errors?.welcomeMessage && (
            <FormHelperText error>{errors.welcomeMessage}</FormHelperText>
          )}
        </Grid>

        {/* Examination Overview */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Examination Overview
          </Typography>
          <ReactQuill
            theme="snow"
            value={instructions?.overview || ''}
            onChange={(value) => handleChange('overview', value)}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            placeholder="Provide an overview of the examination..."
            style={{ height: 150, marginBottom: 50 }}
          />
        </Grid>

        {/* Candidate Responsibilities */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Candidate Responsibilities
          </Typography>
          <ReactQuill
            theme="snow"
            value={instructions?.responsibilities || ''}
            onChange={(value) => handleChange('responsibilities', value)}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            placeholder="List candidate responsibilities and expectations..."
            style={{ height: 150, marginBottom: 50 }}
          />
        </Grid>

        {/* Submission Instructions */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Submission Instructions *
          </Typography>
          <ReactQuill
            theme="snow"
            value={instructions?.submissionInstructions || ''}
            onChange={(value) => handleChange('submissionInstructions', value)}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            placeholder="Provide instructions for submitting the examination..."
            style={{ height: 150, marginBottom: 50 }}
          />
          {errors?.submissionInstructions && (
            <FormHelperText error>{errors.submissionInstructions}</FormHelperText>
          )}
        </Grid>

        {/* Warning Messages */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Warning Messages
          </Typography>
          <ReactQuill
            theme="snow"
            value={instructions?.warningMessages || ''}
            onChange={(value) => handleChange('warningMessages', value)}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            placeholder="Add warning messages for candidates..."
            style={{ height: 150, marginBottom: 50 }}
          />
        </Grid>

        {/* Completion Message */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Completion Message *
          </Typography>
          <ReactQuill
            theme="snow"
            value={instructions?.completionMessage || ''}
            onChange={(value) => handleChange('completionMessage', value)}
            modules={modules}
            formats={formats}
            readOnly={readOnly}
            placeholder="Enter a message to show after completion..."
            style={{ height: 150, marginBottom: 50 }}
          />
          {errors?.completionMessage && (
            <FormHelperText error>{errors.completionMessage}</FormHelperText>
          )}
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