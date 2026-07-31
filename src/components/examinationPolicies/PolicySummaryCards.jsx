/* eslint-disable no-unused-vars */
/**
 * Policy Summary Cards Component
 * Displays policy statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  Settings as GeneralIcon,
  Security as SecurityIcon,
  Timer as TimingIcon,
  NavigateNext as NavigationIcon,
  Person as RestrictionIcon,
  CheckCircle as ValidIcon,
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

const PolicySummaryCards = ({ stats, loading }) => {
  if (!stats && !loading) {
    return null;
  }

  const {
    generalRules = 0,
    securityRules = 0,
    timingRules = 0,
    navigationRules = 0,
    restrictionRules = 0,
    validationStatus = 'pending',
  } = stats || {};

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="General Rules"
          value={generalRules}
          icon={GeneralIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Security Rules"
          value={securityRules}
          icon={SecurityIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Timing Rules"
          value={timingRules}
          icon={TimingIcon}
          color="warning"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Navigation Rules"
          value={navigationRules}
          icon={NavigationIcon}
          color="secondary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Restrictions"
          value={restrictionRules}
          icon={RestrictionIcon}
          color="error"
          loading={loading}
          subtitle={validationStatus === 'valid' ? '✅ Valid' : '⚠️ Review needed'}
        />
      </Grid>
    </Grid>
  );
};

export default PolicySummaryCards;