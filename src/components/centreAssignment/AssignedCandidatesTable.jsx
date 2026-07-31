/* eslint-disable no-unused-vars */
/**
 * Assigned Candidates Table Component
 * Displays assigned candidates by centre with location info
 */

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Chip,
  Stack,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as RemoveIcon,
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import AssignmentStatusChip from './AssignmentStatusChip';

const AssignedCandidatesTable = ({
  assignments,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onRemove,
  selectedRows,
  onSelectRows,
  canRemove,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleMenuOpen = (event, assignment) => {
    setActionMenu(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedAssignment) {
      switch (action) {
        case 'view':
          onView(selectedAssignment);
          break;
        case 'remove':
          onRemove(selectedAssignment);
          break;
        default:
          break;
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const ids = assignments.map((a) => a._id);
      onSelectRows(ids);
    } else {
      onSelectRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      onSelectRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      onSelectRows([...selectedRows, id]);
    }
  };

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  // Helper to get location display
  const getLocationDisplay = (assignment) => {
    const candidate = assignment.candidateId;
    if (!candidate) return 'N/A';
    const city = candidate.city || candidate.location?.city;
    const state = candidate.state || candidate.location?.state;
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'N/A';
  };

  // Helper to get centre location
  const getCentreLocation = (assignment) => {
    const centre = assignment.centreId;
    if (!centre) return 'N/A';
    const city = centre.address?.city;
    const state = centre.address?.state;
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'N/A';
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
                <TableCell>Candidate</TableCell>
                <TableCell>Candidate Location</TableCell>
                <TableCell>Centre</TableCell>
                <TableCell>Centre Location</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell align="right"><Skeleton width={100} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No assignments found. Assign candidates to centres to see them here.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.length === assignments.length && assignments.length > 0}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < assignments.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Candidate</TableCell>
                <TableCell>Candidate Location</TableCell>
                <TableCell>Centre</TableCell>
                <TableCell>Centre Location</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => {
                const isSelected = selectedRows.includes(assignment._id);
                const candidateLocation = getLocationDisplay(assignment);
                const centreLocation = getCentreLocation(assignment);
                const isMatchingLocation = candidateLocation !== 'N/A' && centreLocation !== 'N/A' && 
                  candidateLocation.split(',')[0].trim() === centreLocation.split(',')[0].trim();

                return (
                  <TableRow
                    key={assignment._id}
                    hover
                    selected={isSelected}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(assignment._id)}
                        disabled={assignment.status === 'REMOVED'}
                      />
                    </TableCell>
                    <TableCell>
                      {assignment.candidateId && (
                        <Stack direction="column" spacing={0.5}>
                          <Typography variant="body2">
                            {assignment.candidateId.firstName} {assignment.candidateId.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" fontFamily="monospace">
                            {assignment.candidateId.candidateNumber}
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {candidateLocation}
                        </Typography>
                        {isMatchingLocation && (
                          <Chip label="✓ Match" size="small" color="success" variant="outlined" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {assignment.centreId ? (
                        <Chip
                          label={assignment.centreId.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {centreLocation}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {assignment.assignedBy?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {assignment.assignedAt
                        ? format(new Date(assignment.assignedAt), 'dd/MM/yyyy HH:mm')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <AssignmentStatusChip status={assignment.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton size="small" color="info" onClick={() => onView(assignment)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {canRemove && assignment.status !== 'REMOVED' && (
                          <Tooltip title="Remove">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                handleAction('remove');
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="More">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setSelectedAssignment(assignment);
                              handleMenuOpen(e, assignment);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          component="div"
          count={total || 0}
          rowsPerPage={limit}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenu}
        open={Boolean(actionMenu)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {selectedAssignment && (
          <>
            <MenuItem onClick={() => handleAction('view')}>
              <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            {canRemove && selectedAssignment.status !== 'REMOVED' && (
              <MenuItem onClick={() => handleAction('remove')} sx={{ color: 'error.main' }}>
                <ListItemIcon><RemoveIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Remove Assignment</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default AssignedCandidatesTable;