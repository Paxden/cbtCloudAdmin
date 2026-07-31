/**
 * Examination Detail Page
 * View detailed examination information
 */

import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
  ContentCopy as CloneIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import AppPageHeader from '../../components/common/AppPageHeader';
import * as examinationService from '../../services/examination/examinationService';

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value || '-'}</Typography>
  </Box>
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
          }}
        >
          <Icon />
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">{title}</Typography>
          <Typography variant="h6" fontWeight={600}>{value || 0}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const ExaminationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Fetch examination data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await examinationService.getExamination(id);
        if (response.success) {
          setExamination(response.data);
        } else {
          setError('Examination not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load examination');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle actions
  const handleEdit = () => {
    navigate(`/examinations/${id}/edit`);
  };

  const handleClone = () => {
    navigate(`/examinations/${id}/clone`);
  };

  const handleArchive = async () => {
    try {
      await examinationService.archiveExamination(id, { reason: 'Archived from detail page' });
      setToast({
        open: true,
        message: 'Examination archived successfully',
        severity: 'success',
      });
      // Refresh data
      const response = await examinationService.getExamination(id);
      if (response.success) {
        setExamination(response.data);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to archive examination',
        severity: 'error',
      });
    }
  };

  const handleRestore = async () => {
    try {
      await examinationService.restoreExamination(id);
      setToast({
        open: true,
        message: 'Examination restored successfully',
        severity: 'success',
      });
      const response = await examinationService.getExamination(id);
      if (response.success) {
        setExamination(response.data);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to restore examination',
        severity: 'error',
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      published: 'info',
      scheduled: 'warning',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'error',
      archived: 'default',
    };
    return colors[status?.toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !examination) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Examination not found'}</Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/examinations')}
          sx={{ mt: 2 }}
        >
          Back to Examinations
        </Button>
      </Box>
    );
  }

  const isArchived = examination.isArchived || examination.status === 'Archived';

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title={examination.name || 'Untitled Examination'}
        subtitle={`${examination.code || 'No Code'} • ${examination.examinationType || 'N/A'}`}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => navigate('/examinations')}
            >
              Back
            </Button>

            {!isArchived && (
              <>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={handleEdit}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clone">
                  <IconButton color="secondary" onClick={handleClone}>
                    <CloneIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Archive">
                  <IconButton color="warning" onClick={handleArchive}>
                    <ArchiveIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {isArchived && (
              <>
                <Tooltip title="Restore">
                  <IconButton color="success" onClick={handleRestore}>
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        }
      />

      {/* Status Chip */}
      <Box sx={{ mb: 3 }}>
        <Chip
          label={examination.status?.toUpperCase() || 'UNKNOWN'}
          color={getStatusColor(examination.status)}
          icon={isArchived ? <ArchiveIcon /> : undefined}
          size="medium"
        />
        {examination.isArchived && (
          <Chip
            label="Archived"
            color="default"
            size="medium"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Candidates"
            value={examination.metadata?.totalCandidates || 0}
            icon={PeopleIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Centres"
            value={examination.metadata?.totalCentres || 0}
            icon={SchoolIcon}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Questions"
            value={examination.metadata?.totalQuestions || 0}
            icon={DescriptionIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Version"
            value={examination.version || 1}
            icon={HistoryIcon}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Examination Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <InfoRow label="Examination Name" value={examination.name} />
            <InfoRow label="Examination Code" value={examination.code} />
            <InfoRow label="Examination Type" value={examination.examinationType} />
            <InfoRow label="Promotion Year" value={examination.promotionYear} />
            <InfoRow label="Version" value={`v${examination.version || 1}`} />
            <InfoRow label="Status" value={examination.status || 'N/A'} />

            {examination.description && (
              <>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {examination.description}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Audit Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <InfoRow
              label="Created By"
              value={examination.createdBy?.name || 'Unknown'}
            />
            <InfoRow
              label="Created At"
              value={format(new Date(examination.createdAt), 'dd/MM/yyyy HH:mm')}
            />
            {examination.updatedBy && (
              <InfoRow
                label="Last Updated By"
                value={examination.updatedBy?.name || 'Unknown'}
              />
            )}
            <InfoRow
              label="Last Updated"
              value={format(new Date(examination.updatedAt), 'dd/MM/yyyy HH:mm')}
            />

            {examination.archivedAt && (
              <>
                <InfoRow
                  label="Archived At"
                  value={format(new Date(examination.archivedAt), 'dd/MM/yyyy HH:mm')}
                />
                <InfoRow
                  label="Archived By"
                  value={examination.archivedBy?.name || 'Unknown'}
                />
              </>
            )}
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

export default ExaminationDetail;