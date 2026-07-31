/**
 * Import Summary Cards Component
 * Displays import result statistics
 */

import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as FailedIcon,
  Warning as SkippedIcon,
  PersonAdd as ImportedIcon,
} from '@mui/icons-material';

const SummaryCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
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
        }}
      >
        <Icon />
      </Box>
    </Box>
  </Paper>
);

const ImportSummaryCards = ({ summary }) => {
  if (!summary) {
    return null;
  }

  const totalRecords = summary.totalRecords || 0;
  const successfulRecords = summary.successfulRecords || 0;
  const failedRecords = summary.failedRecords || 0;
  const skippedRecords = summary.skippedRecords || 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Total Processed"
          value={totalRecords}
          icon={ImportedIcon}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Imported Successfully"
          value={successfulRecords}
          icon={SuccessIcon}
          color="success"
          subtitle={`${totalRecords > 0 ? Math.round((successfulRecords / totalRecords) * 100) : 0}%`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Failed"
          value={failedRecords}
          icon={FailedIcon}
          color="error"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="Skipped"
          value={skippedRecords}
          icon={SkippedIcon}
          color="warning"
        />
      </Grid>
    </Grid>
  );
};

export default ImportSummaryCards;