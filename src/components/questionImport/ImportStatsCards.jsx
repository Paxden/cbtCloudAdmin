/* eslint-disable no-unused-vars */
/**
 * Import Stats Cards Component
 * Dashboard statistics for imports
 */

import StatsCard from '../cards/StatsCard';
import { Grid } from '@mui/material';
import {
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  QuestionAnswer as QuestionIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const ImportStatsCards = ({ stats, loading }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Imports"
          value={stats?.total || 0}
          icon={UploadIcon}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Successful Imports"
          value={stats?.completed || 0}
          icon={CheckCircleIcon}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Questions Imported"
          value={stats?.totalImported || 0}
          icon={QuestionIcon}
          color="info"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Failed Questions"
          value={stats?.totalFailed || 0}
          icon={ErrorIcon}
          color="error"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default ImportStatsCards;