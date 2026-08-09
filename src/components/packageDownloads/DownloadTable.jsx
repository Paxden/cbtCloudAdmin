/* eslint-disable no-unused-vars */
/**
 * DownloadTable Component
 * Displays downloads in a data grid
 * 
 * Location: src/components/packageDownloads/DownloadTable.jsx
 */

import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Skeleton,
  Chip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Timeline as TimelineIcon,
  CheckCircle as VerifyIcon,
  Refresh as RetryIcon
} from '@mui/icons-material';
import DownloadStatusChip from './DownloadStatusChip';

const DownloadTable = ({
  downloads,
  total,
  page,
  limit,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onViewTimeline,
  onVerify,
  onRetry,
  onViewPackage,
  canRetry = false,
  canVerify = false
}) => {
  const handlePageChange = (event, newPage) => {
    onPageChange(event, newPage);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(event);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };

  // Skeleton rows for loading state
  if (loading) {
    return (
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Package', 'Examination', 'Centre', 'Version', 'Downloaded By', 'Date', 'Status', 'Actions'].map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width={j === 7 ? 120 : 80} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // Empty state
  if (downloads.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No downloads found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or wait for packages to be downloaded
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Package</TableCell>
              <TableCell>Examination</TableCell>
              <TableCell>Centre</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Downloaded By</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {downloads.map((download) => {
              const isCompleted = download.status === 'COMPLETED';
              const isFailed = download.status === 'FAILED';
              const isPending = download.status === 'PENDING';

              return (
                <TableRow key={download._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {download.packageName || download.package?.name || 'N/A'}
                    </Typography>
                    {download.fileSize && (
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(download.fileSize)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {download.examination?.name || download.examName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {download.examCode || ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {download.centre?.name || download.centreName || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      V{download.packageVersion || download.version || 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {download.downloadedBy?.name || download.downloadedBy || 'System'}
                    </Typography>
                    {download.ipAddress && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {download.ipAddress}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(download.downloadedAt || download.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(download.downloadedAt || download.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <DownloadStatusChip status={download.status} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      {/* View Details */}
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(download._id)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* View Timeline */}
                      <Tooltip title="View Timeline">
                        <IconButton
                          size="small"
                          onClick={() => onViewTimeline(download._id)}
                        >
                          <TimelineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Verify Download */}
                      {canVerify && isCompleted && (
                        <Tooltip title="Verify Download">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => onVerify(download._id)}
                          >
                            <VerifyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Retry Download */}
                      {canRetry && isFailed && (
                        <Tooltip title="Retry Download">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => onRetry(download._id)}
                          >
                            <RetryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );
};

export default DownloadTable;