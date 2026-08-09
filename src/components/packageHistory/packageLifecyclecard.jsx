/* eslint-disable no-unused-vars */
/**
 * PackageLifecycleCard Component
 * Displays package lifecycle status and progress
 * 
 * Location: src/components/packageHistory/PackageLifecycleCard.jsx
 */

import { Box, Typography, Paper, Chip, Stepper, Step, StepLabel, StepContent, Skeleton, LinearProgress, Grid } from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as FailedIcon,
  HourglassEmpty as InProgressIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

// Lifecycle stages in order
const LIFECYCLE_STAGES = [
  { id: 'instance_created', label: 'Instance Created', description: 'Examination instance created' },
  { id: 'package_generated', label: 'Package Generated', description: 'Package generated from instance' },
  { id: 'candidate_papers', label: 'Candidate Papers', description: 'Candidate papers generated' },
  { id: 'validation', label: 'Validation', description: 'Package validation completed' },
  { id: 'distribution', label: 'Distribution', description: 'Package distributed to centre' },
  { id: 'download', label: 'Download', description: 'Package downloaded by centre' },
  { id: 'completed', label: 'Completed', description: 'Package lifecycle completed' }
];

const STAGE_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  FAILED: 'failed'
};

const PackageLifecycleCard = ({ lifecycle, loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  if (!lifecycle) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No lifecycle data available
        </Typography>
      </Paper>
    );
  }

  const {
    packageName,
    packageId,
    currentStage,
    stages = [],
    overallStatus,
    progress = 0,
    startedAt,
    completedAt,
    duration
  } = lifecycle;

  // Determine which stages are completed
  const getStageStatus = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return STAGE_STATUS.PENDING;
    return stage.status || STAGE_STATUS.PENDING;
  };

  const isStageCompleted = (stageId) => {
    return getStageStatus(stageId) === STAGE_STATUS.COMPLETED;
  };

  const isStageInProgress = (stageId) => {
    return getStageStatus(stageId) === STAGE_STATUS.IN_PROGRESS;
  };

  const isStageFailed = (stageId) => {
    return getStageStatus(stageId) === STAGE_STATUS.FAILED;
  };

  const getStageIcon = (stageId) => {
    if (isStageCompleted(stageId)) return <CompletedIcon color="success" />;
    if (isStageInProgress(stageId)) return <InProgressIcon color="primary" />;
    if (isStageFailed(stageId)) return <FailedIcon color="error" />;
    return <PendingIcon color="disabled" />;
  };

  const getStageColor = (stageId) => {
    if (isStageCompleted(stageId)) return 'success';
    if (isStageInProgress(stageId)) return 'primary';
    if (isStageFailed(stageId)) return 'error';
    return 'default';
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const getOverallStatusLabel = () => {
    switch (overallStatus) {
      case 'COMPLETED': return 'Completed';
      case 'IN_PROGRESS': return 'In Progress';
      case 'FAILED': return 'Failed';
      default: return 'Not Started';
    }
  };

  const getOverallStatusIcon = () => {
    switch (overallStatus) {
      case 'COMPLETED': return <SuccessIcon color="success" />;
      case 'IN_PROGRESS': return <InProgressIcon color="primary" />;
      case 'FAILED': return <FailedIcon color="error" />;
      default: return <PendingIcon color="disabled" />;
    }
  };

  // Calculate completed stages count
  const completedCount = stages.filter(s => s.status === STAGE_STATUS.COMPLETED).length;
  const totalStages = LIFECYCLE_STAGES.length;

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6">
            Package Lifecycle
          </Typography>
          {packageName && (
            <Typography variant="body2" color="text.secondary">
              {packageName}
              {packageId && (
                <Chip
                  label={`ID: ${packageId}`}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
          )}
        </Box>
        <Chip
          icon={getOverallStatusIcon()}
          label={getOverallStatusLabel()}
          color={getOverallStatusColor()}
        />
      </Box>

      {/* Progress Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Progress</Typography>
            <Typography variant="h6">{Math.round(progress)}%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Completed</Typography>
            <Typography variant="h6">{completedCount}/{totalStages}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Chip
              label={currentStage || 'N/A'}
              size="small"
              color={currentStage ? 'primary' : 'default'}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Lifecycle Progress
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          color={overallStatus === 'FAILED' ? 'error' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Timestamps */}
      {(startedAt || completedAt) && (
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            {startedAt && (
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Started</Typography>
                <Typography variant="body2">
                  {new Date(startedAt).toLocaleString()}
                </Typography>
              </Grid>
            )}
            {completedAt && (
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Completed</Typography>
                <Typography variant="body2">
                  {new Date(completedAt).toLocaleString()}
                </Typography>
              </Grid>
            )}
            {duration && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Total Duration</Typography>
                <Typography variant="body2">
                  {duration > 3600 
                    ? `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
                    : duration > 60
                      ? `${Math.floor(duration / 60)}m ${duration % 60}s`
                      : `${duration}s`
                  }
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Stepper */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Stages
        </Typography>
        <Stepper orientation="vertical" nonLinear>
          {LIFECYCLE_STAGES.map((stage) => {
            const stageStatus = getStageStatus(stage.id);
            const isCompleted = stageStatus === STAGE_STATUS.COMPLETED;
            const isInProgress = stageStatus === STAGE_STATUS.IN_PROGRESS;
            const isFailed = stageStatus === STAGE_STATUS.FAILED;

            return (
              <Step key={stage.id} active={isInProgress || isCompleted} completed={isCompleted}>
                <StepLabel
                  StepIconComponent={() => getStageIcon(stage.id)}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: isFailed ? 'error.main' : isCompleted ? 'success.main' : 'text.primary'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={isInProgress ? 600 : 400}>
                      {stage.label}
                    </Typography>
                    {stage.description && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {stage.description}
                      </Typography>
                    )}
                    {isFailed && (
                      <Chip
                        label="Failed"
                        size="small"
                        color="error"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                    {isInProgress && (
                      <Chip
                        label="In Progress"
                        size="small"
                        color="primary"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                    {isCompleted && (
                      <Chip
                        label="Completed"
                        size="small"
                        color="success"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </Paper>
  );
};

export default PackageLifecycleCard;