/**
 * Subject Stats Cards Component
 * Dashboard statistics for subjects
 */

import StatsCard from '../../cards/StatsCard';
import { Grid } from '@mui/material';
import {
  Subject as SubjectIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const SubjectStatsCards = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Subjects"
          value={stats?.total || 0}
          icon={SubjectIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Active Subjects"
          value={stats?.active || 0}
          icon={CheckCircleIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Inactive Subjects"
          value={stats?.inactive || 0}
          icon={CancelIcon}
          color="error"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Categories Covered"
          value={stats?.categoriesCount || 0}
          icon={CategoryIcon}
          color="secondary"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default SubjectStatsCards;