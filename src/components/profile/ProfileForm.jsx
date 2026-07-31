/* eslint-disable no-useless-escape */
/**
 * Profile Form Component
 * Form for updating profile information
 */

import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const ProfileForm = ({ profile, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Edit Profile
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Update your personal information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
              fullWidth
              required
              disabled={loading}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              value={profile?.email || ''}
              fullWidth
              disabled
              helperText="Email cannot be changed"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
              disabled={loading}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone || 'Format: +234 801 234 5678'}
              placeholder="e.g., +234 801 234 5678"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Role"
              value={profile?.role || ''}
              fullWidth
              disabled
              helperText="Role is assigned by system administrators"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProfileForm;