/* eslint-disable no-unused-vars */
/**
 * Approval Queue Table Component
 * Displays questions pending review with bulk actions
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
  Checkbox,
  Chip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
  CheckBox as SelectAllIcon,
  CheckBoxOutlineBlank as DeselectAllIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import ReviewStatusChip from './ReviewStatusChip';
import { format } from 'date-fns';

const ApprovalQueueTable = ({
  questions,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onReview,
  onApprove,
  onReject,
  onHistory,
  onRefresh,
  canApprove,
  canReject,
  // Bulk selection props
  selectedRows = [],
  onSelectRows = () => {},
  onBulkApprove = null,
  onBulkReject = null,
  bulkLoading = false,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleMenuOpen = (event, question) => {
    setActionMenu(event.currentTarget);
    setSelectedQuestion(question);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedQuestion) {
      switch (action) {
        case 'review':
          onReview(selectedQuestion);
          break;
        case 'approve':
          onApprove(selectedQuestion);
          break;
        case 'reject':
          onReject(selectedQuestion);
          break;
        case 'history':
          onHistory(selectedQuestion);
          break;
        default:
          break;
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const ids = questions.map((q) => q._id);
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

  const isAllSelected = questions.length > 0 && selectedRows.length === questions.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < questions.length;

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell align="right"><Skeleton width={120} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No questions in the review queue.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      {/* Bulk Action Bar */}
      {selectedRows.length > 0 && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'primary.50',
            border: '1px solid',
            borderColor: 'primary.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${selectedRows.length} selected`}
              size="small"
              color="primary"
              onDelete={() => onSelectRows([])}
            />
            <Typography variant="body2" color="textSecondary">
              {selectedRows.length} of {total} questions selected
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            {canApprove && onBulkApprove && (
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<ApproveIcon />}
                onClick={() => onBulkApprove(selectedRows)}
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Processing...' : `Approve All (${selectedRows.length})`}
              </Button>
            )}
            {canReject && onBulkReject && (
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<RejectIcon />}
                onClick={() => onBulkReject(selectedRows)}
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Processing...' : `Reject All (${selectedRows.length})`}
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={() => onSelectRows([])}
              disabled={bulkLoading}
            >
              Clear
            </Button>
          </Stack>
        </Paper>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                    disabled={bulkLoading}
                  />
                </TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => {
                const title = question.questionText?.replace(/<[^>]*>/g, '').substring(0, 50) || 'No title';
                const isSelected = selectedRows.includes(question._id);
                const isPending = question.status === 'PENDING_REVIEW';

                return (
                  <TableRow
                    key={question._id}
                    hover
                    selected={isSelected}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      opacity: isPending ? 1 : 0.6,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(question._id)}
                        disabled={!isPending || bulkLoading}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {question.questionCode || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={question.questionText?.replace(/<[^>]*>/g, '') || ''}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 150,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {title}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{question.categoryId?.name || 'N/A'}</TableCell>
                    <TableCell>{question.subjectId?.name || 'N/A'}</TableCell>
                    <TableCell>{question.difficultyId?.name || 'N/A'}</TableCell>
                    <TableCell>{question.createdBy?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      {format(new Date(question.submittedAt || question.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <ReviewStatusChip status={question.status} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Review">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onReview(question)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {canApprove && isPending && (
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => onApprove(question)}
                              disabled={bulkLoading}
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {canReject && isPending && (
                          <Tooltip title="Reject">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onReject(question)}
                              disabled={bulkLoading}
                            >
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="History">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => onHistory(question)}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="More">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, question)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
        {selectedQuestion && (
          <>
            <MenuItem onClick={() => handleAction('review')}>
              <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Review</ListItemText>
            </MenuItem>
            {canApprove && selectedQuestion.status === 'PENDING_REVIEW' && (
              <MenuItem onClick={() => handleAction('approve')}>
                <ListItemIcon><ApproveIcon fontSize="small" color="success" /></ListItemIcon>
                <ListItemText>Approve</ListItemText>
              </MenuItem>
            )}
            {canReject && selectedQuestion.status === 'PENDING_REVIEW' && (
              <MenuItem onClick={() => handleAction('reject')}>
                <ListItemIcon><RejectIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Reject</ListItemText>
              </MenuItem>
            )}
            <MenuItem onClick={() => handleAction('history')}>
              <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
              <ListItemText>View History</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default ApprovalQueueTable;