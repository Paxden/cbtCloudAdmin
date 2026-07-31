/* eslint-disable no-unused-vars */
/**
 * Category Table Component
 * Displays categories with actions
 */

import { useState } from 'react';
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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import StatusChip from '../../chips/StatusChip';
import { format } from 'date-fns';

const CategoryTable = ({
  categories,
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
  onRefresh,
  canEdit,
  canDelete,
  canManageStatus,
  canView,
}) => {
  const [selected, setSelected] = useState([]);

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell align="right"><Skeleton width={100} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No categories found. Create your first category to get started.
        </Typography>
      </Paper>
    );
  }

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {category.description || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={category.status} size="small" />
                </TableCell>
                <TableCell>
                  {category.createdBy?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  {format(new Date(category.createdAt), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    {/* View */}
                    {canView && (
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onView(category)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Edit */}
                    {canEdit && (
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(category)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Activate */}
                    {canManageStatus && category.status === 'INACTIVE' && (
                      <Tooltip title="Activate">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => onActivate(category._id)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Deactivate */}
                    {canManageStatus && category.status === 'ACTIVE' && (
                      <Tooltip title="Deactivate">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => onDeactivate(category._id)}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Delete */}
                    {canDelete && (
                      <Tooltip title="Archive">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(category._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Refresh */}
                    <Tooltip title="Refresh">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onRefresh()}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
  );
};

export default CategoryTable;