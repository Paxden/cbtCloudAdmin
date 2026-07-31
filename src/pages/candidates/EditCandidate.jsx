/**
 * Edit Candidate Page
 * Edit candidate information
 */

import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  Stack,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
} from '@mui/material';
import { ArrowBack as BackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import * as candidateService from '../../services/candidates/candidateService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object' && user.role.name) {
    return user.role.name;
  }
  if (user.role && typeof user.role === 'object' && user.role.role) {
    return user.role.role;
  }
  return 'USER';
};

// Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').max(100),
  lastName: yup.string().required('Last name is required').max(100),
  otherName: yup.string().max(100),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().max(20),
  gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  department: yup.string().max(200),
  organization: yup.string().max(200),
  rank: yup.string().max(100),
  employeeNumber: yup.string().max(50),
});

const EditCandidate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canEdit = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      otherName: '',
      email: '',
      phone: '',
      gender: 'PREFER_NOT_TO_SAY',
      department: '',
      organization: '',
      rank: '',
      employeeNumber: '',
    },
  });

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        const response = await candidateService.getCandidate(id);
        if (response.success) {
          const data = response.data;
          reset({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            otherName: data.otherName || '',
            email: data.email || '',
            phone: data.phone || '',
            gender: data.gender || 'PREFER_NOT_TO_SAY',
            department: data.department || '',
            organization: data.organization || '',
            rank: data.rank || '',
            employeeNumber: data.employeeNumber || '',
          });
        } else {
          setError('Candidate not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load candidate');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setSaving(true);
    setError(null);
    try {
      await candidateService.updateCandidate(id, data);
      setToast({
        open: true,
        message: 'Candidate updated successfully',
        severity: 'success',
      });
      setTimeout(() => navigate(`/candidates/${id}`), 1000);
    } catch (err) {
      setError(err.message || 'Failed to update candidate');
      setToast({
        open: true,
        message: err.message || 'Failed to update candidate',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/candidates/${id}`);
  };

  if (!canEdit) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">
          You do not have permission to edit candidates. Please contact your administrator.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/candidates')}
          sx={{ mt: 2 }}
        >
          Back to Candidates
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Edit Candidate"
        subtitle="Update candidate information"
        actions={
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name *"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="otherName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Other Names"
                    fullWidth
                    error={!!errors.otherName}
                    helperText={errors.otherName?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name *"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email *"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender" disabled={saving}>
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                      <MenuItem value="PREFER_NOT_TO_SAY">Prefer Not to Say</MenuItem>
                    </Select>
                    {errors.gender && (
                      <FormHelperText>{errors.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Professional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department"
                    fullWidth
                    error={!!errors.department}
                    helperText={errors.department?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="organization"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Organization"
                    fullWidth
                    error={!!errors.organization}
                    helperText={errors.organization?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="rank"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rank"
                    fullWidth
                    error={!!errors.rank}
                    helperText={errors.rank?.message}
                    disabled={saving}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="employeeNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee Number"
                    fullWidth
                    error={!!errors.employeeNumber}
                    helperText={errors.employeeNumber?.message}
                    disabled={saving}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditCandidate;