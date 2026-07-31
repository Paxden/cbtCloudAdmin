/* eslint-disable no-unused-vars */
/**
 * Centre Details Page
 * View detailed centre information
 */

import React, { useState, useEffect } from 'react';
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
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActivateIcon,
  Cancel as DeactivateIcon,
  PersonAdd as AssignManagerIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import CentreStatusChip from '../../components/centres/CentreStatusChip';
import * as centreService from '../../services/centres/centreService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

// ✅ Helper function to format address
const formatAddress = (address) => {
  if (!address) return 'N/A';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    return parts.join(', ') || 'N/A';
  }
  return 'N/A';
};

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

const CentreDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canEdit = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canActivate = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canDelete = ['SUPER_ADMIN'].includes(userRole);
  const canAssignManager = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);

  const [centre, setCentre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Fetch centre data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await centreService.getCentre(id);
        if (response.success) {
          setCentre(response.data);
        } else {
          setError('Centre not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load centre');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle actions
  const handleEdit = () => {
    navigate(`/centres/${id}/edit`);
  };

  const handleAssignManager = () => {
    navigate(`/centres/${id}/assign-manager`);
  };

  const handleActivate = async () => {
    try {
      await centreService.activateCentre(id);
      setToast({
        open: true,
        message: 'Centre activated successfully',
        severity: 'success',
      });
      const response = await centreService.getCentre(id);
      if (response.success) {
        setCentre(response.data);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to activate centre',
        severity: 'error',
      });
    }
  };

  const handleDeactivate = async () => {
    try {
      await centreService.deactivateCentre(id);
      setToast({
        open: true,
        message: 'Centre deactivated successfully',
        severity: 'success',
      });
      const response = await centreService.getCentre(id);
      if (response.success) {
        setCentre(response.data);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to deactivate centre',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this centre?')) {
      return;
    }
    try {
      await centreService.deleteCentre(id);
      setToast({
        open: true,
        message: 'Centre deleted successfully',
        severity: 'success',
      });
      setTimeout(() => navigate('/centres'), 1000);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to delete centre',
        severity: 'error',
      });
    }
  };

  const handleBack = () => {
    navigate('/centres');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !centre) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Centre not found'}</Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Centres
        </Button>
      </Box>
    );
  }

  const isDeleted = centre.isDeleted || false;
  const capacity = centre.capacity || 0;
  const assignedCandidates = centre.assignedCandidates || 0;
  const utilization = capacity > 0 ? (assignedCandidates / capacity) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title={centre.name || 'Untitled Centre'}
        subtitle={centre.code || 'No Code'}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>

            {!isDeleted && (
              <>
                {canEdit && (
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={handleEdit}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {canAssignManager && (
                  <Tooltip title="Assign Manager">
                    <IconButton color="secondary" onClick={handleAssignManager}>
                      <AssignManagerIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {canActivate && centre.status !== 'ACTIVE' && (
                  <Tooltip title="Activate">
                    <IconButton color="success" onClick={handleActivate}>
                      <ActivateIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {canActivate && centre.status !== 'INACTIVE' && (
                  <Tooltip title="Deactivate">
                    <IconButton color="warning" onClick={handleDeactivate}>
                      <DeactivateIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {canDelete && (
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={handleDelete}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Stack>
        }
      />

      {/* Status Chip */}
      <Box sx={{ mb: 3 }}>
        <CentreStatusChip
          status={isDeleted ? 'DELETED' : centre.status}
          size="medium"
        />
        {isDeleted && (
          <Chip
            label="Deleted"
            color="error"
            size="medium"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Capacity"
            value={capacity}
            icon={PeopleIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Candidates"
            value={assignedCandidates}
            icon={PeopleIcon}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available"
            value={capacity - assignedCandidates}
            icon={PeopleIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilization"
            value={`${Math.round(utilization)}%`}
            icon={PeopleIcon}
            color={utilization >= 90 ? 'error' : utilization >= 70 ? 'warning' : 'success'}
          />
        </Grid>
      </Grid>

      {/* Capacity Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Capacity Utilization
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(utilization, 100)}
          color={utilization >= 90 ? 'error' : utilization >= 70 ? 'warning' : 'success'}
          sx={{ height: 12, borderRadius: 6 }}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="caption" color="textSecondary">
            {assignedCandidates} assigned
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {Math.round(utilization)}% utilized
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {capacity - assignedCandidates} available
          </Typography>
        </Stack>
      </Paper>

      {/* Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Centre Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <InfoRow label="Centre Name" value={centre.name} />
            <InfoRow label="Centre Code" value={centre.code} />
            {/* ✅ Use formatAddress for address */}
            <InfoRow label="Address" value={formatAddress(centre.address)} />
            <InfoRow label="Capacity" value={centre.capacity} />
            <InfoRow label="Status" value={centre.status} />

            {centre.manager && (
              <>
                <InfoRow label="Manager Name" value={centre.manager.name} />
                <InfoRow label="Manager Email" value={centre.manager.email} />
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
              value={centre.createdBy?.name || 'Unknown'}
            />
            <InfoRow
              label="Created At"
              value={format(new Date(centre.createdAt), 'dd/MM/yyyy HH:mm')}
            />
            <InfoRow
              label="Last Updated"
              value={format(new Date(centre.updatedAt), 'dd/MM/yyyy HH:mm')}
            />

            {centre.deletedAt && (
              <>
                <InfoRow
                  label="Deleted At"
                  value={format(new Date(centre.deletedAt), 'dd/MM/yyyy HH:mm')}
                />
                <InfoRow
                  label="Deleted By"
                  value={centre.deletedBy?.name || 'Unknown'}
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

export default CentreDetails;