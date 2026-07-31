/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Dashboard Home Page
 * Main dashboard landing page
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Button, Alert } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

// Services
import * as dashboardService from '../../services/dashboard/dashboardService';

// Components
import AppPageHeader from '../../components/common/AppPageHeader';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import StatsCardGrid from '../../components/dashboard/StatsCardGrid';
import QuestionStatusChart from '../../components/dashboard/QuestionStatusChart';
import QuestionDistributionChart from '../../components/dashboard/QuestionDistributionChart';
import RecentActivities from '../../components/dashboard/RecentActivities';
import PendingReviews from '../../components/dashboard/PendingReviews';
import RecentImports from '../../components/dashboard/RecentImports';
import QuickActions from '../../components/dashboard/QuickActions';
import SystemStatus from '../../components/dashboard/SystemStatus';
import { useAuth } from '../../hooks/useAuth';

const DashboardHome = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [statusChart, setStatusChart] = useState(null);
  const [distributionData, setDistributionData] = useState([]);
  const [distributionType, setDistributionType] = useState('category');
  const [activities, setActivities] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [recentImports, setRecentImports] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const [
        statsData,
        statusData,
        distribution,
        activitiesData,
        reviewsData,
        importsData,
        systemData,
      ] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getQuestionStatusChart(),
        dashboardService.getQuestionDistribution({ groupBy: distributionType }),
        dashboardService.getRecentActivities({ limit: 10 }),
        dashboardService.getPendingReviews({ limit: 10 }),
        dashboardService.getRecentImports({ limit: 5 }),
        dashboardService.getSystemStatus(),
      ]);

      setStats(statsData?.data || null);
      setStatusChart(statusData?.data || null);
      setDistributionData(distribution?.data || []);
      setActivities(activitiesData?.data || []);
      setPendingReviews(reviewsData?.data || []);
      setRecentImports(importsData?.data || []);
      setSystemStatus(systemData?.data || null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [distributionType]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Handle distribution type change
  const handleDistributionTypeChange = (type) => {
    setDistributionType(type);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 1 }}>
        <AppPageHeader title="Dashboard" subtitle="Welcome back, overview of your CBT platform" />
        <DashboardSkeleton />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 1 }}>
        <AppPageHeader title="Dashboard" subtitle="Welcome back, overview of your CBT platform" />
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <AppPageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || 'User'}! Overview of your CBT platform`}
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
      />

      {/* Statistics Cards */}
      <StatsCardGrid stats={stats} loading={refreshing} />

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <QuestionStatusChart data={statusChart} loading={refreshing} />
        </Grid>
        <Grid item xs={12} md={6}>
          <QuestionDistributionChart
            data={distributionData}
            loading={refreshing}
            type={distributionType}
            onTypeChange={handleDistributionTypeChange}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <QuickActions loading={refreshing} />
      </Box>

      {/* Activities & Reviews Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <RecentActivities
            activities={activities}
            loading={refreshing}
            onViewAll={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PendingReviews
            reviews={pendingReviews}
            loading={refreshing}
            onViewAll={() => {}}
          />
        </Grid>
      </Grid>

      {/* Imports & System Status Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RecentImports
            imports={recentImports}
            loading={refreshing}
            onViewAll={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SystemStatus
            status={systemStatus}
            loading={refreshing}
            onRefresh={handleRefresh}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;