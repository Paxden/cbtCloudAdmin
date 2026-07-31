/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Question Analytics Page
 * Executive analytics dashboard for Question Bank
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Typography,
  Snackbar,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { Refresh as RefreshIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import KPICards from '../../components/questionAnalytics/KPICards';
import QuestionGrowthChart from '../../components/questionAnalytics/QuestionGrowthChart';
import QuestionStatusChart from '../../components/questionAnalytics/QuestionStatusChart';
import CategoryDistributionChart from '../../components/questionAnalytics/CategoryDistributionChart';
import DifficultyDistributionChart from '../../components/questionAnalytics/DifficultyDistributionChart';
import QuestionTypeDistributionChart from '../../components/questionAnalytics/QuestionTypeDistributionChart';
import AuthorPerformanceTable from '../../components/questionAnalytics/AuthorPerformanceTable';
import AnalyticsFilters from '../../components/questionAnalytics/AnalyticsFilters';
import * as analyticsService from '../../services/questionAnalytics/questionAnalyticsService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const QuestionAnalytics = () => {
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [difficultyData, setDifficultyData] = useState([]);
  const [questionTypeData, setQuestionTypeData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [filters, setFilters] = useState({});
  const [interval, setInterval] = useState('monthly');
  const [tab, setTab] = useState(0);

  // Fetch all analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);

      const [statsRes, growthRes, statusRes, categoryRes, difficultyRes, typeRes, authorRes] =
        await Promise.all([
          analyticsService.getDashboard(filters),
          analyticsService.getGrowthAnalytics({ interval, ...filters }),
          analyticsService.getStatusAnalytics(filters),
          analyticsService.getCategoryAnalytics(filters),
          analyticsService.getDifficultyAnalytics(filters),
          analyticsService.getQuestionTypeAnalytics(filters),
          analyticsService.getAuthorAnalytics(filters),
        ]);

      setStats(statsRes?.data || null);
      setGrowthData(growthRes?.data || []);
      setStatusData(statusRes?.data || []);
      setCategoryData(categoryRes?.data || []);
      setDifficultyData(difficultyRes?.data || []);
      setQuestionTypeData(typeRes?.data || []);
      setAuthorData(authorRes?.data || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, interval]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Handle interval change
  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await analyticsService.exportAnalytics('csv', filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || 'Failed to export analytics');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Question Analytics"
        subtitle="Executive dashboard for Question Bank insights"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        }
      />

      {/* Filters */}
      <AnalyticsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        loading={refreshing}
      />

      {/* KPI Cards */}
      <KPICards stats={stats} loading={refreshing} />

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <QuestionGrowthChart
            data={growthData}
            loading={refreshing}
            interval={interval}
            onIntervalChange={handleIntervalChange}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <QuestionStatusChart data={statusData} loading={refreshing} />
        </Grid>
      </Grid>

      {/* Tabs for more charts */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Category" />
          <Tab label="Difficulty" />
          <Tab label="Question Types" />
          <Tab label="Authors" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tab === 0 && (
        <CategoryDistributionChart data={categoryData} loading={refreshing} />
      )}
      {tab === 1 && (
        <DifficultyDistributionChart data={difficultyData} loading={refreshing} />
      )}
      {tab === 2 && (
        <QuestionTypeDistributionChart data={questionTypeData} loading={refreshing} />
      )}
      {tab === 3 && (
        <AuthorPerformanceTable data={authorData} loading={refreshing} />
      )}

      {/* Footer */}
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
        Data refreshed automatically. Last updated: {new Date().toLocaleString()}
      </Typography>
    </Box>
  );
};

export default QuestionAnalytics;