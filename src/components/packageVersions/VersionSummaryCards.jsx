/**
 * VersionSummaryCards Component
 * Displays KPI cards for package versions
 * 
 * Location: src/components/packageVersions/VersionSummaryCards.jsx
 */

import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material';
import {
  Numbers as TotalIcon,
  TrendingUp as LatestIcon,
  Archive as ArchivedIcon,
  Refresh as RegeneratedIcon,
  CheckCircle as ActiveIcon,
  Cancel as RevokedIcon
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

const VersionSummaryCards = ({ statistics, loading = false }) => {
  const cards = [
    {
      key: 'total',
      label: 'Total Versions',
      value: statistics?.total || 0,
      icon: TotalIcon,
      color: '#1976d2'
    },
    {
      key: 'latest',
      label: 'Latest Versions',
      value: statistics?.latest || 0,
      icon: LatestIcon,
      color: '#2e7d32'
    },
    {
      key: 'archived',
      label: 'Archived',
      value: statistics?.archived || 0,
      icon: ArchivedIcon,
      color: '#6c757d'
    },
    {
      key: 'regenerated',
      label: 'Regenerated',
      value: statistics?.regenerated || 0,
      icon: RegeneratedIcon,
      color: '#ed6c02'
    },
    {
      key: 'active',
      label: 'Active',
      value: statistics?.active || 0,
      icon: ActiveIcon,
      color: '#2e7d32'
    },
    {
      key: 'revoked',
      label: 'Revoked',
      value: statistics?.revoked || 0,
      icon: RevokedIcon,
      color: '#d32f2f'
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

export default VersionSummaryCards;