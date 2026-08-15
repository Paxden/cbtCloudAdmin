/* eslint-disable no-unused-vars */
/**
 * BuildHistoryTable
 * Displays build history for packages
 * 
 * Location: src/components/package-builder/BuildHistoryTable.jsx
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

const BuildHistoryTable = ({ history = [], loading = false }) => {
  const getStatusChip = (status) => {
    const configs = {
      SUCCESS: { color: 'success', icon: <CheckCircleIcon />, label: 'Success' },
      FAILED: { color: 'error', icon: <ErrorIcon />, label: 'Failed' },
      PENDING: { color: 'warning', icon: <PendingIcon />, label: 'Pending' },
      BUILDING: { color: 'info', icon: <PendingIcon />, label: 'Building' },
    };

    const config = configs[status] || configs.PENDING;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading build history...</Typography>
      </Paper>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No build history available</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Build ID</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Triggered By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((build) => (
            <TableRow key={build.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {build.id?.slice(-8)}
                </Typography>
              </TableCell>
              <TableCell>v{build.version || 1}</TableCell>
              <TableCell>{getStatusChip(build.status)}</TableCell>
              <TableCell>{build.duration || 'N/A'}</TableCell>
              <TableCell>{build.size || 'N/A'}</TableCell>
              <TableCell>
                {build.createdAt ? new Date(build.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>{build.triggeredBy || 'System'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BuildHistoryTable;