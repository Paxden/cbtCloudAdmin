/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * Centre Table Component
 * Displays centre list with actions
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActivateIcon,
  Cancel as DeactivateIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as AssignManagerIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import CentreStatusChip from './CentreStatusChip';

// ✅ Helper function to format address
const formatAddress = (address) => {
  if (!address) return 'N/A';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    return parts.join(', ') || 'N/A';
  }
  return 'N/A';
};

const CentreTable = ({
  centres = [],
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onAssignManager,
  canEdit,
  canActivate,
  canDelete,
  canAssignManager,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedCentre, setSelectedCentre] = useState(null);

  const handleMenuOpen = (event, centre) => {
    setActionMenu(event.currentTarget);
    setSelectedCentre(centre);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedCentre) {
      switch (action) {
        case 'view':
          onView(selectedCentre);
          break;
        case 'edit':
          onEdit(selectedCentre);
          break;
        case 'activate':
          onActivate(selectedCentre);
          break;
        case 'deactivate':
          onDeactivate(selectedCentre);
          break;
        case 'delete':
          onDelete(selectedCentre);
          break;
        case 'assignManager':
          onAssignManager(selectedCentre);
          break;
        default:
          break;
      }
    }
  };

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  const centresList = Array.isArray(centres) ? centres : [];

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={150} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell align="right"><Skeleton width={100} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!centresList || centresList.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No centres found. Create your first centre to get started.
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
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {centresList.map((centre) => {
                const isDeleted = centre.isDeleted || false;
                const capacity = centre.capacity || 0;
                const assignedCandidates = centre.assignedCandidates || 0;
                const utilization = capacity > 0 ? (assignedCandidates / capacity) * 100 : 0;

                return (
                  <TableRow
                    key={centre._id || centre.id || index}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      opacity: isDeleted ? 0.6 : 1,
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500} fontFamily="monospace">
                        {centre.code || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {centre.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {formatAddress(centre.address)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {assignedCandidates} / {capacity}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(utilization, 100)}
                          color={utilization >= 90 ? 'error' : utilization >= 70 ? 'warning' : 'success'}
                          sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {centre.manager?.name || centre.managerId?.name || 'Not Assigned'}
                    </TableCell>
                    <TableCell>
                      <CentreStatusChip
                        status={isDeleted ? 'DELETED' : centre.status}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {centre.createdAt ? format(new Date(centre.createdAt), 'dd/MM/yyyy') : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton size="small" color="info" onClick={() => onView(centre)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {canEdit && !isDeleted && (
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => onEdit(centre)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="More">
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, centre)}>
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
        {selectedCentre && (
          <>
            {!selectedCentre.isDeleted ? (
              <>
                <MenuItem onClick={() => handleAction('view')}>
                  <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View Details</ListItemText>
                </MenuItem>

                {canEdit && (
                  <MenuItem onClick={() => handleAction('edit')}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                )}

                {canAssignManager && (
                  <MenuItem onClick={() => handleAction('assignManager')}>
                    <ListItemIcon><AssignManagerIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Assign Manager</ListItemText>
                  </MenuItem>
                )}

                {canActivate && selectedCentre.status !== 'ACTIVE' && (
                  <MenuItem onClick={() => handleAction('activate')}>
                    <ListItemIcon><ActivateIcon fontSize="small" color="success" /></ListItemIcon>
                    <ListItemText>Activate</ListItemText>
                  </MenuItem>
                )}

                {canActivate && selectedCentre.status !== 'INACTIVE' && (
                  <MenuItem onClick={() => handleAction('deactivate')}>
                    <ListItemIcon><DeactivateIcon fontSize="small" color="warning" /></ListItemIcon>
                    <ListItemText>Deactivate</ListItemText>
                  </MenuItem>
                )}

                {canDelete && (
                  <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                )}
              </>
            ) : (
              <>
                <MenuItem onClick={() => handleAction('view')}>
                  <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View Details</ListItemText>
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default CentreTable;