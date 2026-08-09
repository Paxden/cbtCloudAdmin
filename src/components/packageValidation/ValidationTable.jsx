/* eslint-disable no-unused-vars */
/**
 * ValidationTable Component
 * Displays validations in a data grid
 * 
 * Location: src/components/packageValidation/ValidationTable.jsx
 */

import React, { useState } from 'react';
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
  Chip,
  Checkbox,
  LinearProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  PlayArrow as RunIcon,
  CheckCircle as ChecklistIcon,
  FileDownload as DownloadIcon,
  History as HistoryIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import ValidationStatusChip from './ValidationStatusChip';

const ValidationTable = ({
  validations,
  total,
  page,
  limit,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onRunValidation,
  onViewChecklist,
  onExportReport,
  onSelect,
  selected = [],
  canRunValidation = false
}) => {
  const [localSelected, setLocalSelected] = useState([]);

  const handlePageChange = (event, newPage) => {
    onPageChange(event, newPage);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(event);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = validations.map(v => v._id);
      setLocalSelected(allIds);
      onSelect(allIds);
    } else {
      setLocalSelected([]);
      onSelect([]);
    }
  };

  const handleSelect = (id) => {
    const newSelected = localSelected.includes(id)
      ? localSelected.filter(s => s !== id)
      : [...localSelected, id];
    setLocalSelected(newSelected);
    onSelect(newSelected);
  };

  // Skeleton rows for loading state
  if (loading) {
    return (
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox disabled />
                </TableCell>
                {['Package', 'Examination', 'Centre', 'Status', 'Score', 'Validated By', 'Date', 'Actions'].map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width={j === 6 ? 120 : 80} />
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
  if (validations.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No validations found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or run validation on packages
        </Typography>
      </Paper>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={validations.length > 0 && localSelected.length === validations.length}
                  indeterminate={localSelected.length > 0 && localSelected.length < validations.length}
                  onChange={handleSelectAll}
                  disabled={!canRunValidation}
                />
              </TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Examination</TableCell>
              <TableCell>Centre</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Score</TableCell>
              <TableCell>Validated By</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validations.map((validation) => {
              const isSelected = localSelected.includes(validation._id);
              const isPending = validation.status === 'PENDING';
              const isReady = validation.status === 'READY';

              return (
                <TableRow key={validation._id} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelect(validation._id)}
                      disabled={!canRunValidation || isReady}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {validation.packageName || validation.package?.name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {validation.packageCode || validation.package?.code || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {validation.examination?.name || validation.examName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        V{validation.instanceVersion || 1}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {validation.centre?.name || validation.centreName || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ValidationStatusChip status={validation.status} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    {validation.score !== undefined ? (
                      <Box sx={{ minWidth: 60 }}>
                        <LinearProgress
                          variant="determinate"
                          value={validation.score}
                          color={getScoreColor(validation.score)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">
                          {Math.round(validation.score)}%
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {validation.validatedBy?.name || validation.validatedBy || 'System'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(validation.validatedAt || validation.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(validation.validatedAt || validation.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      {/* View Details */}
                      <Tooltip title="View Report">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(validation._id)}
                        >
                          <ReportIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* View Checklist */}
                      <Tooltip title="View Checklist">
                        <IconButton
                          size="small"
                          onClick={() => onViewChecklist(validation._id)}
                        >
                          <ChecklistIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Run Validation */}
                      {canRunValidation && isPending && (
                        <Tooltip title="Run Validation">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onRunValidation(validation.packageId || validation._id)}
                          >
                            <RunIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Export Report */}
                      {!isPending && (
                        <Tooltip title="Export Report">
                          <IconButton
                            size="small"
                            onClick={() => onExportReport(validation._id)}
                          >
                            <DownloadIcon fontSize="small" />
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

export default ValidationTable;