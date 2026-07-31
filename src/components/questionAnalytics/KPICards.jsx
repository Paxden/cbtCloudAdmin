/**
 * KPI Cards Component
 * Executive KPI cards for analytics dashboard
 */

import { Grid } from '@mui/material';
import StatsCard from '../cards/StatsCard';
import {
  QuestionAnswer as QuestionIcon,
  Edit as DraftIcon,
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Error as RejectedIcon,
  Archive as ArchiveIcon,
  Today as TodayIcon,
  DateRange as MonthIcon,
} from '@mui/icons-material';

const KPICards = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Questions"
          value={stats?.total || 0}
          icon={QuestionIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Draft"
          value={stats?.draft || 0}
          icon={DraftIcon}
          color="default"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Pending Review"
          value={stats?.pendingReview || 0}
          icon={PendingIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Approved"
          value={stats?.approved || 0}
          icon={ApprovedIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Rejected"
          value={stats?.rejected || 0}
          icon={RejectedIcon}
          color="error"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Archived"
          value={stats?.archived || 0}
          icon={ArchiveIcon}
          color="default"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Created Today"
          value={stats?.today || 0}
          icon={TodayIcon}
          color="success"
          loading={loading}
          subtitle="Last 24 hours"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="This Month"
          value={stats?.thisMonth || 0}
          icon={MonthIcon}
          color="secondary"
          loading={loading}
          subtitle="Last 30 days"
        />
      </Grid>
    </Grid>
  );
};

export default KPICards;