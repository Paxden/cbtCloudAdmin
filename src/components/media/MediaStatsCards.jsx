/**
 * Media Stats Cards Component
 * Dashboard statistics for media library
 */

import StatsCard from '../cards/StatsCard';
import { Grid } from '@mui/material';
import {
  Image as ImageIcon,
  CloudUpload as UploadIcon,
  Storage as StorageIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MediaStatsCards = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Media"
          value={stats?.total || 0}
          icon={ImageIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Active Media"
          value={stats?.active || 0}
          icon={UploadIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Storage Used"
          value={stats?.totalSizeBytes ? formatFileSize(stats.totalSizeBytes) : '0 B'}
          icon={StorageIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Archived"
          value={stats?.deleted || 0}
          icon={ArchiveIcon}
          color="default"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default MediaStatsCards;