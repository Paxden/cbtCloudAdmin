/* eslint-disable no-unused-vars */
/**
 * Validation History Table Component
 * Displays validation history
 */

import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  Chip,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import ValidationStatusChip from './ValidationStatusChip';

// Helper to safely get validated by name
const getValidatedByName = (item) => {
  if (!item) return 'Unknown';
  if (typeof item.validatedBy === 'string') return item.validatedBy;
  if (typeof item.validatedBy === 'object' && item.validatedBy !== null) {
    return item.validatedBy.name || item.validatedBy.email || 'Unknown';
  }
  return 'Unknown';
};

// Helper to safely get score
const getScore = (item) => {
  if (!item) return 0;
  return item.validationScore || item.score || 0;
};

// Helper to safely get status
const getStatus = (item) => {
  if (!item) return 'PENDING';
  return item.status || 'PENDING';
};

// Helper to safely get summary
const getSummary = (item) => {
  if (!item) return { passedChecks: 0, failedChecks: 0, warningChecks: 0 };
  return item.summary || { passedChecks: 0, failedChecks: 0, warningChecks: 0 };
};

const ValidationHistoryTable = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onDownload,
  canDownload,
}) => {
  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Validated By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Checks</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell align="right"><Skeleton width={80} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No validation history found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Validated By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Checks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => {
              const status = getStatus(item);
              const score = getScore(item);
              const validatedByName = getValidatedByName(item);
              const summary = getSummary(item);

              return (
                <TableRow key={item._id} hover>
                  <TableCell>
                    {item.validatedAt ? format(new Date(item.validatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {validatedByName}
                  </TableCell>
                  <TableCell>
                    <ValidationStatusChip status={status} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${score}%`}
                      size="small"
                      color={score >= 90 ? 'success' : score >= 70 ? 'warning' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Chip
                        label={`${summary.passedChecks || 0} passed`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                      {summary.failedChecks > 0 && (
                        <Chip
                          label={`${summary.failedChecks} failed`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      )}
                      {summary.warningChecks > 0 && (
                        <Chip
                          label={`${summary.warningChecks} warnings`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="info" onClick={() => onView(item)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {canDownload && (
                      <Tooltip title="Download Report">
                        <IconButton size="small" color="primary" onClick={() => onDownload(item)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={total || 0}
        rowsPerPage={limit}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
      />
    </Paper>
  );
};

export default ValidationHistoryTable;