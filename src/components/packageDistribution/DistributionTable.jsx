/* eslint-disable no-unused-vars */
/**
 * DistributionTable Component
 * Displays distributions in a data grid
 * 
 * Location: src/components/packageDistribution/DistributionTable.jsx
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
  Checkbox
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Send as ReleaseIcon,
  LocationOn as CentreIcon,
  History as HistoryIcon,
  Cancel as RevokeIcon
} from '@mui/icons-material';
import DistributionStatusChip from './DistributionStatusChip';

const DistributionTable = ({
  distributions,
  total,
  page,
  limit,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onRelease,
  onViewCentreStatus,
  onRevoke,
  onSelect,
  selected = [],
  canRelease = false,
  canRevoke = false
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
      const allIds = distributions.map(d => d._id);
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
                {['Package', 'Examination', 'Centre', 'Version', 'Status', 'Released By', 'Date', 'Actions'].map((col) => (
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
  if (distributions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No distributions found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or release packages for distribution
        </Typography>
      </Paper>
    );
  }

  const isReleased = (status) => ['RELEASED', 'DOWNLOADED', 'RECEIVED'].includes(status);
  const isRevoked = (status) => status === 'REVOKED';
  const isPending = (status) => status === 'PENDING' || status === 'APPROVED';

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={distributions.length > 0 && localSelected.length === distributions.length}
                  indeterminate={localSelected.length > 0 && localSelected.length < distributions.length}
                  onChange={handleSelectAll}
                  disabled={!canRelease}
                />
              </TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Examination</TableCell>
              <TableCell>Centre</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Released By</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distributions.map((distribution) => {
              const isSelected = localSelected.includes(distribution._id);
              const canBeReleased = isPending(distribution.status) && !isRevoked(distribution.status);

              return (
                <TableRow key={distribution._id} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelect(distribution._id)}
                      disabled={!canRelease || !canBeReleased}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {distribution.packageName || distribution.package?.name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {distribution.packageCode || distribution.package?.code || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {distribution.examination?.name || distribution.examName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {distribution.examCode || ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {distribution.centre?.name || distribution.centreName || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      V{distribution.packageVersion || distribution.version || 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <DistributionStatusChip status={distribution.status} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {distribution.releasedBy?.name || distribution.releasedBy || 'System'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(distribution.releasedAt || distribution.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(distribution.releasedAt || distribution.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      {/* View Details */}
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(distribution._id)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Release Package */}
                      {canRelease && canBeReleased && (
                        <Tooltip title="Release Package">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onRelease(distribution._id)}
                          >
                            <ReleaseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* View Centre Status */}
                      {distribution.centreId && (
                        <Tooltip title="View Centre Status">
                          <IconButton
                            size="small"
                            onClick={() => onViewCentreStatus(distribution.centreId)}
                          >
                            <CentreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Revoke Distribution */}
                      {canRevoke && isReleased(distribution.status) && !isRevoked(distribution.status) && (
                        <Tooltip title="Revoke Distribution">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onRevoke(distribution._id)}
                          >
                            <RevokeIcon fontSize="small" />
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

export default DistributionTable;