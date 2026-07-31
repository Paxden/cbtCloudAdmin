/* eslint-disable no-unused-vars */
/**
 * Candidate Summary Cards Component
 * Displays candidate statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  People as TotalIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  PersonAdd as RegisteredIcon,
  LocationOn as AssignedIcon,
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

const CandidateSummaryCards = ({ stats, loading }) => {
  if (!stats && !loading) {
    return null;
  }

  const {
    total = 0,
    byStatus = {},
    assignedToCentres = 0,
    unassigned = 0,
  } = stats || {};

  const active = byStatus?.ACTIVE || 0;
  const inactive = byStatus?.INACTIVE || 0;
  const registered = byStatus?.REGISTERED || 0;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Candidates"
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
          title="Registered"
          value={registered}
          icon={RegisteredIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Assigned to Centres"
          value={assignedToCentres}
          icon={AssignedIcon}
          color="info"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default CandidateSummaryCards;