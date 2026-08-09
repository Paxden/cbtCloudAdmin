/**
 * HistorySummaryCards Component
 * Displays KPI cards for package history
 * 
 * Location: src/components/packageHistory/HistorySummaryCards.jsx
 */

import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material';
import {
  History as TotalIcon,
  AddBox as CreatedIcon,
  QrCode as GeneratedIcon,
  Send as DistributedIcon,
  Download as DownloadedIcon,
  Error as FailedIcon,
  Visibility as AuditIcon
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

const HistorySummaryCards = ({ statistics, loading = false }) => {
  const cards = [
    {
      key: 'total',
      label: 'Total Activities',
      value: statistics?.totalActivities || 0,
      icon: TotalIcon,
      color: '#1976d2'
    },
    {
      key: 'created',
      label: 'Packages Created',
      value: statistics?.packagesCreated || 0,
      icon: CreatedIcon,
      color: '#2e7d32'
    },
    {
      key: 'generated',
      label: 'Packages Generated',
      value: statistics?.packagesGenerated || 0,
      icon: GeneratedIcon,
      color: '#0288d1'
    },
    {
      key: 'distributed',
      label: 'Packages Distributed',
      value: statistics?.packagesDistributed || 0,
      icon: DistributedIcon,
      color: '#ed6c02'
    },
    {
      key: 'downloaded',
      label: 'Packages Downloaded',
      value: statistics?.packagesDownloaded || 0,
      icon: DownloadedIcon,
      color: '#2e7d32'
    },
    {
      key: 'failed',
      label: 'Failed Activities',
      value: statistics?.failedActivities || 0,
      icon: FailedIcon,
      color: '#d32f2f'
    },
    {
      key: 'audit',
      label: 'Audit Events',
      value: statistics?.auditEvents || 0,
      icon: AuditIcon,
      color: '#6c757d'
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

export default HistorySummaryCards;