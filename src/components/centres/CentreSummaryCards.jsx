/**
 * Centre Summary Cards Component
 * Displays centre statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  LocationOn as TotalIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pending as PendingIcon,
  People as CapacityIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, color, loading, subtitle }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {value || 0}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const CentreSummaryCards = ({ stats, loading }) => {
  // ✅ Handle loading and empty stats
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(5)].map((_, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // ✅ If no stats, return null or empty state
  if (!stats) {
    return null;
  }

  const {
    total = 0,
    active = 0,
    inactive = 0,
    pending = 0,
    totalCapacity = 0,
    usedCapacity = 0,
  } = stats;

  const availableCapacity = totalCapacity - usedCapacity;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Centres"
          value={total}
          icon={TotalIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Active"
          value={active}
          icon={ActiveIcon}
          color="success"
          loading={loading}
          subtitle={`${total > 0 ? Math.round((active / total) * 100) : 0}%`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Inactive"
          value={inactive}
          icon={InactiveIcon}
          color="error"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Pending"
          value={pending}
          icon={PendingIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Capacity"
          value={totalCapacity}
          icon={CapacityIcon}
          color="info"
          loading={loading}
          subtitle={`${availableCapacity} available`}
        />
      </Grid>
    </Grid>
  );
};

export default CentreSummaryCards;