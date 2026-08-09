/* eslint-disable no-unused-vars */
/**
 * DownloadHistoryTable
 * Displays download history for a package
 * 
 * Location: src/components/download/DownloadHistoryTable.jsx
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
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import {
  DownloadStatus,
  DownloadStatusLabels,
  DownloadStatusColors,
} from '../../types/download.types';

const DownloadHistoryTable = ({
  history = [],
  loading = false,
  onViewDownload,
}) => {
  const getStatusChip = (status) => {
    const label = DownloadStatusLabels[status] || status;
    const color = DownloadStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === DownloadStatus.COMPLETED) {
      icon = <CheckCircleIcon />;
    } else if (status === DownloadStatus.FAILED) {
      icon = <ErrorIcon />;
    } else if (status === DownloadStatus.IN_PROGRESS) {
      icon = <PendingIcon />;
    } else if (status === DownloadStatus.STARTED) {
      icon = <DownloadIcon />;
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        size="small"
        sx={{
          bgcolor: color,
          color: 'white',
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading download history...</Typography>
      </Paper>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No download history available</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Download ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">File Size</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right">Speed</TableCell>
            <TableCell align="right">Started At</TableCell>
            <TableCell>Downloaded By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((download) => (
            <TableRow
              key={download._id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onViewDownload?.(download._id)}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {download._id?.slice(-8)}
                </Typography>
              </TableCell>
              <TableCell>{getStatusChip(download.downloadStatus)}</TableCell>
              <TableCell align="right">
                {formatFileSize(download.fileSize)}
              </TableCell>
              <TableCell align="right">
                {download.downloadDuration
                  ? `${(download.downloadDuration / 1000).toFixed(1)}s`
                  : 'N/A'}
              </TableCell>
              <TableCell align="right">
                {download.downloadSpeed
                  ? `${(download.downloadSpeed / 1024).toFixed(1)} KB/s`
                  : 'N/A'}
              </TableCell>
              <TableCell align="right">
                {download.timeline?.startedAt
                  ? new Date(download.timeline.startedAt).toLocaleString()
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {download.downloadedBy || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DownloadHistoryTable;