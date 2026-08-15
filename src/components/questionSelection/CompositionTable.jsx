/**
 * Composition Table Component
 * Displays selected questions in the paper
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
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as RemoveIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  MoreVert as MoreVertIcon,
  SwapHoriz as ReplaceIcon,
} from '@mui/icons-material';
import QuestionStatusChip from './QuestionStatusChip';

const CompositionTable = ({
  questions,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onRemove,
  onLock,
  onUnlock,
  onReplace,
  canEdit,
  canLock,
  canRemove,
  isLocked,
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
        case 'view':
          onView(selectedQuestion);
          break;
        case 'remove':
          onRemove(selectedQuestion);
          break;
        case 'lock':
          onLock(selectedQuestion);
          break;
        case 'unlock':
          onUnlock(selectedQuestion);
          break;
        case 'replace':
          onReplace(selectedQuestion);
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
                <TableCell>#</TableCell>
                <TableCell>Question Code</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={30} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={40} /></TableCell>
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

  if (!questions || questions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No questions selected. Generate paper or manually select questions.
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
                <TableCell>#</TableCell>
                <TableCell>Question Code</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, index) => {
                const isQuestionLocked = question.isLocked || false;
                const displayOrder = question.displayOrder || index + 1;

                return (
                  <TableRow key={question.questionId || question._id || index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {displayOrder}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {question.questionCode || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {question.subjectId?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {question.topicId?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={question.difficulty || 'N/A'}
                        size="small"
                        color={
                          question.difficulty === 'EASY' ? 'success' :
                          question.difficulty === 'MEDIUM' ? 'warning' :
                          question.difficulty === 'HARD' ? 'error' :
                          'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={question.questionType?.replace('_', ' ') || 'N/A'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {question.marks || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <QuestionStatusChip
                        status={isQuestionLocked ? 'LOCKED' : 'SELECTED'}
                        isLocked={isQuestionLocked}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton size="small" color="info" onClick={() => onView(question)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {!isLocked && canEdit && (
                          <Tooltip title="Replace">
                            <IconButton size="small" color="primary" onClick={() => onReplace(question)}>
                              <ReplaceIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {!isLocked && canRemove && (
                          <Tooltip title="Remove">
                            <IconButton size="small" color="error" onClick={() => onRemove(question)}>
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {!isLocked && canLock && (
                          <Tooltip title="Lock">
                            <IconButton size="small" color="primary" onClick={() => onLock(question)}>
                              <LockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {isLocked && canLock && (
                          <Tooltip title="Unlock">
                            <IconButton size="small" color="warning" onClick={() => onUnlock(question)}>
                              <UnlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="More">
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, question)}>
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
        {selectedQuestion && (
          <>
            <MenuItem onClick={() => handleAction('view')}>
              <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
              <ListItemText>View Question</ListItemText>
            </MenuItem>

            {!selectedQuestion.isLocked && canEdit && (
              <MenuItem onClick={() => handleAction('replace')}>
                <ListItemIcon><ReplaceIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Replace Question</ListItemText>
              </MenuItem>
            )}

            {!selectedQuestion.isLocked && canRemove && (
              <MenuItem onClick={() => handleAction('remove')} sx={{ color: 'error.main' }}>
                <ListItemIcon><RemoveIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Remove Question</ListItemText>
              </MenuItem>
            )}

            {!selectedQuestion.isLocked && canLock && (
              <MenuItem onClick={() => handleAction('lock')}>
                <ListItemIcon><LockIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Lock Question</ListItemText>
              </MenuItem>
            )}

            {selectedQuestion.isLocked && canLock && (
              <MenuItem onClick={() => handleAction('unlock')}>
                <ListItemIcon><UnlockIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Unlock Question</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default CompositionTable;