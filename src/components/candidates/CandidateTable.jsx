/**
 * Candidate Table Component
 * Displays candidate list with actions
 */

import { useState } from 'react';
import {
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
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActivateIcon,
  Cancel as DeactivateIcon,
  Restore as RestoreIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import CandidateStatusChip from './CandidateStatusChip';

const CandidateTable = ({
  candidates,
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
  onRestore,
  selectedRows,
  onSelectRows,
  canEdit,
  canActivate,
  canDelete,
  canRestore,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleMenuOpen = (event, candidate) => {
    setActionMenu(event.currentTarget);
    setSelectedCandidate(candidate);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedCandidate) {
      switch (action) {
        case 'view':
          onView(selectedCandidate);
          break;
        case 'edit':
          onEdit(selectedCandidate);
          break;
        case 'activate':
          onActivate(selectedCandidate);
          break;
        case 'deactivate':
          onDeactivate(selectedCandidate);
          break;
        case 'delete':
          onDelete(selectedCandidate);
          break;
        case 'restore':
          onRestore(selectedCandidate);
          break;
        default:
          break;
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const ids = candidates.map((c) => c._id);
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

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox disabled />
                </TableCell>
                <TableCell>Candidate Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={150} /></TableCell>
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

  if (!candidates || candidates.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No candidates found. Import candidates to get started.
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
                    checked={selectedRows.length === candidates.length && candidates.length > 0}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < candidates.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Candidate Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => {
                const isDeleted = candidate.isDeleted || false;
                const isSelected = selectedRows.includes(candidate._id);

                return (
                  <TableRow
                    key={candidate._id}
                    hover
                    selected={isSelected}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      opacity: isDeleted ? 0.6 : 1,
                      textDecoration: isDeleted ? 'line-through' : 'none',
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(candidate._id)}
                        disabled={isDeleted}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        fontFamily="monospace"
                      >
                        {candidate.candidateNumber || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {candidate.firstName} {candidate.lastName}
                      </Typography>
                      {candidate.otherName && (
                        <Typography variant="caption" color="textSecondary">
                          {candidate.otherName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {candidate.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {candidate.department || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CandidateStatusChip
                        status={isDeleted ? 'DELETED' : candidate.status}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {candidate.createdAt
                          ? format(new Date(candidate.createdAt), 'dd/MM/yyyy')
                          : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onView(candidate)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {canEdit && !isDeleted && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => onEdit(candidate)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="More">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, candidate)}
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
        {selectedCandidate && (
          <>
            {!selectedCandidate.isDeleted ? (
              <>
                {canActivate && selectedCandidate.status !== 'ACTIVE' && (
                  <MenuItem onClick={() => handleAction('activate')}>
                    <ListItemIcon><ActivateIcon fontSize="small" color="success" /></ListItemIcon>
                    <ListItemText>Activate</ListItemText>
                  </MenuItem>
                )}
                {canActivate && selectedCandidate.status !== 'INACTIVE' && (
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
                {canRestore && (
                  <MenuItem onClick={() => handleAction('restore')}>
                    <ListItemIcon><RestoreIcon fontSize="small" color="success" /></ListItemIcon>
                    <ListItemText>Restore</ListItemText>
                  </MenuItem>
                )}
              </>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default CandidateTable;