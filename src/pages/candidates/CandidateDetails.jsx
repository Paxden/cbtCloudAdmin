/* eslint-disable no-unused-vars */
/**
 * Candidate Details Page
 * View candidate profile and information
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
  Divider,
  Chip,
  Snackbar,
} from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import CandidateProfileCard from '../../components/candidates/CandidateProfileCard';
import CandidateStatusChip from '../../components/candidates/CandidateStatusChip';
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

const CandidateDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canEdit = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        const response = await candidateService.getCandidate(id);
        if (response.success) {
          setCandidate(response.data);
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
  }, [id]);

  const handleEdit = () => {
    navigate(`/candidates/${id}/edit`);
  };

  const handleBack = () => {
    navigate(`/candidates?examinationId=${candidate?.examinationId?._id || ''}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !candidate) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Candidate not found'}</Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Candidates
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Candidate Details"
        subtitle={`${candidate.firstName || ''} ${candidate.lastName || ''}`}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            {canEdit && !candidate.isDeleted && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
          </Stack>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CandidateProfileCard candidate={candidate} loading={loading} />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Typography variant="subtitle2">Status</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CandidateStatusChip
                  status={candidate.isDeleted ? 'DELETED' : candidate.status}
                  size="medium"
                />
              </Box>

              <Divider />

              <Typography variant="subtitle2">Examination</Typography>
              <Typography variant="body2">
                {candidate.examinationId?.name || 'N/A'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Code: {candidate.examinationId?.code || 'N/A'}
              </Typography>

              <Divider />

              <Typography variant="subtitle2">Candidate Information</Typography>
              <Typography variant="body2">
                <strong>Number:</strong> {candidate.candidateNumber || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Department:</strong> {candidate.department || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Organization:</strong> {candidate.organization || 'N/A'}
              </Typography>

              {candidate.isDeleted && (
                <>
                  <Divider />
                  <Alert severity="error">
                    This candidate has been deleted
                  </Alert>
                </>
              )}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Future Modules
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
              <Chip
                label="Centre Assignment"
                size="small"
                variant="outlined"
                color="info"
              />
              <Chip
                label="Seat Allocation"
                size="small"
                variant="outlined"
                color="info"
              />
              <Chip
                label="Package Generation"
                size="small"
                variant="outlined"
                color="info"
              />
            </Stack>

            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Available after completing future modules.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

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

export default CandidateDetails;