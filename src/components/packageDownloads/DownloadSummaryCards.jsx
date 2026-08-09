/**
 * DownloadSummaryCards Component
 * Displays KPI cards for package downloads
 * 
 * Location: src/components/packageDownloads/DownloadSummaryCards.jsx
 */


import {
  Grid,
  Paper,
  Typography,
  Box,
  Skeleton
} from '@mui/material';
import {
  Download as TotalIcon,
  CheckCircle as SuccessIcon,
  Error as FailedIcon,
  Pending as PendingIcon,
  LocationOn as CentresIcon,
  TrendingUp as LatestIcon
} from '@mui/icons-material';

const StatCard = ({ icon: Icon, label, value, color, loading = false, subValue = null }) => {
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
          {subValue && (
            <Typography variant="caption" color="text.secondary">
              {subValue}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const DownloadSummaryCards = ({ statistics, loading = false }) => {
  const cards = [
    {
      key: 'total',
      label: 'Total Downloads',
      value: statistics?.total || 0,
      icon: TotalIcon,
      color: '#1976d2'
    },
    {
      key: 'successful',
      label: 'Successful',
      value: statistics?.successful || 0,
      icon: SuccessIcon,
      color: '#2e7d32'
    },
    {
      key: 'failed',
      label: 'Failed',
      value: statistics?.failed || 0,
      icon: FailedIcon,
      color: '#d32f2f'
    },
    {
      key: 'pending',
      label: 'Pending',
      value: statistics?.pending || 0,
      icon: PendingIcon,
      color: '#ed6c02'
    },
    {
      key: 'centres',
      label: 'Unique Centres',
      value: statistics?.uniqueCentres || 0,
      icon: CentresIcon,
      color: '#0288d1'
    },
    {
      key: 'latest',
      label: 'Latest Download',
      value: statistics?.latestDownload?.packageName || 'N/A',
      icon: LatestIcon,
      color: '#2e7d32',
      subValue: statistics?.latestDownload?.centreName ? `by ${statistics.latestDownload.centreName}` : null
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
            subValue={card.subValue}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DownloadSummaryCards;