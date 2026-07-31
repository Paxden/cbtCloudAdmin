/* eslint-disable no-unused-vars */
/**
 * Assignment Summary Cards Component
 * Displays assignment statistics with location data
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  People as TotalIcon,
  CheckCircle as AssignedIcon,
  PersonAdd as UnassignedIcon,
  LocationOn as CentresIcon,
  CheckCircle as AvailableIcon,
  Map as LocationIcon,
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

const AssignmentSummaryCards = ({ stats, loading }) => {
  if (!stats && !loading) {
    return null;
  }

  const {
    totalCandidates = 0,
    assigned = 0,
    unassigned = 0,
    totalCentres = 0,
    filledCentres = 0,
    fullCentres = 0,
    totalCapacity = 0,
    availableCapacity = 0,
    utilizationRate = 0,
    byCentre = [],
    // Location stats
    locationStats = null,
  } = stats || {};

  // Calculate location-based stats
  const totalLocations = locationStats?.length || 0;
  const locationsWithCentres = locationStats?.filter(l => l.hasMatchingCentre).length || 0;
  const candidatesWithLocation = locationStats?.reduce((sum, l) => sum + l.count, 0) || 0;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Candidates"
          value={totalCandidates}
          icon={TotalIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Assigned"
          value={assigned}
          icon={AssignedIcon}
          color="success"
          loading={loading}
          subtitle={`${totalCandidates > 0 ? Math.round((assigned / totalCandidates) * 100) : 0}% assigned`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Unassigned"
          value={unassigned}
          icon={UnassignedIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Centres"
          value={totalCentres}
          icon={CentresIcon}
          color="info"
          loading={loading}
          subtitle={`${filledCentres} filled, ${fullCentres} full`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Available Capacity"
          value={availableCapacity}
          icon={AvailableIcon}
          color="success"
          loading={loading}
          subtitle={`${utilizationRate}% utilized`}
        />
      </Grid>

      {/* Location Stats - Additional Row */}
      {locationStats && locationStats.length > 0 && (
        <>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title="Locations"
              value={totalLocations}
              icon={LocationIcon}
              color="info"
              loading={loading}
              subtitle={`${locationsWithCentres} have centres`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              title="Candidates with Location"
              value={candidatesWithLocation}
              icon={LocationIcon}
              color="primary"
              loading={loading}
              subtitle={`${totalCandidates > 0 ? Math.round((candidatesWithLocation / totalCandidates) * 100) : 0}% of total`}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AssignmentSummaryCards;