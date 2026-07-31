/**
 * Import Validation Summary Component
 * Displays validation statistics
 */

import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as TotalIcon,
  CheckCircle as ValidIcon,
  Error as InvalidIcon,
  Warning as DuplicateIcon,
  Info as InfoIcon,
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

const ImportValidationSummary = ({ validation }) => {
  if (!validation) {
    return null;
  }

  // Handle both response formats
  const totalRecords = validation.totalRecords || 0;
  const validRecords = validation.validRecords || 0;
  const invalidRecords = validation.invalidRecords || 0;
  const duplicateRecords = validation.duplicateRecords || 0;
  const warnings = validation.warnings || 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={2.4}>
        <SummaryCard
          title="Total Records"
          value={totalRecords}
          icon={TotalIcon}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <SummaryCard
          title="Valid Records"
          value={validRecords}
          icon={ValidIcon}
          color="success"
          subtitle={`${totalRecords > 0 ? Math.round((validRecords / totalRecords) * 100) : 0}%`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <SummaryCard
          title="Invalid Records"
          value={invalidRecords}
          icon={InvalidIcon}
          color="error"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <SummaryCard
          title="Duplicates"
          value={duplicateRecords}
          icon={DuplicateIcon}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <SummaryCard
          title="Warnings"
          value={warnings}
          icon={InfoIcon}
          color="info"
        />
      </Grid>
    </Grid>
  );
};

export default ImportValidationSummary;