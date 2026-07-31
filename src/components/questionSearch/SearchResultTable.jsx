/**
 * Search Result Table Component
 * Displays search results with selection
 */

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  ContentCopy as DuplicateIcon,
} from '@mui/icons-material';
import QuestionStatusChip from '../questionBank/QuestionStatusChip';
import { format } from 'date-fns';

const SearchResultTable = ({
  results,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDuplicate,
  selected,
  onSelectAll,
  onSelectOne,
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"><Skeleton width={20} /></TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox"><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={30} /></TableCell>
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

  if (!results || results.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No questions found matching your search criteria.
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

  const handleSelectAll = (event) => {
    onSelectAll(event.target.checked);
  };

  const handleSelectOne = (id) => {
    onSelectOne(id);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < results.length}
                  checked={results.length > 0 && selected.length === results.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((question) => {
              const isSelected = selected.includes(question._id);
              const title = question.questionText?.replace(/<[^>]*>/g, '').substring(0, 50) || 'No title';

              return (
                <TableRow
                  key={question._id}
                  hover
                  selected={isSelected}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    '&.Mui-selected': { bgcolor: 'action.selected' },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectOne(question._id)}
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
                  <TableCell>{question.topicId?.name || 'N/A'}</TableCell>
                  <TableCell>{question.difficultyId?.name || 'N/A'}</TableCell>
                  <TableCell>{question.questionTypeId?.name || 'N/A'}</TableCell>
                  <TableCell>{question.marks || 0}</TableCell>
                  <TableCell>
                    <QuestionStatusChip status={question.status} size="small" />
                  </TableCell>
                  <TableCell>
                    {format(new Date(question.updatedAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton size="small" color="info" onClick={() => onView(question)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => onEdit(question)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" color="default" onClick={() => onDuplicate(question)}>
                          <DuplicateIcon fontSize="small" />
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
  );
};

export default SearchResultTable;