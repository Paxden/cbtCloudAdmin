/**
 * Examination Table Component
 * Displays examination list with actions
 */

import  { useState } from 'react';
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
  Chip,
  Button,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
  ContentCopy as CloneIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const getStatusColor = (status) => {
  const colors = {
    draft: 'default',
    published: 'info',
    scheduled: 'warning',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error',
    archived: 'default',
  };
  return colors[status?.toLowerCase()] || 'default';
};

const getStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const ExaminationTable = ({
  examinations,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onClone,
  onDelete,
  canEdit,
  canArchive,
  canDelete,
  canClone,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event, exam) => {
    setActionMenu(event.currentTarget);
    setSelectedExam(exam);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleArchiveClick = () => {
    handleMenuClose();
    setArchiveDialogOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (selectedExam) {
      await onArchive(selectedExam._id, { reason: archiveReason });
      setArchiveDialogOpen(false);
      setArchiveReason('');
      setSelectedExam(null);
    }
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedExam) {
      await onDelete(selectedExam._id);
      setDeleteDialogOpen(false);
      setSelectedExam(null);
    }
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedExam) {
      switch (action) {
        case 'view':
          onView(selectedExam);
          break;
        case 'edit':
          onEdit(selectedExam);
          break;
        case 'clone':
          onClone(selectedExam);
          break;
        case 'archive':
          handleArchiveClick();
          break;
        case 'restore':
          onRestore(selectedExam);
          break;
        case 'delete':
          handleDeleteClick();
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

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={150} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
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

  if (!examinations || examinations.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No examinations found. Create your first examination to get started.
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
                <TableCell>Type</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examinations.map((exam) => (
                <TableRow
                  key={exam._id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    opacity: exam.isArchived ? 0.6 : 1,
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="primary"
                      sx={{ fontFamily: 'monospace' }}
                    >
                      {exam.code || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {exam.name || 'Untitled'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={exam.examinationType || 'N/A'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {exam.promotionYear || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`v${exam.version || 1}`}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(exam.status)}
                      size="small"
                      color={getStatusColor(exam.status)}
                      variant="outlined"
                      icon={
                        exam.status === 'archived' ? <ArchiveIcon /> :
                        exam.status === 'completed' ? <CheckCircleIcon /> :
                        exam.status === 'cancelled' ? <CancelIcon /> :
                        exam.status === 'scheduled' ? <ScheduleIcon /> :
                        undefined
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(exam.createdAt), 'dd/MM/yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onView(exam)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {canEdit && !exam.isArchived && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(exam)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="More">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, exam)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenu}
        open={Boolean(actionMenu)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {selectedExam && (
          <>
            {!selectedExam.isArchived ? (
              <>
                <MenuItem onClick={() => handleAction('view')}>
                  <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View Details</ListItemText>
                </MenuItem>

                {canEdit && (
                  <MenuItem onClick={() => handleAction('edit')}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                )}

                {canClone && (
                  <MenuItem onClick={() => handleAction('clone')}>
                    <ListItemIcon><CloneIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Clone</ListItemText>
                  </MenuItem>
                )}

                {canArchive && (
                  <MenuItem onClick={() => handleAction('archive')}>
                    <ListItemIcon><ArchiveIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Archive</ListItemText>
                  </MenuItem>
                )}
              </>
            ) : (
              <>
                {canArchive && (
                  <MenuItem onClick={() => handleAction('restore')}>
                    <ListItemIcon><RestoreIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Restore</ListItemText>
                  </MenuItem>
                )}

                {canDelete && (
                  <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Delete Permanently</ListItemText>
                  </MenuItem>
                )}
              </>
            )}
          </>
        )}
      </Menu>

      {/* Archive Dialog */}
      <Dialog
        open={archiveDialogOpen}
        onClose={() => setArchiveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Archive Examination</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to archive "{selectedExam?.name}"?
            This will mark the examination as archived and prevent further modifications.
          </DialogContentText>
          <TextField
            label="Reason (Optional)"
            multiline
            rows={2}
            fullWidth
            value={archiveReason}
            onChange={(e) => setArchiveReason(e.target.value)}
            placeholder="Please provide a reason for archiving..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleArchiveConfirm}
            variant="contained"
            color="warning"
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Examination</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'error.main' }}>
            Are you sure you want to permanently delete "{selectedExam?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExaminationTable;