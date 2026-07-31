/**
 * Reference Editor Component
 * Handles question references (book, document, policy, URL)
 */

import { Box, Grid, TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

const ReferenceEditor = ({
  control,
  errors,
  disabled = false,
}) => {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Reference (Optional)
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
        Provide a reference source for the question.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="referenceBook"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Book / Document"
                fullWidth
                disabled={disabled}
                placeholder="e.g., Textbook Name"
                error={!!errors.referenceBook}
                helperText={errors.referenceBook?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="referenceSection"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Section / Chapter"
                fullWidth
                disabled={disabled}
                placeholder="e.g., Chapter 5, Section 3"
                error={!!errors.referenceSection}
                helperText={errors.referenceSection?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="referenceUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="URL (Optional)"
                fullWidth
                disabled={disabled}
                placeholder="https://example.com"
                error={!!errors.referenceUrl}
                helperText={errors.referenceUrl?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReferenceEditor;