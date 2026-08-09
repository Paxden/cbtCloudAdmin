/**
 * InstanceStatisticsCards
 * Displays statistics cards for examination instances
 * 
 * Location: src/components/instances/InstanceStatisticsCards.jsx
 */

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import {
  FileCopy as FileIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Archive as ArchiveIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { InstanceStatusLabels, InstanceStatusColors } from '../../types/examInstance.types';

const StatCard = ({ title, value, icon, color, loading }) => {
  const IconComponent = icon;
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={60} height={40} />
            ) : (
              <Typography variant="h4" fontWeight="bold">
                {value || 0}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: color || 'primary.main',
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent sx={{ color: 'white' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const InstanceStatisticsCards = ({ statistics, loading = false }) => {
  const stats = {
    total: statistics?.total || 0,
    draft: statistics?.DRAFT || 0,
    generating: statistics?.GENERATING || 0,
    generated: statistics?.GENERATED || 0,
    locked: statistics?.LOCKED || 0,
    archived: statistics?.ARCHIVED || 0,
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Instances"
          value={stats.total}
          icon={FileIcon}
          color="#1976d2"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title={InstanceStatusLabels.DRAFT}
          value={stats.draft}
          icon={PendingIcon}
          color={InstanceStatusColors.DRAFT}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title={InstanceStatusLabels.GENERATED}
          value={stats.generated}
          icon={CheckCircleIcon}
          color={InstanceStatusColors.GENERATED}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title={InstanceStatusLabels.LOCKED}
          value={stats.locked}
          icon={LockIcon}
          color={InstanceStatusColors.LOCKED}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title={InstanceStatusLabels.ARCHIVED}
          value={stats.archived}
          icon={ArchiveIcon}
          color={InstanceStatusColors.ARCHIVED}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default InstanceStatisticsCards;