/**
 * System Status Component
 * Display system health status
 */

import { Paper, Typography, Grid, Box, Chip, Skeleton } from '@mui/material';
import { CheckCircle, Warning, Error, Refresh } from '@mui/icons-material';

const STATUS_CONFIG = {
  healthy: { icon: CheckCircle, color: 'success', label: 'Healthy' },
  warning: { icon: Warning, color: 'warning', label: 'Warning' },
  error: { icon: Error, color: 'error', label: 'Error' },
};

const SystemStatusItem = ({ label, status, details }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.healthy;
  const Icon = config.icon;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon color={config.color} fontSize="small" />
        <Typography variant="body2">{label}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {details && (
          <Typography variant="caption" color="textSecondary">
            {details}
          </Typography>
        )}
        <Chip label={config.label} size="small" color={config.color} />
      </Box>
    </Box>
  );
};

const SystemStatus = ({ status, loading, onRefresh }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          System Status
        </Typography>
        {[...Array(6)].map((_, index) => (
          <Box key={index} sx={{ py: 1 }}>
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Paper>
    );
  }

  const items = [
    { key: 'api', label: 'API Server', status: status?.api?.status || 'healthy', details: status?.api?.uptime },
    { key: 'database', label: 'Database', status: status?.database?.status || 'healthy', details: status?.database?.connected ? 'Connected' : 'Disconnected' },
    { key: 'storage', label: 'Storage', status: status?.storage?.status || 'healthy', details: status?.storage?.used },
    { key: 'jobs', label: 'Background Jobs', status: status?.backgroundJobs?.status || 'healthy', details: `${status?.backgroundJobs?.pending || 0} pending` },
    { key: 'package', label: 'Package Generator', status: status?.packageGenerator?.status || 'healthy', details: status?.packageGenerator?.lastRun },
    { key: 'sync', label: 'Synchronization', status: status?.sync?.status || 'healthy', details: status?.sync?.lastSync },
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">System Status</Typography>
        {onRefresh && (
          <Refresh
            fontSize="small"
            sx={{ cursor: 'pointer', color: 'text.secondary' }}
            onClick={onRefresh}
          />
        )}
      </Box>
      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} key={item.key}>
            <SystemStatusItem
              label={item.label}
              status={item.status}
              details={item.details}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SystemStatus;