/* eslint-disable no-unused-vars */
/**
 * Validation Result Table Component
 * Displays validation results in a table
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
  Typography,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as PassedIcon,
  Cancel as FailedIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import ValidationStatusChip from './ValidationStatusChip';

const ValidationResultTable = ({
  results,
  loading,
  onView,
  canView,
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Check</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Message</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={150} /></TableCell>
                  <TableCell align="right"><Skeleton width={40} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No validation results available. Run validation to see results.
        </Typography>
      </Paper>
    );
  }

  const getStatusIcon = (status) => {
    if (status === 'PASSED') return <PassedIcon color="success" />;
    if (status === 'WARNING') return <WarningIcon color="warning" />;
    if (status === 'FAILED') return <FailedIcon color="error" />;
    return null;
  };

  const getSeverityColor = (severity) => {
    if (severity === 'CRITICAL') return 'error';
    if (severity === 'HIGH') return 'warning';
    if (severity === 'MEDIUM') return 'info';
    return 'default';
  };

  // Helper to safely render message
  const renderMessage = (result) => {
    // If message is an object, stringify it or extract the message field
    if (typeof result.message === 'object' && result.message !== null) {
      // If there's a nested message field
      if (result.message.message) {
        return result.message.message;
      }
      // If there's an error field
      if (result.message.error) {
        return result.message.error;
      }
      // Otherwise stringify the object
      try {
        return JSON.stringify(result.message);
      } catch {
        return 'Invalid message format';
      }
    }
    return result.message || 'No message';
  };

  // Helper to get check name
  const getCheckName = (result) => {
    return result.name || result.check || result.category || 'Check';
  };

  // Helper to get category
  const getCategory = (result) => {
    return result.category || 'General';
  };

  // Helper to get severity
  const getSeverity = (result) => {
    return result.severity || result.severityLevel || 'MEDIUM';
  };

  // Helper to get status
  const getStatus = (result) => {
    return result.status || result.result || 'PASSED';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Check</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Message</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => {
              const status = getStatus(result);
              const severity = getSeverity(result);
              const category = getCategory(result);
              const checkName = getCheckName(result);
              const message = renderMessage(result);

              return (
                <TableRow
                  key={result._id || result.id || index}
                  hover
                  sx={{
                    bgcolor: status === 'FAILED' ? 'error.lighter' : 'inherit',
                  }}
                >
                  <TableCell>
                    <Chip
                      label={category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {checkName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {getStatusIcon(status)}
                      <ValidationStatusChip status={status} size="small" />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {severity && (
                      <Chip
                        label={severity}
                        size="small"
                        color={getSeverityColor(severity)}
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {message}
                    </Typography>
                    {result.recommendation && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        💡 {result.recommendation}
                      </Typography>
                    )}
                    {result.details && typeof result.details === 'object' && (
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 0.5 }}>
                        Details: {JSON.stringify(result.details).substring(0, 100)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {canView && (
                      <Tooltip title="View Details">
                        <IconButton size="small" color="info" onClick={() => onView(result)}>
                          <ViewIcon fontSize="small" />
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
    </Paper>
  );
};

export default ValidationResultTable;