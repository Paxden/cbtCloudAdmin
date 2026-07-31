/* eslint-disable no-unused-vars */
/**
 * Session Table Component
 * Displays sessions with actions
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
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  CheckCircle as ScheduleIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import SessionStatusChip from './SessionStatusChip';

const SessionTable = ({
  sessions,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
  onCancel,
  onSchedule,
  canEdit,
  canDelete,
  canSchedule,
  isPublished,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleMenuOpen = (event, session) => {
    setActionMenu(event.currentTarget);
    setSelectedSession(session);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedSession) {
      switch (action) {
        case 'view':
          onView(selectedSession);
          break;
        case 'edit':
          onEdit(selectedSession);
          break;
        case 'delete':
          onDelete(selectedSession);
          break;
        case 'cancel':
          onCancel(selectedSession);
          break;
        case 'schedule':
          onSchedule(selectedSession);
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

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Session Name</TableCell>
                <TableCell>Centre</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Candidates</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
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

  if (!sessions || sessions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No sessions created. Create your first session to schedule the examination.
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
                <TableCell>Session Name</TableCell>
                <TableCell>Centre</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Candidates</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => {
                const isCancelled = session.status === 'CANCELLED';
                const isCompleted = session.status === 'COMPLETED';
                const isScheduled = session.status === 'SCHEDULED';
                const canEditSession = canEdit && !isPublished && !isCancelled && !isCompleted;

                return (
                  <TableRow
                    key={session._id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      opacity: isCancelled ? 0.6 : 1,
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {session.sessionName || session.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {session.centreId?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {session.sessionDate ? format(new Date(session.sessionDate), 'dd/MM/yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {session.duration || 'N/A'} min
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {session.registeredCount || 0} / {session.capacity || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <SessionStatusChip status={session.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton size="small" color="info" onClick={() => onView(session)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {canEditSession && (
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => onEdit(session)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="More">
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, session)}>
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
          rowsPerPageOptions={[10, 20, 50]}
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
        {selectedSession && (
          <>
            <MenuItem onClick={() => handleAction('view')}>
              <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>

            {canEdit && !isPublished && selectedSession.status !== 'CANCELLED' && selectedSession.status !== 'COMPLETED' && (
              <MenuItem onClick={() => handleAction('edit')}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            )}

            {canSchedule && !isPublished && selectedSession.status === 'DRAFT' && (
              <MenuItem onClick={() => handleAction('schedule')}>
                <ListItemIcon><ScheduleIcon fontSize="small" color="success" /></ListItemIcon>
                <ListItemText>Schedule</ListItemText>
              </MenuItem>
            )}

            {canEdit && !isPublished && selectedSession.status !== 'CANCELLED' && selectedSession.status !== 'COMPLETED' && (
              <MenuItem onClick={() => handleAction('cancel')} sx={{ color: 'warning.main' }}>
                <ListItemIcon><CancelIcon fontSize="small" color="warning" /></ListItemIcon>
                <ListItemText>Cancel</ListItemText>
              </MenuItem>
            )}

            {canDelete && !isPublished && (
              <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default SessionTable;