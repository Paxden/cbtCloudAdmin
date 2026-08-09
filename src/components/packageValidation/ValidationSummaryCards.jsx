/* eslint-disable no-unused-vars */
/**
 * ValidationSummaryCards Component
 * Displays KPI cards for validation
 * 
 * Location: src/components/packageValidation/ValidationSummaryCards.jsx
 */

import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Skeleton
} from '@mui/material';
import {
  CheckCircle as ValidIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Error as FailedIcon,
  Cancel as RejectedIcon,
  Assignment as TotalIcon,
  CheckCircle as ReadyIcon
} from '@mui/icons-material';

const StatCard = ({ icon: Icon, label, value, color, loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2.5, height: '100%' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
        <Skeleton variant="text" width="40%" height={32} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${color}15`,
            color: color
          }}
        >
          <Icon />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {value || 0}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const ValidationSummaryCards = ({ statistics, loading = false }) => {
  const cards = [
    {
      key: 'total',
      label: 'Total Packages',
      value: statistics?.total || 0,
      icon: TotalIcon,
      color: '#1976d2'
    },
    {
      key: 'valid',
      label: 'Validated',
      value: statistics?.valid || 0,
      icon: ValidIcon,
      color: '#2e7d32'
    },
    {
      key: 'pending',
      label: 'Pending Validation',
      value: statistics?.pending || 0,
      icon: PendingIcon,
      color: '#ed6c02'
    },
    {
      key: 'failed',
      label: 'Failed',
      value: statistics?.failed || 0,
      icon: FailedIcon,
      color: '#d32f2f'
    },
    {
      key: 'warning',
      label: 'Warnings',
      value: statistics?.warning || 0,
      icon: WarningIcon,
      color: '#ed6c02'
    },
    {
      key: 'ready',
      label: 'Ready for Distribution',
      value: statistics?.readyForDistribution || 0,
      icon: ReadyIcon,
      color: '#2e7d32'
    }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={2} key={card.key}>
          <StatCard
            icon={card.icon}
            label={card.label}
            value={card.value}
            color={card.color}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ValidationSummaryCards;