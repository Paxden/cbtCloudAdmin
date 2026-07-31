/* eslint-disable no-unused-vars */
/**
 * Schedule Summary Cards Component
 * Displays schedule statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  Event as SessionsIcon,
  CheckCircle as ScheduledIcon,
  PlayArrow as RunningIcon,
  CheckCircle as CompletedIcon,
  LocationOn as CentresIcon,
  Warning as ConflictIcon,
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

const ScheduleSummaryCards = ({ stats, loading }) => {
  if (!stats && !loading) {
    return null;
  }

  const {
    totalSessions = 0,
    scheduled = 0,
    running = 0,
    completed = 0,
    centresScheduled = 0,
    conflicts = 0,
  } = stats || {};

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Sessions"
          value={totalSessions}
          icon={SessionsIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Scheduled"
          value={scheduled}
          icon={ScheduledIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Running"
          value={running}
          icon={RunningIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Completed"
          value={completed}
          icon={CompletedIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Centres"
          value={centresScheduled}
          icon={CentresIcon}
          color="secondary"
          loading={loading}
          subtitle={`${conflicts > 0 ? `⚠️ ${conflicts} conflicts` : '✅ No conflicts'}`}
        />
      </Grid>
    </Grid>
  );
};

export default ScheduleSummaryCards;