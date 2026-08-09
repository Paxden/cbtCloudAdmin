/**
 * DistributionSummaryCards Component
 * Displays KPI cards for package distribution
 * 
 * Location: src/components/packageDistribution/DistributionSummaryCards.jsx
 */

import {
  Grid,
  Paper,
  Typography,
  Box,
  Skeleton
} from '@mui/material';
import {
  Assignment as TotalIcon,
  CheckCircle as ValidatedIcon,
  PlayArrow as ReadyIcon,
  Send as ReleasedIcon,
  Download as DeliveredIcon,
  Pending as PendingIcon,
  Error as FailedIcon
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

const DistributionSummaryCards = ({ statistics, loading = false }) => {
  const cards = [
    {
      key: 'total',
      label: 'Total Packages',
      value: statistics?.total || 0,
      icon: TotalIcon,
      color: '#1976d2'
    },
    {
      key: 'validated',
      label: 'Validated',
      value: statistics?.validated || 0,
      icon: ValidatedIcon,
      color: '#2e7d32'
    },
    {
      key: 'ready',
      label: 'Ready for Distribution',
      value: statistics?.ready || 0,
      icon: ReadyIcon,
      color: '#0288d1'
    },
    {
      key: 'released',
      label: 'Released',
      value: statistics?.released || 0,
      icon: ReleasedIcon,
      color: '#2e7d32'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      value: statistics?.delivered || 0,
      icon: DeliveredIcon,
      color: '#1976d2'
    },
    {
      key: 'pending',
      label: 'Pending Delivery',
      value: statistics?.pendingDelivery || 0,
      icon: PendingIcon,
      color: '#ed6c02'
    },
    {
      key: 'failed',
      label: 'Failed Delivery',
      value: statistics?.failedDelivery || 0,
      icon: FailedIcon,
      color: '#d32f2f'
    }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={1.7} key={card.key}>
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

export default DistributionSummaryCards;