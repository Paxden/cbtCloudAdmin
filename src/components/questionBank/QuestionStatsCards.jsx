/**
 * Question Stats Cards Component
 * Dashboard statistics for question bank
 */

import { Grid } from '@mui/material';
import {
  QuestionAnswer as QuestionIcon,
  Edit as DraftIcon,
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Archive as ArchiveIcon,
  Today as TodayIcon,
  DateRange as MonthIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import StatsCard from '../cards/StatsCard';

const QuestionStatsCards = ({ stats, loading }) => {
  // Fallback values if stats is null or undefined
  const data = stats || {};

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Total Questions */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Questions"
          value={data.total || 0}
          icon={QuestionIcon}
          color="primary"
          loading={loading}
        />
      </Grid>

      {/* Draft */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Draft"
          value={data.draft || data.byStatus?.DRAFT || 0}
          icon={DraftIcon}
          color="default"
          loading={loading}
        />
      </Grid>

      {/* Pending Review */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Pending Review"
          value={data.pendingReview || data.byStatus?.PENDING_REVIEW || 0}
          icon={PendingIcon}
          color="warning"
          loading={loading}
        />
      </Grid>

      {/* Published */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Published"
          value={data.published || data.byStatus?.PUBLISHED || 0}
          icon={ApprovedIcon}
          color="success"
          loading={loading}
        />
      </Grid>

      {/* Archived */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Archived"
          value={data.archived || data.byStatus?.ARCHIVED || 0}
          icon={ArchiveIcon}
          color="default"
          loading={loading}
        />
      </Grid>

      {/* Created Today */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Created Today"
          value={data.createdToday || data.today || 0}
          icon={TodayIcon}
          color="info"
          loading={loading}
          subtitle="Last 24 hours"
        />
      </Grid>

      {/* This Month */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="This Month"
          value={data.createdThisMonth || data.thisMonth || 0}
          icon={MonthIcon}
          color="secondary"
          loading={loading}
          subtitle="Last 30 days"
        />
      </Grid>

      {/* Approved */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Approved"
          value={data.approved || data.byStatus?.APPROVED || 0}
          icon={VerifiedIcon}
          color="success"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default QuestionStatsCards;