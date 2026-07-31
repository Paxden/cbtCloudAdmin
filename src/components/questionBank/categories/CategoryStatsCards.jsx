/**
 * Category Stats Cards Component
 * Dashboard statistics for categories
 */

import StatsCard from "../../cards/StatsCard";
import { Grid } from "@mui/material";
import {
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

const CategoryStatsCards = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Categories"
          value={stats?.total || 0}
          icon={CategoryIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Active Categories"
          value={stats?.active || 0}
          icon={CheckCircleIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Inactive Categories"
          value={stats?.inactive || 0}
          icon={CancelIcon}
          color="error"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Recently Created"
          value={stats?.recentlyCreated || 0}
          icon={TimeIcon}
          color="warning"
          loading={loading}
          subtitle="Last 30 days"
        />
      </Grid>
    </Grid>
  );
};

export default CategoryStatsCards;
