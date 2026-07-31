/* eslint-disable no-unused-vars */
/**
 * Location Statistics Card Component
 * Displays location-based statistics for candidates and centres
 */

import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Stack,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  CheckCircle as MatchIcon,
  Cancel as NoMatchIcon,
} from '@mui/icons-material';

const LocationStatsCard = ({ stats, loading, onRefresh }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={32} />
      </Paper>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No location data available.
        </Typography>
        {onRefresh && (
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{ mt: 1 }}
          >
            Refresh
          </Button>
        )}
      </Paper>
    );
  }

  const totalCandidates = stats.reduce((sum, item) => sum + item.count, 0);
  const locationsWithCentres = stats.filter(item => item.hasMatchingCentre).length;
  const totalCapacity = stats.reduce((sum, item) => sum + (item.totalCapacity || 0), 0);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Location Statistics
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {totalCandidates} candidates • {stats.length} locations
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: item.hasMatchingCentre ? 'success.light' : 'error.light',
                borderRadius: 2,
                bgcolor: item.hasMatchingCentre ? 'success.50' : 'error.50',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight={600}>
                  {item.city || item.state || 'Unknown'}
                </Typography>
                <Chip
                  label={item.count}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Typography variant="caption" color="textSecondary" display="block">
                {item.state || 'No state'}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {item.hasMatchingCentre ? (
                  <Chip
                    icon={<MatchIcon />}
                    label={`${item.centres?.length || 0} centres`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    icon={<NoMatchIcon />}
                    label="No centre"
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
                {item.totalCapacity > 0 && (
                  <Chip
                    label={`Capacity: ${item.totalCapacity}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default LocationStatsCard;