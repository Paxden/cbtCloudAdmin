/**
 * Validation Summary Cards Component
 * Displays validation statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  CheckCircle as PassedIcon,
  Cancel as FailedIcon,
  Warning as WarningIcon,
  Assessment as TotalIcon,
  CheckCircle as ReadyIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

// ✅ Helper to safely get string value
const getSafeString = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value;
  if (typeof value === 'object') {
    // If it's an object, try to extract a number or string
    if (value.value !== undefined) return value.value;
    if (value.count !== undefined) return value.count;
    if (value.total !== undefined) return value.total;
    // Otherwise convert to string
    return JSON.stringify(value);
  }
  return value;
};

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

  // ✅ Ensure value is a number or string
  const displayValue = typeof value === 'string' && value.includes('%') ? value : getSafeString(value);
  const displaySubtitle = subtitle ? String(subtitle) : undefined;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {displayValue || 0}
            </Typography>
            {displaySubtitle && (
              <Typography variant="caption" color="textSecondary">
                {displaySubtitle}
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

const ValidationSummaryCards = ({ stats, loading }) => {
  if (!stats && !loading) {
    return null;
  }

  // ✅ Safely extract values with fallbacks
  const totalChecks = getSafeString(stats?.totalChecks || stats?.summary?.totalChecks || 0);
  const passed = getSafeString(stats?.passed || stats?.summary?.passedChecks || 0);
  const failed = getSafeString(stats?.failed || stats?.summary?.failedChecks || 0);
  const warnings = getSafeString(stats?.warnings || stats?.summary?.warningChecks || 0);
  const score = getSafeString(stats?.score || stats?.validationScore || 0);
  const status = String(stats?.status || stats?.result || 'PENDING').toUpperCase();

  // ✅ Ensure values are numbers for calculations
  const totalChecksNum = Number(totalChecks) || 0;
  const passedNum = Number(passed) || 0;
  const failedNum = Number(failed) || 0;
  const warningsNum = Number(warnings) || 0;
  const scoreNum = Number(score) || 0;

  const getStatusColor = () => {
    if (status === 'PASSED') return 'success';
    if (status === 'WARNING') return 'warning';
    if (status === 'FAILED') return 'error';
    return 'default';
  };

  const getStatusLabel = () => {
    if (status === 'PASSED') return 'Ready for Deployment';
    if (status === 'WARNING') return 'Needs Review';
    if (status === 'FAILED') return 'Not Ready';
    return 'Pending';
  };

  const passedPercentage = totalChecksNum > 0 ? Math.round((passedNum / totalChecksNum) * 100) : 0;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Checks"
          value={totalChecksNum}
          icon={TotalIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Passed"
          value={passedNum}
          icon={PassedIcon}
          color="success"
          loading={loading}
          subtitle={`${passedPercentage}%`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Warnings"
          value={warningsNum}
          icon={WarningIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Failed"
          value={failedNum}
          icon={FailedIcon}
          color="error"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Validation Score"
          value={`${scoreNum}%`}
          icon={scoreNum >= 90 ? ReadyIcon : ErrorIcon}
          color={getStatusColor()}
          loading={loading}
          subtitle={getStatusLabel()}
        />
      </Grid>
    </Grid>
  );
};

export default ValidationSummaryCards;