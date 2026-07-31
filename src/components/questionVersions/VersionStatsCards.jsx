/**
 * Version Stats Cards Component
 * Dashboard statistics for question versions
 */

import StatsCard from '../cards/StatsCard';
import { Grid } from '@mui/material';
import {
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const VersionStatsCards = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Versions"
          value={stats?.total || 0}
          icon={HistoryIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Current Version"
          value={stats?.currentVersion || 0}
          icon={EditIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Published Versions"
          value={stats?.published || 0}
          icon={CheckCircleIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Approved Versions"
          value={stats?.approved || 0}
          icon={CheckCircleIcon}
          color="success"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default VersionStatsCards;