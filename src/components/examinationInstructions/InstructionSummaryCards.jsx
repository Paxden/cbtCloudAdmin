/**
 * Instruction Summary Cards Component
 * Displays instruction statistics
 */

import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  Description as InstructionsIcon,
  AttachFile as ResourcesIcon,
  CheckCircle as ValidIcon,
  Update as UpdatedIcon,
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

const InstructionSummaryCards = ({ stats, loading }) => {
  if (!stats && !loading) {
    return null;
  }

  const {
    instructionCount = 0,
    resourceCount = 0,
    isValid = false,
    lastUpdated = null,
  } = stats || {};

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Instruction Sections"
          value={instructionCount}
          icon={InstructionsIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Resources Uploaded"
          value={resourceCount}
          icon={ResourcesIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Validation Status"
          value={isValid ? '✅ Valid' : '⚠️ Needs Review'}
          icon={ValidIcon}
          color={isValid ? 'success' : 'warning'}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Last Updated"
          value={lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Never'}
          icon={UpdatedIcon}
          color="secondary"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default InstructionSummaryCards;