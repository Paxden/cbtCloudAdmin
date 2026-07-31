/* eslint-disable no-unused-vars */
/**
 * Readiness Score Card Component
 * Displays overall readiness score with circular progress
 */

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const ReadinessScoreCard = ({ readiness, loading }) => {
  if (loading || !readiness) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">Loading readiness score...</Typography>
      </Paper>
    );
  }

  const { score = 0, status = 'incomplete', items = [], missing = [] } = readiness;

  const getStatusColor = () => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    if (score >= 50) return 'error';
    return 'grey';
  };

  const getStatusLabel = () => {
    if (score >= 90) return 'Ready for Validation';
    if (score >= 70) return 'Almost Ready';
    if (score >= 50) return 'Needs Work';
    return 'Not Ready';
  };

  const getStatusIcon = () => {
    if (score >= 90) return <SuccessIcon color="success" />;
    if (score >= 70) return <WarningIcon color="warning" />;
    if (score >= 50) return <ErrorIcon color="error" />;
    return <InfoIcon color="disabled" />;
  };

  const completedCount = items.filter(i => i.status === 'complete').length;
  const totalCount = items.length;

  // Get color for circular progress
  const progressColor = getStatusColor();

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
        {/* Circular Progress - Using Material UI */}
        <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
          <CircularProgress
            variant="determinate"
            value={score}
            size={120}
            thickness={6}
            color={progressColor}
            sx={{
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" component="div" color="text.primary" fontWeight={600}>
              {score}%
            </Typography>
          </Box>
        </Box>

        {/* Details */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="h5" fontWeight={600}>
              {getStatusLabel()}
            </Typography>
            {getStatusIcon()}
          </Stack>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            {completedCount} of {totalCount} requirements completed
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
            <Chip
              label={`${score}% Ready`}
              size="small"
              color={score >= 90 ? 'success' : score >= 70 ? 'warning' : 'error'}
            />
            {missing.length > 0 && (
              <Chip
                label={`${missing.length} missing items`}
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Stack>

          {/* Progress Bar */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={score}
              color={score >= 90 ? 'success' : score >= 70 ? 'warning' : 'error'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ReadinessScoreCard;