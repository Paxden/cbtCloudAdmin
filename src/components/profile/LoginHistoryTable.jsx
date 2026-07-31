/* eslint-disable no-unused-vars */
/**
 * Login History Table Component
 * Displays user login history
 */

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Skeleton, TablePagination, Chip } from '@mui/material';
import { format } from 'date-fns';
import StatusChip from '../chips/StatusChip';

const LoginHistoryTable = ({
  history,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Browser</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">No login history found</Typography>
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
              <TableCell>Date</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Browser</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id || item._id} hover>
                <TableCell>
                  {format(new Date(item.loginDate), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>{item.device || '-'}</TableCell>
                <TableCell>{item.browser || '-'}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {item.ipAddress || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={item.status} size="small" />
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

export default LoginHistoryTable;