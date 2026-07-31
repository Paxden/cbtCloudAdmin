/**
 * Topic Stats Cards Component
 * Dashboard statistics for topics
 */

import StatsCard from '../../cards/StatsCard';
import { Grid } from '@mui/material';
import {
  Topic as TopicIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';

const TopicStatsCards = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Topics"
          value={stats?.total || 0}
          icon={TopicIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Active Topics"
          value={stats?.active || 0}
          icon={CheckCircleIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Inactive Topics"
          value={stats?.inactive || 0}
          icon={CancelIcon}
          color="error"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Subjects Covered"
          value={stats?.subjectsCount || 0}
          icon={SubjectIcon}
          color="secondary"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default TopicStatsCards;