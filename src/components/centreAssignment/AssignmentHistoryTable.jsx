/**
 * Assignment History Table Component
 * Displays assignment history
 */

import {

  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Skeleton,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import AssignmentStatusChip from './AssignmentStatusChip';

const AssignmentHistoryTable = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
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
                <TableCell>Date</TableCell>
                <TableCell>Examination</TableCell>
                <TableCell>Centre</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>Candidates</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(7)].map((_, col) => (
                    <TableCell key={col}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No assignment history found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Examination</TableCell>
              <TableCell>Centre</TableCell>
              <TableCell>Assigned By</TableCell>
              <TableCell>Candidates</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell>
                  {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {item.examinationId?.name || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {item.examinationId?.code || ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  {item.centreId?.name || 'N/A'}
                </TableCell>
                <TableCell>
                  {item.assignedBy?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={item.candidateCount || 0}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {item.assignmentType && (
                      <Chip
                        label={item.assignmentType}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.method || 'Manual'}
                    size="small"
                    color={
                      item.method === 'AUTO' ? 'secondary' :
                      item.method === 'BULK' ? 'info' :
                      'default'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <AssignmentStatusChip status={item.status || 'COMPLETED'} />
                </TableCell>
              </TableRow>
            ))}
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
  );
};

export default AssignmentHistoryTable;