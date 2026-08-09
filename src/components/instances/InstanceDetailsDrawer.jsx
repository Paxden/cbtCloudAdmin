/* eslint-disable no-unused-vars */
/**
 * InstanceDetailsDrawer
 * Drawer displaying detailed instance information
 * 
 * Location: src/components/instances/InstanceDetailsDrawer.jsx
 */

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Grid,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Close as CloseIcon,
  Lock as LockIcon,
  Archive as ArchiveIcon,
  AddBox as GenerateIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { InstanceStatusLabels, InstanceStatusColors } from '../../types/examInstance.types';

const InstanceDetailsDrawer = ({
  open,
  onClose,
  instance,
  loading = false,
  onLock,
  onArchive,
  onGeneratePackages,
  canLock = true,
  canArchive = true,
  canGenerate = true,
}) => {
  if (!open) return null;

  const getStatusChip = (status) => {
    const label = InstanceStatusLabels[status] || status;
    const color = InstanceStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === 'GENERATED') icon = <CheckCircleIcon />;
    else if (status === 'LOCKED') icon = <LockIcon />;
    else if (status === 'ARCHIVED') icon = <ArchiveIcon />;
    else if (status === 'GENERATING') icon = <PendingIcon />;
    else if (status === 'DRAFT') icon = <ErrorIcon />;
    
    return (
      <Chip
        icon={icon}
        label={label}
        sx={{
          bgcolor: color,
          color: 'white',
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!instance) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Instance not found
        </Alert>
      );
    }

    return (
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {instance.instanceCode}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {instance.examName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {getStatusChip(instance.status)}
            <Chip
              label={`v${instance.examVersion || 1}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${instance.candidateCount || 0} candidates`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Actions */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {(instance.status === 'DRAFT' || instance.status === 'GENERATED') && canLock && (
            <Button
              variant="contained"
              startIcon={<LockIcon />}
              onClick={() => onLock(instance._id)}
              size="small"
            >
              Lock Instance
            </Button>
          )}

          {(instance.status === 'GENERATED' || instance.status === 'LOCKED') && canArchive && (
            <Button
              variant="contained"
              color="error"
              startIcon={<ArchiveIcon />}
              onClick={() => onArchive(instance._id)}
              size="small"
            >
              Archive
            </Button>
          )}

          {instance.status === 'LOCKED' && canGenerate && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<GenerateIcon />}
              onClick={() => onGeneratePackages(instance._id)}
              size="small"
            >
              Generate Packages
            </Button>
          )}
        </Box>

        {/* Details */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Schedule
              </Typography>
              <Typography variant="body2">
                Sessions: {instance.scheduleSnapshot?.sessions?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {instance.scheduleSnapshot?.startDate ? 
                  `Starts: ${new Date(instance.scheduleSnapshot.startDate).toLocaleDateString()}` :
                  'No start date set'
                }
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security
              </Typography>
              <Typography variant="body2">
                Proctoring: {instance.configurationSnapshot?.proctoringLevel || 'STANDARD'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: {instance.configurationSnapshot?.duration || 0} minutes
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Resources
              </Typography>
              <Typography variant="body2">
                Questions: {instance.approvedQuestionCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Centres: {instance.centreCount || 0}
              </Typography>
            </Paper>
          </Grid>

          {instance.metadata?.notes && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {instance.metadata.notes}
                </Typography>
              </Paper>
            </Grid>
          )}

          {instance.validationErrors?.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography variant="subtitle2">Validation Errors</Typography>
                {instance.validationErrors.map((err, idx) => (
                  <Typography key={idx} variant="body2">
                    • {err.message}
                  </Typography>
                ))}
              </Alert>
            </Grid>
          )}

          {instance.validationWarnings?.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="warning">
                <Typography variant="subtitle2">Validation Warnings</Typography>
                {instance.validationWarnings.map((warn, idx) => (
                  <Typography key={idx} variant="body2">
                    • {warn.message}
                  </Typography>
                ))}
              </Alert>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Metadata */}
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {new Date(instance.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last Updated: {new Date(instance.updatedAt).toLocaleString()}
        </Typography>
        {instance.metadata?.instanceVersion && (
          <Typography variant="caption" color="text.secondary" display="block">
            Version: {instance.metadata.instanceVersion}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 480 },
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Instance Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {renderContent()}
    </Drawer>
  );
};

export default InstanceDetailsDrawer;