/* eslint-disable no-unused-vars */
/**
 * Review Stats Cards Component
 * Dashboard statistics for review workflow
 */

import React from 'react';
import { Grid } from '@mui/material';
import {
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  RateReview as ReviewIcon,
  Today as TodayIcon,
  DateRange as MonthIcon,
} from '@mui/icons-material';
import StatsCard from '../cards/StatsCard';

const ReviewStatsCards = ({ stats, loading }) => {
  // Fallback values if stats is null or undefined
  const data = stats || {};

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Pending Review */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Pending Review"
          value={data.pending || 0}
          icon={PendingIcon}
          color="warning"
          loading={loading}
          subtitle="Awaiting review"
        />
      </Grid>

      {/* Approved This Week */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Approved This Week"
          value={data.approvedThisWeek || 0}
          icon={CheckCircleIcon}
          color="success"
          loading={loading}
          subtitle="Last 7 days"
        />
      </Grid>

      {/* Rejected This Week */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Rejected This Week"
          value={data.rejectedThisWeek || 0}
          icon={ErrorIcon}
          color="error"
          loading={loading}
          subtitle="Last 7 days"
        />
      </Grid>

      {/* Total Reviews */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Reviews"
          value={data.totalReviews || data.total || 0}
          icon={ReviewIcon}
          color="primary"
          loading={loading}
          subtitle="All time"
        />
      </Grid>

      {/* Optional: Additional Stats Cards */}
      {/* Total Questions in Review Queue */}
      {data.byStatus && (
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="In Review Queue"
            value={data.byStatus.PENDING_REVIEW || 0}
            icon={PendingIcon}
            color="info"
            loading={loading}
            subtitle="Total pending"
          />
        </Grid>
      )}

      {/* Approved Total */}
      {data.byStatus && (
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Approved"
            value={data.byStatus.APPROVED || 0}
            icon={CheckCircleIcon}
            color="success"
            loading={loading}
            subtitle="All time"
          />
        </Grid>
      )}

      {/* Published Total */}
      {data.byStatus && (
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Published"
            value={data.byStatus.PUBLISHED || 0}
            icon={TodayIcon}
            color="primary"
            loading={loading}
            subtitle="Live questions"
          />
        </Grid>
      )}

      {/* Rejected Total */}
      {data.byStatus && (
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Rejected"
            value={data.byStatus.REJECTED || 0}
            icon={ErrorIcon}
            color="error"
            loading={loading}
            subtitle="All time"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ReviewStatsCards;