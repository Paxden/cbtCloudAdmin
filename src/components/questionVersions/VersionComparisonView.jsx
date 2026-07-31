/**
 * Version Comparison View Component
 * Displays side-by-side comparison of two versions
 */

import { Box, Paper, Typography, Chip, Grid, Divider, Stack } from '@mui/material';
import { format } from 'date-fns';

const ComparisonSection = ({ title, left, right, leftLabel, rightLabel }) => {
  const isDifferent = JSON.stringify(left) !== JSON.stringify(right);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {title}
        {isDifferent && (
          <Chip
            label="Changed"
            size="small"
            color="warning"
            sx={{ ml: 1 }}
          />
        )}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              bgcolor: 'action.hover',
              borderColor: isDifferent ? 'warning.main' : 'divider',
            }}
          >
            <Typography variant="caption" color="textSecondary">
              {leftLabel}
            </Typography>
            <Typography variant="body2">{left || '-'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              bgcolor: 'action.hover',
              borderColor: isDifferent ? 'warning.main' : 'divider',
            }}
          >
            <Typography variant="caption" color="textSecondary">
              {rightLabel}
            </Typography>
            <Typography variant="body2">{right || '-'}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const VersionComparisonView = ({ comparison, loading }) => {
  if (loading || !comparison) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Select two versions to compare or loading...
        </Typography>
      </Paper>
    );
  }

  const { versionA, versionB, differences, changedFields } = comparison;

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Version Comparison
          </Typography>
          <Chip
            label={`${differences?.length || 0} changes found`}
            color="warning"
            size="small"
          />
        </Stack>
        <Typography variant="caption" color="textSecondary">
          Comparing Version {versionA?.number} ({format(new Date(versionA?.createdAt), 'dd/MM/yyyy HH:mm')}) 
          vs Version {versionB?.number} ({format(new Date(versionB?.createdAt), 'dd/MM/yyyy HH:mm')})
        </Typography>
      </Paper>

      {/* Changed Fields Summary */}
      {changedFields && changedFields.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Changed Fields
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {changedFields.map((field) => (
              <Chip key={field} label={field} size="small" color="warning" variant="outlined" />
            ))}
          </Box>
        </Paper>
      )}

      {/* Differences */}
      {differences && differences.length > 0 ? (
        differences.map((diff, index) => (
          <ComparisonSection
            key={index}
            title={diff.field}
            left={diff.oldValue}
            right={diff.newValue}
            leftLabel={`Version ${versionA?.number}`}
            rightLabel={`Version ${versionB?.number}`}
          />
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No differences found between these versions.
          </Typography>
        </Paper>
      )}

      {/* Metadata Comparison */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Metadata Comparison
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <Typography variant="caption" color="textSecondary">Status</Typography>
            <Typography variant="body2">{versionA?.status || '-'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <Typography variant="caption" color="textSecondary">Status</Typography>
            <Typography variant="body2">{versionB?.status || '-'}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VersionComparisonView;