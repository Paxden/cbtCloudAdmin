/* eslint-disable no-unused-vars */
/**
 * InstanceTable
 * Table displaying examination instances
 * 
 * Location: src/components/instances/InstanceTable.jsx
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
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  Archive as ArchiveIcon,
  AddBox as GenerateIcon,
  History as HistoryIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { InstanceStatusLabels, InstanceStatusColors } from '../../types/examInstance.types';

const InstanceTable = ({
  instances = [],
  total = 0,
  page = 0,
  limit = 10,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onLock,
  onArchive,
  onGeneratePackages,
  onViewHistory,
  canLock = true,
  canArchive = true,
  canGenerate = true,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);

  const handleMenuOpen = (event, instance) => {
    setAnchorEl(event.currentTarget);
    setSelectedInstance(instance);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInstance(null);
  };

  const getStatusChip = (status) => {
    const label = InstanceStatusLabels[status] || status;
    const color = InstanceStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === 'GENERATED') icon = <CheckCircleIcon />;
    else if (status === 'LOCKED') icon = <LockIcon />;
    else if (status === 'ARCHIVED') icon = <ArchiveIcon />;
    else if (status === 'GENERATING') icon = <PendingIcon />;
    else if (status === 'DRAFT') icon = <ErrorIcon />;
    
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

  const canLockInstance = (status) => {
    return (status === 'DRAFT' || status === 'GENERATED') && canLock;
  };

  const canArchiveInstance = (status) => {
    return (status === 'GENERATED' || status === 'LOCKED') && canArchive;
  };

  const canGeneratePackages = (status) => {
    return status === 'LOCKED' && canGenerate;
  };

  if (loading && instances.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading instances...</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instance Code</TableCell>
              <TableCell>Exam Name</TableCell>
              <TableCell align="center">Questions</TableCell>
              <TableCell align="center">Candidates</TableCell>
              <TableCell align="center">Centres</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No examination instances found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              instances.map((instance) => (
                <TableRow key={instance._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {instance.instanceCode}
                    </Typography>
                  </TableCell>
                  <TableCell>{instance.examName}</TableCell>
                  <TableCell align="center">{instance.approvedQuestionCount || 0}</TableCell>
                  <TableCell align="center">{instance.candidateCount || 0}</TableCell>
                  <TableCell align="center">{instance.centreCount || 0}</TableCell>
                  <TableCell>{getStatusChip(instance.status)}</TableCell>
                  <TableCell align="right">
                    {new Date(instance.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(instance._id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="More Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, instance)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedInstance && (
          <>
            <MenuItem onClick={() => {
              handleMenuClose();
              onViewDetails(selectedInstance._id);
            }}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>

            {canLockInstance(selectedInstance.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onLock(selectedInstance._id);
              }}>
                <ListItemIcon>
                  <LockIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Lock Instance</ListItemText>
              </MenuItem>
            )}

            {canArchiveInstance(selectedInstance.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onArchive(selectedInstance._id);
              }}>
                <ListItemIcon>
                  <ArchiveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive Instance</ListItemText>
              </MenuItem>
            )}

            {canGeneratePackages(selectedInstance.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onGeneratePackages(selectedInstance._id);
              }}>
                <ListItemIcon>
                  <GenerateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Generate Packages</ListItemText>
              </MenuItem>
            )}

            <MenuItem onClick={() => {
              handleMenuClose();
              onViewHistory(selectedInstance._id);
            }}>
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View History</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </Paper>
  );
};

export default InstanceTable;