/* eslint-disable no-unused-vars */
/**
 * CandidatePaperSummaryCards
 * Displays summary statistics for candidate papers
 * 
 * Location: src/components/candidate-paper/CandidatePaperSummaryCards.jsx
 */

import React from 'react';
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
  Error as ErrorIcon,
  Inventory as PackageIcon,
} from '@mui/icons-material';

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

const CandidatePaperSummaryCards = ({ statistics, loading = false }) => {
  const stats = statistics || {
    total: 0,
    generated: 0,
    encrypted: 0,
    packaged: 0,
    activated: 0,
    archived: 0,
    failed: 0,
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Total Papers"
          value={stats.total}
          icon={FileIcon}
          color="#1976d2"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Generated"
          value={stats.generated}
          icon={CheckCircleIcon}
          color="#4caf50"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Encrypted"
          value={stats.encrypted}
          icon={LockIcon}
          color="#ff9800"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Packaged"
          value={stats.packaged}
          icon={PackageIcon}
          color="#2196f3"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <StatCard
          title="Archived/Failed"
          value={(stats.archived || 0) + (stats.failed || 0)}
          icon={ArchiveIcon}
          color="#f44336"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default CandidatePaperSummaryCards;